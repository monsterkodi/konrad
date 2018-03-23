###
00000000  00000000   00000000    0000000   00000000
000       000   000  000   000  000   000  000   000
0000000   0000000    0000000    000   000  0000000
000       000   000  000   000  000   000  000   000
00000000  000   000  000   000   0000000   000   000
###

{ log } = require 'kxk'

pretty = require './pretty'

konradError = (title, msg) ->
    
    stripped = String(msg).strip
    splitted = stripped.split '\n'

    if title == 'compile error'
        [sourceFile, rest] = splitted[0].split ': '
        splitted[0] = rest.bold.yellow
        errStr = splitted.join '\n'
        log pretty.time(), "😡  #{pretty.filePath sourceFile}\n#{errStr}"
    else
        log "#{title.bold.yellow} #{String(stripped).red}"
    false
    
module.exports = konradError
