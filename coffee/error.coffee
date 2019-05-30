###
00000000  00000000   00000000    0000000   00000000
000       000   000  000   000  000   000  000   000
0000000   0000000    0000000    000   000  0000000
000       000   000  000   000  000   000  000   000
00000000  000   000  000   000   0000000   000   000
###

{ slash, klog, colors } = require 'kxk'

pretty = require './pretty'

konradError = (title, msg, srcFile) ->
    
    msgsplit = msg.split '\n'
    stripped = msgsplit.map (s) -> colors.strip s

    if title == 'compile error'
        
        # [fileLine, rest] = stripped[0].split ': '
        # [file, line, col] = slash.splitFileLine fileLine
        # # splitted[0] = rest?.bold.yellow
#         
        # if srcFile
            # file = slash.tilde srcFile

        # sourceFile = file
        # sourceFile += ":#{line}" if line
        # sourceFile += ":#{col}" if col

        # klog pretty.time(), "😡  #{pretty.filePath sourceFile, colors.red}\n#{msgsplit[1..].join('\n')}"
        klog pretty.time(), "😡  #{msg}"
    else
        klog "#{title.bold.yellow} #{colors.red stripped}"
    false
    
module.exports = konradError
