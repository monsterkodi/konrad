// monsterkodi/kode 0.146.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var _, args, fs, kerror, klog, kolor, slash, pretty, config, argDir, should, target, compile, runcmd, build, writeCompiled

_ = require('kxk')._
args = require('kxk').args
undefined = require('kxk').undefined
fs = require('kxk').fs
kerror = require('kxk').kerror
klog = require('kxk').klog
kolor = require('kxk').kolor
slash = require('kxk').slash

pretty = require('./pretty')
config = require('./config')
argDir = require('./argdir')
should = require('./should')
target = require('./target')
compile = require('./compile')
runcmd = require('./runcmd')

build = function (sourceFile, opt, cb)
{
    var ext, cfg, main, out, pwd, targetFile

    if (args.debug)
    {
        klog(gray("source file"),sourceFile)
    }
    ext = slash.ext(sourceFile)
    cfg = config.obj(sourceFile,opt)
    if (ext === 'js' && should('browserify',cfg,sourceFile))
    {
        main = cfg.browserify.main
        out = cfg.browserify.out
        pwd = config.path('browserify',slash.resolve(sourceFile),opt)
        if (out !== slash.relative(sourceFile,pwd))
        {
            klog(pretty.filePath(_.padEnd(slash.relative(main,argDir()),40),kolor.yellow),"🔧  ",pretty.filePath(slash.relative(out,argDir()),kolor.blue))
            runcmd('browserify',`${main} ${out}`,pwd)
        }
        return
    }
    targetFile = target(sourceFile,opt)
    if (!(targetFile != null))
    {
        console.warn(`no targetFile for source: ${sourceFile}`,opt)
        return
    }
    if (args.debug)
    {
        klog(gray("target file"),targetFile)
    }
    return fs.readFile(sourceFile,'utf8',function (err, sourceText)
    {
        var compiled, stat, ttat

        if (err)
        {
            kerror(`can't read ${sourceFile}`)
            cb()
            return
        }
        compiled = compile(sourceText,ext,sourceFile,targetFile,cfg)
        if (_k_.empty(compiled))
        {
            cb()
            return
        }
        slash.logErrors = true
        if (!slash.fileExists(targetFile) || slash.readText(targetFile) !== compiled)
        {
            return writeCompiled(sourceFile,targetFile,compiled,cb)
        }
        else
        {
            if (args.debug)
            {
                klog(kolor.green(kolor.dim('unchanged')),pretty.filePath(slash.relative(targetFile,argDir()),kolor.gray))
            }
            if (args.verbose)
            {
                console.log(pretty.time(),`👍  ${pretty.filePath(sourceFile)} ${kolor.bold(kolor.yellow('►'))} ${pretty.filePath(targetFile)}`)
            }
            stat = fs.statSync(sourceFile)
            ttat = fs.statSync(targetFile)
            if (stat.mtime.getTime() !== ttat.mtime.getTime())
            {
                return fs.utimesSync(slash.resolve(targetFile),stat.atime,stat.mtime)
            }
        }
    })
}

writeCompiled = function (sourceFile, targetFile, compiled, cb)
{
    fs.mkdirSync(slash.dir(targetFile),{recursive:true})
    slash.writeText(targetFile,compiled)
    if (!args.quiet)
    {
        if (args.verbose)
        {
            console.log(pretty.time(),`👍   ${pretty.filePath(slash.tilde(sourceFile))} ${kolor.bold(kolor.yellow('►'))} ${pretty.filePath(slash.tilde(targetFile))}`)
        }
        else
        {
            console.log(pretty.time(),`👍   ${pretty.filePath(slash.tilde(targetFile))}`)
        }
    }
    return (typeof cb === "function" ? cb(sourceFile,targetFile) : undefined)
}
module.exports = build