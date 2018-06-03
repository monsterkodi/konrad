#!/usr/bin/env bash
cd `dirname $0`/..

if rm -rf konrad-win32-x64; then

    konrad
    
    node_modules/.bin/electron-rebuild
    
    IGNORE="/(.*\.dmg$|Icon$|coffee$|.*md$|pug$|styl$|package\.noon$|.*\.lock$|img/dmg.*\.png)"
    
    # TODO: -no-prune ???
    node_modules/electron-packager/cli.js . --overwrite --icon=img/app.ico --no-prune --ignore=$IGNORE

else
    handle64 -nobanner konrad-win32-x64\\resources\\electron.asar
fi
