#!/bin/bash
#

set -e

BIN_PATH=$(cd "$(dirname "$0")"; pwd -P)
WORK_PATH=${BIN_PATH}/../

cd ${WORK_PATH}

npx zx ${WORK_PATH}/scripts/boot.mjs $@
