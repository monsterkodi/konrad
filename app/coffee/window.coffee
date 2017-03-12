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
ipc       = electron.ipcRenderer

ipc.on "clearLog", -> $("main").innerHTML = ''

prefs.init()

window.onresize = -> ipc.send 'saveBounds'

onError = (s) ->
    for l in s.split '\n'
        log l

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
        when 'command+alt+i'      then return ipc.send 'openDevTools'
        when 'command+alt+ctrl+l' then return ipc.send 'reloadWin'

konrad = childp.spawn '/usr/local/bin/konrad', [], 
    cwd: resolve '~/s'
    
konrad.on 'close', (code) -> log "exit: #{code}"

konrad.stdout.on 'data', (data) -> 
    s = data.toString()
    if /\ watching\ /.test s
        setTitleBar s.split('watching ')[1]
    else if /^compile error/.test s
        onError s.split('compile error')[1]
    else
        log "#{s}"

