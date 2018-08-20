###
00     00   0000000   000  000   000
000   000  000   000  000  0000  000
000000000  000000000  000  000 0 000
000 0 000  000   000  000  000  0000
000   000  000   000  000  000   000
###

{ app, args, colors, prefs, first, post, noon, os, slash, childp, fs, log } = require 'kxk'

pkg      = require '../package.json'
electron = require 'electron'

app = new app
    dir:        __dirname
    pkg:        pkg
    shortcut:   'CmdOrCtrl+F2'
    index:      'index.html'
    icon:       '../img/app.ico'
    tray:       '../img/menu@2x.png'
    about:      '../img/about.png'
    onQuit:     -> quit()
    width:      400
    height:     400
    minWidth:   300
    minHeight:  200
    args: """
        show      open window on startup  true
        prefs     show preferences        false
        """

konrad         = null
konradVersion  = null

if args.verbose
    log colors.white.bold "\n#{pkg.name}", colors.gray "v#{pkg.version}\n"
    log colors.yellow.bold 'process'
    p = cwd: process.cwd()
    log noon.stringify p, colors:true
    log colors.yellow.bold 'args'
    log noon.stringify args, colors:true
    log ''

if args.prefs
    log colors.yellow.bold 'prefs'
    log colors.green.bold prefs.store.file
    if slash.fileExists prefs.store.file
        log noon.stringify noon.load(prefs.store.file), colors:true

# 000   000   0000000   000   000  00000000    0000000   0000000
# 000  000   000   000  0000  000  000   000  000   000  000   000
# 0000000    000   000  000 0 000  0000000    000000000  000   000
# 000  000   000   000  000  0000  000   000  000   000  000   000
# 000   000   0000000   000   000  000   000  000   000  0000000

post.on 'Restart konrad', -> startKonrad prefs.get 'rootDir'

startKonrad = (rootDir) ->
    
    prefs.set 'rootDir', rootDir

    if konrad?
        log 'killing konrad', konrad.pid
        treekill = require 'tree-kill'
        treekill konrad.pid

    konrad = childp.spawn "konrad", ['-vw'],
        cwd:      rootDir
        shell:    true
        detached: false

    log 'startKonrad', konrad.pid, rootDir
    
    konrad.on 'exit', (code, signal) -> 
        log 'konrad.on exit'

    konrad.on 'close', (code, signal) ->
        # log 'konrad.on close'
        post.toWins 'konradExit', "konrad exit code: #{code}"

    konrad.stderr.on 'data', (data) ->
        s = colors.strip data.toString()
        if app.win?
            post.toWins 'konradError', "konrad error: #{s}"
        else
            createWindow 'konradError', "konrad error: #{s}"

    konrad.stdout.on 'data', (data) ->
        s = colors.strip data.toString()
        if /\ 👁\ \ /.test s
            konradVersion = s.split('👁  ')[1]
            post.toWins 'konradVersion', konradVersion
        else if app.win?
            post.toWins 'konradOutput', s
        else
            if / 😡 /.test s
                createWindow 'konradOutput', s
            else
                highlight()

#  0000000   000   000  000  000000000  
# 000   000  000   000  000     000     
# 000 00 00  000   000  000     000     
# 000 0000   000   000  000     000     
#  00000 00   0000000   000     000     

quit = ->

    if konrad?
        log 'killing konrad', konrad?.pid
        treekill = require 'tree-kill'
        treekill konrad.pid, -> app.exitApp()
        konrad = null
        'delay'
        
post.on 'Restart', ->
    
    log 'on Restart', konrad.pid

    treekill = require 'tree-kill'
    treekill konrad.pid, -> 
    
        log 'spawn', process.argv[0], process.argv.slice(1)
        childp.spawn process.argv[0], process.argv.slice(1),
            cwd:         process.cwd()
            encoding:    'utf8'
            detached:    true
            shell:       true
            windowsHide: true
        process.exit 0
        
#  0000000  00000000  000000000        00000000    0000000    0000000   000000000  
# 000       000          000           000   000  000   000  000   000     000     
# 0000000   0000000      000           0000000    000   000  000   000     000     
#      000  000          000           000   000  000   000  000   000     000     
# 0000000   00000000     000           000   000   0000000    0000000      000     

setRootDir = ->

    opts =
        title:      'Open'
        properties: ['openDirectory']

    electron.dialog.showOpenDialog opts, (dirs) =>
        if dir = first dirs
            startKonrad dir

post.on 'setRootDir', setRootDir

#  0000000   00000000   00000000         00000000   00000000   0000000   0000000    000   000  
# 000   000  000   000  000   000        000   000  000       000   000  000   000   000 000   
# 000000000  00000000   00000000         0000000    0000000   000000000  000   000    00000    
# 000   000  000        000              000   000  000       000   000  000   000     000     
# 000   000  000        000              000   000  00000000  000   000  0000000       000     

post.on 'appReady', ->

    if rootDir = prefs.get 'rootDir'
        startKonrad rootDir
    else
        setRootDir()

#000   000  000  000   000        00000000   00000000   0000000   0000000    000   000  
#000 0 000  000  0000  000        000   000  000       000   000  000   000   000 000   
#000000000  000  000 0 000        0000000    0000000   000000000  000   000    00000    
#000   000  000  000  0000        000   000  000       000   000  000   000     000     
#00     00  000  000   000        000   000  00000000  000   000  0000000       000     

post.on 'winReady', (wID) ->
    
    post.toWin wID, 'konradVersion', konradVersion if konradVersion

# 000   000  000   0000000   000   000  000      000   0000000   000   000  000000000  
# 000   000  000  000        000   000  000      000  000        000   000     000     
# 000000000  000  000  0000  000000000  000      000  000  0000  000000000     000     
# 000   000  000  000   000  000   000  000      000  000   000  000   000     000     
# 000   000  000   0000000   000   000  0000000  000   0000000   000   000     000     

highlight = ->

    return if not app.tray? 
    
    if slash.win()
        app.tray.setImage slash.resolve slash.join __dirname, '../img/menu.png'
        unhighlight = -> app.tray.setImage slash.resolve slash.join __dirname, '../img/menu@2x.png'
        setTimeout unhighlight, 1000
    else
        
        app.tray.setHighlightMode 'always'
        unhighlight = -> app.tray.setHighlightMode 'never'
        setTimeout unhighlight, 1000

post.on 'highlight', highlight


