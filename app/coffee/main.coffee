# 00     00   0000000   000  000   000
# 000   000  000   000  000  0000  000
# 000000000  000000000  000  000 0 000
# 000 0 000  000   000  000  000  0000
# 000   000  000   000  000  000   000
{
fileExists,
resolve,
about,
prefs,
log
}        = require 'kxk'
pkg      = require '../package.json'
childp   = require 'child_process'
electron = require 'electron'
colors   = require 'colors'
noon     = require 'noon'
fs       = require 'fs'
app      = electron.app
Window   = electron.BrowserWindow
Tray     = electron.Tray
Menu     = electron.Menu
ipc      = electron.ipcMain
konrad   = null
win      = null
tray     = null
konradVersion  = null
konradLastTask = []

#  0000000   00000000    0000000    0000000
# 000   000  000   000  000        000     
# 000000000  0000000    000  0000  0000000 
# 000   000  000   000  000   000       000
# 000   000  000   000   0000000   0000000 

args  = require('karg') """

#{pkg.productName}

    show      . ? open window on startup  . = false
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

prefs.init shortcut: 'F5'

if args.prefs
    log colors.yellow.bold 'prefs'
    if fileExists prefs.file
        log noon.stringify noon.load(prefs.file), colors:true

# 000  00000000    0000000
# 000  000   000  000     
# 000  00000000   000     
# 000  000        000     
# 000  000         0000000

ipc.on 'openDevTools',   -> win?.webContents.openDevTools()
ipc.on 'reloadWin',      -> win?.webContents.reloadIgnoringCache()
ipc.on 'showWin',        -> showWindow()
ipc.on 'saveBounds',     -> saveBounds()
ipc.on 'highlight',      -> highlight()
ipc.on 'toggleMaximize', -> if win?.isMaximized() then win?.unmaximize() else win?.maximize()

# 000   000   0000000   000   000  00000000    0000000   0000000    
# 000  000   000   000  0000  000  000   000  000   000  000   000  
# 0000000    000   000  000 0 000  0000000    000000000  000   000  
# 000  000   000   000  000  0000  000   000  000   000  000   000  
# 000   000   0000000   000   000  000   000  000   000  0000000    

startKonrad = ->
    konrad = childp.spawn resolve('~/s/konrad/bin/konrad'), ['-vw'], 
        cwd:    resolve '~/s'
        shell: '/usr/local/bin/bash'
        
    konrad.on 'close', (code) -> 
        log "konrad exit code: #{code}"
        if win?
            win.webContents.send 'konradExit', "konrad exit code: #{code}"
        else
            createWindow 'konradExit', "konrad exit code: #{code}"
    
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
            
    log 'konrad started'

#000   000  000  000   000  0000000     0000000   000   000
#000 0 000  000  0000  000  000   000  000   000  000 0 000
#000000000  000  000 0 000  000   000  000   000  000000000
#000   000  000  000  0000  000   000  000   000  000   000
#00     00  000  000   000  0000000     0000000   00     00

toggleWindow = ->
    if win?.isVisible() and win?.isFocused()
        win.hide()    
        app.dock.hide()        
    else
        showWindow()

showWindow = () ->
    if win?
        win.showInactive()
        app.dock.show()
    else
        createWindow()
    
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

    win = new Window
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
        
    bounds = prefs.get 'bounds'
    win.setBounds bounds if bounds?
        
    win.loadURL "file://#{__dirname}/index.html"
    win.webContents.openDevTools() if args.DevTools
    win.on 'closed', -> win = null
    win.on 'close', -> app.dock.hide()
    win.on 'hide', -> app.dock.hide()
    win.on 'ready-to-show', ->         
        win.showInactive() 
        app.dock.show()
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

saveBounds = -> if win? then prefs.set 'bounds', win.getBounds()
    
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
    
    tray = new Tray "#{__dirname}/../img/menu.png"
    tray.on 'click', toggleWindow
    app.dock.hide() if app.dock
    
    app.setName pkg.productName
    
    showWindow() if args.show
    startKonrad()
    
    # 00     00  00000000  000   000  000   000
    # 000   000  000       0000  000  000   000
    # 000000000  0000000   000 0 000  000   000
    # 000 0 000  000       000  0000  000   000
    # 000   000  00000000  000   000   0000000 
    
    Menu.setApplicationMenu Menu.buildFromTemplate [
            label: app.getName()
            submenu: [
                label:        "About #{pkg.name}"
                accelerator:  'Command+.'
                click:        showAbout
            ,
                type: 'separator'
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
                click:        -> app.quit()
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
                label:       'Maximize'
                accelerator: 'Cmd+Shift+m'
                click:       -> if win?.isMaximized() then win?.unmaximize() else win?.maximize()
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
        
    electron.globalShortcut.register prefs.get('shortcut'), toggleWindow

    