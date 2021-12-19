// monsterkodi/kode 0.146.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var kerror, slash, walkdir, argDir, should, target, config, walk

kerror = require('kxk').kerror
slash = require('kxk').slash
walkdir = require('kxk').walkdir

argDir = require('./argdir')
should = require('./should')
target = require('./target')
config = require('./config')

walk = function (wlk, opt, cb)
{
    if (typeof(opt) == 'function')
    {
        cb = opt
        opt = {}
    }
    try
    {
        return walkdir.sync(argDir(),function (wp)
        {
            var p, o

            p = slash.path(wp)
            o = config.obj(p,opt)
            if (o && p)
            {
                if (should('ignore',o,p))
                {
                    if (opt.all)
                    {
                        cb(p)
                    }
                    this.ignore(wp)
                    return
                }
            }
            else
            {
                return
            }
            if (wlk)
            {
                if (should('ignore',wlk,p))
                {
                    if (opt.all)
                    {
                        cb(p)
                    }
                    this.ignore(wp)
                    return
                }
            }
            if (_k_.in(slash.ext(p),Object.keys(o)))
            {
                return cb(p,target(p,opt))
            }
            else
            {
                if (opt.all)
                {
                    if (!cb(p))
                    {
                        return this.ignore(wp)
                    }
                }
            }
        })
    }
    catch (err)
    {
        return kerror("walk",err.toString())
    }
}
module.exports = walk