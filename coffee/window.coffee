###
000   000   0000000   000   000  00000000    0000000   0000000
000  000   000   000  0000  000  000   000  000   000  000   000
0000000    000   000  000 0 000  0000000    000000000  000   000
000  000   000   000  000  0000  000   000  000   000  000   000
000   000   0000000   000   000  000   000  000   000  0000000
###

{ slash, elem, keyinfo, childp, scheme, prefs, post, popup, pos, log, $, _ } = require 'kxk'

electron  = require 'electron'
ipc       = electron.ipcRenderer

prefs.init()
scheme.set prefs.get 'scheme', 'dark'

window.onresize = -> ipc.send 'saveBounds'

openFile = (f) ->
    f = slash.resolve f
    if slash.win()
        log f
        # childp.spawn 'bash', ['ko', f]
        childp.spawn slash.unslash slash.resolve('~/s/ko/ko-win32-x64/ko.exe'), ['ko', slash.unslash slash.path f]
    else
        childp.spawn '/usr/local/bin/ko', [f]

tasks = {}

showOverlay = ->

    img = slash.fileUrl __dirname+'/../img/about.png'
    $("#overlay")?.remove() 
    overlay = elem id:'overlay'
    overlay.appendChild elem 'img', class:'info', src:img
    overlay.addEventListener 'click', (event) -> event.target.remove()
    $("main").appendChild overlay

fadeOverlay = ->
    
    showOverlay()
    $("#overlay").classList.add 'fade-in'
    
clearTasks = -> $("main").innerHTML = ''; tasks = {}; showOverlay(); 

# 000  00000000    0000000
# 000  000   000  000
# 000  00000000   000
# 000  000        000
# 000  000         0000000

ipc.on "clearLog", clearTasks
ipc.on "konradExit", (event, s) ->
ipc.on "konradError", (event, s) ->
ipc.on "konradVersion", (event, s) -> setTitleBar s
ipc.on "konradOutput", (event, s) ->
    if      / 😡 /.test s then onError   s
    else if / 👍 /.test s then onTask    s
    else if / 🔧 /.test s then onMessage s
    else console.log 'konrad', s

taskDiv = (opt) ->

    main =$ 'main'
    if _.isEmpty tasks
        main.innerHTML = ''

    tasks[opt.key]?.remove()

    div = document.createElement 'div'
    tim = document.createElement 'span'
    fil = document.createElement 'span'

    div.classList.add 'task'

    tim.classList.add 'time'
    tim.innerHTML = opt.time

    fil.classList.add opt.file? and 'file' or 'message'
    fil.innerHTML = " #{opt.icon} #{opt.file ? opt.message}"
    fil.onclick = () -> openFile opt.file if opt.file?

    div.appendChild tim
    div.appendChild fil

    tasks[opt.key] = div
    main.appendChild div

    div
    
# 000000000   0000000    0000000  000   000
#    000     000   000  000       000  000
#    000     000000000  0000000   0000000
#    000     000   000       000  000  000
#    000     000   000  0000000   000   000

onTask = (s) ->

    ipc.send 'highlight'

    [time, sourceTarget] = s.split ' 👍 '
    [source, target] = sourceTarget.split ' ► '

    source = slash.tilde(source).trim()
    div = taskDiv time: time, file: source, key: source, icon: '👍'
    div.scrollIntoViewIfNeeded()
    
    fadeOverlay()

# 00     00  00000000   0000000   0000000   0000000    0000000   00000000
# 000   000  000       000       000       000   000  000        000
# 000000000  0000000   0000000   0000000   000000000  000  0000  0000000
# 000 0 000  000            000       000  000   000  000   000  000
# 000   000  00000000  0000000   0000000   000   000   0000000   00000000

onMessage = (s) ->

    [time, msg] = s.split ' 🔧 '

    div = taskDiv time: time, message: msg, key: 'msg', icon: '🔧'
    
    delayClear()

# 00000000  00000000   00000000    0000000   00000000
# 000       000   000  000   000  000   000  000   000
# 0000000   0000000    0000000    000   000  0000000
# 000       000   000  000   000  000   000  000   000
# 00000000  000   000  000   000   0000000   000   000

onError = (s) ->

    ipc.send 'showWin'
    ipc.send 'highlight'
    
    $("main").innerHTML = ''
    tasks = {}

    lines = s.split '\n'
    [time, file] = lines.shift().split ' 😡 '
    file = file.trim()

    div = taskDiv time: time, file: file, key: file.split(':')[0], icon: '😡'

    for l in lines
        pre = document.createElement 'pre'
        pre.classList.add 'error'
        pre.textContent = l
        div.appendChild pre

    div.scrollIntoViewIfNeeded()
    
setTitleBar = (s) ->

    if slash.win()
        $('titlebar')?.remove()
        $('main').style.top = '0px'
        win = electron.remote.getCurrentWindow()
        win.setTitle 'konrad ● ' + s
    else
        [path, version] = s.split ' ● '
        html  = "<span class='titlebarPath'>#{slash.tilde path}</span>"
        html += "<span class='titlebarDot'> ● </span>"
        html += "<span class='titlebarVersion'>#{version}</span>"
        $('titlebar').innerHTML = html
        $('titlebar').ondblclick = => ipc.send 'toggleMaximize'

# 000   000  00000000  000   000
# 000  000   000        000 000
# 0000000    0000000     00000
# 000  000   000          000
# 000   000  00000000     000

document.onkeydown = (event) ->

    { mod, key, combo } = keyinfo.forEvent event
    
    switch combo
        when 'q'                                then electron.remote.app.quit()
        when 'k'                                then clearTasks()
        when 'esc', 'w'                         then window.close()
        when 'command+i', 'i', 'ctrl+i'         then scheme.toggle()
        when 'command+c', 'ctrl+c'              then document.execCommand 'copy'
        when 'command+alt+i', 'ctrl+alt+i'      then ipc.send 'openDevTools'
        when 'command+alt+ctrl+l', 'ctrl+alt+l' then ipc.send 'reloadWin'

# 00000000    0000000   00000000   000   000  00000000   
# 000   000  000   000  000   000  000   000  000   000  
# 00000000   000   000  00000000   000   000  00000000   
# 000        000   000  000        000   000  000        
# 000         0000000   000         0000000   000        

$('main').addEventListener "contextmenu", (event) ->
    
    absPos = pos event
    if not absPos?
        absPos = pos $('main').getBoundingClientRect().left, $('main').getBoundingClientRect().top
    
    opt = items: [
        text:   'Set Dir...'
        combo:  'ctrl+o'
        cb:      -> post.toMain 'setRootDir'
    ,
        text:   'Clear'
        combo:  'k' 
        cb:     clearTasks
    ,
        text:   'Show Menu'
        combo:  'alt'
        cb:     -> electron.remote.getCurrentWindow().setMenuBarVisibility true
    ,
        text:   'About'
        combo:  'ctrl+.'
        cb:      -> post.toMain 'showAbout'
    ,
        text:   'Quit'
        combo:  'ctrl+q' 
        cb:     -> post.toMain 'quitKonrad'
    ]
    
    opt.x = absPos.x
    opt.y = absPos.y

    popup.menu opt
    
