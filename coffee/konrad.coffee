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
jade   = require 'jade'
colors = require 'colors'
stylus = require 'stylus'
mkpath = require 'mkpath'
childp = require 'child_process'
write  = require 'write-file-atomic'
coffee = require 'coffee-script'
choki  = require 'chokidar'
notify = require 'growl'
path   = require 'path'
_      = require 'lodash'

pkg     = require "#{__dirname}/../package"
log     = console.log
watcher = null

args = require('karg') """

konrad
    arguments  . ? see arguments                   . ** .
    bump       . ? bump package.* version          . = false
    commit     . ? commit with message             . = false
    publish    . ? bump, commit and publish to npm . = false
    update     . ? update npm packages             . = false
    verbose    . ? log more                        . = false
    quiet      . ? log nothing                     . = false
    time       . ? log with time                   . = true
    
arguments
    no option  directory to watch
    commit     message
    bump       version
    
version  #{pkg.version}
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
    log "#{'[ERROR]'.bold.red} #{e.red}"
    notify String(e).strip, 
        title: 'ERROR'
        sticky: true
    
###
00000000   00000000   00000000  000000000  000000000  000   000
000   000  000   000  000          000        000      000 000 
00000000   0000000    0000000      000        000       00000  
000        000   000  000          000        000        000   
000        000   000  00000000     000        000        000   
###

prettyPath = (p, c=colors.yellow) ->
    p.split(path.sep).map((n) -> c(n).bold).join c(path.sep).dim

prettyTime = () ->
    if args.time
        d = new Date()
        ["#{_.padStart(String(d.getHours()),   2, '0').bold}:"
         "#{_.padStart(String(d.getMinutes()), 2, '0').bold}:"
         "#{_.padStart(String(d.getSeconds()), 2, '0').bold}"].join('').blue
    else
        ''

###
00000000   00000000   0000000  000000000   0000000   00000000   000000000
000   000  000       000          000     000   000  000   000     000   
0000000    0000000   0000000      000     000000000  0000000       000   
000   000  000            000     000     000   000  000   000     000   
000   000  00000000  0000000      000     000   000  000   000     000   
###

restart = ->
    watcher.close()
    log prettyTime(), '🔧  restart'.bold.gray
    childp.execSync "/usr/bin/env node #{__filename}",
        cwd:      process.cwd()
        encoding: 'utf8'
        stdio:    'inherit'
    log 'exit'.yellow.bold
    process.exit 0

dowatch = true

###
 0000000  00     00  0000000  
000       000   000  000   000
000       000000000  000   000
000       000 0 000  000   000
 0000000  000   000  0000000  
###

# log noon.stringify args, colors:true

for cmd in ['update', 'bump', 'commit', 'publish']
    
    if args[cmd]
        dowatch = false
        try
            cmdpath = resolve "#{__dirname}/../bin/#{cmd}"
            cmdargs = args.arguments.join ' '
            command = "#{cmdpath} #{cmdargs}"
            if args.verbose
                log cmd.gray.reset, prettyPath(cmdpath), cmdargs.green
            childp.execSync command,
                cwd: process.cwd()
                encoding: 'utf8'
                stdio: 'inherit'
        catch e
            error "command #{cmd.bold.yellow} #{'failed!'.red}"
            break
        log 'done'.gray if args.verbose
        
        if args.arguments and cmd in ['commit', 'bump']
            break

if not dowatch then process.exit 0

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
    
    d = args.arguments[0] ? '.'
    
    log prettyTime(), "🔧  watching #{prettyPath resolve(d), colors.blue}".bold.gray
    watcher = choki.watch d, 
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
                mkpath.sync path.dirname f
                write f, compiled, (err) ->
                    if err 
                        log "can't write #{f.bold.yellow}".bold.red
                        return
                    if not args.quiet 
                        log prettyTime(), "👍  #{path.dirname f}/#{path.basename(f, path.extname(f)).bold}#{path.extname(f)}".yellow
                    
                    if path.resolve(f) == __filename
                        restart()
            else
                log 'unchanged'.green, path.resolve(f) if args.verbose
                        
            
        
