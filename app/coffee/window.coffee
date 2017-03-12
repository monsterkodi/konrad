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
    childp.spawn '/usr/local/bin/ko', [f]

tasks = {}

clearLog   = -> $("main").innerHTML = ''
clearTasks = -> clearLog(); tasks = {}
ipc.on "clearLog", clearLog

taskDiv = (opt) ->
    
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
    $('main').appendChild div
    
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
    
    source = source.trim()
    div = taskDiv time: time, file: source, key: source, icon: '👍'
    div.scrollIntoViewIfNeeded()

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
    ipc.send 'showWin'
    ipc.send 'highlight'
    clearTasks()
    
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

