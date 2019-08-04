// koffee 1.3.0

/*
 0000000   0000000   00     00  00000000   000  000      00000000  
000       000   000  000   000  000   000  000  000      000       
000       000   000  000000000  00000000   000  000      0000000   
000       000   000  000 0 000  000        000  000      000       
 0000000   0000000   000   000  000        000  0000000  00000000
 */

(function() {
    var _, compile, fs, klog, koffee, konradError, noon, pretty, ref, slash;

    ref = require('kxk'), noon = ref.noon, slash = ref.slash, klog = ref.klog, fs = ref.fs, _ = ref._;

    koffee = require('koffee');

    pretty = require('./pretty');

    konradError = require('./error');

    compile = function(sourceText, ext, sourceFile, targetFile, cfg) {
        var compiled, e, jsMap, mapcfg, pos, pug, stylus;
        try {
            compiled = (function() {
                var ref1;
                switch (ext) {
                    case 'coffee':
                        if ((ref1 = cfg[ext]) != null ? ref1.map : void 0) {
                            mapcfg = {
                                source: sourceFile,
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
                            jsMap = koffee.compile(sourceText, mapcfg);
                            return jsMap.js;
                        } else {
                            return koffee.compile(sourceText, {
                                bare: true,
                                source: sourceFile
                            });
                        }
                        break;
                    case 'styl':
                        stylus = require('stylus');
                        return stylus(sourceText).render();
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
            pos = (e.location != null) && ':' + (e.location.first_line + 1) + ':' + e.location.first_column || '';
            klog(pretty.time(), "🔺  " + (pretty.filePath(slash.tilde(sourceFile))) + pos);
            konradError('compile error', e.message, sourceFile);
            return null;
        }
        return compiled;
    };

    module.exports = compile;

}).call(this);
