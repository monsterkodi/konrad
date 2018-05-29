###
 0000000   0000000   000   000  00000000  000   0000000 
000       000   000  0000  000  000       000  000      
000       000   000  000 0 000  000000    000  000  0000
000       000   000  000  0000  000       000  000   000
 0000000   0000000   000   000  000       000   0000000 
###

{ slash, fs, noon, log, _ } = require 'kxk'

path = (key, p, opt) ->
    
    while slash.dir(p).length and slash.dir(p) not in ['.', '/']
        p = slash.dir p
        if fs.existsSync slash.join p, '.konrad.noon'
            o = _.defaultsDeep noon.load(slash.join p, '.konrad.noon'), opt
            if o[key]?
                return slash.resolve p
    null

obj = (p, opt) ->
    
    while slash.dir(p).length and slash.dir(p) not in ['.', '/'] and not /^\w\:\/$/.test slash.dir(p)
        p = slash.dir p
        if fs.existsSync slash.join p, '.konrad.noon'
            o = _.defaultsDeep noon.load(slash.join p, '.konrad.noon'), opt
            if o.ignore?.map?
                o.ignore = o.ignore.map (i) ->
                    if _.isString i
                        new RegExp i
                    else
                        i
            return o
    opt
    
module.exports = 
    path:path
    obj:obj
