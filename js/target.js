// monsterkodi/kode 0.245.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var argDir, args, config, kolor, pretty, slash, swapLastDir, target, _

_ = require('kxk')._
args = require('kxk').args
kolor = require('kxk').kolor
slash = require('kxk').slash

argDir = require('./argdir')
config = require('./config')
pretty = require('./pretty')

swapLastDir = function (path, from, to)
{
    var lastIndex

    lastIndex = path.lastIndexOf(`/${from}/`)
    if (lastIndex >= 0)
    {
        path = path.slice(0, typeof lastIndex === 'number' ? lastIndex+1 : Infinity) + to + path.slice(lastIndex + (`/${from}`).length)
    }
    return path
}

target = function (sourceFile, opt)
{
    var ext, k, matches, o, r, targetFile, v, _27_21_, _38_22_, _42_18_, _45_29_

    ext = slash.ext(sourceFile)
    o = config.obj(sourceFile,opt)
    if (((o[ext] != null ? o[ext].filter : undefined) != null))
    {
        matches = false
        var list = _k_.list(o[ext].filter)
        for (var _29_14_ = 0; _29_14_ < list.length; _29_14_++)
        {
            r = list[_29_14_]
            if (new RegExp(r).test(sourceFile))
            {
                matches = true
            }
        }
        if (!matches)
        {
            if (args.debug)
            {
                console.log(pretty.filePath(slash.relative(sourceFile,argDir()),kolor.blue))
            }
            return
        }
    }
    targetFile = _.clone(sourceFile)
    if (((o[ext] != null ? o[ext].replace : undefined) != null))
    {
        for (k in o[ext].replace)
        {
            v = o[ext].replace[k]
            targetFile = targetFile.replace(k,v)
        }
    }
    if (((o[ext] != null ? o[ext].out : undefined) != null))
    {
        targetFile = swapLastDir(targetFile,ext,(o[ext] != null ? o[ext].out : undefined))
    }
    if (!((o[ext] != null ? o[ext].ext : undefined) != null))
    {
        return
    }
    return targetFile = slash.join(slash.dir(targetFile),slash.base(targetFile) + '.' + o[ext].ext)
}
module.exports = target