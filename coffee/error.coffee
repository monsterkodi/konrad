###
00000000  00000000   00000000    0000000   00000000
000       000   000  000   000  000   000  000   000
0000000   0000000    0000000    000   000  0000000
000       000   000  000   000  000   000  000   000
00000000  000   000  000   000   0000000   000   000
###

{ klog, kolor, kstr, title } = require 'kxk'

pretty = require './pretty'

konradError = (title, msg, srcFile) ->
    
    if title == 'compile error'
        klog pretty.time(), "😡  #{msg}"
    else
        msgsplit = msg.split '\n'
        stripped = msgsplit.map (s) -> kstr.stripAnsi s
        klog "#{kolor.bold kolor.yellow title} #{kolor.r5 stripped}"
    false
    
module.exports = konradError
