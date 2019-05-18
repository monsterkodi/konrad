#!/usr/bin/env bash
cd `dirname $0`/..

./node_modules/.bin/koffee -o js -c coffee/*.coffee
