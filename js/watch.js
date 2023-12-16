// monsterkodi/kode 0.245.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var args, build, config, kolor, kxk, pkg, pretty, runcmd, should, slash, watch, Watch, watcher, _

kxk = require('kxk')
_ = kxk._
args = kxk.args
kolor = kxk.kolor
slash = kxk.slash
watch = kxk.watch

pretty = require('./pretty')
should = require('./should')
runcmd = require('./runcmd')
config = require('./config')
build = require('./build')
pkg = require('../package.json')
watcher = null

Watch = function (wlk, opt)
{
    var start

    start = function (cb)
    {
        var d, pass, v, _29_30_

        pass = function (p)
        {
            return _k_.in(slash.ext(p),_.keys(opt))
        }
        d = ((_29_30_=args.arguments[0]) != null ? _29_30_ : '.')
        v = kolor.dim(kolor.gray(`${pkg.version} ●`))
        console.log(pretty.time(),kolor.gray(`👁   ${v} ${pretty.filePath(slash.resolve(d),kolor.white)}`))
        return watch.watch(d,{recursive:true,ignore:wlk.ignore,cb:function (watcher)
        {
            return watcher.on('change',function (info)
            {
                if (pass(info.path))
                {
                    return cb(slash.path(info.path))
                }
            })
        }})
    }
    return start(function (sourceFile)
    {
        var o, test

        sourceFile = slash.resolve(sourceFile)
        o = config.obj(sourceFile,opt)
        test = function (source)
        {
            if (should('test',o,source))
            {
                return runcmd('test',source,config.path('test',slash.resolve(source),opt))
            }
        }
        if (!should('ignore',o,sourceFile))
        {
            console.log('build?',sourceFile,opt,test)
            return build(sourceFile,opt,test)
        }
        else
        {
            return test(sourceFile)
        }
    })
}
module.exports = Watch