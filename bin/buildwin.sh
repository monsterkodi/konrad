#!/usr/bin/env bash
cd `dirname $0`/..

if rm -rf konrad-win32-x64; then

    konrad
    
    node_modules/.bin/electron-rebuild
    
    IGNORE="/(.*\.dmg$|Icon$|coffee$|.*md$|pug$|styl$|package\.noon$|.*\.lock$|img/dmg.*\.png)"
    
    node_modules/.bin/electron-packager . --overwrite --icon=img/app.ico --ignore=$IGNORE
    
    ./konrad-win32-x64/konrad.exe &
fi
