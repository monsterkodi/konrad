###
000   000   0000000   000   000  00000000    0000000   0000000  
000  000   000   000  0000  000  000   000  000   000  000   000
0000000    000   000  000 0 000  0000000    000000000  000   000
000  000   000   000  000  0000  000   000  000   000  000   000
000   000   0000000   000   000  000   000  000   000  0000000  
###

fs     = require 'fs'
path   = require 'path'
noon   = require 'noon'
write  = require 'write-file-atomic'
colors = require 'colors'
chalk  = require 'chalk'
coffee = require 'coffee-script'
choki  = require 'chokidar'
notify = require 'growl'
path   = require 'path'
_      = require 'lodash'
log    = console.log

args = require('karg') """
konrad
    directory  . ? the directory to watch . * . = .
    verbose    . ? log more . = false
    quiet      . ? log nothing . = false
    version    . - V . = #{require("#{__dirname}/../package.json").version}
"""

opt = noon.parse """
coffee  . ext js . replace .. /coffee/ /js/
noon    . ext json
json    . ext noon
"""

###
00000000  00000000   00000000    0000000   00000000 
000       000   000  000   000  000   000  000   000
0000000   0000000    0000000    000   000  0000000  
000       000   000  000   000  000   000  000   000
00000000  000   000  000   000   0000000   000   000
###

error = (e) ->
    notify chalk.stripColor(String(e)), 
        title: 'ERROR'
        sticky: true
    log String(e)

###
000   000   0000000   000000000   0000000  000   000
000 0 000  000   000     000     000       000   000
000000000  000000000     000     000       000000000
000   000  000   000     000     000       000   000
00     00  000   000     000      0000000  000   000
###

watch = (opt, cb) ->

    ignore = [
        /node_modules/
        /\/\..+$/
        /\.git$/
        /\.app$/
    ]
    
    pass = (p) -> if path.extname(p).substr(1) in _.keys(opt) then true
    
    watcher = choki.watch opt.dir ? '.', 
        ignored: ignore
        ignoreInitial: true
        
    watcher
        .on 'add',    (p) -> if pass p then cb p
        .on 'change', (p) -> if pass p then cb p

watch opt, (sourceFile) ->
    
    ###
    00000000   00000000   0000000   0000000  
    000   000  000       000   000  000   000
    0000000    0000000   000000000  000   000
    000   000  000       000   000  000   000
    000   000  00000000  000   000  0000000  
    ###
    fs.readFile sourceFile, 'utf8', (err, data) -> 
        if err 
            log "can't read #{sourceFile}"
            return

        if args.verbose then log "source file".gray, sourceFile
        
        ext = path.extname(sourceFile).substr(1)
        
        f = sourceFile
        if opt[ext].replace?
            for k,v of opt[ext].replace
                f = f.replace k, v
            
        f = path.join path.dirname(f), path.basename(f, path.extname(f)) + '.' + opt[ext].ext
        
        if args.verbose then log "target file".gray, f
        
        try
            ###
             0000000   0000000   00     00  00000000   000  000      00000000
            000       000   000  000   000  000   000  000  000      000     
            000       000   000  000000000  00000000   000  000      0000000 
            000       000   000  000 0 000  000        000  000      000     
             0000000   0000000   000   000  000        000  0000000  00000000
            ###
            compiled = switch ext
                when 'coffee'
                    coffee.compile data, 
                        filename: sourceFile
                when 'json'
                    noon.stringify JSON.parse data
                when 'noon'
                    JSON.stringify noon.parse(data), null, '    '
        catch e
            error e
            return

        fs.readFile f, 'utf8', (err, targetData) ->  
            if err 
                log "can't read #{f}"
                return
            if compiled != targetData
                ###
                000   000  00000000   000  000000000  00000000
                000 0 000  000   000  000     000     000     
                000000000  0000000    000     000     0000000 
                000   000  000   000  000     000     000     
                00     00  000   000  000     000     00000000
                ###
                write f, compiled, (err) ->
                    if err 
                        log "can't write #{f}"
                        return
                    if not args.quiet then log "->".gray, f.yellow
                    
                    if path.resolve(f) == __filename
                        log 'exit'.yellow
                        process.exit 0
            else
                log 'unchanged'.green, path.resolve(f) if args.verbose
                        
            
        
