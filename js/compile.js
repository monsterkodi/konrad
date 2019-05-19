// koffee 0.43.0

/*
 0000000   0000000   00     00  00000000   000  000      00000000  
000       000   000  000   000  000   000  000  000      000       
000       000   000  000000000  00000000   000  000      0000000   
000       000   000  000 0 000  000        000  000      000       
 0000000   0000000   000   000  000        000  0000000  00000000
 */

(function() {
    var _, compile, fs, konradError, noon, ref, slash;

    ref = require('kxk'), noon = ref.noon, slash = ref.slash, fs = ref.fs, _ = ref._;

    konradError = require('./error');

    compile = function(sourceText, ext, sourceFile, targetFile, cfg) {
        var coffee, compiled, e, jsMap, mapcfg, pug, stylus;
        try {
            compiled = (function() {
                var ref1;
                switch (ext) {
                    case 'coffee':
                        coffee = require('koffee');
                        if ((ref1 = cfg[ext]) != null ? ref1.map : void 0) {
                            mapcfg = {
                                bare: true,
                                sourceMap: true,
                                inlineMap: true,
                                sourceRoot: '.',
                                filename: slash.relative(sourceFile, slash.dir(targetFile)),
                                feature: {
                                    header: true
                                },
                                generatedFile: slash.file(targetFile)
                            };
                            jsMap = coffee.compile(sourceText, mapcfg);
                            return jsMap.js;
                        } else {
                            return coffee.compile(sourceText, {
                                bare: true
                            });
                        }
                        break;
                    case 'styl':
                        stylus = require('stylus');
                        return stylus(sourceText).set('filename', sourceFile).set('paths', [slash.dir(sourceFile)]).render();
                    case 'pug':
                        pug = require('pug');
                        return pug.render(sourceText, {
                            pretty: true
                        });
                    case 'json':
                        return noon.stringify(JSON.parse(sourceText), {
                            ext: '.' + cfg[ext].ext,
                            indent: '  ',
                            maxalign: 16
                        });
                    case 'noon':
                        return noon.stringify(noon.parse(sourceText), {
                            ext: '.' + cfg[ext].ext,
                            indent: '  '
                        });
                    default:
                        throw ("don't know how to build files with extname ." + ext.bold + "!").yellow;
                }
            })();
        } catch (error) {
            e = error;
            konradError('compile error', e, sourceFile);
            return null;
        }
        return compiled;
    };

    module.exports = compile;

}).call(this);
