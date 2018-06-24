#!/usr/bin/env bash
cd `dirname $0`/..

if rm -rf konrad-darwin-x64; then
    konrad --run

    IGNORE="(.*\.dmg$|Icon$|.*md$|pug$|styl$|.*\.lock$|img/dmg.*\.png)"

    node_modules/electron-packager/cli.js . --overwrite --icon=img/app.icns --ignore=$IGNORE
fi
