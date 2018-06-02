###
000   000  000  000   000  0000000     0000000   000   000  
000 0 000  000  0000  000  000   000  000   000  000 0 000  
000000000  000  000 0 000  000   000  000   000  000000000  
000   000  000  000  0000  000   000  000   000  000   000  
00     00  000  000   000  0000000     0000000   00     00  
###

{ title, slash, elem, stopEvent, keyinfo, childp, scheme, prefs, post, popup, pos, log, $, _ } = require 'kxk'

pkg = require '../package.json'

electron  = require 'electron'

prefs.init()
scheme.set prefs.get 'scheme', 'dark'

win = electron.remote.getCurrentWindow()
win.on 'resize', -> post.toMain 'saveBounds'
win.on 'move',   -> post.toMain 'saveBounds'

openFile = (f) ->
    
    f = slash.resolve f
    if slash.win()
        log 'openFile', f, slash.unslash slash.resolve('~/s/ko/ko-win32-x64/ko.exe')
        # childp.spawn 'bash', ['ko', f]
        childp.spawn slash.unslash(slash.resolve('~/s/ko/ko-win32-x64/ko.exe')), ['ko', slash.unslash slash.path f]
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

# 00000000    0000000    0000000  000000000  
# 000   000  000   000  000          000     
# 00000000   000   000  0000000      000     
# 000        000   000       000     000     
# 000         0000000   0000000      000     

post.on "clearLog", clearTasks
post.on "konradExit", (s) ->
post.on "konradError", (s) ->
post.on "konradOutput", (s) ->
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

    post.toMain 'highlight'

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
    
# 00000000  00000000   00000000    0000000   00000000
# 000       000   000  000   000  000   000  000   000
# 0000000   0000000    0000000    000   000  0000000
# 000       000   000  000   000  000   000  000   000
# 00000000  000   000  000   000   0000000   000   000

onError = (s) ->

    post.toMain 'showWindow'
    post.toMain 'highlight'
    
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
    
# 000000000  000  000000000  000      00000000  
#    000     000     000     000      000       
#    000     000     000     000      0000000   
#    000     000     000     000      000       
#    000     000     000     0000000  00000000  

window.titlebar = new title
    pkg:    pkg 
    menu:   __dirname + '/../coffee/menu.noon' 
    icon:   __dirname + '/../img/menu@2x.png'

# 000   000  00000000  000   000
# 000  000   000        000 000
# 0000000    0000000     00000
# 000  000   000          000
# 000   000  00000000     000

document.onkeydown = (event) ->

    return stopEvent(event) if 'unhandled' != window.titlebar.handleKey event, true
    
    { combo } = keyinfo.forEvent event
    
    log 'unhandled', combo

    switch combo
        when 'command+c', 'ctrl+c' then document.execCommand 'copy'

# 00000000    0000000   00000000   000   000  00000000   
# 000   000  000   000  000   000  000   000  000   000  
# 00000000   000   000  00000000   000   000  00000000   
# 000        000   000  000        000   000  000        
# 000         0000000   000         0000000   000        

$("#main").addEventListener "contextmenu", (event) ->
    
    absPos = pos event
    if not absPos?
        absPos = pos $('main').getBoundingClientRect().left, $('main').getBoundingClientRect().top
       
    items = _.clone window.titlebar.menuTemplate()
    items.unshift text:'Clear', accel:'ctrl+k'
        
    popup.menu
        items:  items
        x:      absPos.x
        y:      absPos.y
    
# 00     00  00000000  000   000  000   000   0000000    0000000  000000000  000   0000000   000   000  
# 000   000  000       0000  000  000   000  000   000  000          000     000  000   000  0000  000  
# 000000000  0000000   000 0 000  000   000  000000000  000          000     000  000   000  000 0 000  
# 000 0 000  000       000  0000  000   000  000   000  000          000     000  000   000  000  0000  
# 000   000  00000000  000   000   0000000   000   000   0000000     000     000   0000000   000   000  

post.on 'menuAction', (action) ->
    switch action
        when 'Quit'             then electron.remote.app.quit()
        when 'Clear'            then clearTasks()
        when 'Set Dir...'       then post.toMain 'setRootDir'
        when 'About'            then post.toMain 'showAbout'
        