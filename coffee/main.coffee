###
00     00   0000000   000  000   000
000   000  000   000  000  0000  000
000000000  000000000  000  000 0 000
000 0 000  000   000  000  000  0000
000   000  000   000  000  000   000
###

{ about, karg, colors, prefs, first, post, noon, os, slash, childp, fs, log } = require 'kxk'

pkg      = require '../package.json'
electron = require 'electron'

app      = electron.app
Window   = electron.BrowserWindow
Tray     = electron.Tray
Menu     = electron.Menu
ipc      = electron.ipcMain
dialog   = electron.dialog
konrad   = null
win      = null
tray     = null
showInactive   = false
konradVersion  = null
konradLastTask = []

#  0000000   00000000    0000000    0000000
# 000   000  000   000  000        000
# 000000000  0000000    000  0000  0000000
# 000   000  000   000  000   000       000
# 000   000  000   000   0000000   0000000

args  = karg """

#{pkg.name}

    show      . ? open window on startup  . = true
    prefs     . ? show preferences        . = false
    noprefs   . ? don't load preferences  . = false
    verbose   . ? log more                . = false
    DevTools  . ? open developer tools    . = false

version  #{pkg.version}

""", dontExit: true

app.exit 0 if not args?

if args.verbose
    log colors.white.bold "\n#{pkg.name}", colors.gray "v#{pkg.version}\n"
    log colors.yellow.bold 'process'
    p = cwd: process.cwd()
    log noon.stringify p, colors:true
    log colors.yellow.bold 'args'
    log noon.stringify args, colors:true
    log ''

# 00000000   00000000   00000000  00000000   0000000
# 000   000  000   000  000       000       000
# 00000000   0000000    0000000   000000    0000000
# 000        000   000  000       000            000
# 000        000   000  00000000  000       0000000

prefs.init shortcut: 'CmdOrCtrl+F2'

if args.prefs
    log colors.yellow.bold 'prefs'
    log colors.green.bold prefs.store.file
    if slash.fileExists prefs.store.file
        log noon.stringify noon.load(prefs.store.file), colors:true

# 000  00000000    0000000
# 000  000   000  000
# 000  00000000   000
# 000  000        000
# 000  000         0000000

ipc.on 'openDevTools',   -> win?.webContents.toggleDevTools()
ipc.on 'reloadWin',      -> win?.webContents.reloadIgnoringCache()
ipc.on 'showWin',        -> showWindow true
ipc.on 'saveBounds',     -> saveBounds()
ipc.on 'highlight',      -> highlight()
ipc.on 'toggleMaximize', -> if win?.isMaximized() then win?.unmaximize() else win?.maximize()

# 000   000   0000000   000   000  00000000    0000000   0000000
# 000  000   000   000  0000  000  000   000  000   000  000   000
# 0000000    000   000  000 0 000  0000000    000000000  000   000
# 000  000   000   000  000  0000  000   000  000   000  000   000
# 000   000   0000000   000   000  000   000  000   000  0000000

startKonrad = (rootDir) ->

    prefs.set 'rootDir', rootDir

    if konrad?
        treekill = require 'tree-kill'
        treekill konrad.pid, 'SIGKILL'

    konrad = childp.spawn "konrad", ['-vw'],
        cwd:      rootDir
        shell:    true
        detached: false

    konrad.on 'exit', (code, signal) ->
        if not konrad
            app.exit()

    konrad.on 'close', (code, signal) ->
        if win?
            win.webContents.send 'konradExit', "konrad exit code: #{code}"

    konrad.stderr.on 'data', (data) ->
        s = colors.strip data.toString()
        log "konrad error: #{s}"
        if win?
            win.webContents.send 'konradError', "konrad error: #{s}"
        else
            createWindow 'konradError', "konrad error: #{s}"

    konrad.stdout.on 'data', (data) ->
        s = colors.strip data.toString()
        if /\ 👁\ \ /.test s
            konradVersion = s.split('👁  ')[1]
            win?.send 'konradVersion', konradVersion
        else if win?
            win.webContents.send 'konradOutput', s
        else
            if / 😡 /.test s
                createWindow 'konradOutput', s
            else
                highlight()
                log 'konrad output:', s
                konradLastTask.push s

quitKonrad = ->

    if konrad?
        log 'killing konrad', konrad?.pid
        treekill = require 'tree-kill'
        treekill konrad.pid, 'SIGKILL'
        konrad = null

post.on 'quitKonrad', quitKonrad
        
# 00000000    0000000    0000000   000000000  
# 000   000  000   000  000   000     000     
# 0000000    000   000  000   000     000     
# 000   000  000   000  000   000     000     
# 000   000   0000000    0000000      000     

setRootDir = ->

    opts =
        title:      'Open'
        properties: ['openDirectory']

    dialog.showOpenDialog opts, (dirs) =>
        if dir = first dirs
            startKonrad dir

post.on 'setRootDir', setRootDir

#000   000  000  000   000  0000000     0000000   000   000
#000 0 000  000  0000  000  000   000  000   000  000 0 000
#000000000  000  000 0 000  000   000  000   000  000000000
#000   000  000  000  0000  000   000  000   000  000   000
#00     00  000  000   000  0000000     0000000   00     00

toggleWindow = ->
    
    if win?.isVisible() and win?.isFocused()
        win.hide()
        app.dock?.hide()
    else
        showWindow()

showWindow = (inactive) ->
    
    if win?
        if inactive
            if slash.win()
                { foreground } = require 'wxw'
                foreground process.argv[0]
            win.showInactive()
        else
            win.show()
    else
        showInactive = inactive
        createWindow()
        
    app.dock?.show()

