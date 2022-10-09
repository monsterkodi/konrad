###
0000000    000   000  000  000      0000000    
000   000  000   000  000  000      000   000  
0000000    000   000  000  000      000   000  
000   000  000   000  000  000      000   000  
0000000     0000000   000  0000000  0000000    
###

{ args, childp, fs, karg, kerror, kolor, os, slash } = require 'kxk'

args = karg """

build
    compile  . ? compile sources        . = true
    npminst  . ? run npm install        . = false
    pnpm     . ? run pnpm install       . = true
    builder  . ? electron-builder       . = true
    install  . ? move to /Applications  . = true
    prune    . ? prune package          . = false . -P
    start    . ? run executable         . = true
    verbose                             . = true
"""

config = require '../js/config'

exec = (msg, cmd, opt={shell:true encoding:'utf8'}) ->
    
    if args.verbose then log kolor.y5 msg
    childp.execSync cmd, opt

try    
    pkgdir = slash.pkg process.cwd()
    pkgpth = slash.join pkgdir, 'package.json'
    pkg    = require pkgpth
    if slash.win()
        bindir = "dist/win-unpacked/"
    else
        bindir = "dist/mac-#{os.arch()}/"
    
    exeext = switch os.platform()
        when 'win32'  then '.exe'
        when 'darwin' then '.app'
        else '' # linux?
    exepth = slash.resolve slash.join bindir, "#{pkg.name}#{exeext}"
    
    if args.verbose then log kolor.y3('cwd      '), kolor.w2 slash.tilde pkgdir
    process.chdir pkgdir

    if slash.dirExists bindir
        try
            if os.platform() == 'win32'
                if exec 'quit' "taskkill /f /im #{slash.file exepth} /t"
                    childp.execSync 'sleep 2'
            else
                childp.execSync "killall #{pkg.name}"
        catch err
            kerror "kill failed: #{err}"
        if args.verbose then log kolor.y4('remove   '), kolor.b6 bindir
        fs.removeSync bindir
    
    if args.compile then exec 'compile' 'node --trace-warnings ' + slash.join __dirname, 'konrad'
    if args.npminst then exec 'npminst' 'npm install'
    if args.pnpm    then exec 'pnpm -i' 'pnpm install'
    if args.builder then exec 'builder' "#{slash.resolve('./node_modules/.bin/electron-builder')} --dir --config.asar=false"
    if args.install and not slash.win()
        log kolor.y5 'install'
        appDir = "/Applications/#{slash.file exepth}"
        if slash.dirExists appDir
            fs.removeSync appDir
        fs.moveSync exepth, appDir
        fs.removeSync slash.resolve 'dist'
        exepth = appDir
        fs.removeSync slash.join exepth, 'Contents/Resources/app/node_modules'
        process.chdir slash.join exepth, 'Contents/Resources/app/'
        childp.execSync 'pnpm i'
    if args.install and slash.win()
        log kolor.y5 'install'
        fs.removeSync slash.join slash.dir(exepth), 'resources/app/node_modules'
        process.chdir slash.join slash.dir(exepth), 'resources/app/'
        childp.execSync 'pnpm i'
    if args.prune
        if args.verbose then log kolor.y4('prune')
        for d in ['inno' 'x64']
            dir = slash.join bindir, 'resources' 'app' d # needs to change on mac
            if slash.dirExists dir
                if args.verbose then log kolor.r5 dir
                fs.removeSync dir
                 
        if prune = config.obj(pkgpth)?.build?.prune
            for d in prune        
                dir = slash.join bindir, 'resources' 'app' d # needs to change on mac
                if slash.dirExists dir
                    if args.verbose then log kolor.r5 dir
                    fs.removeSync dir
                else
                    log 'no path to prune' dir
    if args.start
        if args.verbose then log kolor.y3('start     '), kolor.w2 slash.tilde exepth
        if os.platform() == 'win32'
            childp.spawn exepth, encoding:'utf8' detached:true
        else
            childp.spawn "open" [exepth], encoding:'utf8' shell:true detached:true stdio:'inherit'
    process.exit 0
        
catch err
    error String err
    process.exit 1
        