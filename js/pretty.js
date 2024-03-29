// monsterkodi/kode 0.257.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var args, kolor, os, pretty, slash, _

_ = require('kxk')._
args = require('kxk').args
kolor = require('kxk').kolor
os = require('kxk').os
slash = require('kxk').slash

pretty = {}

pretty.path = function (p, c = kolor.yellow)
{
    return p.split('/').map(function (n)
    {
        return c(n)
    }).join(kolor.dim(c('/')))
}

pretty.ext = function (e, c = kolor.yellow)
{
    if (e.length)
    {
        return kolor.dim(c('.')) + c(e.substr(1))
    }
    else
    {
        return ''
    }
}

pretty.file = function (f, c = kolor.yellow)
{
    return `${kolor.bold(c(slash.base(f)))}${pretty.ext(slash.extname(f),c)}`
}

pretty.filePath = function (p, c = kolor.yellow)
{
    p = p.replace(os.homedir(),"~")
    if (!_k_.empty(slash.dir(p)))
    {
        return `${pretty.path(slash.dir(p),c)}${pretty.path('/',c)}${pretty.file(slash.basename(p),c)}`
    }
    else
    {
        return `${pretty.file(slash.basename(p),c)}`
    }
}

pretty.time = function ()
{
    var d

    if (args.logtime)
    {
        d = new Date()
        return [`${kolor.gray(_.padStart(String(d.getHours()),2,'0'))}${kolor.dim(kolor.gray(':'))}`,`${kolor.gray(_.padStart(String(d.getMinutes()),2,'0'))}${kolor.dim(kolor.gray(':'))}`,`${kolor.gray(_.padStart(String(d.getSeconds()),2,'0'))}`].join('')
    }
    else
    {
        return ''
    }
}
module.exports = pretty