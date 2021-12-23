// monsterkodi/kode 0.201.0

var _k_

var argDir


argDir = function ()
{
    var args, d, slash

    args = require('kxk').args
    slash = require('kxk').slash

    if (args.arguments[0])
    {
        d = slash.resolve(args.arguments[0])
        if (slash.dirExists(d))
        {
            return d
        }
        d = slash.dir(d)
        if (slash.dirExists(d))
        {
            return d
        }
    }
    return slash.resolve('.')
}
module.exports = argDir