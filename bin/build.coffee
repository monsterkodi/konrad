###
0000000    000   000  000  000      0000000    
000   000  000   000  000  000      000   000  
0000000    000   000  000  000      000   000  
000   000  000   000  000  000      000   000  
0000000     0000000   000  0000000  0000000    
###

{ slash, noon, childp, karg, klog, kolor, os, fs } = require 'kxk'

args = karg """

build
    compile  . ? compile sources  . = true
    install  . ? run npm install  . = true
    rebuild  . ? electron-rebuild . = true
    package  . ? package project  . = true
    start    . ? run executable   . = true
    verbose                       . = true
"""

exec = (msg, cmd, opt={stdio:'inherit' shell:true}) ->
    
    if args.verbose then klog kolor.y5 msg
    childp.execSync cmd, opt

try    
    pkgdir = slash.pkg process.cwd()
    pkg    = require slash.join pkgdir, 'package.json'
    bindir = pkg.name + '-' + "#{os.platform()}-x64"
    
    if args.verbose then klog kolor.y3('cwd      '), kolor.w2 pkgdir
    process.chdir pkgdir

    if slash.dirExists bindir
        if args.verbose then klog kolor.y4('remove   '), kolor.b6 bindir
        fs.removeSync bindir
    
    if args.compile then exec 'compile' 'node ' + slash.join __dirname, 'konrad'
    if args.install then exec 'install' 'npm install'
    if args.rebuild then exec 'rebuild' slash.resolve './node_modules/.bin/electron-rebuild'
    if args.package 
        ign = "(.*\.dmg$|Icon$|.*\.lock$|inno$|x64$)"
        exe = slash.resolve './node_modules/.bin/electron-packager'
        cmd = "#{exe} . --overwrite --icon=img/app.ico --ignore=\"#{ign}\""
        exec 'package' cmd
    if args.start
        exeext = switch os.platform()
            when 'win32'  then '.exe'
            when 'darwin' then '.app'
            else '' # linux?
        exepth = slash.resolve slash.join bindir, "#{pkg.name}#{exeext}"
        if args.verbose then klog 'start     ' exepth
        childp.spawn exepth, encoding:'utf8' shell:true detached:true stdio:'inherit'
        
    process.exit 0
        
catch err
    error String err
    process.exit 1
        