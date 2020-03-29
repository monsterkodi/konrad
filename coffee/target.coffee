###
000000000   0000000   00000000    0000000   00000000  000000000
   000     000   000  000   000  000        000          000   
   000     000000000  0000000    000  0000  0000000      000   
   000     000   000  000   000  000   000  000          000   
   000     000   000  000   000   0000000   00000000     000   
###

{ _, args, klog, kolor, slash } = require 'kxk'

argDir = require './argdir'
config = require './config'
pretty = require './pretty'

target = (sourceFile, opt) ->
    
    ext = slash.ext sourceFile
    o = config.obj sourceFile, opt

    if o[ext]?.filter?
        matches = false
        for r in o[ext].filter
            if new RegExp(r).test(sourceFile)
                matches = true
        if not matches
            klog pretty.filePath slash.relative(sourceFile, argDir()), kolor.blue if args.debug
            return

    targetFile = _.clone sourceFile

    if o[ext]?.replace?
        for k,v of o[ext].replace
            targetFile = targetFile.replace k, v

    return if not o[ext]?.ext?

    targetFile = slash.join slash.dir(targetFile), slash.base(targetFile) + '.' + o[ext].ext
    
module.exports = target
