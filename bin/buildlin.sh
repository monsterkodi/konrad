#!/usr/bin/env bash
cd `dirname $0`/..

if rm -rf konrad-linux-ia32; then

    konrad 

    node_modules/.bin/electron-rebuild
    
    node_modules/electron-packager/cli.js . konrad --no-prune --icon=img/menu@2x.png
    
    rm -rf konrad-linux-ia32/resources/app/node_modules/electron-packager
    rm -rf konrad-linux-ia32/resources/app/node_modules/electron-rebuild
    rm -rf konrad-linux-ia32/resources/app/node_modules/electron
    rm -rf konrad-linux-ia32/resources/app/inno

fi
