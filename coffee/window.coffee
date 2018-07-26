###
000   000  000  000   000  0000000     0000000   000   000  
000 0 000  000  0000  000  000   000  000   000  000 0 000  
000000000  000  000 0 000  000   000  000   000  000000000  
000   000  000  000  0000  000   000  000   000  000   000  
00     00  000  000   000  0000000     0000000   00     00  
###

{ win, udp, slash, elem, stopEvent, keyinfo, childp, scheme, prefs, post, popup, pos, log, $, _ } = require 'kxk'

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

koSend = null
openFile = (f) ->
    log 'openFile', f
    if not koSend then koSend = new udp port:9779
    koSend.send slash.resolve f

tasks = {}

#  0000000   000   000  00000000  00000000   000       0000000   000   000  
# 000   000  000   000  000       000   000  000      000   000   000 000   
# 000   000   000 000   0000000   0000000    000      000000000    00000    
# 000   000     000     000       000   000  000      000   000     000     
#  0000000       0      00000000  000   000  0000000  000   000     000     

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

post.on "konradVersion", (s) ->
    split = s.trim().split /\s+/
    info = 
        name:    'konrad'
        version: split[0]
        path:    slash.tilde split[2]
    window.titlebar.setTitle info
    
post.on "clearLog", -> $("main").innerHTML = ''; tasks = {}; showOverlay(); 
    
# 000000000   0000000    0000000  000   000  0000000    000  000   000  
#    000     000   000  000       000  000   000   000  000  000   000  
#    000     000000000  0000000   0000000    000   000  000   000 000   
#    000     000   000       000  000  000   000   000  000     000     
#    000     000   000  0000000   000   000  0000000    000      0      

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
    fil.onclick = -> openFile opt.file if opt.file?

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
    
    source = slash.tilde source.trim()
    target = slash.tilde target.trim()
    # source = slash.tilde(source).trim()
    div = taskDiv time: time, file: source, key: source, icon: '👍'
    div.scrollIntoViewIfNeeded()
    
    if slash.dir(target).startsWith slash.tilde slash.dir __filename
        if slash.file(target) == 'window.js' or slash.ext(target) in ['css', 'html']
            post.emit 'menuAction', 'Reload'
        else if slash.file(target) == 'main.js'
            post.toMain 'Restart'
        else
            log "should restart konrad '#{slash.file(target)}'", target, slash.path __filename
            post.toMain 'Restart konrad'
    
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
    
    for key,task of tasks
        if task.icon == '😡' 
            task.div.remove()
            delete tasks[key]

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
    
# 00     00  00000000  000   000  000   000   0000000    0000000  000000000  000   0000000   000   000  
# 000   000  000       0000  000  000   000  000   000  000          000     000  000   000  0000  000  
# 000000000  0000000   000 0 000  000   000  000000000  000          000     000  000   000  000 0 000  
# 000 0 000  000       000  0000  000   000  000   000  000          000     000  000   000  000  0000  
# 000   000  00000000  000   000   0000000   000   000   0000000     000     000   0000000   000   000  

post.on 'menuAction', (action) ->
    
    switch action
        when 'Clear'      then post.emit 'clearLog'
        when 'Set Dir...' then post.toMain 'setRootDir'
        
showOverlay()