screenSize = -> electron.screen.getPrimaryDisplay().workAreaSize

highlight = ->
    tray.setHighlightMode 'always'
    unhighlight = -> tray.setHighlightMode 'never'
    setTimeout unhighlight, 1000

createWindow = (ipcMsg, ipcArg) ->

    bounds = prefs.get 'bounds', null
    if not bounds
        {w, h} = screenSize()
        bounds = {}
        bounds.width = h + 122
        bounds.height = h
        bounds.x = parseInt (w-bounds.width)/2
        bounds.y = 0

    cfg =
        x:               bounds.x
        y:               bounds.y
        width:           bounds.width
        height:          bounds.height
        minWidth:        206
        minHeight:       206
        titleBarStyle:   'hidden'
        backgroundColor: '#000'
        maximizable:     true
        minimizable:     true
        resizable:       true
        useContentSize:  true
        fullscreenable:  false
        show:            false
        frame:           false
        autoHideMenuBar: true

    if slash.win()
        cfg.icon = slash.path __dirname + '/../img/konrad.ico'
        
    win = new Window cfg

    bounds = prefs.get 'bounds'
    win.setBounds bounds if bounds?

    win.loadURL slash.fileUrl "#{__dirname}/index.html"
    win.webContents.openDevTools() if args.DevTools
    win.on 'closed', -> win = null
    win.on 'close', -> app.dock?.hide()
    win.on 'hide', -> app.dock?.hide()
    win.on 'ready-to-show', ->

        app.dock?.show()
        if slash.win()
            win.show()
        else        
            if showInactive
                win.showInactive()
                showInactive = false
            else
                win.show()
                
        win.webContents.send 'konradVersion', konradVersion if konradVersion
        if ipcMsg
            win.webContents.send ipcMsg, ipcArg
        else if konradLastTask.length
            for t in konradLastTask
                win.webContents.send 'konradOutput', t
        else
            win.webContents.send 'clearLog'
        konradLastTask = []
    win

saveBounds = ->
  if win?
      prefs.set 'bounds', win.getBounds()

#  0000000   0000000     0000000   000   000  000000000
# 000   000  000   000  000   000  000   000     000
# 000000000  0000000    000   000  000   000     000
# 000   000  000   000  000   000  000   000     000
# 000   000  0000000     0000000    0000000      000

showAbout = ->
    
    dark = 'dark' == prefs.get 'scheme', 'dark'
    about
        img: "#{__dirname}/../img/about.png"
        color:      dark and '#383838' or '#ddd'
        background: dark and '#282828' or '#fff'
        highlight:  dark and '#ff0'    or '#000'
        pkg: pkg

post.on 'showAbout',  showAbout

app.on 'window-all-closed', (event) -> event.preventDefault()

#00000000   00000000   0000000   0000000    000   000
#000   000  000       000   000  000   000   000 000
#0000000    0000000   000000000  000   000    00000
#000   000  000       000   000  000   000     000
#000   000  00000000  000   000  0000000       000

app.on 'ready', ->

    icon = os.platform() == 'win32' and 'menu@2x.png' or 'menu.png'
    tray = new Tray slash.join __dirname, '..', 'img', icon
    tray.on 'click', toggleWindow
    
    tray.setContextMenu Menu.buildFromTemplate [
        label: "Quit"
        click: -> app.exit 0; process.exit 0
    ,
        label: "About"
        click: showAbout
    ]
    
    app.dock?.hide()

    app.setName pkg.name

    rootDir = prefs.get 'rootDir', slash.resolve '~/s'
    startKonrad rootDir

    try
        electron.globalShortcut.register prefs.get('shortcut'), toggleWindow
    catch err
        log 'error setting shortcut', err

    # # 00     00  00000000  000   000  000   000
    # # 000   000  000       0000  000  000   000
    # # 000000000  0000000   000 0 000  000   000
    # # 000 0 000  000       000  0000  000   000
    # # 000   000  00000000  000   000   0000000

    # Menu.setApplicationMenu Menu.buildFromTemplate [
        # label: app.getName()
        # submenu: [
            # label:        "About #{pkg.name}"
            # accelerator:  'ctrl+.'
            # click:        showAbout
        # ,
            # type: 'separator'
        # ,
            # label:       'Set Dir...'
            # accelerator:  'ctrl+o'
            # click:        setRootDir
        # ,
            # label:       'Clear Log'
            # accelerator: 'ctrl+k'
            # click:        -> win?.webContents.send 'clearLog'
        # ,
            # type: 'separator'
        # ,
            # label:       'Quit'
            # accelerator: 'ctrl+q'
            # click:        quitKonrad
        # ]
    # ,
        # # 000   000  000  000   000  0000000     0000000   000   000
        # # 000 0 000  000  0000  000  000   000  000   000  000 0 000
        # # 000000000  000  000 0 000  000   000  000   000  000000000
        # # 000   000  000  000  0000  000   000  000   000  000   000
        # # 00     00  000  000   000  0000000     0000000   00     00

        # label: 'Window'
        # submenu: [
            # label:       'Close Window'
            # accelerator: 'ctrl+w'
            # click:       -> win?.close()
        # ,
            # type: 'separator'
        # ,
            # label:       'Toggle DevTools'
            # accelerator: 'alt+ctrl+i'
            # click:       -> win?.webContents.toggleDevTools()
        # ]
    # ]

    showWindow() if args.show

if app.makeSingleInstance( -> showWindow() )
    app.quit()

module.exports = app
