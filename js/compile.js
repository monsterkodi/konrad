// koffee 1.3.0

/*
 0000000   0000000   00     00  00000000   000  000      00000000  
000       000   000  000   000  000   000  000  000      000       
000       000   000  000000000  00000000   000  000      0000000   
000       000   000  000 0 000  000        000  000      000       
 0000000   0000000   000   000  000        000  0000000  00000000
 */
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUE7O0FBUUEsTUFBK0IsT0FBQSxDQUFRLEtBQVIsQ0FBL0IsRUFBRSxlQUFGLEVBQVEsaUJBQVIsRUFBZSxlQUFmLEVBQXFCLFdBQXJCLEVBQXlCOztBQUV6QixNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULFdBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFFZCxPQUFBLEdBQVUsU0FBQyxVQUFELEVBQWEsR0FBYixFQUFrQixVQUFsQixFQUE4QixVQUE5QixFQUEwQyxHQUExQztBQUVOLFFBQUE7QUFBQTtRQUNJLFFBQUE7O0FBQVcsb0JBQU8sR0FBUDtBQUFBLHFCQUVGLFFBRkU7b0JBSUgsb0NBQVcsQ0FBRSxZQUFiO3dCQUNJLE1BQUEsR0FDSTs0QkFBQSxNQUFBLEVBQWUsVUFBZjs0QkFDQSxJQUFBLEVBQWUsSUFEZjs0QkFFQSxTQUFBLEVBQWUsSUFGZjs0QkFHQSxTQUFBLEVBQWUsSUFIZjs0QkFJQSxVQUFBLEVBQWUsR0FKZjs0QkFLQSxRQUFBLEVBQWUsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLEtBQUssQ0FBQyxHQUFOLENBQVUsVUFBVixDQUEzQixDQUxmOzRCQU1BLE9BQUEsRUFBUztnQ0FBQSxNQUFBLEVBQVEsSUFBUjs2QkFOVDs0QkFPQSxhQUFBLEVBQWUsS0FBSyxDQUFDLElBQU4sQ0FBVyxVQUFYLENBUGY7O3dCQVNKLEtBQUEsR0FBUSxNQUFNLENBQUMsT0FBUCxDQUFlLFVBQWYsRUFBMkIsTUFBM0I7K0JBQ1IsS0FBSyxDQUFDLEdBWlY7cUJBQUEsTUFBQTsrQkFjSSxNQUFNLENBQUMsT0FBUCxDQUFlLFVBQWYsRUFBMkI7NEJBQUEsSUFBQSxFQUFLLElBQUw7NEJBQVcsTUFBQSxFQUFPLFVBQWxCO3lCQUEzQixFQWRKOztBQUZDO0FBRkUscUJBb0JGLE1BcEJFO29CQXFCSCxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7MkJBQ1QsTUFBQSxDQUFPLFVBQVAsQ0FDSSxDQUFDLE1BREwsQ0FBQTtBQXRCRyxxQkF5QkYsS0F6QkU7b0JBMEJILEdBQUEsR0FBUyxPQUFBLENBQVEsS0FBUjsyQkFDVCxHQUFHLENBQUMsTUFBSixDQUFXLFVBQVgsRUFBdUI7d0JBQUEsTUFBQSxFQUFRLElBQVI7cUJBQXZCO0FBM0JHLHFCQTZCRixNQTdCRTsyQkErQkgsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsS0FBTCxDQUFXLFVBQVgsQ0FBZixFQUF1Qzt3QkFBQSxHQUFBLEVBQUssR0FBQSxHQUFJLEdBQUksQ0FBQSxHQUFBLENBQUksQ0FBQyxHQUFsQjt3QkFBdUIsTUFBQSxFQUFRLElBQS9CO3dCQUFxQyxRQUFBLEVBQVUsRUFBL0M7cUJBQXZDO0FBL0JHLHFCQWlDRixNQWpDRTsyQkFtQ0gsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsS0FBTCxDQUFXLFVBQVgsQ0FBZixFQUF1Qzt3QkFBQSxHQUFBLEVBQUssR0FBQSxHQUFJLEdBQUksQ0FBQSxHQUFBLENBQUksQ0FBQyxHQUFsQjt3QkFBdUIsTUFBQSxFQUFRLElBQS9CO3FCQUF2QztBQW5DRztBQXFDSCwwQkFBTSxDQUFBLDhDQUFBLEdBQStDLEdBQUcsQ0FBQyxJQUFuRCxHQUF3RCxHQUF4RCxDQUEwRCxDQUFDO0FBckM5RDthQURmO0tBQUEsYUFBQTtRQXdDTTtRQUNGLEdBQUEsR0FBTSxvQkFBQSxJQUFnQixHQUFBLEdBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVgsR0FBc0IsQ0FBdkIsQ0FBSixHQUE4QixHQUE5QixHQUFrQyxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQTdELElBQTZFO1FBQ25GLElBQUEsQ0FBSyxNQUFNLENBQUMsSUFBUCxDQUFBLENBQUwsRUFBb0IsTUFBQSxHQUFNLENBQUMsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLEtBQU4sQ0FBWSxVQUFaLENBQWhCLENBQUQsQ0FBTixHQUFnRCxHQUFwRTtRQUNBLFdBQUEsQ0FBWSxlQUFaLEVBQTZCLENBQUMsQ0FBQyxPQUEvQixFQUF3QyxVQUF4QztBQUNBLGVBQU8sS0E1Q1g7O1dBOENBO0FBaERNOztBQWtEVixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIDAwMDAwMDAgICAwMDAwMDAwICAgMDAgICAgIDAwICAwMDAwMDAwMCAgIDAwMCAgMDAwICAgICAgMDAwMDAwMDAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgMDAwICAgICAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMCAgMDAwICAgICAgMDAwMDAwMCAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgMDAwICAgICAgIFxuIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIFxuIyMjXG5cbnsgbm9vbiwgc2xhc2gsIGtsb2csIGZzLCBfIH0gPSByZXF1aXJlICdreGsnXG5cbmtvZmZlZSA9IHJlcXVpcmUgJ2tvZmZlZSdcbnByZXR0eSA9IHJlcXVpcmUgJy4vcHJldHR5J1xua29ucmFkRXJyb3IgPSByZXF1aXJlICcuL2Vycm9yJ1xuXG5jb21waWxlID0gKHNvdXJjZVRleHQsIGV4dCwgc291cmNlRmlsZSwgdGFyZ2V0RmlsZSwgY2ZnKSAtPlxuXG4gICAgdHJ5XG4gICAgICAgIGNvbXBpbGVkID0gc3dpdGNoIGV4dFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdjb2ZmZWUnXG5cbiAgICAgICAgICAgICAgICBpZiBjZmdbZXh0XT8ubWFwXG4gICAgICAgICAgICAgICAgICAgIG1hcGNmZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6ICAgICAgICBzb3VyY2VGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXJlOiAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmxpbmVNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VSb290OiAgICAnLidcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiAgICAgIHNsYXNoLnJlbGF0aXZlIHNvdXJjZUZpbGUsIHNsYXNoLmRpciB0YXJnZXRGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWF0dXJlOiBoZWFkZXI6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZEZpbGU6IHNsYXNoLmZpbGUgdGFyZ2V0RmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGpzTWFwID0ga29mZmVlLmNvbXBpbGUgc291cmNlVGV4dCwgbWFwY2ZnXG4gICAgICAgICAgICAgICAgICAgIGpzTWFwLmpzXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBrb2ZmZWUuY29tcGlsZSBzb3VyY2VUZXh0LCBiYXJlOnRydWUsIHNvdXJjZTpzb3VyY2VGaWxlXG5cbiAgICAgICAgICAgIHdoZW4gJ3N0eWwnXG4gICAgICAgICAgICAgICAgc3R5bHVzID0gcmVxdWlyZSAnc3R5bHVzJ1xuICAgICAgICAgICAgICAgIHN0eWx1cyBzb3VyY2VUZXh0XG4gICAgICAgICAgICAgICAgICAgIC5yZW5kZXIoKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gJ3B1ZydcbiAgICAgICAgICAgICAgICBwdWcgICAgPSByZXF1aXJlICdwdWcnXG4gICAgICAgICAgICAgICAgcHVnLnJlbmRlciBzb3VyY2VUZXh0LCBwcmV0dHk6IHRydWVcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gJ2pzb24nXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbm9vbi5zdHJpbmdpZnkgSlNPTi5wYXJzZShzb3VyY2VUZXh0KSwgZXh0OiAnLicrY2ZnW2V4dF0uZXh0LCBpbmRlbnQ6ICcgICcsIG1heGFsaWduOiAxNlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnbm9vbidcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBub29uLnN0cmluZ2lmeSBub29uLnBhcnNlKHNvdXJjZVRleHQpLCBleHQ6ICcuJytjZmdbZXh0XS5leHQsIGluZGVudDogJyAgJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IFwiZG9uJ3Qga25vdyBob3cgdG8gYnVpbGQgZmlsZXMgd2l0aCBleHRuYW1lIC4je2V4dC5ib2xkfSFcIi55ZWxsb3dcblxuICAgIGNhdGNoIGVcbiAgICAgICAgcG9zID0gZS5sb2NhdGlvbj8gYW5kICc6JysoZS5sb2NhdGlvbi5maXJzdF9saW5lKzEpKyc6JytlLmxvY2F0aW9uLmZpcnN0X2NvbHVtbiBvciAnJ1xuICAgICAgICBrbG9nIHByZXR0eS50aW1lKCksIFwi8J+UuiAgI3twcmV0dHkuZmlsZVBhdGggc2xhc2gudGlsZGUgc291cmNlRmlsZX0je3Bvc31cIlxuICAgICAgICBrb25yYWRFcnJvciAnY29tcGlsZSBlcnJvcicsIGUubWVzc2FnZSwgc291cmNlRmlsZVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICBcbiAgICBjb21waWxlZFxuICAgIFxubW9kdWxlLmV4cG9ydHMgPSBjb21waWxlXG5cblxuIl19
//# sourceURL=../coffee/compile.coffee