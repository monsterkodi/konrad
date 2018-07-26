###
00000000  00000000   00000000    0000000   00000000
000       000   000  000   000  000   000  000   000
0000000   0000000    0000000    000   000  0000000
000       000   000  000   000  000   000  000   000
00000000  000   000  000   000   0000000   000   000
###

{ slash } = require 'kxk'

log = console.log
pretty = require './pretty'

konradError = (title, msg, srcFile) ->
    
    stripped = String(msg).strip
    splitted = stripped.split '\n'

    if title == 'compile error'
        
        [fileLine, rest] = splitted[0].split ': '
        [file, line, col] = slash.splitFileLine fileLine
        splitted[0] = rest.bold.yellow
        errStr = splitted.join '\n'
        
        if srcFile
            file = slash.tilde srcFile
            
        sourceFile = file
        sourceFile += ":#{line}" if line
        sourceFile += ":#{col}" if col
        
        log pretty.time(), "😡  #{pretty.filePath sourceFile}\n#{errStr}"
    else
        log "#{title.bold.yellow} #{String(stripped).red}"
    false
    
module.exports = konradError
