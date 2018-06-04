###
000   000  000  000   000  0000000     0000000   000   000  
000 0 000  000  0000  000  000   000  000   000  000 0 000  
000000000  000  000 0 000  000   000  000   000  000000000  
000   000  000  000  0000  000   000  000   000  000   000  
00     00  000  000   000  0000000     0000000   00     00  
###

{ win, slash, elem, stopEvent, keyinfo, childp, scheme, prefs, post, popup, pos, log, $, _ } = require 'kxk'

w = new win 
    dir:    __dirname
    pkg:    require '../package.json'
    menu:   '../coffee/menu.noon'
    icon:   '../img/menu@2x.png'
    
#  0000000   00000000   00000000  000   000  
# 000   000  000   000  000       0000  000  
# 000   000  00000000   0000000   000 0 000  
# 000   000  000        000       000  0000  
#  0000000   000        00000000  000   000  

openFile = (f) ->
    
    f = slash.resolve f
    if slash.win()
        log 'openFile', f, slash.unslash slash.resolve('~/s/ko/ko-win32-x64/ko.exe')
        # childp.spawn 'bash', ['ko', f]
        childp.spawn slash.unslash(slash.resolve('~/s/ko/ko-win32-x64/ko.exe')), ['ko', slash.unslash slash.path f]
    else
        childp.spawn '/usr/local/bin/ko', [f]

tasks = {}

#  0000000   000   000  00000000  00000000   000       0000000   000   000  
# 000   000  000   000  000       000   000  000      000   000   000 000   
# 000   000   000 000   0000000   0000000    000      000000000    00000    
# 000   000     000     000       000   000  000      000   000     000     
#  0000000       0      00000000  000   000  0000000  000   000     000     

showOverlay = ->

    log 'showOverlay'
    img = slash.fileUrl __dirname+'/../img/about.png'
    $("#overlay")?.remove() 
    overlay = elem id:'overlay'
    overlay.appendChild elem 'img', class:'info', src:img
    overlay.addEventListener 'click', (event) -> event.target.remove()
    $("main").appendChild overlay

fadeOverlay = ->
    
    showOverlay()
    $("#overlay").classList.add 'fade-in'
    
# 00000000    0000000    0000000  000000000  
# 000   000  000   000  000          000     
# 00000000   000   000  0000000      000     
# 000        000   000       000     000     
# 000         0000000   0000000      000     

post.on "konradExit", (s) ->
post.on "konradError", (s) ->
post.on "konradOutput", (s) ->
    if      / 😡 /.test s then onError   s
    else if / 👍 /.test s then onTask    s
    else if / 🔧 /.test s then onMessage s
    else console.log 'konrad', s

# 000000000   0000000    0000000  000   000   0000000  
#    000     000   000  000       000  000   000       
#    000     000000000  0000000   0000000    0000000   
#    000     000   000       000  000  000        000  
#    000     000   000  0000000   000   000  0000000   

clearTasks = -> $("main").innerHTML = ''; tasks = {}; showOverlay(); 

post.on "clearLog", clearTasks
    
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
    
# 000   000  00000000  000   000
# 000  000   000        000 000
# 0000000    0000000     00000
# 000  000   000          000
# 000   000  00000000     000

# onCombo = (combo, info) ->
#    
    # switch combo
        # when 'command+c', 'ctrl+c' then document.execCommand 'copy'
#         
# post.on 'combo', onCombo

# 00     00  00000000  000   000  000   000   0000000    0000000  000000000  000   0000000   000   000  
# 000   000  000       0000  000  000   000  000   000  000          000     000  000   000  0000  000  
# 000000000  0000000   000 0 000  000   000  000000000  000          000     000  000   000  000 0 000  
# 000 0 000  000       000  0000  000   000  000   000  000          000     000  000   000  000  0000  
# 000   000  00000000  000   000   0000000   000   000   0000000     000     000   0000000   000   000  

onMenuAction = (action) ->
    
    log 'menuAction', action
    switch action
        when 'Clear'            then clearTasks()
        when 'Set Dir...'       then post.toMain 'setRootDir'
        
post.on 'menuAction', onMenuAction
