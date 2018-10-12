#!/bin/sh

# install required node scripts:
# npm install --global typescript rollup

cd "$(dirname $0)"
rm -rf src/js/* dist/*

tsc
rollup --config
