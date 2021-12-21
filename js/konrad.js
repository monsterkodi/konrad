// monsterkodi/kode 0.172.0

var _k_ = {list: function (l) {return (l != null ? typeof l.length === 'number' ? l : [] : [])}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var actions, argDir, args, build, cmd, config, dirty, dotGit, fs, gitcount, gitup, klog, kolor, opt, optall, pkg, pretty, runcmd, should, slash, status, walk, watch, wlk, _

_ = require('kxk')._
args = require('kxk').args
fs = require('kxk').fs
klog = require('kxk').klog
kolor = require('kxk').kolor
noon = require('kxk').noon
slash = require('kxk').slash
watch = require('kxk').watch

argDir = require('./argdir')
build = require('./build')
config = require('./config')
pretty = require('./pretty')
runcmd = require('./runcmd')
should = require('./should')
status = require('./status')
watch = require('./watch')
walk = require('./walk')
pkg = require(`${__dirname}/../package`)
args = args.init(`arguments  depend on options                            **
run        build dirty or missing targets in dir        false
rebuild    rebuild all targets in dir                   false  -R
watch      watch directory for changes                  false
info       show build status of dir                     false
bump       bump package.* version [major|minor|patch]   false
build      make package                                 false  -m
diff       show git diff of file/dir                    false
status     show git status of file/dir                  false
fetch      fetch and show git status of file/dir        false
commit     add, commit and push [msg]                   false
update     update npm packages                          false
publish    bump, commit & publish to npm [msg]          false
test       run tests                                    false
verbose    log more                                     false
quiet      log nothing                                  false
debug      log debug                                    false  -D
logtime    log with time                                true`,{pkg:pkg})
actions = ['bump','build','commit','publish','update','test','watch','run','rebuild','info','status','fetch','diff']
if (!actions.map(function (a)
    {
        return args[a]
    }).reduce(function (acc, val)
    {
        return acc || val
    }))
{
    args.run = true
}
opt = noon.parse(`coffee  . ext js   . map true . replace .. /coffee/ /js/ .. ^coffee/ js/ 
kode    . ext js   . out js            
noon    . ext json
json    . ext noon . filter  .. package.json$
styl    . ext css  . replace .. /style/ /css/ .. /styl/ /js/css/
pug     . ext html . replace .. /pug/ /js/`)
opt.ignore = [/.*\.konrad\.noon$/,/.*menu\.noon$/]
wlk = {ignore:[/node_modules$/,/bower_components$/,/\/img$/,/\/\..+$/,/\.git$/,/\.app$/,/.*-x64$/,/.*-arm64$/,/.*-ia32$/,/\/?inno$/,/\/?js$/]}

dirty = function (sourceFile, targetFile)
{
    var ss, ts

    if (!fs.existsSync(targetFile))
    {
        return true
    }
    ss = fs.statSync(sourceFile)
    ts = fs.statSync(targetFile)
    return ss.mtime.getTime() > ts.mtime.getTime()
}
if (args.info)
{
    console.log(kolor.gray('○● info'))
    walk(wlk,opt,function (sourceFile, targetFile)
    {
        if (args.verbose)
        {
            console.log(`source: ${sourceFile} target: ${targetFile}`)
        }
        if (dirty(sourceFile,targetFile))
        {
            console.log(pretty.filePath(_.padEnd(slash.relative(sourceFile,argDir()),40),kolor.yellow),kolor.red(kolor.dim(" ► ")),pretty.filePath(slash.relative(targetFile,argDir()),kolor.red))
        }
        else if (args.verbose)
        {
            console.log(pretty.filePath(_.padEnd(slash.relative(sourceFile,argDir()),40),kolor.magenta),kolor.green(kolor.dim(" ► ")),pretty.filePath(slash.relative(targetFile,argDir()),kolor.green))
        }
    })
}
if (args.diff)
{
    args.status = true
}
if (args.status || args.fetch)
{
    optall = _.defaults(opt,{all:true})
    gitcount = 0
    walk(wlk,optall,function (sourceFile, targetFile)
    {
        var i, _144_30_

        if (!targetFile)
        {
            if (slash.basename(sourceFile) === '.git')
            {
                if (args.fetch)
                {
                    status.gitFetch(sourceFile)
                }
                else
                {
                    status.gitStatus(sourceFile)
                }
                gitcount += 1
            }
            if (slash.dirExists(sourceFile))
            {
                var list = _k_.list(opt.ignore)
                for (var _143_22_ = 0; _143_22_ < list.length; _143_22_++)
                {
                    i = list[_143_22_]
                    if (((i != null ? i.test : undefined) != null))
                    {
                        if (i.test(sourceFile))
                        {
                            return false
                        }
                    }
                    else
                    {
                        klog('ignore?',i)
                    }
                }
            }
        }
        return true
    })
    if (!gitcount)
    {
        gitup = slash.parse(argDir())
        while (gitup.base)
        {
            dotGit = slash.join(gitup.dir,'.git')
            if (fs.existsSync(dotGit))
            {
                if (args.fetch)
                {
                    status.gitFetch(dotGit)
                }
                else
                {
                    status.gitStatus(dotGit)
                }
                break
            }
            gitup = slash.parse(gitup.dir)
        }
    }
}
if (args.run || args.rebuild)
{
    if (!args.quiet)
    {
        console.log('🔧🔧 ' + kolor.gray(args.rebuild && 'rebuild' || 'run'))
    }
    walk(wlk,opt,function (sourceFile, targetFile)
    {
        var isDirty, src, tgt

        if (targetFile)
        {
            isDirty = dirty(sourceFile,targetFile)
            if (args.rebuild || isDirty)
            {
                src = pretty.filePath(_.padEnd(slash.relative(sourceFile,argDir()),40),isDirty && kolor.red || kolor.yellow)
                tgt = pretty.filePath(slash.relative(targetFile,argDir()),kolor.green)
                if (!args.quiet)
                {
                    console.log(src,"🔧  ",tgt)
                }
                return build(sourceFile,opt,function (sourceFile, targetFile)
                {
                    var o

                    if (!targetFile)
                    {
                        process.exit(1)
                    }
                    o = config.obj(targetFile,opt)
                    if (should('browserify',o,targetFile))
                    {
                        console.log(pretty.filePath(_.padEnd(slash.relative(o.browserify.main,argDir()),40),kolor.yellow),"🔧  ",pretty.filePath(slash.relative(o.browserify.out,argDir()),kolor.blue))
                        return runcmd('browserify',`${o.browserify.main} ${o.browserify.out}`,config.path('browserify',slash.resolve(targetFile),opt))
                    }
                })
            }
        }
    })
}
var list = ['update','bump','build','test','commit','publish']
for (var _190_8_ = 0; _190_8_ < list.length; _190_8_++)
{
    cmd = list[_190_8_]
    if (args[cmd])
    {
        if (!runcmd(cmd,args.arguments.join(' '),process.cwd()))
        {
            process.exit(1)
            break
        }
        if (args.verbose)
        {
            console.log(kolor.gray('🔧  done'))
        }
        if (args.arguments && _k_.in(cmd,['commit','bump','build']))
        {
            break
        }
    }
}
if (args.watch)
{
    watch(wlk,opt)
}
else if (_k_.in(cmd,['build']))
{
    process.exit(0)
}