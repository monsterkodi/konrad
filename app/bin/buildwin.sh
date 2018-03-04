#!/usr/bin/env bash
cd `dirname $0`/..

konrad

node_modules/.bin/electron-rebuild

IGNORE="/(.*\.dmg$|Icon$|coffee$|.*md$|pug$|styl$|package\.noon$|.*\.lock$|img/dmg.*\.png)"

node_modules/electron-packager/cli.js . --overwrite --icon=img/konrad.ico --no-prune --ignore=$IGNORE

rm -f konrad-win32-x64/LICENSE*
rm -f konrad-win32-x64/version
