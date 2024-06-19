#!/bin/sh
#

set -e


BIN_PATH=$(cd "$(dirname "$0")"; pwd -P)

cd ${BIN_PATH}

npx zx ${BIN_PATH}/scripts/init.mjs --chain=$1

if [[ "${1}" == "darwinia" ]]; then
  export ORMPONDER_ENABLE_SIGNATURE=1
fi

npx ponder $2
