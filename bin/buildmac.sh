#!/usr/bin/env bash
cd `dirname $0`/..

if rm -rf konrad-darwin-x64; then
    
    ./bin/compile.sh
    
    konrad --run

    IGNORE="(.*\.dmg$|Icon$|.*\.lock$|img/dmg.*\.png)"

    node_modules/.bin/electron-packager . --overwrite --icon=img/app.icns --ignore=$IGNORE
fi
