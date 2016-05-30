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
noon   = require 'noon'
colors = require 'colors'
chalk  = require 'chalk'
childp = require 'child_process'
_      = require 'lodash'

pkg    = require "#{__dirname}/../package"
log    = console.log

args   = require('karg') """

konrad
    arguments  . ? see arguments                   . ** .
    bump       . ? bump package.* version          . = false
    commit     . ? add, commit and push            . = false
    publish    . ? bump, commit & publish to npm   . = false
    update     . ? update npm packages             . = false
    test       . ? run tests                       . = false
    run        . ? build dirty or missing targets  . = false
    rebuild    . ? rebuild all targets             . = false . - R
    info       . ? show build status               . = false
    status     . ? show git status                 . = false
    diff       . ? show git diff                   . = false
    verbose    . ? log more                        . = false
    quiet      . ? log nothing                     . = false
    debug      . ? log debug                       . = false . - D
    logtime    . ? log with time                   . = true

arguments
    [no option]  directory to watch         #{'.'.magenta}
    info         directory to inspect       #{'.'.magenta}
    status       files or directory         #{'.'.magenta}
    diff         files or directory         #{'.'.magenta}
    run          directory to build         #{'.'.magenta}
    rebuild      directory to rebuild       #{'.'.magenta}
    bump         semver version             #{'patch'.magenta}
    commit       commit message
    publish      commit message

version  #{pkg.version}
"""

#0000000    00000000  00000000   0000000   000   000  000      000000000   0000000
#000   000  000       000       000   000  000   000  000         000     000     
#000   000  0000000   000000    000000000  000   000  000         000     0000000 
#000   000  000       000       000   000  000   000  000         000          000
#0000000    00000000  000       000   000   0000000   0000000     000     0000000 

