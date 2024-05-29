#!/bin/bash
#

set -e


BIN_PATH=$(cd "$(dirname "$0")"; pwd -P)


${BIN_PATH}/scripts/entrypoint.sh --group=$1 $2
