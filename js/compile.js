// Generated by koffee 0.4.0

/*
 0000000   0000000   00     00  00000000   000  000      00000000  
000       000   000  000   000  000   000  000  000      000       
000       000   000  000000000  00000000   000  000      0000000   
000       000   000  000 0 000  000        000  000      000       
 0000000   0000000   000   000  000        000  0000000  00000000
 */
var _, compile, error, fs, konradError, log, noon, ref, slash;

ref = require('kxk'), noon = ref.noon, slash = ref.slash, error = ref.error, log = ref.log, fs = ref.fs, _ = ref._;

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
    } catch (error1) {
        e = error1;
        konradError('compile error', e, sourceFile);
        return null;
    }
    return compiled;
};

module.exports = compile;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUE7O0FBUUEsTUFBcUMsT0FBQSxDQUFRLEtBQVIsQ0FBckMsRUFBRSxlQUFGLEVBQVEsaUJBQVIsRUFBZSxpQkFBZixFQUFzQixhQUF0QixFQUEyQixXQUEzQixFQUErQjs7QUFFL0IsV0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUVkLE9BQUEsR0FBVSxTQUFDLFVBQUQsRUFBYSxHQUFiLEVBQWtCLFVBQWxCLEVBQThCLFVBQTlCLEVBQTBDLEdBQTFDO0FBRU4sUUFBQTtBQUFBO1FBQ0ksUUFBQTs7QUFBVyxvQkFBTyxHQUFQO0FBQUEscUJBRUYsUUFGRTtvQkFLSCxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7b0JBRVQsb0NBQVcsQ0FBRSxZQUFiO3dCQUNJLE1BQUEsR0FDSTs0QkFBQSxJQUFBLEVBQWUsSUFBZjs0QkFDQSxTQUFBLEVBQWUsSUFEZjs0QkFFQSxTQUFBLEVBQWUsSUFGZjs0QkFHQSxVQUFBLEVBQWUsR0FIZjs0QkFJQSxRQUFBLEVBQWUsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLEtBQUssQ0FBQyxHQUFOLENBQVUsVUFBVixDQUEzQixDQUpmOzRCQUtBLE9BQUEsRUFBUztnQ0FBQSxNQUFBLEVBQVEsSUFBUjs2QkFMVDs0QkFNQSxhQUFBLEVBQWUsS0FBSyxDQUFDLElBQU4sQ0FBVyxVQUFYLENBTmY7O3dCQVFKLEtBQUEsR0FBUSxNQUFNLENBQUMsT0FBUCxDQUFlLFVBQWYsRUFBMkIsTUFBM0I7K0JBQ1IsS0FBSyxDQUFDLEdBWFY7cUJBQUEsTUFBQTsrQkFhSSxNQUFNLENBQUMsT0FBUCxDQUFlLFVBQWYsRUFBMkI7NEJBQUEsSUFBQSxFQUFLLElBQUw7eUJBQTNCLEVBYko7O0FBTEM7QUFGRSxxQkFzQkYsTUF0QkU7b0JBd0JILE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjsyQkFDVCxNQUFBLENBQU8sVUFBUCxDQUNJLENBQUMsR0FETCxDQUNTLFVBRFQsRUFDcUIsVUFEckIsQ0FFSSxDQUFDLEdBRkwsQ0FFUyxPQUZULEVBRWtCLENBQUMsS0FBSyxDQUFDLEdBQU4sQ0FBVSxVQUFWLENBQUQsQ0FGbEIsQ0FHSSxDQUFDLE1BSEwsQ0FBQTtBQXpCRyxxQkE4QkYsS0E5QkU7b0JBZ0NILEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUjsyQkFDTixHQUFHLENBQUMsTUFBSixDQUFXLFVBQVgsRUFBdUI7d0JBQUEsTUFBQSxFQUFRLElBQVI7cUJBQXZCO0FBakNHLHFCQW1DRixNQW5DRTsyQkFxQ0gsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsS0FBTCxDQUFXLFVBQVgsQ0FBZixFQUF1Qzt3QkFBQSxHQUFBLEVBQUssR0FBQSxHQUFJLEdBQUksQ0FBQSxHQUFBLENBQUksQ0FBQyxHQUFsQjt3QkFBdUIsTUFBQSxFQUFRLElBQS9CO3dCQUFxQyxRQUFBLEVBQVUsRUFBL0M7cUJBQXZDO0FBckNHLHFCQXVDRixNQXZDRTsyQkF5Q0gsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsS0FBTCxDQUFXLFVBQVgsQ0FBZixFQUF1Qzt3QkFBQSxHQUFBLEVBQUssR0FBQSxHQUFJLEdBQUksQ0FBQSxHQUFBLENBQUksQ0FBQyxHQUFsQjt3QkFBdUIsTUFBQSxFQUFRLElBQS9CO3FCQUF2QztBQXpDRztBQTJDSCwwQkFBTSxDQUFBLDhDQUFBLEdBQStDLEdBQUcsQ0FBQyxJQUFuRCxHQUF3RCxHQUF4RCxDQUEwRCxDQUFDO0FBM0M5RDthQURmO0tBQUEsY0FBQTtRQThDTTtRQUNGLFdBQUEsQ0FBWSxlQUFaLEVBQTZCLENBQTdCLEVBQWdDLFVBQWhDO0FBQ0EsZUFBTyxLQWhEWDs7V0FrREE7QUFwRE07O0FBc0RWLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMCAgICAgMDAgIDAwMDAwMDAwICAgMDAwICAwMDAgICAgICAwMDAwMDAwMCAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgICAwMDAgICAgICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwICAwMDAgICAgICAwMDAwMDAwICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAwMDAgICAgICAgXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgXG4jIyNcblxueyBub29uLCBzbGFzaCwgZXJyb3IsIGxvZywgZnMsIF8gfSA9IHJlcXVpcmUgJ2t4aydcblxua29ucmFkRXJyb3IgPSByZXF1aXJlICcuL2Vycm9yJ1xuXG5jb21waWxlID0gKHNvdXJjZVRleHQsIGV4dCwgc291cmNlRmlsZSwgdGFyZ2V0RmlsZSwgY2ZnKSAtPlxuICAgIFxuICAgIHRyeVxuICAgICAgICBjb21waWxlZCA9IHN3aXRjaCBleHRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnY29mZmVlJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICMgY29mZmVlID0gcmVxdWlyZSAnY29mZmVlc2NyaXB0J1xuICAgICAgICAgICAgICAgIGNvZmZlZSA9IHJlcXVpcmUgJ2tvZmZlZSdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiBjZmdbZXh0XT8ubWFwXG4gICAgICAgICAgICAgICAgICAgIG1hcGNmZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXJlOiAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmxpbmVNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VSb290OiAgICAnLidcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiAgICAgIHNsYXNoLnJlbGF0aXZlIHNvdXJjZUZpbGUsIHNsYXNoLmRpciB0YXJnZXRGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWF0dXJlOiBoZWFkZXI6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZEZpbGU6IHNsYXNoLmZpbGUgdGFyZ2V0RmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGpzTWFwID0gY29mZmVlLmNvbXBpbGUgc291cmNlVGV4dCwgbWFwY2ZnXG4gICAgICAgICAgICAgICAgICAgIGpzTWFwLmpzXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjb2ZmZWUuY29tcGlsZSBzb3VyY2VUZXh0LCBiYXJlOnRydWVcblxuICAgICAgICAgICAgd2hlbiAnc3R5bCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzdHlsdXMgPSByZXF1aXJlICdzdHlsdXMnXG4gICAgICAgICAgICAgICAgc3R5bHVzIHNvdXJjZVRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldCAnZmlsZW5hbWUnLCBzb3VyY2VGaWxlXG4gICAgICAgICAgICAgICAgICAgIC5zZXQgJ3BhdGhzJywgW3NsYXNoLmRpciBzb3VyY2VGaWxlXVxuICAgICAgICAgICAgICAgICAgICAucmVuZGVyKClcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdwdWcnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcHVnID0gcmVxdWlyZSAncHVnJ1xuICAgICAgICAgICAgICAgIHB1Zy5yZW5kZXIgc291cmNlVGV4dCwgcHJldHR5OiB0cnVlXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdqc29uJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIG5vb24uc3RyaW5naWZ5IEpTT04ucGFyc2Uoc291cmNlVGV4dCksIGV4dDogJy4nK2NmZ1tleHRdLmV4dCwgaW5kZW50OiAnICAnLCBtYXhhbGlnbjogMTZcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gJ25vb24nXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbm9vbi5zdHJpbmdpZnkgbm9vbi5wYXJzZShzb3VyY2VUZXh0KSwgZXh0OiAnLicrY2ZnW2V4dF0uZXh0LCBpbmRlbnQ6ICcgICdcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBcImRvbid0IGtub3cgaG93IHRvIGJ1aWxkIGZpbGVzIHdpdGggZXh0bmFtZSAuI3tleHQuYm9sZH0hXCIueWVsbG93XG5cbiAgICBjYXRjaCBlXG4gICAgICAgIGtvbnJhZEVycm9yICdjb21waWxlIGVycm9yJywgZSwgc291cmNlRmlsZVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICBcbiAgICBjb21waWxlZFxuICAgIFxubW9kdWxlLmV4cG9ydHMgPSBjb21waWxlXG5cblxuIl19
//# sourceURL=../coffee/compile.coffee