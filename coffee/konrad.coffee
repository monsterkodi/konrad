###
000   000   0000000   000   000  00000000    0000000   0000000
000  000   000   000  0000  000  000   000  000   000  000   000
0000000    000   000  000 0 000  0000000    000000000  000   000
000  000   000   000  000  0000  000   000  000   000  000   000
000   000   0000000   000   000  000   000  000   000  0000000
###

{ atomic, colors, karg, walkdir, noon, childp, slash, error, log, fs, os, _ } = require 'kxk'

pkg         = require "#{__dirname}/../package"
pretty      = require './pretty'
konradError = require './error'
args        = require './args'
argDir      = require './argdir'
build       = require './build'
should      = require './should'
target      = require './target'
config      = require './config'
status      = require './status'
watch       = require './watch'
runcmd      = require './runcmd'

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
    /.*-x64/
    /.*\.app$/
coffee  . ext js   . map inline . replace .. /coffee/ /js/ .. ^coffee/ js/ 
noon    . ext json
json    . ext noon . filter  .. package.json$
styl    . ext css  . replace .. /style/ /css/ .. /styl/ /js/css/
pug     . ext html . replace .. /pug/ /js/
"""

# log "default config:", opt

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
        /.*-x64/
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

# 000   000   0000000   000      000   000
# 000 0 000  000   000  000      000  000
# 000000000  000000000  000      0000000
# 000   000  000   000  000      000  000
# 00     00  000   000  0000000  000   000

walk = (wopt, cb) ->
    
    if _.isFunction wopt
        cb = wopt
        wopt = {}

    try
        walkdir.sync argDir(), (wp) ->

            p = slash.path wp
            o = config.obj p, wopt

            if should 'ignore', o, p
                cb p if wopt.all
                @ignore wp
                return

            if should 'ignore', wlk, p
                cb p if wopt.all
                @ignore wp
                return

            if slash.ext(p) in _.keys o
                cb p, target p, wopt
            else
                if wopt.all
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

        log "source: #{sourceFile} target: #{targetFile}" if args.verbose
        if dirty sourceFile, targetFile
            log pretty.filePath(_.padEnd(slash.relative(sourceFile, argDir()), 40), colors.yellow), " ► ".red.dim, pretty.filePath(slash.relative(targetFile, argDir()), colors.red)
        else if args.verbose
            log pretty.filePath(_.padEnd(slash.relative(sourceFile, argDir()), 40), colors.magenta), " ► ".green.dim, pretty.filePath(slash.relative(targetFile, argDir()), colors.green)

if args.diff
    args.status  = true
    args.verbose = true

if args.status
    
    optall = _.defaults opt, all: true
    gitcount = 0

    walk optall, (sourceFile, targetFile) ->

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

    log '🔧🔧 ' + (args.rebuild and 'rebuild' or 'run').gray
    
    walk opt, (sourceFile, targetFile) ->
        if targetFile
            isDirty = dirty sourceFile, targetFile
            if args.rebuild or isDirty
                src = pretty.filePath(_.padEnd(slash.relative(sourceFile, argDir()), 40), isDirty and colors.red or colors.yellow)
                tgt = pretty.filePath(slash.relative(targetFile, argDir()), colors.green)
                log src, "🔧  ", tgt
                build sourceFile, opt, (sourceFile, targetFile) ->
                    o = config.obj targetFile, opt
                    if should 'browserify', o, targetFile
                        log pretty.filePath(_.padEnd(slash.relative(o.browserify.main, argDir()), 40), colors.yellow), "🔧  ", pretty.filePath(slash.relative(o.browserify.out, argDir()), colors.blue)
                        runcmd 'browserify', "#{o.browserify.main} #{o.browserify.out}", config.path 'browserify', slash.resolve(targetFile), opt

for cmd in ['update', 'bump', 'commit', 'publish', 'test']

    if args[cmd]

        if not runcmd cmd, args.arguments.join ' ', process.cwd()
            break

        log '🔧  done'.gray if args.verbose

        if args.arguments and cmd in ['commit', 'bump']
            break

if args.watch
    
    watch wlk, opt
    