# 00     00   0000000   000  000   000
# 000   000  000   000  000  0000  000
# 000000000  000000000  000  000 0 000
# 000 0 000  000   000  000  000  0000
# 000   000  000   000  000  000   000

{ about, karg, colors, prefs, first, noon, os, slash, childp, fs, log } = require 'kxk'

pkg      = require '../package.json'
electron = require 'electron'
treekill = require 'tree-kill'

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

#{pkg.productName}

    show      . ? open window on startup  . = true
    prefs     . ? show preferences        . = false
    noprefs   . ? don't load preferences  . = false
    verbose   . ? log more                . = false
    DevTools  . ? open developer tools    . = false

version  #{pkg.version}

""", dontExit: true

app.exit 0 if not args?

if args.verbose
    log colors.white.bold "\n#{pkg.productName}", colors.gray "v#{pkg.version}\n"
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

ipc.on 'openDevTools',   -> win?.webContents.openDevTools()
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
        s = data.toString()
        log "konrad error: #{s}"
        if win?
            win.webContents.send 'konradError', "konrad error: #{s}"
        else
            createWindow 'konradError', "konrad error: #{s}"

    konrad.stdout.on 'data', (data) ->
        s = data.toString()
        if /\ watching\ /.test s
            konradVersion = s.split('watching ')[1]
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

    # log 'konrad started in', rootDir

quitKonrad = ->

    if konrad?
        log 'killing konrad', konrad?.pid
        treekill konrad.pid, 'SIGKILL'
        konrad = null

setRootDir = ->

    opts =
        title:      'Open'
        properties: ['openDirectory']

    dialog.showOpenDialog opts, (dirs) =>
        if dir = first dirs
            startKonrad dir

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
        useContentSize:  true
        fullscreenable:  false
        show:            false
        autoHideMenuBar: true

    if os.platform() == 'win32'
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
    app.dock?.hide()

    app.setName pkg.productName

    rootDir = prefs.get 'rootDir', slash.resolve '~/s'
    startKonrad rootDir

    try
        electron.globalShortcut.register prefs.get('shortcut'), toggleWindow
    catch err
        log 'error setting shortcut', err

    # 00     00  00000000  000   000  000   000
    # 000   000  000       0000  000  000   000
    # 000000000  0000000   000 0 000  000   000
    # 000 0 000  000       000  0000  000   000
    # 000   000  00000000  000   000   0000000

    if os.platform() != 'win32'
        Menu.setApplicationMenu Menu.buildFromTemplate [
                label: app.getName()
                submenu: [
                    label:        "About #{pkg.name}"
                    accelerator:  'Command+.'
                    click:        showAbout
                ,
                    type: 'separator'
                ,
                    label:       'Set Dir...'
                    accelerator:  'Command+o'
                    click:        setRootDir
                ,
                    label:       'Clear Log'
                    accelerator: 'Command+K'
                    click:        -> win?.webContents.send 'clearLog'
                ,
                    type: 'separator'
                ,
                    label:       "Hide #{pkg.productName}"
                    accelerator: 'Cmd+H'
                    role:        'hide'
                ,
                    label:       'Hide Others'
                    accelerator: 'Cmd+Alt+H'
                    role:        'hideothers'
                ,
                    type: 'separator'
                ,
                    label:       'Quit'
                    accelerator: 'Command+Q'
                    click:        quitKonrad
                ]
            ,
                # 000   000  000  000   000  0000000     0000000   000   000
                # 000 0 000  000  0000  000  000   000  000   000  000 0 000
                # 000000000  000  000 0 000  000   000  000   000  000000000
                # 000   000  000  000  0000  000   000  000   000  000   000
                # 00     00  000  000   000  0000000     0000000   00     00

                label: 'Window'
                submenu: [
                    label:       'Minimize'
                    accelerator: 'Alt+Cmd+M'
                    click:       -> win?.minimize()
                ,
                    type: 'separator'
                ,
                    label:       'Close Window'
                    accelerator: 'Cmd+W'
                    click:       -> win?.close()
                ,
                    type: 'separator'
                ,
                    label:       'Bring All to Front'
                    accelerator: 'Alt+Cmd+`'
                    click:       -> win?.show()
                ,
                    type: 'separator'
                ,
                    label:       'Reload Window'
                    accelerator: 'Ctrl+Alt+Cmd+L'
                    click:       -> win?.webContents.reloadIgnoringCache()
                ,
                    label:       'Toggle DevTools'
                    accelerator: 'Cmd+Alt+I'
                    click:       -> win?.webContents.openDevTools()
                ]
            ]

    else
        Menu.setApplicationMenu Menu.buildFromTemplate [
                label: app.getName()
                submenu: [
                    label:        "About #{pkg.name}"
                    accelerator:  'Ctrl+.'
                    click:        showAbout
                ,
                    type: 'separator'
                ,
                    label:       'Set Dir...'
                    accelerator:  'Ctrl+o'
                    click:        setRootDir
                ,
                    label:       'Clear Log'
                    accelerator: 'Ctrl+K'
                    click:        -> win?.webContents.send 'clearLog'
                ,
                    type: 'separator'
                ,
                    label:       'Quit'
                    accelerator: 'Ctrl+Q'
                    click:        quitKonrad
                ]
            ,
                # 000   000  000  000   000  0000000     0000000   000   000
                # 000 0 000  000  0000  000  000   000  000   000  000 0 000
                # 000000000  000  000 0 000  000   000  000   000  000000000
                # 000   000  000  000  0000  000   000  000   000  000   000
                # 00     00  000  000   000  0000000     0000000   00     00

                label: 'Window'
                submenu: [
                    label:       'Minimize'
                    accelerator: 'Ctrl+Alt+M'
                    click:       -> win?.minimize()
                ,
                    type: 'separator'
                ,
                    label:       'Close Window'
                    accelerator: 'Ctrl+W'
                    click:       -> win?.close()
                ,
                    type: 'separator'
                ,
                    label:       'Reload Window'
                    accelerator: 'Ctrl+Alt+L'
                    click:       -> win?.webContents.reloadIgnoringCache()
                ,
                    label:       'Toggle DevTools'
                    accelerator: 'Ctrl+Alt+I'
                    click:       -> win?.webContents.openDevTools()
                ]
            ]

    showWindow() if args.show

if app.makeSingleInstance( -> showWindow() )
    app.quit()
