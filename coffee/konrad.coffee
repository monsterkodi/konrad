###
000   000   0000000   000   000  00000000    0000000   0000000  
000  000   000   000  0000  000  000   000  000   000  000   000
0000000    000   000  000 0 000  0000000    000000000  000   000
000  000   000   000  000  0000  000   000  000   000  000   000
000   000   0000000   000   000  000   000  000   000  0000000  
###

fs     = require 'fs'
path   = require 'path'
sds    = require 'sds'
noon   = require 'noon'
write  = require 'write-file-atomic'
jade   = require 'jade'
stylus = require 'stylus'
colors = require 'colors'
coffee = require 'coffee-script'
choki  = require 'chokidar'
notify = require 'growl'
path   = require 'path'
_      = require 'lodash'
log    = console.log

args = require('karg') """
konrad
    directory  . ? the directory to watch . * . = .
    verbose    . ? log more                   . = false
    quiet      . ? log nothing                . = false
version  #{require("#{__dirname}/../package.json").version}
"""

###
00000000   00000000   0000000   0000000   000      000   000  00000000
000   000  000       000       000   000  000      000   000  000     
0000000    0000000   0000000   000   000  000       000 000   0000000 
000   000  000            000  000   000  000         000     000     
000   000  00000000  0000000    0000000   0000000      0      00000000
###

resolve = (unresolved) ->
    p = unresolved.replace /\~/, process.env.HOME
    p = path.resolve p
    p = path.normalize p
    p

###
 0000000   0000000   000   000  00000000  000   0000000 
000       000   000  0000  000  000       000  000      
000       000   000  000 0 000  000000    000  000  0000
000       000   000  000  0000  000       000  000   000
 0000000   0000000   000   000  000       000   0000000 
###

opt = noon.parse """
coffee  . ext js  . replace .. /coffee/ /js/
noon    . ext json
json    . ext noon . filter .. package.json$
styl    . ext css
jade    . ext html
"""

config = (p) ->
    while path.dirname(p).length and path.dirname(p) != '.'
        p = path.dirname p
        if fs.existsSync path.join p, '.konrad.noon'
            return _.defaultsDeep sds.load(path.join p, '.konrad.noon'), opt
    opt
    
###
00000000  00000000   00000000    0000000   00000000 
000       000   000  000   000  000   000  000   000
0000000   0000000    0000000    000   000  0000000  
000       000   000  000   000  000   000  000   000
00000000  000   000  000   000   0000000   000   000
###

error = (e) ->
    notify String(e).strip, 
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
    
    watcher = choki.watch args.directory ? '.', 
        ignored: ignore
        ignoreInitial: true
        
    watcher
        .on 'add',    (p) -> if pass p then cb p
        .on 'change', (p) -> if pass p then cb p

watch opt, (sourceFile) ->
    
    o = config sourceFile

    return if 'ignore' in _.keys o
    
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
        
        if o[ext].replace?
            for k,v of o[ext].replace
                f = f.replace k, v
                
        if o[ext].filter?
            matches = false
            for r in o[ext].filter
                if new RegExp(r).test(sourceFile)
                    matches = true
            if not matches then return        
            
        return if not o[ext].ext?
            
        f = path.join path.dirname(f), path.basename(f, path.extname(f)) + '.' + o[ext].ext
        
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
                when 'styl'
                    stylus.render data
                when 'jade'
                    jade.render data, pretty: true
                when 'json'
                    sds.stringify JSON.parse data, ext: '.'+o[ext].ext, indent: '  '
                when 'noon'
                    sds.stringify noon.parse(data), ext: '.'+o[ext].ext, indent: '  '
        catch e
            error e
            return

        fs.readFile f, 'utf8', (err, targetData) ->  
            
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
                        
            
        
