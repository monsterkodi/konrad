// koffee 1.20.0

/*
 0000000   0000000   00     00  00000000   000  000      00000000  
000       000   000  000   000  000   000  000  000      000       
000       000   000  000000000  00000000   000  000      0000000   
000       000   000  000 0 000  000        000  000      000       
 0000000   0000000   000   000  000        000  0000000  00000000
 */
var compile, klog, kode, koffee, kolor, konradError, noon, pretty, ref, slash;

ref = require('kxk'), klog = ref.klog, kolor = ref.kolor, noon = ref.noon, slash = ref.slash;

koffee = require('koffee');

kode = require('kode');

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
                            filename: slash.relative(sourceFile, slash.dir(targetFile)),
                            generatedFile: targetFile,
                            metalog: 'klog',
                            feature: {
                                header: true
                            }
                        };
                        jsMap = koffee.compile(sourceText, mapcfg);
                        return jsMap.js;
                    } else {
                        return koffee.compile(sourceText, {
                            bare: true,
                            source: sourceFile,
                            metalog: 'log'
                        });
                    }
                    break;
                case 'kode':
                    return kode.compile(sourceText, {
                        header: true
                    });
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
                    console.log('noon.parse', sourceText);
                    return noon.stringify(noon.parse(sourceText), {
                        ext: '.' + cfg[ext].ext,
                        indent: '  '
                    });
                default:
                    throw kolor.yellow("don't know how to build files with extname ." + (kolor.bold(ext)) + "!");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb2ZmZWUiLCJzb3VyY2VzIjpbImNvbXBpbGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLE1BQStCLE9BQUEsQ0FBUSxLQUFSLENBQS9CLEVBQUUsZUFBRixFQUFRLGlCQUFSLEVBQWUsZUFBZixFQUFxQjs7QUFFckIsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOztBQUNULElBQUEsR0FBUyxPQUFBLENBQVEsTUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsV0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUVkLE9BQUEsR0FBVSxTQUFDLFVBQUQsRUFBYSxHQUFiLEVBQWtCLFVBQWxCLEVBQThCLFVBQTlCLEVBQTBDLEdBQTFDO0FBRU4sUUFBQTtBQUFBO1FBQ0ksUUFBQTs7QUFBVyxvQkFBTyxHQUFQO0FBQUEscUJBRUYsUUFGRTtvQkFJSCxvQ0FBVyxDQUFFLFlBQWI7d0JBQ0ksTUFBQSxHQUNJOzRCQUFBLE1BQUEsRUFBZSxVQUFmOzRCQUNBLElBQUEsRUFBZSxJQURmOzRCQUVBLFNBQUEsRUFBZSxJQUZmOzRCQUdBLFNBQUEsRUFBZSxJQUhmOzRCQUlBLFFBQUEsRUFBZSxLQUFLLENBQUMsUUFBTixDQUFlLFVBQWYsRUFBMkIsS0FBSyxDQUFDLEdBQU4sQ0FBVSxVQUFWLENBQTNCLENBSmY7NEJBS0EsYUFBQSxFQUFlLFVBTGY7NEJBTUEsT0FBQSxFQUFlLE1BTmY7NEJBT0EsT0FBQSxFQUFTO2dDQUFBLE1BQUEsRUFBUSxJQUFSOzZCQVBUOzt3QkFTSixLQUFBLEdBQVEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxVQUFmLEVBQTJCLE1BQTNCOytCQUNSLEtBQUssQ0FBQyxHQVpWO3FCQUFBLE1BQUE7K0JBY0ksTUFBTSxDQUFDLE9BQVAsQ0FBZSxVQUFmLEVBQTJCOzRCQUFBLElBQUEsRUFBSyxJQUFMOzRCQUFXLE1BQUEsRUFBTyxVQUFsQjs0QkFBOEIsT0FBQSxFQUFRLEtBQXRDO3lCQUEzQixFQWRKOztBQUZDO0FBRkUscUJBb0JGLE1BcEJFOzJCQXNCSCxJQUFJLENBQUMsT0FBTCxDQUFhLFVBQWIsRUFBeUI7d0JBQUEsTUFBQSxFQUFPLElBQVA7cUJBQXpCO0FBdEJHLHFCQXdCRixNQXhCRTtvQkF5QkgsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOzJCQUNULE1BQUEsQ0FBTyxVQUFQLENBQ0ksQ0FBQyxNQURMLENBQUE7QUExQkcscUJBNkJGLEtBN0JFO29CQThCSCxHQUFBLEdBQVMsT0FBQSxDQUFRLEtBQVI7MkJBQ1QsR0FBRyxDQUFDLE1BQUosQ0FBVyxVQUFYLEVBQXVCO3dCQUFBLE1BQUEsRUFBUSxJQUFSO3FCQUF2QjtBQS9CRyxxQkFpQ0YsTUFqQ0U7MkJBbUNILElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxVQUFYLENBQWYsRUFBdUM7d0JBQUEsR0FBQSxFQUFLLEdBQUEsR0FBSSxHQUFJLENBQUEsR0FBQSxDQUFJLENBQUMsR0FBbEI7d0JBQXVCLE1BQUEsRUFBTyxJQUE5Qjt3QkFBbUMsUUFBQSxFQUFVLEVBQTdDO3FCQUF2QztBQW5DRyxxQkFxQ0YsTUFyQ0U7b0JBc0NKLE9BQUEsQ0FBQyxHQUFELENBQUssWUFBTCxFQUFrQixVQUFsQjsyQkFDQyxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsVUFBWCxDQUFmLEVBQXVDO3dCQUFBLEdBQUEsRUFBSyxHQUFBLEdBQUksR0FBSSxDQUFBLEdBQUEsQ0FBSSxDQUFDLEdBQWxCO3dCQUF1QixNQUFBLEVBQVEsSUFBL0I7cUJBQXZDO0FBdkNHO0FBeUNILDBCQUFNLEtBQUssQ0FBQyxNQUFOLENBQWEsOENBQUEsR0FBOEMsQ0FBQyxLQUFLLENBQUMsSUFBTixDQUFXLEdBQVgsQ0FBRCxDQUE5QyxHQUErRCxHQUE1RTtBQXpDSDthQURmO0tBQUEsYUFBQTtRQTRDTTtRQUNGLEdBQUEsR0FBTSxvQkFBQSxJQUFnQixHQUFBLEdBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVgsR0FBc0IsQ0FBdkIsQ0FBSixHQUE4QixHQUE5QixHQUFrQyxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQTdELElBQTZFO1FBQ25GLElBQUEsQ0FBSyxNQUFNLENBQUMsSUFBUCxDQUFBLENBQUwsRUFBb0IsTUFBQSxHQUFNLENBQUMsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLEtBQU4sQ0FBWSxVQUFaLENBQWhCLENBQUQsQ0FBTixHQUFnRCxHQUFwRTtRQUNBLFdBQUEsQ0FBWSxlQUFaLEVBQTRCLENBQUMsQ0FBQyxPQUE5QixFQUF1QyxVQUF2QztBQUNBLGVBQU8sS0FoRFg7O1dBa0RBO0FBcERNOztBQXNEVixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIDAwMDAwMDAgICAwMDAwMDAwICAgMDAgICAgIDAwICAwMDAwMDAwMCAgIDAwMCAgMDAwICAgICAgMDAwMDAwMDAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgMDAwICAgICAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMCAgMDAwICAgICAgMDAwMDAwMCAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgMDAwICAgICAgIFxuIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIFxuIyMjXG5cbnsga2xvZywga29sb3IsIG5vb24sIHNsYXNoIH0gPSByZXF1aXJlICdreGsnXG5cbmtvZmZlZSA9IHJlcXVpcmUgJ2tvZmZlZSdcbmtvZGUgICA9IHJlcXVpcmUgJ2tvZGUnXG5wcmV0dHkgPSByZXF1aXJlICcuL3ByZXR0eSdcbmtvbnJhZEVycm9yID0gcmVxdWlyZSAnLi9lcnJvcidcblxuY29tcGlsZSA9IChzb3VyY2VUZXh0LCBleHQsIHNvdXJjZUZpbGUsIHRhcmdldEZpbGUsIGNmZykgLT5cblxuICAgIHRyeVxuICAgICAgICBjb21waWxlZCA9IHN3aXRjaCBleHRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnY29mZmVlJ1xuXG4gICAgICAgICAgICAgICAgaWYgY2ZnW2V4dF0/Lm1hcFxuICAgICAgICAgICAgICAgICAgICBtYXBjZmcgPVxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiAgICAgICAgc291cmNlRmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgYmFyZTogICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlTWFwOiAgICAgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5saW5lTWFwOiAgICAgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6ICAgICAgc2xhc2gucmVsYXRpdmUgc291cmNlRmlsZSwgc2xhc2guZGlyIHRhcmdldEZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZEZpbGU6IHRhcmdldEZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFsb2c6ICAgICAgICdrbG9nJ1xuICAgICAgICAgICAgICAgICAgICAgICAgZmVhdHVyZTogaGVhZGVyOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAganNNYXAgPSBrb2ZmZWUuY29tcGlsZSBzb3VyY2VUZXh0LCBtYXBjZmdcbiAgICAgICAgICAgICAgICAgICAganNNYXAuanNcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGtvZmZlZS5jb21waWxlIHNvdXJjZVRleHQsIGJhcmU6dHJ1ZSwgc291cmNlOnNvdXJjZUZpbGUsIG1ldGFsb2c6J2xvZydcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdrb2RlJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGtvZGUuY29tcGlsZSBzb3VyY2VUZXh0LCBoZWFkZXI6dHJ1ZVxuXG4gICAgICAgICAgICB3aGVuICdzdHlsJ1xuICAgICAgICAgICAgICAgIHN0eWx1cyA9IHJlcXVpcmUgJ3N0eWx1cydcbiAgICAgICAgICAgICAgICBzdHlsdXMgc291cmNlVGV4dFxuICAgICAgICAgICAgICAgICAgICAucmVuZGVyKClcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdwdWcnXG4gICAgICAgICAgICAgICAgcHVnICAgID0gcmVxdWlyZSAncHVnJ1xuICAgICAgICAgICAgICAgIHB1Zy5yZW5kZXIgc291cmNlVGV4dCwgcHJldHR5OiB0cnVlXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdqc29uJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIG5vb24uc3RyaW5naWZ5IEpTT04ucGFyc2Uoc291cmNlVGV4dCksIGV4dDogJy4nK2NmZ1tleHRdLmV4dCwgaW5kZW50OicgICcgbWF4YWxpZ246IDE2XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdub29uJ1xuICAgICAgICAgICAgICAgIGxvZyAnbm9vbi5wYXJzZScgc291cmNlVGV4dFxuICAgICAgICAgICAgICAgIG5vb24uc3RyaW5naWZ5IG5vb24ucGFyc2Uoc291cmNlVGV4dCksIGV4dDogJy4nK2NmZ1tleHRdLmV4dCwgaW5kZW50OiAnICAnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhyb3cga29sb3IueWVsbG93KFwiZG9uJ3Qga25vdyBob3cgdG8gYnVpbGQgZmlsZXMgd2l0aCBleHRuYW1lIC4je2tvbG9yLmJvbGQoZXh0KX0hXCIpXG5cbiAgICBjYXRjaCBlXG4gICAgICAgIHBvcyA9IGUubG9jYXRpb24/IGFuZCAnOicrKGUubG9jYXRpb24uZmlyc3RfbGluZSsxKSsnOicrZS5sb2NhdGlvbi5maXJzdF9jb2x1bW4gb3IgJydcbiAgICAgICAga2xvZyBwcmV0dHkudGltZSgpLCBcIvCflLogICN7cHJldHR5LmZpbGVQYXRoIHNsYXNoLnRpbGRlIHNvdXJjZUZpbGV9I3twb3N9XCJcbiAgICAgICAga29ucmFkRXJyb3IgJ2NvbXBpbGUgZXJyb3InIGUubWVzc2FnZSwgc291cmNlRmlsZVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICBcbiAgICBjb21waWxlZFxuICAgIFxubW9kdWxlLmV4cG9ydHMgPSBjb21waWxlXG5cblxuIl19
//# sourceURL=../coffee/compile.coffee