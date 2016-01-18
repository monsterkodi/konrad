###
000   000   0000000   000   000  00000000    0000000   0000000  
000  000   000   000  0000  000  000   000  000   000  000   000
0000000    000   000  000 0 000  0000000    000000000  000   000
000  000   000   000  000  0000  000   000  000   000  000   000
000   000   0000000   000   000  000   000  000   000  0000000  
###

fs     = require 'fs'
fu     = require 'fs-utils'
path   = require 'path'
sds    = require 'sds'
noon   = require 'noon'
colors = require 'colors'
chalk  = require 'chalk'
_      = require 'lodash'

pkg     = require "#{__dirname}/../package"
log     = console.log

args = require('karg') """

konrad
    arguments  . ? see arguments                   . ** .
    bump       . ? bump package.* version          . = false
    commit     . ? commit with message             . = false
    publish    . ? bump, commit & publish to npm   . = false
    update     . ? update npm packages             . = false
    test       . ? run tests                       . = false
    run        . ? build dirty or missing targets  . = false
    rebuild    . ? rebuild all targets             . = false . - R
    info       . ? show info                       . = false
    verbose    . ? log more                        . = false
    quiet      . ? log nothing                     . = false
    debug      . ? log debug                       . = false
    logtime    . ? log with time                   . = true
    
arguments
    [no option]  directory to watch         #{'.'.magenta}
    info         directory to inspect       #{'.'.magenta}
    run          directory to build         #{'.'.magenta}
    rebuild      directory to rebuild       #{'.'.magenta}
    bump         semver version             #{'patch'.magenta}
    commit       commit message
    publish      commit message
    
version  #{pkg.version}
"""
    
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
00000000   00000000  000       0000000   000000000  000  000   000  00000000
000   000  000       000      000   000     000     000  000   000  000     
0000000    0000000   000      000000000     000     000   000 000   0000000 
000   000  000       000      000   000     000     000     000     000     
000   000  00000000  0000000  000   000     000     000      0      00000000
###

relative = (absolute, to) ->
    d = to ? args.arguments[0] ? '.'
    if not fu.isDir d then d = ''
    r = path.relative d, absolute
        
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
        if not matches 
            log prettyFilePath relative(sourceFile), colors.blue if args.verbose
            return       
    
    targetFile = _.clone sourceFile
            
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
    if not fs.existsSync targetFile then return true
    ss = fs.statSync sourceFile
    ts = fs.statSync targetFile
    ss.mtime > ts.mtime    

###
00000000  00000000   00000000    0000000   00000000 
000       000   000  000   000  000   000  000   000
0000000   0000000    0000000    000   000  0000000  
000       000   000  000   000  000   000  000   000
00000000  000   000  000   000   0000000   000   000
###

sticky = false
error = (e) ->
    log "#{'[ERROR]'.bold.red} #{String(e).red}"
    require('growl') String(e).strip, 
        title: 'ERROR'
        sticky: sticky

###
00000000   000   000  000   000
000   000  000   000  0000  000
0000000    000   000  000 0 000
000   000  000   000  000  0000
000   000   0000000   000   000
###
    
run = (sourceFile) ->
    
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

        if args.debug then log "source file".gray, sourceFile
                
        ext = path.extname(sourceFile).substr(1)
        
        targetFile = target sourceFile
        
        if args.debug then log "target file".gray, targetFile
        
        o = config sourceFile
        
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
                    sds.stringify JSON.parse(data), ext: '.'+o[ext].ext, indent: '  ', maxalign: 16
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
                require('mkpath').sync path.dirname targetFile
                require('write-file-atomic') targetFile, compiled, (err) ->
                    if err 
                        log "can't write #{targetFile.bold.yellow}".bold.red
                        return
                    if not args.quiet 
                        log prettyTime(), "👍  #{prettyFilePath targetFile}"
                    
                    if path.resolve(targetFile) == __filename
                        reload()
            else
                log 'unchanged'.green.dim, prettyFilePath(relative(targetFile), colors.gray) if args.verbose
                stat = fs.statSync sourceFile
                ttat = fs.statSync targetFile
                if stat.mtime.getTime() != ttat.mtime.getTime()
                    fs.utimesSync path.resolve(targetFile), stat.atime, stat.mtime

###
000   000   0000000   000      000   000
000 0 000  000   000  000      000  000 
000000000  000000000  000      0000000  
000   000  000   000  000      000  000 
00     00  000   000  0000000  000   000
###

walk = (opt, cb) ->
    
    if _.isFunction opt
        cb = opt
        opt = {}
    
    walkdir = require 'walkdir'
    d = args.arguments[0] ? '.'
    if not fu.isDir d then d = '.'
    try
        walkdir.sync d, (p) ->
            if not opt.all
                for i in ignore
                    if i.test p
                        log prettyFilePath(relative(p), colors.gray), 'ignored'.blue if args.debug
                        @ignore p
                        return
            if path.extname(p).substr(1) in _.keys(opt)
                cb p, target p
            else 
                if opt.all
                    if not cb p
                        @ignore p
                if args.debug
                    log prettyFilePath(relative(p), colors.gray)
    catch err
        error err

