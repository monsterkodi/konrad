name                konrad
description         builds my stuff
version             0.202.0
keywords
                    build
                    tool
license             Unlicense
author              monsterkodi
repository          github:monsterkodi/konrad.git
main                js/index.js
scripts
                    build  ./node_modules/.bin/kode -o js kode/*.kode
bin
                    konrad  ./bin/konrad
build
                    asar    false
                    mac
                        icon  img/app.icns
dependencies
                    colorcat    monsterkodi/colorcat
                    kode        monsterkodi/kode
                    koffee      monsterkodi/koffee
                    kxk         monsterkodi/kxk
                    sds         monsterkodi/sds
                    mkpath      ^1.0.0
                    pug         ^3.0.2
                    semver      ^7.3.5
                    simple-git  ^2.48.0
                    stylus      ^0.55.0
                    tree-kill   ^1.2.2
devDependencies
                    electron            ^16.0.5
                    electron-builder    ^22.14.5
                    node-abi            ^3.5.0