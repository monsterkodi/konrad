// monsterkodi/kode 0.172.0

var _k_

var kolor, render

kolor = require('kxk').kolor


render = function (rgs)
{
    var cfunc, index, plain, result, rng

    result = ''
    plain = ''
    for (index = 0; index < rgs.length; index++)
    {
        rng = rgs[index]
        while (plain.length < rng.start)
        {
            plain += ' '
            result += ' '
        }
        cfunc = ((function ()
        {
            switch (rng.clss)
            {
                case 'text':
                    return function (s)
                    {
                        return kolor.white(kolor.dim(s))
                    }

                case 'comment':
                    return function (s)
                    {
                        return kolor.gray(kolor.bold(s))
                    }

                case 'punct comment':
                case 'punct':
                    return function (s)
                    {
                        return kolor.gray(kolor.dim(s))
                    }

                case 'function':
                case 'function call':
                case 'string single':
                case 'string double':
                case 'dir text':
                case 'property':
                    return function (s)
                    {
                        return kolor.green(kolor.bold(s))
                    }

                case 'punct function call':
                case 'punct string single':
                case 'punct string double':
                case 'punct dir':
                    return function (s)
                    {
                        return kolor.green(kolor.dim(s))
                    }

                case 'obj':
                case 'class':
                case 'git file':
                    return function (s)
                    {
                        return kolor.yellow(kolor.bold(s))
                    }

                case 'punct git':
                case 'git ext':
                    return function (s)
                    {
                        return kolor.yellow(kolor.dim(s))
                    }

                case 'number':
                case 'keyword':
                case 'url domain':
                    return function (s)
                    {
                        return kolor.blue(kolor.bold(s))
                    }

                case 'require':
                case 'punct property':
                    return function (s)
                    {
                        return kolor.green(kolor.dim(s))
                    }

                case 'punct semver':
                case 'url protocol':
                case 'punct url':
                    return function (s)
                    {
                        return kolor.magenta(s)
                    }

                case 'semver':
                case 'dir url tld':
                case 'punct url tld':
                    return function (s)
                    {
                        return kolor.magenta(kolor.bold(s))
                    }

                default:
                    return function (s)
                {
                    return kolor.white(kolor.bold(s))
                }
            }

        }).bind(this))()
        plain += rng.match
        result += cfunc(rng.match)
    }
    return result
}
module.exports = render