#!/bin/bash
#

set -e


BIN_PATH=$(cd "$(dirname "$0")"; pwd -P)

cd ${BIN_PATH}

npx zx ${BIN_PATH}/scripts/init.mjs --group=$1

npx ponder $2
