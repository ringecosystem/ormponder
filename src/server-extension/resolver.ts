import {
  Arg,
  Field,
  InputType,
  Int,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import type { EntityManager } from "typeorm";
import { ORMPHashImported } from "../model";

// @ObjectType()
// export class MyQueryResult {
//   @Field(() => Number, { nullable: false })
//   total!: number;

//   @Field(() => Number, { nullable: false })
//   max!: number;

//   constructor(props: Partial<MyQueryResult>) {
//     Object.assign(this, props);
//   }
// }

@ObjectType()
export class MessageProgressResult {
  @Field(() => Int, { nullable: true })
  total!: number;
  @Field(() => Int, { nullable: true })
  inflight!: number;
  @Field(() => Int, { nullable: true })
  failed!: number;
}

@ObjectType()
export class MessagePortResult {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  protocol!: string;

  @Field(() => String, { nullable: true })
  payload!: string | undefined | null;

  @Field(() => String, { nullable: true })
  params!: string | undefined | null;

  @Field(() => Number, { nullable: false })
  status!: number;

  @Field(() => String, { nullable: true })
  sender!: string | undefined | null;

  @Field(() => BigInt, { nullable: true })
  sourceChainId!: bigint | undefined | null;

  @Field(() => BigInt, { nullable: true })
  sourceBlockNumber!: bigint | undefined | null;

  @Field(() => BigInt, { nullable: true })
  sourceBlockTimestamp!: bigint | undefined | null;

  @Field(() => String, { nullable: true })
  sourceTransactionHash!: string | undefined | null;

  @Field(() => Number, { nullable: true })
  sourceTransactionIndex!: number | undefined | null;

  @Field(() => Number, { nullable: true })
  sourceLogIndex!: number | undefined | null;

  @Field(() => String, { nullable: true })
  sourceDappAddress!: string | undefined | null;

  @Field(() => String, { nullable: true })
  sourcePortAddress!: string | undefined | null;

  @Field(() => BigInt, { nullable: true })
  targetChainId!: bigint | undefined | null;

  @Field(() => BigInt, { nullable: true })
  targetBlockNumber!: bigint | undefined | null;

  @Field(() => BigInt, { nullable: true })
  targetBlockTimestamp!: bigint | undefined | null;

  @Field(() => String, { nullable: true })
  targetTransactionHash!: string | undefined | null;

  @Field(() => Number, { nullable: true })
  targetTransactionIndex!: number | undefined | null;

  @Field(() => Number, { nullable: true })
  targetLogIndex!: number | undefined | null;

  @Field(() => String, { nullable: true })
  targetDappAddress!: string | undefined | null;

  @Field(() => String, { nullable: true })
  targetPortAddress!: string | undefined | null;
}

@InputType()
export class MessagePortWhereInput {
  @Field((type) => Int, { nullable: true })
  sourceChainId_eq?: number;
  @Field((type) => Int, { nullable: true })
  targetChainId_eq?: number;
  @Field((type) => [Int], { nullable: true })
  sourceChainId_in?: number[];
  @Field((type) => [Int], { nullable: true })
  targetChainId_in?: number[];
  @Field({ nullable: true })
  id_eq?: string;
  @Field((type) => [String], { nullable: true })
  id_in?: string[];
  @Field({ nullable: true })
  sourceTransactionHash_eq?: string;
  @Field((type) => [String], { nullable: true })
  sourceTransactionHash_in?: string[];
  @Field({ nullable: true })
  targetTransactionHash_eq?: string;
  @Field((type) => [String], { nullable: true })
  targetTransactionHash_in?: string[];
  @Field((type) => [String], { nullable: true })
  blockTimestamp_start?: string;
  @Field((type) => [String], { nullable: true })
  blockTimestamp_end?: string;
  @Field((type) => Int, { nullable: true })
  status_eq?: number;
  @Field((type) => [Int], { nullable: true })
  status_in?: number[];
}

@Resolver()
export class MsgportResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => MessageProgressResult)
  async messageProgress() {
    const manager = await this.tx();
    const sql = `
    select
    a.total,
    a.total-b.dispatched as inflight,
    b.failed
    from (
      select
      1 as id,
      count(1) as total
      from ormp_upgradeable_port_message_sent 
    ) as a
    inner join (
      select
      1 as id,
      count(1) as dispatched,
      count(case when dispatch_result is false then 1 end) as failed
      from ormp_message_dispatched
    ) as b on a.id=b.id
    `;
    const results = await manager.getRepository(ORMPHashImported).query(sql);
    return results.map((item: any) => {
      const mpr = new MessageProgressResult();
      mpr.total = item.total;
      mpr.inflight = item.inflight;
      mpr.failed = item.failed;
      return mpr;
    })[0];
  }

  @Query(() => [MessagePortResult])
  async messagePorts(
    @Arg("limit", (type) => Int, { nullable: true }) _limit: number,
    @Arg("offset", (type) => Int, { nullable: true }) _offset: number,
    @Arg("where", (type) => MessagePortWhereInput, { nullable: true })
    _where: MessagePortWhereInput
  ): Promise<MessagePortResult[]> {
    // console.log({ _limit, _offset, _where });
    const limit = _limit ?? 100;
    const offset = _offset ?? 0;
    const where = _where ?? {};

    const sourceChainIdIns = where.sourceChainId_eq
      ? [where.sourceChainId_eq]
      : where.sourceChainId_in ?? [];
    const targetChainIdIns = where.targetChainId_eq
      ? [where.targetChainId_eq]
      : where.targetChainId_in ?? [];
    const idIns = where.id_eq ? [where.id_eq] : where.id_in ?? [];
    const sourceTransactionHashIns = where.sourceTransactionHash_eq
      ? [where.sourceTransactionHash_eq]
      : where.sourceTransactionHash_in ?? [];
    const targetTransactionHashIns = where.targetTransactionHash_eq
      ? [where.targetTransactionHash_eq]
      : where.targetTransactionHash_in ?? [];
    const blockTimestampStart = where.blockTimestamp_start
      ? new Date(+where.blockTimestamp_start).getTime()
      : undefined;
    const blockTimestampEnd = where.blockTimestamp_end
      ? new Date(+where.blockTimestamp_end).getTime()
      : undefined;
    const statusIns = where.status_eq
      ? [where.status_eq]
      : where.status_in ?? [];

    const manager = await this.tx();
    let paramIndex = 0;
    const sqls = [
      `
      select * from (
        select
        mp.*,
        case 
            when od.dispatch_result is true then 1
            when od.dispatch_result is false then 2
            else mp._msgport_status
        end as status
        from (
        select
        coalesce (ms.msg_id, mr.msg_id) as id,
        coalesce (ms.msg_id, mr.msg_id) as msg_id,
        'ormp' as protocol,
        ms.chain_id as source_chain_id,
        ms.block_number as source_block_number,
        ms.block_timestamp as source_block_timestamp,
        ms.transaction_hash as source_transaction_hash,
        ms.transaction_index as source_transaction_index,
        ms.log_index as source_log_index,
        ms.port_address as source_port_address,
        ms.from_dapp as source_dapp_address,
        ms.to_chain_id as target_chain_id,
        ms.to_dapp as target_dapp_address,
        ms.message as payload,
        ms.params as params,
        ms.transaction_from as sender,
        case 
            when mr.result is true then 1
            when mr.result is false then 2
            else 0
        end as _msgport_status,
        -- mr.chain_id as target_chain_id,
        mr.block_number as target_block_number,
        mr.block_timestamp as target_block_timestamp,
        mr.transaction_hash as target_transaction_hash,
        mr.transaction_index as target_transaction_index,
        mr.log_index as target_log_index,
        mr.port_address as target_port_address
        from ormp_upgradeable_port_message_sent as ms
        full join ormp_upgradeable_port_message_recv as mr on ms.msg_id = mr.msg_id 
        ) as mp
        left join ormp_message_dispatched as od on mp.msg_id=od.msg_hash
      ) as v
      where 1=1
    `,
    ];
    if (idIns.length) {
      sqls.push(
        `and ${
          idIns.length > 0
            ? `v.id in (${idIns.map((_, i) => `$${i + 1}`).join(", ")})`
            : "1=1"
        }`
      );
      paramIndex += idIns.length;
    }
    if (statusIns.length) {
      sqls.push(
        `and ${
          statusIns.length > 0
            ? `v.status in (${statusIns
                .map((_, i) => `$${i + 1 + paramIndex}`)
                .join(", ")})`
            : "1=1"
        }`
      );
      paramIndex += statusIns.length;
    }
    if (sourceChainIdIns.length) {
      sqls.push(
        `and ${
          sourceChainIdIns.length > 0
            ? `v.source_chain_id in (${sourceChainIdIns
                .map((_, i) => `$${i + 1 + paramIndex}`)
                .join(", ")})`
            : "1=1"
        }`
      );
      paramIndex += sourceChainIdIns.length;
    }
    if (targetChainIdIns.length) {
      sqls.push(
        `and ${
          targetChainIdIns.length > 0
            ? `v.target_chain_id in (${targetChainIdIns
                .map((_, i) => `$${i + 1 + paramIndex}`)
                .join(", ")})`
            : "1=1"
        }`
      );
      paramIndex += targetChainIdIns.length;
    }
    if (sourceTransactionHashIns.length) {
      sqls.push(
        `and ${
          sourceTransactionHashIns.length > 0
            ? `v.source_transaction_hash in (${sourceTransactionHashIns
                .map((_, i) => `$${i + 1 + paramIndex}`)
                .join(", ")})`
            : "1=1"
        }`
      );
      paramIndex += sourceTransactionHashIns.length;
    }
    if (targetTransactionHashIns.length) {
      sqls.push(
        `and ${
          targetTransactionHashIns.length > 0
            ? `v.target_transaction_hash in (${targetTransactionHashIns
                .map((_, i) => `$${i + 1 + paramIndex}`)
                .join(", ")})`
            : "1=1"
        }`
      );
      paramIndex += targetTransactionHashIns.length;
    }
    if (blockTimestampStart) {
      sqls.push(`and v.source_block_timestamp >= $${1 + paramIndex}`);
      paramIndex += 1;
    }
    if (blockTimestampEnd) {
      sqls.push(`and v.source_block_timestamp < $${1 + paramIndex}`);
      paramIndex += 1;
    }
    sqls.push("order by v.source_block_timestamp desc");
    sqls.push(`limit $${1 + paramIndex}`);
    paramIndex += 1;
    sqls.push(`offset $${1 + paramIndex}`);
    paramIndex += 1;

    const params = [
      ...idIns,
      ...sourceChainIdIns,
      ...targetChainIdIns,
      ...sourceTransactionHashIns,
      ...targetTransactionHashIns,
    ];
    if (blockTimestampStart) params.push(blockTimestampStart);
    if (blockTimestampEnd) params.push(blockTimestampEnd);
    params.push(...[limit, offset]);
    const sql = sqls.join("\n");
    // console.log(sql, params);
    const results = await manager
      .getRepository(ORMPHashImported)
      .query(sql, params);
    return results.map((item: any) => {
      const mpr = new MessagePortResult();
      mpr.id = item.id;
      mpr.protocol = item.protocol;
      mpr.payload = item.payload;
      mpr.params = item.params;
      mpr.status = item.status;
      mpr.sender = item.sender;
      mpr.sourceChainId = item.source_chain_id;
      mpr.sourceBlockNumber = item.source_block_number;
      mpr.sourceBlockTimestamp = item.source_block_timestamp;
      mpr.sourceTransactionHash = item.source_transaction_hash;
      mpr.sourceTransactionIndex = item.source_transaction_index;
      mpr.sourceLogIndex = item.source_log_index;
      mpr.sourceDappAddress = item.source_dapp_address;
      mpr.sourcePortAddress = item.source_port_address;
      mpr.targetChainId = item.target_chain_id;
      mpr.targetBlockNumber = item.target_block_number;
      mpr.targetBlockTimestamp = item.target_block_timestamp;
      mpr.targetTransactionHash = item.target_transaction_hash;
      mpr.targetTransactionIndex = item.target_transaction_index;
      mpr.targetLogIndex = item.target_log_index;
      mpr.targetDappAddress = item.target_dapp_address;
      mpr.targetPortAddress = item.target_port_address;
      return mpr;
    });
  }
}
