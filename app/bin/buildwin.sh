#!/usr/bin/env bash
cd `dirname $0`/..

NAME=`sds productName`

konrad --run

IGNORE="/(.*\.dmg$|Icon$|coffee$|.*md$|pug$|styl$|package\.noon$|.*\.lock$|img/dmg.*\.png)"

node_modules/electron-packager/cli.js . --overwrite --icon=img/konrad.ico --ignore=$IGNORE

rm -f konrad-win32-x64/LICENSE*
rm -f konrad-win32-x64/version
