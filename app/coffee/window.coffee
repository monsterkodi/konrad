# 000   000   0000000   000   000  00000000    0000000   0000000    
# 000  000   000   000  0000  000  000   000  000   000  000   000  
# 0000000    000   000  000 0 000  0000000    000000000  000   000  
# 000  000   000   000  000  0000  000   000  000   000  000   000  
# 000   000   0000000   000   000  000   000  000   000  0000000    
{
$}        = require './tools/tools'
log       = require './tools/log'  
keyinfo   = require './tools/keyinfo'
electron  = require 'electron'
ipc       = electron.ipcRenderer

ipc.on "clearLog", -> clearLog()

clearLog = -> $("scroll").innerHTML = html

# 000   000  00000000  000   000
# 000  000   000        000 000 
# 0000000    0000000     00000  
# 000  000   000          000   
# 000   000  00000000     000   

document.onkeydown = (event) ->
    {mod, key, combo} = keyinfo.forEvent event
    switch key
        when 'esc'           then return window.close()
        when 'command+alt+i' then return ipc.send 'open-console'
    log key
