
$.verbose = true;

function _projectdir() {
  return path.resolve(__dirname, '../')
}

function _lifecycle() {
  return {
    group: (argv['group'] || argv['g']) || $.env['ORMPONDER_GROUP'],
  };
}

async function _check(lifecycle) {
  const {group} = lifecycle;
  if (!group) {
    console.log(chalk.red('missing group, please add --group or set ORMPONDER_GROUP'));
    process.exit(1)
  }
  const pathGroup = `${_projectdir()}/definition/${group}`;
  if (!await fs.pathExists(pathGroup)) {
    console.log(chalk.red(`not have this group. [path]: ${pathGroup}`))
    process.exit(1)
  }
}

async function _copy(lifecycle) {
  const {group} = lifecycle;
  const pathGroup = `${_projectdir()}/definition/${group}`;

  await fs.copy(`${pathGroup}/ponder.config.ts`, `${_projectdir()}/ponder.config.ts`);
  await fs.copy(`${pathGroup}/address.ts`, `${_projectdir()}/src/address.local.ts`);
  console.log('definition file generated');
}


async function main() {
  const lifecycle = _lifecycle();
  await _check(lifecycle);
  await _copy(lifecycle);
}


await main();

