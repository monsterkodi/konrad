###
000   000   0000000   000000000   0000000  000   000
000 0 000  000   000     000     000       000   000
000000000  000000000     000     000       000000000
000   000  000   000     000     000       000   000
00     00  000   000     000      0000000  000   000
###

kxk = require 'kxk'
{ _, args, klog, kolor, slash, watch } = kxk

pretty = require './pretty'
should = require './should'
runcmd = require './runcmd'
config = require './config'
build  = require './build'
pkg    = require '../package.json'

watcher = null

Watch = (wlk, opt) ->
    
    # log 'watch' wlk, opt
    
    start = (cb) ->

        pass = (p) -> slash.ext(p) in _.keys(opt)

        d = args.arguments[0] ? '.'
        v = kolor.dim kolor.gray "#{pkg.version} ●"
        klog pretty.time(), kolor.gray "👁   #{v} #{pretty.filePath slash.resolve(d), kolor.white}"
        watch.watch d, recursive:true, ignore:wlk.ignore, cb:(watcher) ->
            watcher.on 'change' (info) -> 
                if pass info.path then cb slash.path info.path

    start (sourceFile) ->

        sourceFile = slash.resolve sourceFile
        o = config.obj sourceFile, opt

        test = (source) ->
            if should 'test' o, source
                runcmd 'test' source, config.path 'test' slash.resolve(source), opt

        if not should 'ignore' o, sourceFile
            log 'build?' sourceFile, opt, test
            build sourceFile, opt, test
        else
            test sourceFile

module.exports = Watch
