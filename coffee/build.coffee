###
0000000    000   000  000  000      0000000  
000   000  000   000  000  000      000   000
0000000    000   000  000  000      000   000
000   000  000   000  000  000      000   000
0000000     0000000   000  0000000  0000000  
###

{ args, slash, atomic, empty, fs, colors, str, error, _ } = require 'kxk'

log     = console.log
pretty  = require './pretty'
config  = require './config'
argDir  = require './argdir'
should  = require './should'
target  = require './target'
compile = require './compile'
runcmd  = require './runcmd'

build = (sourceFile, opt, cb) ->

    log "source file".gray, sourceFile if args.debug

    ext = slash.extname(sourceFile).substr(1)

    cfg = config.obj sourceFile, opt

    if ext == 'js' and should 'browserify', cfg, sourceFile
        main = cfg.browserify.main
        out  = cfg.browserify.out
        pwd  = config.path 'browserify', slash.resolve(sourceFile), opt
        if out != slash.relative sourceFile, pwd
            log pretty.filePath(_.padEnd(slash.relative(main, argDir()), 40), colors.yellow), "🔧  ", pretty.filePath(slash.relative(out, argDir()), colors.blue)
            runcmd 'browserify', "#{main} #{out}", pwd
        return

    targetFile = target sourceFile, opt
    if not targetFile?
        log "no targetFile for source: #{sourceFile}", opt
        return

    log "target file".gray, targetFile if args.debug

    # 00000000   00000000   0000000   0000000
    # 000   000  000       000   000  000   000
    # 0000000    0000000   000000000  000   000
    # 000   000  000       000   000  000   000
    # 000   000  00000000  000   000  0000000

    fs.readFile sourceFile, 'utf8', (err, sourceText) ->

        if err then return error "can't read #{sourceFile}"
        
        #  0000000   0000000   00     00  00000000   000  000      00000000  
        # 000       000   000  000   000  000   000  000  000      000       
        # 000       000   000  000000000  00000000   000  000      0000000   
        # 000       000   000  000 0 000  000        000  000      000       
        #  0000000   0000000   000   000  000        000  0000000  00000000  
        
        compiled = compile sourceText, ext, sourceFile, targetFile, cfg
        
        if empty compiled
            if args.verbose then error "compile failed for #{sourceFile}"
            return
        
        fs.readFile targetFile, 'utf8', (err, targetData) ->

            if err or compiled != targetData

                writeCompiled sourceFile, targetFile, compiled, cb

            else
                log 'unchanged'.green.dim, pretty.filePath(slash.relative(targetFile, argDir()), colors.gray) if args.debug
                if args.verbose
                    log pretty.time(), "👍  #{pretty.filePath sourceFile} #{'►'.bold.yellow} #{pretty.filePath targetFile}"
                stat = fs.statSync sourceFile
                ttat = fs.statSync targetFile
                if stat.mtime.getTime() != ttat.mtime.getTime()
                    fs.utimesSync slash.resolve(targetFile), stat.atime, stat.mtime

# 000   000  00000000   000  000000000  00000000
# 000 0 000  000   000  000     000     000
# 000000000  0000000    000     000     0000000
# 000   000  000   000  000     000     000
# 00     00  000   000  000     000     00000000

writeCompiled = (sourceFile, targetFile, compiled, cb) ->

    log 'writeCompiled:', sourceFile, targetFile if args.debug
    
    fs.ensureDir slash.dir(targetFile), (err) ->

        if err then return error "can't create output  directory#{slash.dir(targetFile).bold.yellow}".bold.red

        atomic targetFile, compiled, (err) ->
            if not empty err 
                return error "can't  write#{targetFile.bold.yellow}!".bold.red, err
            if not args.quiet
                if args.verbose
                    log pretty.time(), "👍   #{pretty.filePath slash.tilde sourceFile} #{'►'.bold.yellow} #{pretty.filePath slash.tilde targetFile}"
                else
                    log pretty.time(), "👍   #{pretty.filePath slash.tilde targetFile}"

            if slash.samePath slash.dir(targetFile), __dirname
                watch = require './watch'
                watch.reload()
            else if cb?
                cb sourceFile, targetFile

module.exports = build
