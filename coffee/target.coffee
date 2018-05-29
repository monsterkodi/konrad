###
000000000   0000000   00000000    0000000   00000000  000000000
   000     000   000  000   000  000        000          000   
   000     000000000  0000000    000  0000  0000000      000   
   000     000   000  000   000  000   000  000          000   
   000     000   000  000   000   0000000   00000000     000   
###

{ slash, colors, log, _ } = require 'kxk'

args   = require './args'
argDir = require './argdir'
config = require './config'

target = (sourceFile, opt) ->
    
    ext = slash.ext sourceFile
    o = config.obj sourceFile, opt

    if o[ext]?.filter?
        matches = false
        for r in o[ext].filter
            if new RegExp(r).test(sourceFile)
                matches = true
        if not matches
            log pretty.filePath slash.relative(sourceFile, argDir()), colors.blue if args.debug
            return

    targetFile = _.clone sourceFile

    if o[ext]?.replace?
        for k,v of o[ext].replace
            targetFile = targetFile.replace k, v

    return if not o[ext]?.ext?

    targetFile = slash.join slash.dir(targetFile), slash.base(targetFile) + '.' + o[ext].ext
    
module.exports = target
