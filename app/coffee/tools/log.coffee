#000       0000000    0000000 
#000      000   000  000      
#000      000   000  000  0000
#000      000   000  000   000
#0000000   0000000    0000000 

str    = require './str'
childp = require 'child_process'

log = -> 
    console.log (str(s) for s in [].slice.call arguments, 0).join " "
    
logScroll = -> 
    s = (str(s) for s in [].slice.call arguments, 0).join " "
    console.log s
    { $ }  = require './tools'
    $('main').innerHTML += s + '<br>'

if window?
    module.exports = logScroll
else
    module.exports = log
    