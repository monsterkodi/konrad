###
000   000   0000000   000000000   0000000  000   000
000 0 000  000   000     000     000       000   000
000000000  000000000     000     000       000000000
000   000  000   000     000     000       000   000
00     00  000   000     000      0000000  000   000
###

{ args, slash, childp, colors, log, _ } = require 'kxk'

pretty = require './pretty'
should = require './should'
runcmd = require './runcmd'
config = require './config'
build  = require './build'
pkg    = require '../package.json'

watcher = null

watch = (wlk, opt) ->
    
    start = (cb) ->

        pass = (p) -> if slash.extname(p).substr(1) in _.keys(opt) then true

        d = args.arguments[0] ? '.'
        v = "#{pkg.version} ●".dim.gray
        log pretty.time(), "👁   #{v} #{pretty.filePath slash.resolve(d), colors.white}".gray
        watcher = require('chokidar').watch d,
            ignored:        wlk.ignore
            ignoreInitial:  true
            usePolling:     false
            useFsEvents:    true

        watcher
            .on 'add',    (p) -> if pass p then cb slash.path p
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

# 00000000   00000000  000       0000000    0000000   0000000    
# 000   000  000       000      000   000  000   000  000   000  
# 0000000    0000000   000      000   000  000000000  000   000  
# 000   000  000       000      000   000  000   000  000   000  
# 000   000  00000000  0000000   0000000   000   000  0000000    

watch.reload = ->
    
    return if not watcher?
    
    watcher.close()
    
    log pretty.time(), '🔧  reload '.gray, process.cwd() if not args.quiet

    konrad = slash.resolve slash.join __dirname, 'konrad.js'
    
    args = [konrad]
    args.push '-w'
    args.push '-v' if args.verbose
    args.push '-D' if args.debug
    args.push '-q' if args.quiet
        
    childp.spawn 'node', args,
        cwd:         process.cwd()
        encoding:    'utf8'
        detached:    true
        shell:       true
        windowsHide: true
        
    log 'exit'.yellow.bold if not args.quiet
    
    process.exit 0

module.exports = watch
