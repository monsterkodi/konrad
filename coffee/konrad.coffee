###
000   000   0000000   000   000  00000000    0000000   0000000
000  000   000   000  0000  000  000   000  000   000  000   000
0000000    000   000  000 0 000  0000000    000000000  000   000
000  000   000   000  000  0000  000   000  000   000  000   000
000   000   0000000   000   000  000   000  000   000  0000000
###

{ args, colors, slash, noon, fs, klog, _ } = require 'kxk'

argDir = require './argdir'
build  = require './build'
config = require './config'
pretty = require './pretty'
runcmd = require './runcmd'
should = require './should'
status = require './status'
watch  = require './watch'
walk   = require './walk'
pkg    = require "#{__dirname}/../package"

args = args.init """
    arguments  depend on options                            **
    run        build dirty or missing targets in dir        false
    rebuild    rebuild all targets in dir                   false  -R
    watch      watch directory for changes                  false
    info       show build status of dir                     false
    bump       bump package.* version [major|minor|patch]   false
    diff       show git diff of file/dir                    false
    status     show git status of file/dir                  false
    commit     add, commit and push [msg]                   false
    update     update npm packages                          false
    publish    bump, commit & publish to npm [msg]          false
    test       run tests                                    false
    verbose    log more                                     false
    quiet      log nothing                                  false
    debug      log debug                                    false  -D
    logtime    log with time                                true
    """, pkg:pkg

actions = ['bump', 'commit', 'publish', 'update', 'test', 'watch', 'run', 'rebuild', 'info', 'status', 'diff']

if not actions.map((a) -> args[a]).reduce((acc,val) -> acc or val)
    args.run = true # makes run the default action if no other action is set
    
# 0000000    00000000  00000000   0000000   000   000  000      000000000   0000000
# 000   000  000       000       000   000  000   000  000         000     000
# 000   000  0000000   000000    000000000  000   000  000         000     0000000
# 000   000  000       000       000   000  000   000  000         000          000
# 0000000    00000000  000       000   000   0000000   0000000     000     0000000

opt = noon.parse """
coffee  . ext js   . map true . replace .. /coffee/ /js/ .. ^coffee/ js/ 
koffee  . ext js   . map true . replace .. /coffee/ /js/ .. ^coffee/ js/ 
noon    . ext json
json    . ext noon . filter  .. package.json$
styl    . ext css  . replace .. /style/ /css/ .. /styl/ /js/css/
pug     . ext html . replace .. /pug/ /js/
"""

# 000   0000000   000   000   0000000   00000000   00000000
# 000  000        0000  000  000   000  000   000  000
# 000  000  0000  000 0 000  000   000  0000000    0000000
# 000  000   000  000  0000  000   000  000   000  000
# 000   0000000   000   000   0000000   000   000  00000000

opt.ignore = [
    /gulpfile.coffee$/
    /Gruntfile.coffee$/
    /\.konrad\.noon$/
    /menu.noon$/
]

wlk =
    ignore: [
        /node_modules$/
        /bower_components$/
        /\/img$/
        /\/\..+$/
        /\.git$/
        /\.app$/
        /.*-x64$/
        /.*-ia32$/
        /\/?inno$/
        /\/?js$/
    ]

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

# 000  000   000  00000000   0000000
# 000  0000  000  000       000   000
# 000  000 0 000  000000    000   000
# 000  000  0000  000       000   000
# 000  000   000  000        0000000

if args.info

    log '○● info'.gray

    walk wlk, opt, (sourceFile, targetFile) ->

        log "source: #{sourceFile} target: #{targetFile}" if args.verbose
        if dirty sourceFile, targetFile
            log pretty.filePath(_.padEnd(slash.relative(sourceFile, argDir()), 40), colors.yellow), " ► ".red.dim, pretty.filePath(slash.relative(targetFile, argDir()), colors.red)
        else if args.verbose
            log pretty.filePath(_.padEnd(slash.relative(sourceFile, argDir()), 40), colors.magenta), " ► ".green.dim, pretty.filePath(slash.relative(targetFile, argDir()), colors.green)

if args.diff
    
    args.status  = true

if args.status
    
    optall = _.defaults opt, all: true
    gitcount = 0

    walk wlk, optall, (sourceFile, targetFile) ->

        if not targetFile

            if slash.basename(sourceFile) == '.git'
                status.gitStatus sourceFile
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
                status.gitStatus dotGit
                break
            gitup = slash.parse gitup.dir
            
# 00000000   000   000  000   000
# 000   000  000   000  0000  000
# 0000000    000   000  000 0 000
# 000   000  000   000  000  0000
# 000   000   0000000   000   000

if args.run or args.rebuild

    if not args.quiet
        klog '🔧🔧 ' + (args.rebuild and 'rebuild' or 'run').gray
    
    walk wlk, opt, (sourceFile, targetFile) ->
        if targetFile
            isDirty = dirty sourceFile, targetFile
            if args.rebuild or isDirty
                src = pretty.filePath(_.padEnd(slash.relative(sourceFile, argDir()), 40), isDirty and colors.red or colors.yellow)
                tgt = pretty.filePath(slash.relative(targetFile, argDir()), colors.green)
                if not args.quiet
                    klog src, "🔧  ", tgt
                build sourceFile, opt, (sourceFile, targetFile) ->
                    if not targetFile
                        process.exit 1
                    o = config.obj targetFile, opt
                    if should 'browserify', o, targetFile
                        console.log pretty.filePath(_.padEnd(slash.relative(o.browserify.main, argDir()), 40), colors.yellow), "🔧  ", pretty.filePath(slash.relative(o.browserify.out, argDir()), colors.blue)
                        runcmd 'browserify' "#{o.browserify.main} #{o.browserify.out}" config.path 'browserify', slash.resolve(targetFile), opt

for cmd in ['update' 'bump' 'commit' 'publish' 'test']

    if args[cmd]

        if not runcmd cmd, args.arguments.join(' '), process.cwd()
            process.exit 1
            break

        klog '🔧  done'.gray if args.verbose

        if args.arguments and cmd in ['commit' 'bump']
            break

if args.watch
    watch wlk, opt
    