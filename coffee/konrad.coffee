
# 000   000   0000000   000   000  00000000    0000000   0000000
# 000  000   000   000  0000  000  000   000  000   000  000   000
# 0000000    000   000  000 0 000  0000000    000000000  000   000
# 000  000   000   000  000  0000  000   000  000   000  000   000
# 000   000   0000000   000   000  000   000  000   000  0000000

{ atomic, noon, childp, slash, error, log, fs, os, _ } = require 'kxk'

colors = require 'colors'
pkg    = require "#{__dirname}/../package"

args   = require('karg') """

konrad
    arguments  . ? see arguments                   . **
    bump       . ? bump package.* version          . = false
    commit     . ? add, commit and push            . = false
    publish    . ? bump, commit & publish to npm   . = false
    update     . ? update npm packages             . = false
    test       . ? run tests                       . = false
    watch      . ? watch directory for changes     . = false
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
    watch        directory to watch         #{'.'.magenta}
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

actions = ['bump', 'commit', 'publish', 'update', 'test', 'watch', 'run', 'rebuild', 'info', 'status', 'diff']

if not actions.map((a) -> args[a]).reduce((acc,val) -> acc or val)
    args.run = true # makes run the default action if no other action is set

# 0000000    00000000  00000000   0000000   000   000  000      000000000   0000000
# 000   000  000       000       000   000  000   000  000         000     000
# 000   000  0000000   000000    000000000  000   000  000         000     0000000
# 000   000  000       000       000   000  000   000  000         000          000
# 0000000    00000000  000       000   000   0000000   0000000     000     0000000

opt = noon.parse """
ignore
    /.*-darwin-x64/
    /.*\.app$/
