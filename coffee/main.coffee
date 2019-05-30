###
00     00   0000000   000  000   000
000   000  000   000  000  0000  000
000000000  000000000  000  000 0 000
000 0 000  000   000  000  000  0000
000   000  000   000  000  000   000
###

{ app, args, colors, prefs, first, post, noon, os, slash, childp, klog, kstr, fs } = require 'kxk'

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
    
    klog colors.white.bold "\n#{pkg.name}", colors.gray "v#{pkg.version}\n"
    klog colors.yellow.bold 'process'
    p = cwd: process.cwd()
    klog noon.stringify p, colors:true
    klog colors.yellow.bold 'args'
    klog noon.stringify args, colors:true
    klog ''

if args.prefs
    
    klog colors.yellow.bold 'prefs'
    klog colors.green.bold prefs.store.file
    if slash.fileExists prefs.store.file
        klog noon.stringify noon.load(prefs.store.file), colors:true

# 000   000   0000000   000   000  00000000    0000000   0000000
# 000  000   000   000  0000  000  000   000  000   000  000   000
# 0000000    000   000  000 0 000  0000000    000000000  000   000
# 000  000   000   000  000  0000  000   000  000   000  000   000
# 000   000   0000000   000   000  000   000  000   000  0000000

post.on 'Restart konrad', -> startKonrad prefs.get 'rootDir'

startKonrad = (rootDir) ->
    
    prefs.set 'rootDir', rootDir

    if konrad?
        klog 'killing konrad', konrad.pid
        treekill = require 'tree-kill'
        treekill konrad.pid

    path = slash.resolve "#{__dirname}/../js/konrad.js"
    
    if '/usr/local/bin' not in process.env.PATH.split ':'
        process.env.PATH = process.env.PATH + ':/usr/local/bin'
    
    konrad = childp.spawn 'node', [path, '-w' '-v'],
        cwd:      rootDir
        shell:    true
        env:      process.env
        detached: false
        
    konrad.on 'exit', (code, signal) -> 
        klog 'konrad.on exit', code, signal

    konrad.on 'close', (code, signal) ->
        post.toWins 'konradExit', "konrad exit code: #{code}"

    konrad.stderr.on 'data', (data) ->
        klog 'konrad.stderr', data.toString()
        s = kstr.stripAnsi data.toString()
        if app.win?
            post.toWins 'konradError', "konrad error: #{s}", kstr.ansi2html data.toString()
        else
            createWindow 'konradError', "konrad error: #{s}", kstr.ansi2html data.toString()

    konrad.stdout.on 'data', (data) ->
        s = kstr.stripAnsi data.toString()
        if /\ 👁\ \ /.test s
            konradVersion = s.split('👁  ')[1]
            post.toWins 'konradVersion', konradVersion
        else if app.win?
            post.toWins 'konradOutput', s, kstr.ansi2html data.toString()
        else
            if / 😡 /.test s
                createWindow 'konradOutput', s, kstr.ansi2html data.toString()
            else
                highlight()

#  0000000   000   000  000  000000000  
# 000   000  000   000  000     000     
# 000 00 00  000   000  000     000     
# 000 0000   000   000  000     000     
#  00000 00   0000000   000     000     

quit = ->

    if konrad?
        klog 'killing konrad', konrad?.pid
        treekill = require 'tree-kill'
        treekill konrad.pid, -> app.exitApp()
        konrad = null
        'delay'
        
post.on 'Restart', ->
    
    klog 'on Restart', konrad.pid

    treekill = require 'tree-kill'
    treekill konrad.pid, -> 
    
        klog 'spawn', process.argv[0], process.argv.slice(1)
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


