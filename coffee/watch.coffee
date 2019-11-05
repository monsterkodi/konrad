###
000   000   0000000   000000000   0000000  000   000
000 0 000  000   000     000     000       000   000
000000000  000000000     000     000       000000000
000   000  000   000     000     000       000   000
00     00  000   000     000      0000000  000   000
###

{ colors, slash, args, klog, _ } = require 'kxk'

pretty = require './pretty'
should = require './should'
runcmd = require './runcmd'
config = require './config'
build  = require './build'
pkg    = require '../package.json'

watcher = null

Watch = (wlk, opt) ->
    
    # klog 'watch' wlk, opt
    
    start = (cb) ->

        pass = (p) -> slash.ext(p) in _.keys(opt)

        d = args.arguments[0] ? '.'
        v = "#{pkg.version} ●".dim.gray
        klog pretty.time(), "👁   #{v} #{pretty.filePath slash.resolve(d), colors.white}".gray
        watcher = require('kxk').watch.watch d, recursive:true, ignore:wlk.ignore
        watcher.on 'change' (info) -> 
            if pass info.path then cb slash.path info.path

    start (sourceFile) ->

        sourceFile = slash.resolve sourceFile
        o = config.obj sourceFile, opt

        test = (source) ->
            if should 'test' o, source
                runcmd 'test' source, config.path 'test' slash.resolve(source), opt

        if not should 'ignore' o, sourceFile
            build sourceFile, opt, test
        else
            test sourceFile

module.exports = Watch
