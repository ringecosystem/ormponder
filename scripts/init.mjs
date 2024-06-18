
$.verbose = true;

function _projectdir() {
  return path.resolve(__dirname, '../')
}

function _lifecycle() {
  return {
    chain: (argv['chain'] || argv['c']) || $.env['ORMPONDER_CHAIN'],
  };
}

async function _check(lifecycle) {
  const {chain} = lifecycle;
  if (!chain) {
    console.log(chalk.red('missing group, please add --chain or set ORMPONDER_CHAIN'));
    process.exit(1)
  }
  const pathMainnetsChain = `${_projectdir()}/definition/mainnets/ponder.${chain}.ts`;
  const pathTestnetsChain = `${_projectdir()}/definition/testnets/ponder.${chain}.ts`;
  if (!await fs.pathExists(pathMainnetsChain) && !await fs.pathExists(pathTestnetsChain)) {
    console.log(chalk.red(`not have this chain. [chain]: ${chain}`))
    process.exit(1)
  }
}

async function _copy(lifecycle) {
  const {chain} = lifecycle;
  const pathDefinition = `${_projectdir()}/definition`;
  const pathMainnetsChain = `${pathDefinition}/mainnets/ponder.${chain}.ts`;
  const pathTestnetsChain = `${pathDefinition}n/testnets/ponder.${chain}.ts`;

  if (await fs.pathExists(pathMainnetsChain)) {
    await fs.copy(pathMainnetsChain, `${_projectdir()}/ponder.config.ts`);
    await fs.copy(`$${pathDefinition}/mainnets/address.ts`, `${_projectdir()}/src/address.local.ts`);
  }
  if (await fs.pathExists(pathTestnetsChain)) {
    await fs.copy(pathTestnetsChain, `${_projectdir()}/ponder.config.ts`);
    await fs.copy(`$${pathDefinition}/testnets/address.ts`, `${_projectdir()}/src/address.local.ts`);
  } 
  console.log('definition file generated');
}


async function main() {
  const lifecycle = _lifecycle();
  await _check(lifecycle);
  await _copy(lifecycle);
}


await main();

