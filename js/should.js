// monsterkodi/kode 0.172.0

var _k_ = {list: function (l) {return (l != null ? typeof l.length === 'number' ? l : [] : [])}}

var argDir, args, klog, kolor, pretty, should, slash

args = require('kxk').args
klog = require('kxk').klog
kolor = require('kxk').kolor
slash = require('kxk').slash

argDir = require('./argdir')
pretty = require('./pretty')

should = function (k, o, p)
{
    var i, keys, r

    if (!(o[k] != null))
    {
        return false
    }
    if (o[k] instanceof Array)
    {
        keys = o[k]
    }
    else if (o[k] instanceof Object)
    {
        keys = Object.keys(o[k])
    }
    else
    {
        keys = [o[k]]
    }
    var list = _k_.list(keys)
    for (var _27_10_ = 0; _27_10_ < list.length; _27_10_++)
    {
        i = list[_27_10_]
        r = i
        if (typeof(i) === 'string')
        {
            r = new RegExp(i)
        }
        if (p && r && r.test(p))
        {
            if (args.debug)
            {
                klog(pretty.filePath(slash.relative(p,argDir()),kolor.gray),kolor.blue('should ') + kolor.bold(kolor.blue(k)))
            }
            return true
        }
    }
    return false
}
module.exports = should