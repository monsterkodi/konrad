var _k_

var compile, kode, koffee, kolor, konradError, pretty, slash

kolor = require('kxk').kolor
noon = require('kxk').noon
slash = require('kxk').slash

koffee = require('koffee')
kode = require('kode')
pretty = require('./pretty')
konradError = require('./error')

compile = function (sourceText, ext, sourceFile, targetFile, cfg)
{
    var compiled, pos, _68_24_

    try
    {
        compiled = ((function ()
        {
            var jsMap, k0de, mapcfg, pug, stylus

            switch (ext)
            {
                case 'coffee':
                    if ((cfg[ext] != null ? cfg[ext].map : undefined))
                    {
                        mapcfg = {source:sourceFile,bare:true,sourceMap:true,inlineMap:true,filename:slash.relative(sourceFile,slash.dir(targetFile)),generatedFile:targetFile,metalog:'log',feature:{header:true}}
                        jsMap = koffee.compile(sourceText,mapcfg)
                        return jsMap.js
                    }
                    else
                    {
                        return koffee.compile(sourceText,{bare:true,source:sourceFile,metalog:'log'})
                    }
                    break
                case 'kode':
                    kode.compile(sourceText,{header:false})
                    k0de = new kode({header:false})
                    return k0de.compile(sourceText,sourceFile)

                case 'styl':
                    stylus = require('stylus')
                    return stylus(sourceText).render()

                case 'pug':
                    pug = require('pug')
                    return pug.render(sourceText,{pretty:true})

                case 'json':
                    return noon.stringify(JSON.parse(sourceText),{ext:'.' + cfg[ext].ext,indent:'  ',maxalign:16})

                case 'noon':
                    return noon.stringify(noon.parse(sourceText),{ext:'.' + cfg[ext].ext,indent:'  '})

                default:
                    throw kolor.yellow(`don't know how to build files with extname .${kolor.bold(ext)}!`)
            }

        }).bind(this))()
    }
    catch (e)
    {
        pos = (e.location != null) && ':' + (e.location.first_line + 1) + ':' + e.location.first_column || ''
        console.log(pretty.time(),`🔺  ${pretty.filePath(slash.tilde(sourceFile))}${pos}`)
        konradError('compile error',e.message,sourceFile)
        return null
    }
    return compiled
}
module.exports = compile