coffee  . ext js   . replace .. /coffee/ /js/ .. ^coffee/ js/
noon    . ext json
json    . ext noon . filter  .. package.json$
styl    . ext css  . replace .. /style/ /css/ .. /styl/ /js/css/
pug     . ext html . replace .. /pug/ /js/
"""

# log "default config:", opt

#  0000000   0000000   000   000  00000000  000   0000000
# 000       000   000  0000  000  000       000  000
# 000       000   000  000 0 000  000000    000  000  0000
# 000       000   000  000  0000  000       000  000   000
#  0000000   0000000   000   000  000       000   0000000

config = (p) ->
    while slash.dirname(p).length and slash.dirname(p) not in ['.', '/'] and not /^\w\:\/$/.test slash.dirname(p)
        p = slash.dirname p
        if fs.existsSync slash.join p, '.konrad.noon'
            o = _.defaultsDeep noon.load(slash.join p, '.konrad.noon'), opt
            if o.ignore?.map?
                o.ignore = o.ignore.map (i) ->
                    if _.isString i
                        new RegExp i
                    else
                        i
            return o
    opt

configPath = (key, p) ->
    while slash.dirname(p).length and slash.dirname(p) not in ['.', '/']
        p = slash.dirname p
        if fs.existsSync slash.join p, '.konrad.noon'
            o = _.defaultsDeep noon.load(slash.join p, '.konrad.noon'), opt
            if o[key]?
                return slash.resolve p
    null

# 000   0000000   000   000   0000000   00000000   00000000
# 000  000        0000  000  000   000  000   000  000
# 000  000  0000  000 0 000  000   000  0000000    0000000
# 000  000   000  000  0000  000   000  000   000  000
# 000   0000000   000   000   0000000   000   000  00000000

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

# 00000000   00000000   00000000  000000000  000000000  000   000
# 000   000  000   000  000          000        000      000 000
# 00000000   0000000    0000000      000        000       00000
# 000        000   000  000          000        000        000
# 000        000   000  00000000     000        000        000

prettyPath = (p, c=colors.yellow) ->
    p.split('/').map((n) -> c(n)).join c('/').dim

prettyFilePath = (p, c=colors.yellow) ->
    p = p.replace os.homedir(), "~"
    if slash.dirname(p) not in ['.', '/']
        "#{prettyPath slash.dirname(p), c}#{prettyPath '/', c}#{prettyFile slash.basename(p), c}"
    else
        "#{prettyFile slash.basename(p), c}"

prettyFile = (f, c=colors.yellow) ->
    "#{c(slash.fileName(f)).bold}#{prettyExt slash.extname(f), c}"

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

#  0000000   00000000    0000000   0000000    000  00000000
# 000   000  000   000  000        000   000  000  000   000
# 000000000  0000000    000  0000  000   000  000  0000000
# 000   000  000   000  000   000  000   000  000  000   000
# 000   000  000   000   0000000   0000000    000  000   000

argDir = ->
    
    if args.arguments[0]
        d = slash.resolve args.arguments[0]
        if slash.dirExists d
            return d
        d = slash.dirname d # ???
        if slash.dirExists d
            return d
    slash.resolve '.'

argDirRel = ->
    if argDir() == slash.resolve '.'
        return ''
     slash.relative argDir(), '.'

#  0000000  000   000   0000000   000   000  000      0000000
# 000       000   000  000   000  000   000  000      000   000
# 0000000   000000000  000   000  000   000  000      000   000
#      000  000   000  000   000  000   000  000      000   000
# 0000000   000   000   0000000    0000000   0000000  0000000

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
            log prettyFilePath(slash.relative(p, argDir()), colors.gray), 'should '.blue+k.bold.blue if args.debug
            return true
    false

# 000000000   0000000   00000000    0000000   00000000  000000000
#    000     000   000  000   000  000        000          000
#    000     000000000  0000000    000  0000  0000000      000
#    000     000   000  000   000  000   000  000          000
#    000     000   000  000   000   0000000   00000000     000

target = (sourceFile) ->
    
    ext = slash.ext sourceFile
    o = config sourceFile

    if o[ext]?.filter?
        matches = false
        for r in o[ext].filter
            if new RegExp(r).test(sourceFile)
                matches = true
        if not matches
            log prettyFilePath slash.relative(sourceFile, argDir()), colors.blue if args.debug
            return

    targetFile = _.clone sourceFile

    if o[ext]?.replace?
        for k,v of o[ext].replace
            targetFile = targetFile.replace k, v

    return if not o[ext]?.ext?

    targetFile = slash.join slash.dirname(targetFile), slash.fileName(targetFile) + '.' + o[ext].ext

# 0000000    000  00000000   000000000  000   000
# 000   000  000  000   000     000      000 000
# 000   000  000  0000000       000       00000
# 000   000  000  000   000     000        000
# 0000000    000  000   000     000        000

dirty = (sourceFile, targetFile) ->
    
    if not fs.existsSync targetFile then return true
    ss = fs.statSync sourceFile
    ts = fs.statSync targetFile
    ss.mtime.getTime() > ts.mtime.getTime()

# 00000000  00000000   00000000    0000000   00000000
# 000       000   000  000   000  000   000  000   000
# 0000000   0000000    0000000    000   000  0000000
# 000       000   000  000   000  000   000  000   000
# 00000000  000   000  000   000   0000000   000   000

konradError = (title, msg) ->
    
    stripped = String(msg).strip
    splitted = stripped.split '\n'

    if title == 'compile error'
        [sourceFile, rest] = splitted[0].split ': '
        splitted[0] = rest.bold.yellow
        errStr = splitted.join '\n'
        log prettyTime(), "😡  #{prettyFilePath sourceFile}\n#{errStr}"
    else
        log "#{title.bold.yellow} #{String(stripped).red}"
    false

# 0000000    000   000  000  000      0000000
# 000   000  000   000  000  000      000   000
# 0000000    000   000  000  000      000   000
# 000   000  000   000  000  000      000   000
# 0000000     0000000   000  0000000  0000000

build = (sourceFile, cb) ->

    log "source file".gray, sourceFile if args.debug

    ext = slash.extname(sourceFile).substr(1)

    o = config sourceFile

    if ext == 'js' and should 'browserify', o, sourceFile
        main = o.browserify.main
        out  = o.browserify.out
        pwd  = configPath 'browserify', slash.resolve sourceFile
        if out != slash.relative sourceFile, pwd
            log prettyFilePath(_.padEnd(slash.relative(main, argDir()), 40), colors.yellow), "🔧  ", prettyFilePath(slash.relative(out, argDir()), colors.blue)
            runcmd 'browserify', "#{main} #{out}", pwd
        return

    targetFile = target sourceFile
    return if not targetFile?

    log "target file".gray, targetFile if args.debug

    # 00000000   00000000   0000000   0000000
    # 000   000  000       000   000  000   000
    # 0000000    0000000   000000000  000   000
    # 000   000  000       000   000  000   000
    # 000   000  00000000  000   000  0000000

    fs.readFile sourceFile, 'utf8', (err, data) ->

        if err then return error "can't read #{sourceFile}"

        try
            #  0000000   0000000   00     00  00000000   000  000      00000000
            # 000       000   000  000   000  000   000  000  000      000
            # 000       000   000  000000000  00000000   000  000      0000000
            # 000       000   000  000 0 000  000        000  000      000
            #  0000000   0000000   000   000  000        000  0000000  00000000

            compiled = switch ext
                when 'coffee'
                    coffee = require 'coffeescript'
                    o = config sourceFile
                    if o[ext]?.map in ['inline', 'file']
                        toSource       = slash.relative targetFile, sourceFile
                        splitIndex     = toSource.lastIndexOf('./') + 2
                        sourceRoot     = toSource.slice 0, splitIndex - 4
                        relativeSource = toSource.substr splitIndex
                        cfg =
                            filename:      sourceFile
                            sourceMap:     true
                            generatedFile: slash.basename targetFile
                            sourceRoot:    sourceRoot
                            sourceFiles:   [relativeSource]

                    switch o[ext]?.map
                        when 'inline'
                            cfg.inlineMap = true
                            jsMap = coffee.compile data, cfg
                            jsMap.js
                        when 'file'
                            jsMap = coffee.compile data, cfg
                            srcMap = jsMap.v3SourceMap
                            mapFile = "#{targetFile}.map"
                            atomic mapFile, srcMap, (err) ->
                                if err then error "can't write sourceMap for #{targetFile}: #{err}"
                            jsMap.js + "\n//# sourceMappingURL=#{slash.basename mapFile}\n"
                        else
                            coffee.compile data

                when 'styl'
                    stylus = require 'stylus'
                    stylus data
                        .set 'filename', sourceFile
                        .set 'paths', [slash.dirname(sourceFile)]
                        .render()
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
            return konradError 'compile error', e

        fs.readFile targetFile, 'utf8', (err, targetData) ->

            if err or compiled != targetData

                writeCompiled sourceFile, targetFile, compiled, cb

            else
                log 'unchanged'.green.dim, prettyFilePath(slash.relative(targetFile, argDir()), colors.gray) if args.debug
                if args.verbose
                    log prettyTime(), "👍  #{prettyFilePath sourceFile} #{'►'.bold.yellow} #{prettyFilePath targetFile}"
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

    fs.ensureDir slash.dirname(targetFile), (err) ->

        if err then return error "can't create output directory #{slash.dirname(targetFile).bold.yellow}".bold.red

        atomic targetFile, compiled, (err) ->
            if err then return error "can't write #{targetFile.bold.yellow}".bold.red
            if not args.quiet
                if args.verbose
                    log prettyTime(), "👍  #{prettyFilePath slash.tilde sourceFile} #{'►'.bold.yellow} #{prettyFilePath slash.tilde targetFile}"
                else
                    log prettyTime(), "👍  #{prettyFilePath slash.tilde targetFile}"

            if slash.samePath slash.resolve(targetFile), __filename
                reload()
            else if cb?
                cb sourceFile, targetFile


# 000   000   0000000   000      000   000
# 000 0 000  000   000  000      000  000
# 000000000  000000000  000      0000000
# 000   000  000   000  000      000  000
# 00     00  000   000  0000000  000   000

walk = (opt, cb) ->

    if _.isFunction opt
        cb = opt
        opt = {}

    walkdir = require 'walkdir'
    try
        walkdir.sync argDir(), (wp) ->

            p = slash.path wp
            o = config p

            if should 'ignore', o, p
                cb p if opt.all
                @ignore wp
                return

            if should 'ignore', wlk, p
                cb p if opt.all
                @ignore wp
                return

            if slash.ext(p) in _.keys o
                cb p, target p
            else
                if opt.all
                    if not cb p
                        @ignore wp
    catch err
        console.log "walk [ERROR]: #{err}"

# 000  000   000  00000000   0000000
# 000  0000  000  000       000   000
# 000  000 0 000  000000    000   000
# 000  000  0000  000       000   000
# 000  000   000  000        0000000

if args.info

    log '○● info'.gray

    walk opt, (sourceFile, targetFile) ->

        if targetFile
            if dirty sourceFile, targetFile
                log prettyFilePath(_.padEnd(slash.relative(sourceFile, argDir()), 40), colors.yellow), " ► ".red.dim, prettyFilePath(slash.relative(targetFile, argDir()), colors.red)
            else if args.verbose
                log prettyFilePath(_.padEnd(slash.relative(sourceFile, argDir()), 40), colors.magenta), " ► ".green.dim, prettyFilePath(slash.relative(targetFile, argDir()), colors.green)

#  0000000  000000000   0000000   000000000  000   000   0000000
# 000          000     000   000     000     000   000  000
# 0000000      000     000000000     000     000   000  0000000
#      000     000     000   000     000     000   000       000
# 0000000      000     000   000     000      0000000   0000000

gitStatus = (sourceFile) ->

    gitDir = slash.dirname sourceFile
    git = require('simple-git') gitDir
    git.status (err,status) ->

        if err then return error "git error #{err}"

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
                            if slash.join(gitDir, f).indexOf(slash.resolve a) == 0
                                filtered = false
                                break
                        if filtered
                            log 'filtered', slash.resolve(a), f, slash.join(gitDir, f) if args.debug
                            continue

                    prfx    = "    "
                    prfx    = m[k] "█   "
                    gitFile = slash.join gitDir, f
                    relPath = slash.relative gitFile, '.'
                    lame    = slash.extname(gitFile) == '.js' or slash.basename(gitFile) == 'package.json'
                    change  = prfx + prettyFilePath(relPath, (lame and m[k].dim or m[k]))
                    if k in ['modified', 'created'] and args.verbose
                        continue if lame
                        res = childp.execSync "git diff -U0 --ignore-space-at-eol #{gitFile}",
                            encoding: 'utf8'
                            cwd: gitDir
                        diff = ""
                        c = '▼'.bold.blue
                        for l in res.split /\r?\n/
                            ls = colors.strip(l)
                            if (ls[0] in ['+', '-', '@']) and (ls.substr(0,4) not in ['+++ ', '--- '])
                                if ls[0] == '+'
                                    diff += "\n " + (ls.substr(1)).white
                                else if ls[0] == '-'
                                    diff += "\n " + (ls.substr(1)).gray.bold.dim
                                else
                                    diff += ("\n"+c)
                                    c = '●'.blue.dim
                        change += diff+"\n"+"▲".blue.dim if diff.length
                    changes.push change

        relPath = slash.relative gitDir, '.'
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
            st = st.split(/\r?\n/)[0].split '['
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
    
    optall = _.defaults opt, all: true
    gitcount = 0

    walk optall, (sourceFile, targetFile) ->

        if not targetFile

            if slash.basename(sourceFile) == '.git'
                gitStatus sourceFile
                gitcount += 1

            if slash.dirExists sourceFile
                for i in opt.ignore
                    if i.test sourceFile
                        return false
        true

    if not gitcount
        gitup = slash.parse argDir()
        while gitup.base
            dotGit = slash.join gitup.dir, '.git'
            if fs.existsSync dotGit
                gitStatus dotGit
                break
            gitup = slash.parse gitup.dir

#  0000000  00     00  0000000
# 000       000   000  000   000
# 000       000000000  000   000
# 000       000 0 000  000   000
#  0000000  000   000  0000000

runcmd = (cmd, cmdargs, cwd) ->
    
    try
        cmdpath = slash.resolve slash.join __dirname, '..', 'bin', cmd
        if os.platform() == 'win32'
            command = "\"C:\\Program\ Files\\Git\\bin\\bash.exe\" \"#{cmdpath}\" #{cmdargs}"
        else
            command = "#{cmdpath} #{cmdargs}"
        if args.verbose
            log "🔧 ", cmd.gray.reset, prettyFilePath(cmdpath), cmdargs.green
        childp.execSync command,
            cwd: cwd
            encoding: 'utf8'
            stdio:    'inherit'
            shell:    true
    catch err
        return konradError "command error", "command '#{cmd.bold.yellow}' (#{command.bold.blue}) #{'failed!'.red} #{err}"
    true

# 00000000   000   000  000   000
# 000   000  000   000  0000  000
# 0000000    000   000  000 0 000
# 000   000  000   000  000  0000
# 000   000   0000000   000   000

if args.run or args.rebuild

    log '🔧🔧 ' + (args.rebuild and 'rebuild' or 'run').gray
    
    walk opt, (sourceFile, targetFile) ->
        if targetFile
            isDirty = dirty sourceFile, targetFile
            if args.rebuild or isDirty
                src = prettyFilePath(_.padEnd(slash.relative(sourceFile, argDir()), 40), isDirty and colors.red or colors.yellow)
                tgt = prettyFilePath(slash.relative(targetFile, argDir()), colors.green)
                log src, "🔧  ", tgt
                build sourceFile, (sourceFile, targetFile) ->
                    o = config targetFile
                    if should 'browserify', o, targetFile
                        log prettyFilePath(_.padEnd(slash.relative(o.browserify.main, argDir()), 40), colors.yellow), "🔧  ", prettyFilePath(slash.relative(o.browserify.out, argDir()), colors.blue)
                        runcmd 'browserify', "#{o.browserify.main} #{o.browserify.out}", configPath 'browserify', slash.resolve targetFile

for cmd in ['update', 'bump', 'commit', 'publish', 'test']

    if args[cmd]

        if not runcmd cmd, args.arguments.join ' ', process.cwd()
            break

        log '🔧  done'.gray if args.verbose

        if args.arguments and cmd in ['commit', 'bump']
            break

# 00000000   00000000  000       0000000    0000000   0000000
# 000   000  000       000      000   000  000   000  000   000
# 0000000    0000000   000      000   000  000000000  000   000
# 000   000  000       000      000   000  000   000  000   000
# 000   000  00000000  0000000   0000000   000   000  0000000

watcher = null

reload = ->
    
    return if not watcher?
    watcher.close()
    
    log prettyTime(), '🔧  reload'.gray if not args.quiet
    
    arg = '-w'
    arg += ' -v' if args.verbose
    arg += ' -D' if args.debug
    arg += ' -q' if args.quiet
    
    childp.execSync "node #{__filename} #{arg}",
        cwd:      process.cwd()
        encoding: 'utf8'
        stdio:    'inherit'
        shell:    true
    log 'exit'.yellow.bold if not args.quiet
    
    process.exit 0

if args.watch

    # 000   000   0000000   000000000   0000000  000   000
    # 000 0 000  000   000     000     000       000   000
    # 000000000  000000000     000     000       000000000
    # 000   000  000   000     000     000       000   000
    # 00     00  000   000     000      0000000  000   000

    watch = (cb) ->

        pass = (p) -> if slash.extname(p).substr(1) in _.keys(opt) then true

        d = args.arguments[0] ? '.'
        v = " ● v#{pkg.version}".dim.gray
        log prettyTime(), "🔧  watching #{prettyFilePath slash.resolve(d), colors.white}#{v}".gray
        watcher = require('chokidar').watch d,
            ignored:        wlk.ignore
            ignoreInitial:  true
            usePolling:     false
            useFsEvents:    true

        watcher
            .on 'add',    (p) -> if pass p then cb slash.path p
            .on 'change', (p) -> if pass p then cb slash.path p

    watch (sourceFile) ->

        sourceFile = slash.resolve sourceFile
        o = config sourceFile

        test = (source) ->
            if should 'test', o, source
                runcmd 'test', source, configPath 'test', slash.resolve source

        if not should 'ignore', o, sourceFile
            build sourceFile, test
        else
            test sourceFile
