###
 0000000  000   000   0000000   000   000  000      0000000  
000       000   000  000   000  000   000  000      000   000
0000000   000000000  000   000  000   000  000      000   000
     000  000   000  000   000  000   000  000      000   000
0000000   000   000   0000000    0000000   0000000  0000000  
###

{ args, slash, colors, log, _ } = require 'kxk'

argDir = require './argdir'
pretty = require './pretty'

should = (k, o, p) ->

    return false if not o[k]?

    if _.isArray o[k]
        keys = o[k]
    else if _.isObject o[k]
        keys = _.keys o[k]
    else
        keys = [o[k]]

    for i in keys
        r = i
        r = new RegExp i if _.isString i
        if r.test p
            log pretty.filePath(slash.relative(p, argDir()), colors.gray), 'should '.blue+k.bold.blue if args.debug
            return true
    false

module.exports = should
