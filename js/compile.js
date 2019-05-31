// koffee 0.50.0

/*
 0000000   0000000   00     00  00000000   000  000      00000000  
000       000   000  000   000  000   000  000  000      000       
000       000   000  000000000  00000000   000  000      0000000   
000       000   000  000 0 000  000        000  000      000       
 0000000   0000000   000   000  000        000  0000000  00000000
 */
var _, compile, fs, klog, koffee, konradError, noon, ref, slash;

ref = require('kxk'), noon = ref.noon, slash = ref.slash, klog = ref.klog, fs = ref.fs, _ = ref._;

koffee = require('koffee');

konradError = require('./error');

compile = function(sourceText, ext, sourceFile, targetFile, cfg) {
    var compiled, e, jsMap, mapcfg, pug, stylus;
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
        konradError('compile error', e.message, sourceFile);
        return null;
    }
    return compiled;
};

module.exports = compile;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUE7O0FBUUEsTUFBK0IsT0FBQSxDQUFRLEtBQVIsQ0FBL0IsRUFBRSxlQUFGLEVBQVEsaUJBQVIsRUFBZSxlQUFmLEVBQXFCLFdBQXJCLEVBQXlCOztBQUV6QixNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0FBQ1QsV0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUVkLE9BQUEsR0FBVSxTQUFDLFVBQUQsRUFBYSxHQUFiLEVBQWtCLFVBQWxCLEVBQThCLFVBQTlCLEVBQTBDLEdBQTFDO0FBRU4sUUFBQTtBQUFBO1FBQ0ksUUFBQTs7QUFBVyxvQkFBTyxHQUFQO0FBQUEscUJBRUYsUUFGRTtvQkFJSCxvQ0FBVyxDQUFFLFlBQWI7d0JBQ0ksTUFBQSxHQUNJOzRCQUFBLE1BQUEsRUFBZSxVQUFmOzRCQUNBLElBQUEsRUFBZSxJQURmOzRCQUVBLFNBQUEsRUFBZSxJQUZmOzRCQUdBLFNBQUEsRUFBZSxJQUhmOzRCQUlBLFVBQUEsRUFBZSxHQUpmOzRCQUtBLFFBQUEsRUFBZSxLQUFLLENBQUMsUUFBTixDQUFlLFVBQWYsRUFBMkIsS0FBSyxDQUFDLEdBQU4sQ0FBVSxVQUFWLENBQTNCLENBTGY7NEJBTUEsT0FBQSxFQUFTO2dDQUFBLE1BQUEsRUFBUSxJQUFSOzZCQU5UOzRCQU9BLGFBQUEsRUFBZSxLQUFLLENBQUMsSUFBTixDQUFXLFVBQVgsQ0FQZjs7d0JBU0osS0FBQSxHQUFRLE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZixFQUEyQixNQUEzQjsrQkFDUixLQUFLLENBQUMsR0FaVjtxQkFBQSxNQUFBOytCQWNJLE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZixFQUEyQjs0QkFBQSxJQUFBLEVBQUssSUFBTDs0QkFBVyxNQUFBLEVBQU8sVUFBbEI7eUJBQTNCLEVBZEo7O0FBRkM7QUFGRSxxQkFvQkYsTUFwQkU7b0JBcUJILE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjsyQkFDVCxNQUFBLENBQU8sVUFBUCxDQUNJLENBQUMsTUFETCxDQUFBO0FBdEJHLHFCQXlCRixLQXpCRTtvQkEwQkgsR0FBQSxHQUFTLE9BQUEsQ0FBUSxLQUFSOzJCQUNULEdBQUcsQ0FBQyxNQUFKLENBQVcsVUFBWCxFQUF1Qjt3QkFBQSxNQUFBLEVBQVEsSUFBUjtxQkFBdkI7QUEzQkcscUJBNkJGLE1BN0JFOzJCQStCSCxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsVUFBWCxDQUFmLEVBQXVDO3dCQUFBLEdBQUEsRUFBSyxHQUFBLEdBQUksR0FBSSxDQUFBLEdBQUEsQ0FBSSxDQUFDLEdBQWxCO3dCQUF1QixNQUFBLEVBQVEsSUFBL0I7d0JBQXFDLFFBQUEsRUFBVSxFQUEvQztxQkFBdkM7QUEvQkcscUJBaUNGLE1BakNFOzJCQW1DSCxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsVUFBWCxDQUFmLEVBQXVDO3dCQUFBLEdBQUEsRUFBSyxHQUFBLEdBQUksR0FBSSxDQUFBLEdBQUEsQ0FBSSxDQUFDLEdBQWxCO3dCQUF1QixNQUFBLEVBQVEsSUFBL0I7cUJBQXZDO0FBbkNHO0FBcUNILDBCQUFNLENBQUEsOENBQUEsR0FBK0MsR0FBRyxDQUFDLElBQW5ELEdBQXdELEdBQXhELENBQTBELENBQUM7QUFyQzlEO2FBRGY7S0FBQSxhQUFBO1FBd0NNO1FBRUYsV0FBQSxDQUFZLGVBQVosRUFBNkIsQ0FBQyxDQUFDLE9BQS9CLEVBQXdDLFVBQXhDO0FBQ0EsZUFBTyxLQTNDWDs7V0E2Q0E7QUEvQ007O0FBaURWLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMCAgICAgMDAgIDAwMDAwMDAwICAgMDAwICAwMDAgICAgICAwMDAwMDAwMCAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgICAwMDAgICAgICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwICAwMDAgICAgICAwMDAwMDAwICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAwMDAgICAgICAgXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgXG4jIyNcblxueyBub29uLCBzbGFzaCwga2xvZywgZnMsIF8gfSA9IHJlcXVpcmUgJ2t4aydcblxua29mZmVlID0gcmVxdWlyZSAna29mZmVlJ1xua29ucmFkRXJyb3IgPSByZXF1aXJlICcuL2Vycm9yJ1xuXG5jb21waWxlID0gKHNvdXJjZVRleHQsIGV4dCwgc291cmNlRmlsZSwgdGFyZ2V0RmlsZSwgY2ZnKSAtPlxuXG4gICAgdHJ5XG4gICAgICAgIGNvbXBpbGVkID0gc3dpdGNoIGV4dFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdjb2ZmZWUnXG5cbiAgICAgICAgICAgICAgICBpZiBjZmdbZXh0XT8ubWFwXG4gICAgICAgICAgICAgICAgICAgIG1hcGNmZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6ICAgICAgICBzb3VyY2VGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXJlOiAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmxpbmVNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VSb290OiAgICAnLidcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiAgICAgIHNsYXNoLnJlbGF0aXZlIHNvdXJjZUZpbGUsIHNsYXNoLmRpciB0YXJnZXRGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWF0dXJlOiBoZWFkZXI6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZEZpbGU6IHNsYXNoLmZpbGUgdGFyZ2V0RmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGpzTWFwID0ga29mZmVlLmNvbXBpbGUgc291cmNlVGV4dCwgbWFwY2ZnXG4gICAgICAgICAgICAgICAgICAgIGpzTWFwLmpzXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBrb2ZmZWUuY29tcGlsZSBzb3VyY2VUZXh0LCBiYXJlOnRydWUsIHNvdXJjZTpzb3VyY2VGaWxlXG5cbiAgICAgICAgICAgIHdoZW4gJ3N0eWwnXG4gICAgICAgICAgICAgICAgc3R5bHVzID0gcmVxdWlyZSAnc3R5bHVzJ1xuICAgICAgICAgICAgICAgIHN0eWx1cyBzb3VyY2VUZXh0XG4gICAgICAgICAgICAgICAgICAgIC5yZW5kZXIoKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gJ3B1ZydcbiAgICAgICAgICAgICAgICBwdWcgICAgPSByZXF1aXJlICdwdWcnXG4gICAgICAgICAgICAgICAgcHVnLnJlbmRlciBzb3VyY2VUZXh0LCBwcmV0dHk6IHRydWVcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gJ2pzb24nXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbm9vbi5zdHJpbmdpZnkgSlNPTi5wYXJzZShzb3VyY2VUZXh0KSwgZXh0OiAnLicrY2ZnW2V4dF0uZXh0LCBpbmRlbnQ6ICcgICcsIG1heGFsaWduOiAxNlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnbm9vbidcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBub29uLnN0cmluZ2lmeSBub29uLnBhcnNlKHNvdXJjZVRleHQpLCBleHQ6ICcuJytjZmdbZXh0XS5leHQsIGluZGVudDogJyAgJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IFwiZG9uJ3Qga25vdyBob3cgdG8gYnVpbGQgZmlsZXMgd2l0aCBleHRuYW1lIC4je2V4dC5ib2xkfSFcIi55ZWxsb3dcblxuICAgIGNhdGNoIGVcbiAgICAgICAgXG4gICAgICAgIGtvbnJhZEVycm9yICdjb21waWxlIGVycm9yJywgZS5tZXNzYWdlLCBzb3VyY2VGaWxlXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIFxuICAgIGNvbXBpbGVkXG4gICAgXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBpbGVcblxuXG4iXX0=
//# sourceURL=../coffee/compile.coffee