# 00     00   0000000   000  000   000
# 000   000  000   000  000  0000  000
# 000000000  000000000  000  000 0 000
# 000 0 000  000   000  000  000  0000
# 000   000  000   000  000  000   000
{
fileExists
}        = require './tools/tools'
prefs    = require './tools/prefs'
log      = require './tools/log'
pkg      = require '../package.json'
electron = require 'electron'
proc     = require 'child_process'
colors   = require 'colors'
noon     = require 'noon'
fs       = require 'fs'
app      = electron.app
Window   = electron.BrowserWindow
Tray     = electron.Tray
Menu     = electron.Menu
ipc      = electron.ipcMain
win      = undefined
tray     = undefined

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

ipc.on 'openDevTools', => win?.webContents.openDevTools()
ipc.on 'reloadWin',    => win?.webContents.reloadIgnoringCache()
ipc.on 'saveBounds',   -> saveBounds()

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

showWindow = ->
    if win?
        win.show()
        app.dock.show()
    else
        createWindow()
    
screenSize = -> electron.screen.getPrimaryDisplay().workAreaSize

createWindow = ->
    
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
        show:            true
        
    bounds = prefs.get 'bounds'
    win.setBounds bounds if bounds?
        
    win.loadURL "file://#{__dirname}/../index.html"
    win.webContents.openDevTools() if args.DevTools
    app.dock.show()
    win.on 'closed', -> win = null
    win.on 'close', (event) ->
        win.hide()
        app.dock.hide()
        event.preventDefault()
    win

saveBounds = -> if win? then prefs.set 'bounds', win.getBounds()
    
#  0000000   0000000     0000000   000   000  000000000
# 000   000  000   000  000   000  000   000     000   
# 000000000  0000000    000   000  000   000     000   
# 000   000  000   000  000   000  000   000     000   
# 000   000  0000000     0000000    0000000      000   

showAbout = ->    
    w = new Window
        show:            true
        center:          true
        resizable:       false
        frame:           false
        backgroundColor: '#000'            
        width:           400
        height:          400
    w.loadURL "file://#{__dirname}/../about.html"

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
    
    # 00     00  00000000  000   000  000   000
    # 000   000  000       0000  000  000   000
    # 000000000  0000000   000 0 000  000   000
    # 000 0 000  000       000  0000  000   000
    # 000   000  00000000  000   000   0000000 
    
    Menu.setApplicationMenu Menu.buildFromTemplate [
        label: app.getName()
        submenu: [
            label: "About #{pkg.name}"
            accelerator: 'Command+.'
            click: showAbout
        ,            
            label: 'Clear Log'
            accelerator: 'Command+K'
            click: -> win.webContents.send 'clearLog'
        ,
            label: 'Close Window'
            accelerator: 'Command+W'
            click: -> win.close()
        ,
            label: 'Quit'
            accelerator: 'Command+Q'
            click: -> 
                saveBounds()
                prefs.save()
                app.exit 0
        ]
    ]
        
    electron.globalShortcut.register prefs.get('shortcut'), toggleWindow

    