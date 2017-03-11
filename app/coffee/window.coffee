# 000   000   0000000   000   000  00000000    0000000   0000000    
# 000  000   000   000  0000  000  000   000  000   000  000   000  
# 0000000    000   000  000 0 000  0000000    000000000  000   000  
# 000  000   000   000  000  0000  000   000  000   000  000   000  
# 000   000   0000000   000   000  000   000  000   000  0000000    
{
$}        = require './tools/tools'
log       = require './tools/log'  
keyname   = require './tools/keyname'
electron  = require 'electron'
clipboard = electron.clipboard
ipc       = electron.ipcRenderer

ipc.on "clearLog", -> clearLog()

clearLog = -> $("scroll").innerHTML = html

# 000   000  00000000  000   000
# 000  000   000        000 000 
# 0000000    0000000     00000  
# 000  000   000          000   
# 000   000  00000000     000   

document.onkeydown = (event) ->
    key = keyname.ofEvent event
    switch key
        when 'esc'           then return window.close()
        when 'command+alt+i' then return ipc.send 'open-console'
    log key
