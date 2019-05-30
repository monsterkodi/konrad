###
000   000  000  000   000  0000000     0000000   000   000  
000 0 000  000  0000  000  000   000  000   000  000 0 000  
000000000  000  000 0 000  000   000  000   000  000000000  
000   000  000  000  0000  000   000  000   000  000   000  
00     00  000  000   000  0000000     0000000   00     00  
###

{ win, udp, slash, elem, stopEvent, keyinfo, childp, scheme, prefs, post, popup, noon, klog, $, _ } = require 'kxk'

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
    klog 'openFile', f
    if not koSend then koSend = new udp port:9779
    koSend.send slash.resolve f

tasks = {}

#  0000000   000   000  00000000  00000000   000       0000000   000   000  
# 000   000  000   000  000       000   000  000      000   000   000 000   
# 000   000   000 000   0000000   0000000    000      000000000    00000    
# 000   000     000     000       000   000  000      000   000     000     
#  0000000       0      00000000  000   000  0000000  000   000     000     

showOverlay = ->

    img = slash.fileUrl slash.join __dirname, '..', 'img', 'about.png'
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
post.on "konradOutput", (s, html) ->
    
    if      / 😡 /.test s then onError   s, html
    else if / 👍 /.test s then onTask    s, html
    else if / 🔧 /.test s then onMessage s, html
    else log 'konrad', s

post.on "konradVersion", (s) ->
    
    split = s.trim().split /\s+/
    window.titlebar.setTitle  
        title: process.argv[0].endsWith('Electron Helper') and ['version' 'path'] or ['path']
        pkg:
            version: split[0]
            path: slash.tilde split[2]
    
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
    fil.innerHTML = opt.fileHtml ? " #{opt.icon} #{opt.file ? opt.message}"
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
            # klog "should restart konrad '#{slash.file(target)}'", target, slash.path __filename
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

onError = (s, html) ->

    post.toMain 'showWindow'
    post.toMain 'highlight'
    
    for key,task of tasks
        if task.icon == '😡' 
            task.div.remove()
            delete tasks[key]

    lines = s.split '\n'
    if html
        htmls = html.split '\n'
        fileHtml = htmls.shift().split('</span>')[5..].join '</span>'
    
    [time, file] = lines.shift().split ' 😡 '
    file = file.trim()

    div = taskDiv time: time, file: file, key: file.split(':')[0], icon: '😡', fileHtml:fileHtml

    for i in [0...lines.length]
        pre = document.createElement 'pre'
        pre.classList.add 'error'
        if htmls[i]
            pre.innerHTML = htmls[i]
        else
            pre.textContent = lines[i]
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