dowatch = true

###
                000  000   000  00000000   0000000 
                000  0000  000  000       000   000
000000  000000  000  000 0 000  000000    000   000
                000  000  0000  000       000   000
                000  000   000  000        0000000 
###

if args.info
    dowatch = false
    log '○● info'.gray

    walk all: true, (sourceFile, targetFile) ->
        if targetFile
            if dirty sourceFile, targetFile
                log prettyFilePath(_.padEnd(relative(sourceFile), 40), colors.red), " ► ".red.dim, prettyFilePath(relative(targetFile), colors.red) 
            else if args.verbose
                log prettyFilePath(_.padEnd(relative(sourceFile), 40), colors.magenta), " ► ".green.dim, prettyFilePath(relative(targetFile), colors.green) 
        else            
            if path.basename(sourceFile) == '.git'
                git = require('simple-git') path.dirname sourceFile
                git.status (err,status) ->
                    if err
                        error err
                        return
                    changes = []
                    for k,v of _.clone status
                        if _.isEmpty status[k]
                            delete status[k]
                        m = 
                            not_added: colors.red
                            modified:  colors.green
                            created:   colors.magenta

                        if k in _.keys m
                            for f in status[k] ? []
                                if not fu.isDir args.arguments[0]
                                    if f != args.arguments[0]
                                        continue
                                if args.arguments.length > 1
                                    if f not in args.arguments
                                        continue
                                change = "    " + prettyFilePath(relative(path.join(path.dirname(sourceFile), f)), m[k]) 
                                if k == 'modified' and args.verbose
                                    childp = require 'child_process'
                                    res = childp.execSync "git diff -U0 #{path.join(path.dirname(sourceFile), f)}", 
                                        encoding: 'utf8'
                                        cwd: path.dirname sourceFile
                                    diff = ""
                                    for l in res.split '\n'
                                        ls = chalk.stripColor(l)
                                        if ls[0] in ['+', '-', '@'] and ls[1] not in ['+', '-']
                                            if ls[0] == '+'
                                                diff += ("\n "+ls.substr(1)).white
                                            else if ls[0] == '-'
                                                diff += ("\n " +ls.substr(1)).red.bold.dim
                                            else 
                                                diff += ("\n▬").gray.dim
                                    change += diff+"\n▬\n".gray.dim if diff.length
                                changes.push change
                            
                    if _.isEmpty changes then return
                    log 'git '.bgBlue.bold.blue + prettyFilePath(relative(path.dirname(sourceFile)), colors.white).bgBlue
                    for c in changes
                        log c

            if fu.isDir sourceFile
                for i in ignore
                    if i.test sourceFile
                        return false
        true
                
###
                00000000   000   000  000   000
                000   000  000   000  0000  000
000000  000000  0000000    000   000  000 0 000
                000   000  000   000  000  0000
                000   000   0000000   000   000
###

if args.run or args.rebuild
    dowatch = false
    log '🔧🔧 ' + (args.rebuild and 'rebuild' or 'run').gray

    walk (sourceFile, targetFile) ->
        if targetFile
            isDirty = dirty sourceFile, targetFile 
            if args.rebuild or isDirty
                src = prettyFilePath(_.padEnd(relative(sourceFile), 40), isDirty and colors.red or colors.yellow)
                tgt = prettyFilePath(relative(targetFile), colors.green) 
                log src, "🔧  ", tgt
                run sourceFile

###
                 0000000  00     00  0000000  
                000       000   000  000   000
000000  000000  000       000000000  000   000
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
            require('child_process').execSync command,
                cwd: process.cwd()
                encoding: 'utf8'
                stdio: 'inherit'
        catch e
            error "command #{cmd.bold.yellow} #{'failed!'.red}"
            break
        log '🔧  done'.gray if args.verbose
        
        if args.arguments and cmd in ['commit', 'bump']
            break

###
00000000   00000000  000       0000000    0000000   0000000  
000   000  000       000      000   000  000   000  000   000
0000000    0000000   000      000   000  000000000  000   000
000   000  000       000      000   000  000   000  000   000
000   000  00000000  0000000   0000000   000   000  0000000  
###

watcher = null

reload = ->
    return if not watcher?
    watcher.close()
    log prettyTime(), '🔧  reload'.gray
    require('child_process').execSync "/usr/bin/env node #{__filename}",
        cwd:      process.cwd()
        encoding: 'utf8'
        stdio:    'inherit'
    log 'exit'.yellow.bold
    process.exit 0
    
if dowatch
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
        
        run sourceFile
    

        
