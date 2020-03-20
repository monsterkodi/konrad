###
 0000000   0000000   000   000  00000000  000   0000000 
000       000   000  0000  000  000       000  000      
000       000   000  000 0 000  000000    000  000  0000
000       000   000  000  0000  000       000  000   000
 0000000   0000000   000   000  000       000   0000000 
###

{ _, klog, noon, slash } = require 'kxk'

path = (key, p, opt) ->
    
    while slash.dir(p).length and slash.dir(p) not in ['.' '/']
        p = slash.dir p
        if slash.fileExists slash.join p, '.konrad.noon'
            o = _.defaultsDeep noon.load(slash.join p, '.konrad.noon'), opt
            if o[key]?
                return slash.resolve p
    null

obj = (p, opt={}) ->
    
    # klog 'obj' p, opt
    while slash.dir(p).length and slash.dir(p) not in ['.' '/'] and not /^\w\:\/$/.test slash.dir(p)
        p = slash.dir p
        if slash.fileExists slash.join p, '.konrad.noon'
            o = _.defaultsDeep noon.load(slash.join p, '.konrad.noon'), opt
            if o.ignore?.map?
                o.ignore = o.ignore.map (i) ->
                    if _.isString i
                        new RegExp i
                    else 
                        i
            # klog 'konrad.noon' o
            return o
    klog 'no obj' p
    opt
    
module.exports = 
    path:path
    obj:obj
