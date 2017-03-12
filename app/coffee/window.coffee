# 000   000   0000000   000   000  00000000    0000000   0000000    
# 000  000   000   000  0000  000  000   000  000   000  000   000  
# 0000000    000   000  000 0 000  0000000    000000000  000   000  
# 000  000   000   000  000  0000  000   000  000   000  000   000  
# 000   000   0000000   000   000  000   000  000   000  0000000    
{
resolve,
unresolve,
$}        = require './tools/tools'
log       = require './tools/log'  
keyinfo   = require './tools/keyinfo'
prefs     = require './tools/prefs'
childp    = require 'child_process'
electron  = require 'electron'
moment    = require 'moment'
ipc       = electron.ipcRenderer

prefs.init()

window.onresize = -> ipc.send 'saveBounds'

openFile = (f) ->
    f = resolve f
    console.log "open file: '#{f}'"
    childp.spawn '/usr/local/bin/ko', [f]

tasks = {}

clearLog   = -> $("main").innerHTML = ''
clearTasks = -> clearLog(); tasks = {}
ipc.on "clearLog", clearLog

# 000000000   0000000    0000000  000   000  
#    000     000   000  000       000  000   
#    000     000000000  0000000   0000000    
#    000     000   000       000  000  000   
#    000     000   000  0000000   000   000  

onTask = (s) ->
    ipc.send 'highlight'
    
    [time, sourceTarget] = s.split ' 👍 '
    [source, target] = sourceTarget.split ' ► '
    
    source = source.trim()
    tasks[source]?.div?.remove()
    
    div = document.createElement 'div'
    tim = document.createElement 'span'
    fil = document.createElement 'span'
    
    div.classList.add 'task'
    tim.classList.add 'time'
    fil.classList.add 'file'
    fil.onclick = () -> openFile source 
    
    tim.innerHTML = time
    fil.innerHTML = ' 👍 ' + source
    
    div.appendChild tim
    div.appendChild fil
    
    tasks[source] = div: div
    
    $('main').appendChild div
    div.scrollIntoViewIfNeeded()

# 00     00  00000000   0000000   0000000   0000000    0000000   00000000  
# 000   000  000       000       000       000   000  000        000       
# 000000000  0000000   0000000   0000000   000000000  000  0000  0000000   
# 000 0 000  000            000       000  000   000  000   000  000       
# 000   000  00000000  0000000   0000000   000   000   0000000   00000000  

onMessage = (s) ->
    
    [time, msg] = s.split ' 🔧 '
    
    tasks['msg']?.div?.remove()
    
    div = document.createElement 'div'
    tim = document.createElement 'span'
    fil = document.createElement 'span'
    
    div.classList.add 'task'
    tim.classList.add 'time'
    fil.classList.add 'message'
    
    tim.innerHTML = time
    fil.innerHTML = ' 🔧 ' + msg
    
    div.appendChild tim
    div.appendChild fil
    
    tasks['msg'] = div: div
    
    $('main').appendChild div    

# 00000000  00000000   00000000    0000000   00000000   
# 000       000   000  000   000  000   000  000   000  
# 0000000   0000000    0000000    000   000  0000000    
# 000       000   000  000   000  000   000  000   000  
# 00000000  000   000  000   000   0000000   000   000  

onError = (s) ->
    ipc.send 'showWin'
    ipc.send 'highlight'
    clearTasks()
    
    lines = s.split '\n'
    [time, file] = lines.shift().split ' 😡 '
    console.log "time: '#{time}' file: '#{file}'"
    file = file.trim()
    
    div = document.createElement 'div'
    tim = document.createElement 'span'
    fil = document.createElement 'span'
    
    div.classList.add 'task'
    tim.classList.add 'time'
    fil.classList.add 'file'
    fil.onclick = () -> openFile file
    
    tim.innerHTML = time
    fil.innerHTML = ' 😡 ' + file
    
    div.appendChild tim
    div.appendChild fil
    
    tasks[file.split(':')[0]] = div: div
    
    for l in lines
        pre = document.createElement 'pre'
        pre.classList.add 'error'
        pre.textContent = l
        div.appendChild pre
        
    $('main').appendChild div
    div.scrollIntoViewIfNeeded()
    
setTitleBar = (s) ->
    [path, version] = s.split ' ● '
    html  = "<span class='titlebarPath'>#{unresolve path}</span>"
    html += "<span class='titlebarDot'> ● </span>"
    html += "<span class='titlebarVersion'>#{version}</span>"
    $('titlebar').innerHTML = html

# 000   000  00000000  000   000
# 000  000   000        000 000 
# 0000000    0000000     00000  
# 000  000   000          000   
# 000   000  00000000     000   

document.onkeydown = (event) ->
    {mod, key, combo} = keyinfo.forEvent event
    switch combo
        when 'esc'                then return window.close()
        when 'command+c'          then document.execCommand 'copy' 
        when 'command+alt+i'      then return ipc.send 'openDevTools'
        when 'command+alt+ctrl+l' then return ipc.send 'reloadWin'

# konrad = childp.spawn '/usr/local/bin/konrad', ['-v'], 
konrad = childp.spawn resolve('~/s/konrad/bin/konrad'), ['-v'], 
    cwd:    resolve '~/s'
    shell: '/usr/local/bin/bash'
    
konrad.on 'close', (code) -> 
    log "konrad exit code: #{code}"
    ipc.send 'showWin'

konrad.stderr.on 'data', (data) ->
    s = data.toString()
    log "konrad error: #{s}"

konrad.stdout.on 'data', (data) -> 
    s = data.toString()
    if /\ watching\ /.test s then setTitleBar s.split('watching ')[1]
    else if    / 😡 /.test s then onError   s
    else if    / 👍 /.test s then onTask    s
    else if    / 🔧 /.test s then onMessage s
    else console.log 'konrad: ', s

