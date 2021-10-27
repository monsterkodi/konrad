#!/usr/bin/env bash

DIR=`dirname $0`
BIN=$DIR/../node_modules/.bin
cd $DIR/..

if rm -rf konrad-darwin-x64; then
    
    ./bin/compile.sh
    
    konrad --run

    IGNORE="(.*\.dmg$|Icon$|.*\.lock$|img/dmg.*\.png)"

    if $BIN/electron-packager . --overwrite --icon=img/app.icns --ignore=$IGNORE; then
    
        rm -rf /Applications/konrad.app
        cp -R konrad-darwin-arm64/konrad.app /Applications
        
        open /Applications/konrad.app 
    fi
fi
