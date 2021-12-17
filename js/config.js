// monsterkodi/kode 0.139.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var _, noon, slash, path, obj

_ = require('kxk')._
noon = require('kxk').noon
slash = require('kxk').slash


path = function (key, p, opt)
{
    var o

    while (slash.dir(p).length && !(_k_.in(slash.dir(p),['.','/'])))
    {
        p = slash.dir(p)
        if (slash.fileExists(slash.join(p,'.konrad.noon')))
        {
            o = _.defaultsDeep(noon.load(slash.join(p,'.konrad.noon')),opt)
            if ((o[key] != null))
            {
                return slash.resolve(p)
            }
        }
    }
    return null
}

obj = function (p, opt = {})
{
    var dotkonrad, ignore, o

    while (slash.dir(p).length && !(_k_.in(slash.dir(p),['.','/'])) && !/^\w\:\/$/.test(slash.dir(p)))
    {
        p = slash.dir(p)
        if (slash.fileExists(slash.join(p,'.konrad.noon')))
        {
            dotkonrad = noon.load(slash.join(p,'.konrad.noon'))
            ignore = [].concat(dotkonrad.ignore,opt.ignore)
            o = _.defaultsDeep(dotkonrad,opt)
            o.ignore = ignore.map(function (i)
            {
                if (_.isString(i))
                {
                    return new RegExp(i)
                }
                else
                {
                    return i
                }
            })
            return o
        }
    }
    return opt
}
module.exports = {path:path,obj:obj}