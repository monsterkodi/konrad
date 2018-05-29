###
000   000   0000000   000      000   000
000 0 000  000   000  000      000  000 
000000000  000000000  000      0000000  
000   000  000   000  000      000  000 
00     00  000   000  0000000  000   000
###

{ walkdir, slash, error, log, _ } = require 'kxk'

argDir = require './argdir'
should = require './should'
target = require './target'
config = require './config'

walk = (wlk, opt, cb) ->
    
    if _.isFunction opt
        cb = opt
        opt = {}

    try
        walkdir.sync argDir(), (wp) ->

            p = slash.path wp
            o = config.obj p, opt

            if should 'ignore', o, p
                cb p if opt.all
                @ignore wp
                return

            if should 'ignore', wlk, p
                cb p if opt.all
                @ignore wp
                return

            if slash.ext(p) in _.keys o
                cb p, target p, opt
            else
                if opt.all
                    if not cb p
                        @ignore wp
    catch err
        error "walk", err

module.exports = walk
