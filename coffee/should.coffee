###
 0000000  000   000   0000000   000   000  000      0000000  
000       000   000  000   000  000   000  000      000   000
0000000   000000000  000   000  000   000  000      000   000
     000  000   000  000   000  000   000  000      000   000
0000000   000   000   0000000    0000000   0000000  0000000  
###

{ _, args, klog, kolor, slash } = require 'kxk'

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
        if r?.test? p
            klog pretty.filePath(slash.relative(p, argDir()), kolor.gray), 'should '.blue+k.bold.blue if args.debug
            return true
    false

module.exports = should
