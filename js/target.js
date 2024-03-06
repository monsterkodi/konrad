// monsterkodi/kode 0.257.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var argDir, args, config, kolor, pretty, slash, swapFirstDir, target, _

_ = require('kxk')._
args = require('kxk').args
kolor = require('kxk').kolor
slash = require('kxk').slash

argDir = require('./argdir')
config = require('./config')
pretty = require('./pretty')

swapFirstDir = function (path, from, to)
{
    var firstIndex

    firstIndex = path.indexOf(`${from}/`)
    if (firstIndex >= 0)
    {
        path = path.slice(0, typeof firstIndex === 'number' ? firstIndex : -1) + to + path.slice(firstIndex + from.length)
    }
    return path
}

target = function (sourceFile, opt)
{
    var ext, k, matches, o, r, targetFile, v, _34_21_, _45_22_, _49_23_, _54_29_

    ext = slash.ext(sourceFile)
    o = config.obj(sourceFile,opt)
    if (((o[ext] != null ? o[ext].filter : undefined) != null))
    {
        matches = false
        var list = _k_.list(o[ext].filter)
        for (var _36_14_ = 0; _36_14_ < list.length; _36_14_++)
        {
            r = list[_36_14_]
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
    else if (((o[ext] != null ? o[ext].out : undefined) != null))
    {
        targetFile = slash.join(argDir(),swapFirstDir(slash.relative(targetFile,argDir()),ext,(o[ext] != null ? o[ext].out : undefined)))
    }
    if (!((o[ext] != null ? o[ext].ext : undefined) != null))
    {
        return
    }
    targetFile = slash.join(slash.dir(targetFile),slash.base(targetFile) + '.' + o[ext].ext)
    return targetFile
}
module.exports = target