opt = noon.parse """
coffee  . ext js  . replace .. /coffee/ /js/
noon    . ext json
json    . ext noon . filter .. package.json$
styl    . ext css . replace .. /style/ /css/
jade    . ext html
pug     . ext html
js      
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

config = (p) ->
    while path.dirname(p).length and path.dirname(p) not in ['.', '/']
        p = path.dirname p
        if fs.existsSync path.join p, '.konrad.noon'
            o = _.defaultsDeep noon.load(path.join p, '.konrad.noon'), opt
            if o.ignore?.map?
                o.ignore = o.ignore.map (i) ->
                    if _.isString i
                        new RegExp i
                    else
                        i
            return o
    opt

configPath = (key, p) ->
    while path.dirname(p).length and path.dirname(p) not in ['.', '/']
        p = path.dirname p
        if fs.existsSync path.join p, '.konrad.noon'
            o = _.defaultsDeep noon.load(path.join p, '.konrad.noon'), opt
            if o[key]?
                return resolve p
    null

###
000   0000000   000   000   0000000   00000000   00000000
000  000        0000  000  000   000  000   000  000
000  000  0000  000 0 000  000   000  0000000    0000000
000  000   000  000  0000  000   000  000   000  000
000   0000000   000   000   0000000   000   000  00000000
###

opt.ignore = [
    /gulpfile.coffee$/
    /Gruntfile.coffee$/
    /\.konrad\.noon$/
]

wlk =
    ignore: [
        /node_modules/
        /bower_components/
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
 0000000   00000000    0000000   0000000    000  00000000 
000   000  000   000  000        000   000  000  000   000
000000000  0000000    000  0000  000   000  000  0000000  
000   000  000   000  000   000  000   000  000  000   000
000   000  000   000   0000000   0000000    000  000   000
###

argDir = () ->
    if args.arguments[0]
        d = resolve args.arguments[0]
        if fu.isDir d
            return d
        d = path.parse(d).dir
        if fu.isDir d
            return d
    resolve '.'
    
argDirRel = () ->
    if argDir() == resolve '.'
        return ''
    relative argDir(), '.'
    
###
00000000   00000000  000       0000000   000000000  000  000   000  00000000
000   000  000       000      000   000     000     000  000   000  000
0000000    0000000   000      000000000     000     000   000 000   0000000
000   000  000       000      000   000     000     000     000     000
000   000  00000000  0000000  000   000     000     000      0      00000000
###

relative = (absolute, to) ->
    d = to? and resolve(to) or argDir()
    if not fu.isDir d then d = '.'
    r = path.relative d, absolute

###
 0000000  000   000   0000000   000   000  000      0000000  
000       000   000  000   000  000   000  000      000   000
0000000   000000000  000   000  000   000  000      000   000
     000  000   000  000   000  000   000  000      000   000
0000000   000   000   0000000    0000000   0000000  0000000  
###

should = (k, o, p) ->

    return false if not o[k]? 
    
    if _.isArray o[k]
        keys = o[k]
    else if _.isObject o[k]
        keys = _.keys o[k]
    else
        keys = [o[k]]

    for i in keys
        r = i
        r = new RegExp i if _.isString i
        if r.test p
            log prettyFilePath(relative(p), colors.gray), 'should '.blue+k.bold.blue if args.debug
            return true
    false
    
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

    if o[ext]?.filter?
        matches = false
        for r in o[ext].filter
            if new RegExp(r).test(sourceFile)
                matches = true
        if not matches
            log prettyFilePath relative(sourceFile), colors.blue if args.debug
            return

    targetFile = _.clone sourceFile

    if o[ext]?.replace?
        for k,v of o[ext].replace
            targetFile = targetFile.replace k, v
        
    return if not o[ext]?.ext?
    
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
    ss.mtime.getTime() > ts.mtime.getTime()

###
00000000  00000000   00000000    0000000   00000000
000       000   000  000   000  000   000  000   000
0000000   0000000    0000000    000   000  0000000
000       000   000  000   000  000   000  000   000
00000000  000   000  000   000   0000000   000   000
###

error = (e) ->
    log "#{'[ERROR]'.bold.red} #{String(e).red}"
    try
        require('growl') String(e).strip,
            title: 'ERROR'
            sticky: false
    catch err
        true

###
0000000    000   000  000  000      0000000  
000   000  000   000  000  000      000   000
0000000    000   000  000  000      000   000
000   000  000   000  000  000      000   000
0000000     0000000   000  0000000  0000000  
###

build = (sourceFile, cb) ->

    log "source file".gray, sourceFile if args.debug

    ext = path.extname(sourceFile).substr(1)

    o = config sourceFile

    if ext == 'js' and should 'browserify', o, sourceFile
        main = o.browserify.main
        out  = o.browserify.out
        pwd  = configPath 'browserify', resolve sourceFile
        if out != relative sourceFile, pwd
            runcmd 'browserify', "#{main} #{out}", pwd
        return

    targetFile = target sourceFile
    return if not targetFile?

    log "target file".gray, targetFile if args.debug

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
                    stylus data
                        .set 'filename', sourceFile
                        .set 'paths', [path.dirname(sourceFile)]
                        .render()
                when 'jade'
                    jade = require 'jade'
                    jade.render data, pretty: true
                when 'pug'
                    pug = require 'pug'
                    pug.render data, pretty: true
                when 'json'
                    noon.stringify JSON.parse(data), ext: '.'+o[ext].ext, indent: '  ', maxalign: 16
                when 'noon'
                    noon.stringify noon.parse(data), ext: '.'+o[ext].ext, indent: '  '
                else 
                    throw "don't know how to build files with extname .#{ext.bold}!".yellow
                    
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
                    else if cb?
                        cb sourceFile, targetFile
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
    try
        walkdir.sync argDir(), (p) ->
            
            o = config p

            if should 'ignore', o, p
                cb p if opt.all
                @ignore p
                return

            if should 'ignore', wlk, p
                cb p if opt.all
                @ignore p
                return
                
            if path.extname(p).substr(1) in _.keys o
                cb p, target p
            else
                if args.debug
                    log prettyFilePath relative(p), colors.gray
                if opt.all
                    if not cb p
                        @ignore p
    catch err
        error err

dowatch = true

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

    walk opt, (sourceFile, targetFile) ->
        if targetFile
            if dirty sourceFile, targetFile
                log prettyFilePath(_.padEnd(relative(sourceFile), 40), colors.yellow), " ► ".red.dim, prettyFilePath(relative(targetFile), colors.red)
            else if args.verbose
                log prettyFilePath(_.padEnd(relative(sourceFile), 40), colors.magenta), " ► ".green.dim, prettyFilePath(relative(targetFile), colors.green)
    true    
    
###
 0000000  000000000   0000000   000000000  000   000   0000000
000          000     000   000     000     000   000  000     
0000000      000     000000000     000     000   000  0000000 
     000     000     000   000     000     000   000       000
0000000      000     000   000     000      0000000   0000000 
###

gitStatus = (sourceFile) ->
    
    gitDir = path.dirname sourceFile
    git = require('simple-git') gitDir
    git.status (err,status) ->
        if err
            error err
            return
        changes = []
                
        for k,v of _.clone status
            if _.isEmpty status[k]
                delete status[k]
            m =
                not_added:  colors.gray
                conflicted: colors.yellow
                modified:   colors.green
                created:    colors.magenta
                deleted:    colors.red

            if k in _.keys m
                for f in status[k] ? []
                    d = argDir()
                    
                    arglist = _.filter args.arguments, (a) -> a not in ['fetch']
                    if arglist.length
                        filtered = true
                        for a in arglist
                            if path.join(gitDir, f).indexOf(resolve a) == 0
                                filtered = false
                                break
                        if filtered
                            log 'filtered', resolve(a), f, path.join(gitDir, f) if args.debug
                            continue

                    prfx    = "    "
                    prfx    = m[k] "█   "
                    gitFile = path.join gitDir, f
                    relPath = relative gitFile, '.'
                    lame    = path.extname(gitFile) == '.js' or path.basename(gitFile) == 'package.json'
                    change  = prfx + prettyFilePath(relPath, (lame and m[k].dim or m[k]))
                    if k in ['modified', 'created'] and args.verbose
                        continue if lame
                        res = childp.execSync "git diff -U0 --ignore-space-at-eol #{gitFile}",
                            encoding: 'utf8'
                            cwd: gitDir
                        diff = ""
                        c = '▼'.blue.bold
                        for l in res.split '\n'
                            ls = chalk.stripColor(l)
                            if (ls[0] in ['+', '-', '@']) and (ls.substr(0,4) not in ['+++ ', '--- '])
                                if ls[0] == '+'
                                    diff += ("\n "+ls.substr(1)).white
                                else if ls[0] == '-'
                                    diff += ("\n " +ls.substr(1)).gray.bold.dim
                                else
                                    diff += ("\n"+c)
                                    c = '●'.blue.dim
                        change += diff+"\n▲".blue.dim if diff.length
                    changes.push change

        relPath = relative gitDir, resolve '.'
        relPath = '.' if relPath == ''
        gitPath = prettyFilePath relPath, colors.white
        
        
        aheadBehind = () ->
            if 'fetch' in args.arguments
                childp.execSync "git fetch",
                    cwd: gitDir
                    encoding: 'utf8'
            st = childp.execSync "git status -sb",
                cwd: gitDir
                encoding: 'utf8'
            st = st.split('\n')[0].split '['
            if st.length > 1
                st = st[1].substr(0,st[1].length-1)
                st = st.replace ', ', ' '
                st = st.replace /ahead (.*)/, "▲ $1".yellow.bold.bgBlack
                st = st.replace /behind (.*)/, "▼ $1".red.bold.bgBlack
                st = _.padEnd st, 4
            else 
                ''
            
        log ('    ' + gitPath + ' ').bgBlue + ' ' + aheadBehind()
        for c in changes
            log c

if args.diff
    args.status  = true
    args.verbose = true
        
if args.status
    dowatch = false    
    optall = _.defaults opt, all: true
    gitcount = 0
    
    walk optall, (sourceFile, targetFile) ->

        if not targetFile
        
            if path.basename(sourceFile) == '.git'
                gitStatus sourceFile
                gitcount += 1
                
            if fu.isDir sourceFile
                for i in opt.ignore
                    if i.test sourceFile
                        return false
        true
        
    if not gitcount
        gitup = path.parse argDir()
        while gitup.base
            dotGit = path.join gitup.dir, '.git'
            if fs.existsSync dotGit
                gitStatus dotGit
                break
            gitup = path.parse gitup.dir

###
00000000   000   000  000   000
000   000  000   000  0000  000
0000000    000   000  000 0 000
000   000  000   000  000  0000
000   000   0000000   000   000
###

if args.run or args.rebuild
    dowatch = false
    log '🔧🔧 ' + (args.rebuild and 'rebuild' or 'run').gray

    walk opt, (sourceFile, targetFile) ->
        if targetFile
            isDirty = dirty sourceFile, targetFile
            if args.rebuild or isDirty
                src = prettyFilePath(_.padEnd(relative(sourceFile), 40), isDirty and colors.red or colors.yellow)
                tgt = prettyFilePath(relative(targetFile), colors.green)
                log src, "🔧  ", tgt
                build sourceFile

###
 0000000  00     00  0000000  
000       000   000  000   000
000       000000000  000   000
000       000 0 000  000   000
 0000000  000   000  0000000  
###

runcmd = (cmd, cmdargs, cwd) -> 
    try
        cmdpath = resolve "#{__dirname}/../bin/#{cmd}"
        command = "#{cmdpath} #{cmdargs}"
        if args.verbose
            log "🔧 ", cmd.gray.reset, prettyFilePath(cmdpath), cmdargs.green
        childp.execSync command,
            cwd: cwd
            encoding: 'utf8'
            stdio: 'inherit'
    catch err
        error "command #{cmd.bold.yellow} #{'failed!'.red}"
        log String(err).red
        return false
    true

for cmd in ['update', 'bump', 'commit', 'publish', 'test']

    if args[cmd]
        dowatch = false
        
        if not runcmd cmd, args.arguments.join ' ', process.cwd()
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
    log prettyTime(), '🔧  reload'.gray if not args.quiet
    arg = ''
    arg += ' -v' if args.verbose
    arg += ' -D' if args.debug
    arg += ' -q' if args.quiet
    childp.execSync "/usr/bin/env node #{__filename} #{arg}",
        cwd:      process.cwd()
        encoding: 'utf8'
        stdio:    'inherit'
    log 'exit'.yellow.bold if not args.quiet
    process.exit 0

if dowatch
    
    ###
    000   000   0000000   000000000   0000000  000   000
    000 0 000  000   000     000     000       000   000
    000000000  000000000     000     000       000000000
    000   000  000   000     000     000       000   000
    00     00  000   000     000      0000000  000   000
    ###

    watch = (cb) ->

        pass = (p) -> if path.extname(p).substr(1) in _.keys(opt) then true

        d = args.arguments[0] ? '.'
        v = args.verbose and " ● version #{pkg.version}".dim.gray or ''
        log prettyTime(), "🔧  watching #{prettyFilePath resolve(d), colors.white}#{v}".gray
        watcher = require('chokidar').watch d, 
            ignored: wlk.ignore
            ignoreInitial: true

        watcher
            .on 'add',    (p) -> if pass p then cb p
            .on 'change', (p) -> if pass p then cb p

    watch (sourceFile) ->

        sourceFile = resolve sourceFile
        o = config sourceFile

        test = (source) ->
            if should 'test', o, source
                runcmd 'test', source, configPath 'test', resolve source

        if not should 'ignore', o, sourceFile
            build sourceFile, test
        else
            test sourceFile

