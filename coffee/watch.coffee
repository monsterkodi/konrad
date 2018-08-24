###
000   000   0000000   000000000   0000000  000   000
000 0 000  000   000     000     000       000   000
000000000  000000000     000     000       000000000
000   000  000   000     000     000       000   000
00     00  000   000     000      0000000  000   000
###

{ watch, args, slash, childp, colors, _ } = require 'kxk'

log    = console.log
pretty = require './pretty'
should = require './should'
runcmd = require './runcmd'
config = require './config'
build  = require './build'
pkg    = require '../package.json'

watcher = null

Watch = (wlk, opt) ->
    
    start = (cb) ->

        pass = (p) -> if slash.extname(p).substr(1) in _.keys(opt) then true

        d = args.arguments[0] ? '.'
        v = "#{pkg.version} ●".dim.gray
        log pretty.time(), "👁   #{v} #{pretty.filePath slash.resolve(d), colors.white}".gray
        log 'watch.ignore', wlk.ignore
        watcher = watch.watch d
        # watcher = require('chokidar').watch d,
            # ignored:        wlk.ignore
            # ignoreInitial:  true
            # usePolling:     false
            # useFsEvents:    true

        watcher
            # .on 'add',    (p) -> if pass p then cb slash.path p
            .on 'change', (p) -> if pass p then cb slash.path p

    start (sourceFile) ->

        sourceFile = slash.resolve sourceFile
        o = config.obj sourceFile, opt

        test = (source) ->
            if should 'test', o, source
                runcmd 'test', source, config.path 'test', slash.resolve(source), opt

        if not should 'ignore', o, sourceFile
            build sourceFile, opt, test
        else
            test sourceFile

module.exports = Watch
