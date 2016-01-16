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
colors = require 'colors'
mkpath = require 'mkpath'
childp = require 'child_process'
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
    test       . ? run tests                       . = false
    info       . ? show info                       . = false
    verbose    . ? log more                        . = false
    quiet      . ? log nothing                     . = false
    logtime    . ? log with time                   . = true
    
arguments
    no option  directory to watch
    commit     commit message
    publish    commit message
    bump       semver version
    
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
styl    . ext css . replace .. /style/ /css/
jade    . ext html
"""

config = (p) ->
    while path.dirname(p).length and path.dirname(p) not in ['.', '/']
        p = path.dirname p
        if fs.existsSync path.join p, '.konrad.noon'
            return _.defaultsDeep sds.load(path.join p, '.konrad.noon'), opt
    opt

###
00000000   00000000  000       0000000   000000000  000  000   000  00000000
000   000  000       000      000   000     000     000  000   000  000     
0000000    0000000   000      000000000     000     000   000 000   0000000 
000   000  000       000      000   000     000     000     000     000     
000   000  00000000  0000000  000   000     000     000      0      00000000
###

relative = (absolute) ->
    d = args.arguments[0] ? '.'
    r = path.relative d, absolute
    
###
000   0000000   000   000   0000000   00000000   00000000
000  000        0000  000  000   000  000   000  000     
000  000  0000  000 0 000  000   000  0000000    0000000 
000  000   000  000  0000  000   000  000   000  000     
000   0000000   000   000   0000000   000   000  00000000
###

ignore = [
    /node_modules/
    /bower_components/
    /gulpfile.coffee$/
    /Gruntfile.coffee$/
    /\/js$/
    /\/img$/
    /\/\..+$/
    /\.git$/
    /\.app$/
    /_misc/
]
    
###
00000000  00000000   00000000    0000000   00000000 
000       000   000  000   000  000   000  000   000
0000000   0000000    0000000    000   000  0000000  
000       000   000  000   000  000   000  000   000
00000000  000   000  000   000   0000000   000   000
###

sticky = false
error = (e) ->
    log "#{'[ERROR]'.bold.red} #{e.red}"
    require('growl') String(e).strip, 
        title: 'ERROR'
        sticky: sticky
    
###
00000000   00000000   00000000  000000000  000000000  000   000
000   000  000   000  000          000        000      000 000 
00000000   0000000    0000000      000        000       00000  
000        000   000  000          000        000        000   
000        000   000  00000000     000        000        000   
###

prettyPath = (p, c=colors.yellow) ->
    p.split(path.sep).map((n) -> c(n)).join c(path.sep).dim
    
prettyFilePath = (p, c=colors.yellow) ->
    if path.dirname(p) not in ['.', '/']
        "#{prettyPath path.dirname(p), c}#{prettyPath '/', c}#{prettyFile path.basename(p), c}"
    else
        "#{prettyFile path.basename(p), c}"

prettyFile = (f, c=colors.yellow) ->
    "#{c(path.basename(f, path.extname(f))).bold}#{prettyExt path.extname(f), c}"

prettyExt = (e, c=colors.yellow) ->
    if e.length then c('.').dim + c(e.substr 1) else ''

prettyTime = () ->
    if args.logtime
        d = new Date()
        ["#{_.padStart(String(d.getHours()),   2, '0').gray}#{':'.dim.gray}"
         "#{_.padStart(String(d.getMinutes()), 2, '0').gray}#{':'.dim.gray}"
         "#{_.padStart(String(d.getSeconds()), 2, '0').gray}"].join('')
    else
        ''

###
00000000   00000000  000       0000000    0000000   0000000  
000   000  000       000      000   000  000   000  000   000
0000000    0000000   000      000   000  000000000  000   000
000   000  000       000      000   000  000   000  000   000
000   000  00000000  0000000   0000000   000   000  0000000  
###

reload = ->
    watcher.close()
    log prettyTime(), '🔧  reload'.gray
    childp.execSync "/usr/bin/env node #{__filename}",
        cwd:      process.cwd()
        encoding: 'utf8'
        stdio:    'inherit'
    log 'exit'.yellow.bold
    process.exit 0

dowatch = true

###
000000000   0000000   00000000    0000000   00000000  000000000
   000     000   000  000   000  000        000          000   
   000     000000000  0000000    000  0000  0000000      000   
   000     000   000  000   000  000   000  000          000   
   000     000   000  000   000   0000000   00000000     000   
###

target = (sourceFile) ->
    ext = path.extname(sourceFile).substr(1)
    o = config sourceFile
    
    return if 'ignore' in _.keys o
    
    if o[ext].filter?
        matches = false
        for r in o[ext].filter
            if new RegExp(r).test(sourceFile)
                matches = true
        if not matches then return       
    
    targetFile = sourceFile
            
    if o[ext].replace?
        for k,v of o[ext].replace
            targetFile = targetFile.replace k, v
                        
    return if not o[ext].ext?
        
    targetFile = path.join path.dirname(targetFile), path.basename(targetFile, path.extname(targetFile)) + '.' + o[ext].ext

###
0000000    000  00000000   000000000  000   000
000   000  000  000   000     000      000 000 
000   000  000  0000000       000       00000  
000   000  000  000   000     000        000   
0000000    000  000   000     000        000   
###

dirty = (sourceFile, targetFile) ->
    ss = fs.statSync sourceFile
    ts = fs.statSync targetFile
    ss.mtime > ts.mtime    

###
000  000   000  00000000   0000000 
000  0000  000  000       000   000
000  000 0 000  000000    000   000
000  000  0000  000       000   000
000  000   000  000        0000000 
###

if args.info
    dowatch = false
    log '○● info'.gray
    walk = require 'walkdir'
    d = args.arguments[0] ? '.'
    walk.sync d, (p) ->
        for i in ignore
            if i.test p
                log prettyFilePath relative(p), colors.red if args.verbose
                @ignore p
                return
                
        if path.extname(p).substr(1) in _.keys(opt)
            targetFile = target p
            if targetFile
                if dirty p, targetFile
                    log prettyFilePath(_.padEnd(relative(p), 40), colors.red), " ► ".red.dim, prettyFilePath(relative(targetFile), colors.red) 
                else
                    log prettyFilePath(_.padEnd(relative(p), 40)), " ► ".green.dim, prettyFilePath(relative(targetFile), colors.green) 
            else if args.verbose
                log prettyFilePath relative(p), colors.blue
        else if args.verbose
            log prettyFilePath relative(p), colors.gray

###
 0000000  00     00  0000000  
000       000   000  000   000
000       000000000  000   000
000       000 0 000  000   000
 0000000  000   000  0000000  
###

# log noon.stringify args, colors:true

for cmd in ['update', 'bump', 'commit', 'publish', 'test']
    
    if args[cmd]
        dowatch = false
        try
            cmdpath = resolve "#{__dirname}/../bin/#{cmd}"
            cmdargs = args.arguments.join ' '
            command = "#{cmdpath} #{cmdargs}"
            if args.verbose
                log "🔧 ", cmd.gray.reset, prettyFilePath(cmdpath), cmdargs.green
            childp.execSync command,
                cwd: process.cwd()
                encoding: 'utf8'
                stdio: 'inherit'
        catch e
            error "command #{cmd.bold.yellow} #{'failed!'.red}"
            break
        log '🔧  done'.gray if args.verbose
        
        if args.arguments and cmd in ['commit', 'bump']
            break

if not dowatch then process.exit 0
sticky = true

###
000   000   0000000   000000000   0000000  000   000
000 0 000  000   000     000     000       000   000
000000000  000000000     000     000       000000000
000   000  000   000     000     000       000   000
00     00  000   000     000      0000000  000   000
###

watch = (opt, cb) ->
    
    pass = (p) -> if path.extname(p).substr(1) in _.keys(opt) then true
    
    d = args.arguments[0] ? '.'
    
    log prettyTime(), "🔧  watching #{prettyFilePath resolve(d), colors.white}".gray
    watcher = require('chokidar').watch d, 
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
        
        targetFile = target sourceFile
        
        if args.verbose then log "target file".gray, targetFile
        
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
                    coffee = require 'coffee-script'
                    coffee.compile data, 
                        filename: sourceFile
                when 'styl'
                    stylus = require 'stylus'
                    stylus.render data
                when 'jade'
                    jade = require 'jade'
                    jade.render data, pretty: true
                when 'json'
                    sds.stringify JSON.parse(data), ext: '.'+o[ext].ext, indent: '  '
                when 'noon'
                    sds.stringify noon.parse(data), ext: '.'+o[ext].ext, indent: '  '
        catch e
            error e
            return

        fs.readFile targetFile, 'utf8', (err, targetData) ->  
            
            if compiled != targetData
                ###
                000   000  00000000   000  000000000  00000000
                000 0 000  000   000  000     000     000     
                000000000  0000000    000     000     0000000 
                000   000  000   000  000     000     000     
                00     00  000   000  000     000     00000000
                ###
                mkpath.sync path.dirname targetFile
                require('write-file-atomic') targetFile, compiled, (err) ->
                    if err 
                        log "can't write #{targetFile.bold.yellow}".bold.red
                        return
                    if not args.quiet 
                        log prettyTime(), "👍  #{prettyFilePath targetFile}"
                    
                    if path.resolve(targetFile) == __filename
                        reload()
            else
                log 'unchanged'.green, path.resolve(targetFile) if args.verbose
                        
            
        
