// koffee 1.7.0

/*
 0000000   0000000   00     00  00000000   000  000      00000000  
000       000   000  000   000  000   000  000  000      000       
000       000   000  000000000  00000000   000  000      0000000   
000       000   000  000 0 000  000        000  000      000       
 0000000   0000000   000   000  000        000  0000000  00000000
 */
var compile, klog, koffee, konradError, noon, pretty, ref, slash;

ref = require('kxk'), klog = ref.klog, noon = ref.noon, slash = ref.slash;

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
                            filename: slash.relative(sourceFile, slash.dir(targetFile)),
                            generatedFile: targetFile,
                            feature: {
                                header: true
                            }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUE7O0FBUUEsTUFBd0IsT0FBQSxDQUFRLEtBQVIsQ0FBeEIsRUFBRSxlQUFGLEVBQVEsZUFBUixFQUFjOztBQUVkLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsV0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUVkLE9BQUEsR0FBVSxTQUFDLFVBQUQsRUFBYSxHQUFiLEVBQWtCLFVBQWxCLEVBQThCLFVBQTlCLEVBQTBDLEdBQTFDO0FBRU4sUUFBQTtBQUFBO1FBQ0ksUUFBQTs7QUFBVyxvQkFBTyxHQUFQO0FBQUEscUJBRUYsUUFGRTtvQkFJSCxvQ0FBVyxDQUFFLFlBQWI7d0JBQ0ksTUFBQSxHQUNJOzRCQUFBLE1BQUEsRUFBZSxVQUFmOzRCQUNBLElBQUEsRUFBZSxJQURmOzRCQUVBLFNBQUEsRUFBZSxJQUZmOzRCQUdBLFNBQUEsRUFBZSxJQUhmOzRCQUlBLFFBQUEsRUFBZSxLQUFLLENBQUMsUUFBTixDQUFlLFVBQWYsRUFBMkIsS0FBSyxDQUFDLEdBQU4sQ0FBVSxVQUFWLENBQTNCLENBSmY7NEJBS0EsYUFBQSxFQUFlLFVBTGY7NEJBTUEsT0FBQSxFQUFTO2dDQUFBLE1BQUEsRUFBUSxJQUFSOzZCQU5UOzt3QkFRSixLQUFBLEdBQVEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxVQUFmLEVBQTJCLE1BQTNCOytCQUNSLEtBQUssQ0FBQyxHQVhWO3FCQUFBLE1BQUE7K0JBYUksTUFBTSxDQUFDLE9BQVAsQ0FBZSxVQUFmLEVBQTJCOzRCQUFBLElBQUEsRUFBSyxJQUFMOzRCQUFXLE1BQUEsRUFBTyxVQUFsQjt5QkFBM0IsRUFiSjs7QUFGQztBQUZFLHFCQW1CRixNQW5CRTtvQkFvQkgsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOzJCQUNULE1BQUEsQ0FBTyxVQUFQLENBQ0ksQ0FBQyxNQURMLENBQUE7QUFyQkcscUJBd0JGLEtBeEJFO29CQXlCSCxHQUFBLEdBQVMsT0FBQSxDQUFRLEtBQVI7MkJBQ1QsR0FBRyxDQUFDLE1BQUosQ0FBVyxVQUFYLEVBQXVCO3dCQUFBLE1BQUEsRUFBUSxJQUFSO3FCQUF2QjtBQTFCRyxxQkE0QkYsTUE1QkU7MkJBOEJILElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxVQUFYLENBQWYsRUFBdUM7d0JBQUEsR0FBQSxFQUFLLEdBQUEsR0FBSSxHQUFJLENBQUEsR0FBQSxDQUFJLENBQUMsR0FBbEI7d0JBQXVCLE1BQUEsRUFBUSxJQUEvQjt3QkFBcUMsUUFBQSxFQUFVLEVBQS9DO3FCQUF2QztBQTlCRyxxQkFnQ0YsTUFoQ0U7MkJBa0NILElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxVQUFYLENBQWYsRUFBdUM7d0JBQUEsR0FBQSxFQUFLLEdBQUEsR0FBSSxHQUFJLENBQUEsR0FBQSxDQUFJLENBQUMsR0FBbEI7d0JBQXVCLE1BQUEsRUFBUSxJQUEvQjtxQkFBdkM7QUFsQ0c7QUFvQ0gsMEJBQU0sQ0FBQSw4Q0FBQSxHQUErQyxHQUFHLENBQUMsSUFBbkQsR0FBd0QsR0FBeEQsQ0FBMEQsQ0FBQztBQXBDOUQ7YUFEZjtLQUFBLGFBQUE7UUF1Q007UUFDRixHQUFBLEdBQU0sb0JBQUEsSUFBZ0IsR0FBQSxHQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFYLEdBQXNCLENBQXZCLENBQUosR0FBOEIsR0FBOUIsR0FBa0MsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUE3RCxJQUE2RTtRQUNuRixJQUFBLENBQUssTUFBTSxDQUFDLElBQVAsQ0FBQSxDQUFMLEVBQW9CLE1BQUEsR0FBTSxDQUFDLE1BQU0sQ0FBQyxRQUFQLENBQWdCLEtBQUssQ0FBQyxLQUFOLENBQVksVUFBWixDQUFoQixDQUFELENBQU4sR0FBZ0QsR0FBcEU7UUFDQSxXQUFBLENBQVksZUFBWixFQUE2QixDQUFDLENBQUMsT0FBL0IsRUFBd0MsVUFBeEM7QUFDQSxlQUFPLEtBM0NYOztXQTZDQTtBQS9DTTs7QUFpRFYsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbiAwMDAwMDAwICAgMDAwMDAwMCAgIDAwICAgICAwMCAgMDAwMDAwMDAgICAwMDAgIDAwMCAgICAgIDAwMDAwMDAwICBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgIDAwMCAgICAgICBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAgIDAwMCAgICAgIDAwMDAwMDAgICBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICAgICAwMDAgIDAwMCAgICAgIDAwMCAgICAgICBcbiAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICBcbiMjI1xuXG57IGtsb2csIG5vb24sIHNsYXNoIH0gPSByZXF1aXJlICdreGsnXG5cbmtvZmZlZSA9IHJlcXVpcmUgJ2tvZmZlZSdcbnByZXR0eSA9IHJlcXVpcmUgJy4vcHJldHR5J1xua29ucmFkRXJyb3IgPSByZXF1aXJlICcuL2Vycm9yJ1xuXG5jb21waWxlID0gKHNvdXJjZVRleHQsIGV4dCwgc291cmNlRmlsZSwgdGFyZ2V0RmlsZSwgY2ZnKSAtPlxuXG4gICAgdHJ5XG4gICAgICAgIGNvbXBpbGVkID0gc3dpdGNoIGV4dFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdjb2ZmZWUnXG5cbiAgICAgICAgICAgICAgICBpZiBjZmdbZXh0XT8ubWFwXG4gICAgICAgICAgICAgICAgICAgIG1hcGNmZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6ICAgICAgICBzb3VyY2VGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXJlOiAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmxpbmVNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogICAgICBzbGFzaC5yZWxhdGl2ZSBzb3VyY2VGaWxlLCBzbGFzaC5kaXIgdGFyZ2V0RmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkRmlsZTogdGFyZ2V0RmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgZmVhdHVyZTogaGVhZGVyOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAganNNYXAgPSBrb2ZmZWUuY29tcGlsZSBzb3VyY2VUZXh0LCBtYXBjZmdcbiAgICAgICAgICAgICAgICAgICAganNNYXAuanNcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGtvZmZlZS5jb21waWxlIHNvdXJjZVRleHQsIGJhcmU6dHJ1ZSwgc291cmNlOnNvdXJjZUZpbGVcblxuICAgICAgICAgICAgd2hlbiAnc3R5bCdcbiAgICAgICAgICAgICAgICBzdHlsdXMgPSByZXF1aXJlICdzdHlsdXMnXG4gICAgICAgICAgICAgICAgc3R5bHVzIHNvdXJjZVRleHRcbiAgICAgICAgICAgICAgICAgICAgLnJlbmRlcigpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAncHVnJ1xuICAgICAgICAgICAgICAgIHB1ZyAgICA9IHJlcXVpcmUgJ3B1ZydcbiAgICAgICAgICAgICAgICBwdWcucmVuZGVyIHNvdXJjZVRleHQsIHByZXR0eTogdHJ1ZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnanNvbidcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBub29uLnN0cmluZ2lmeSBKU09OLnBhcnNlKHNvdXJjZVRleHQpLCBleHQ6ICcuJytjZmdbZXh0XS5leHQsIGluZGVudDogJyAgJywgbWF4YWxpZ246IDE2XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdub29uJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIG5vb24uc3RyaW5naWZ5IG5vb24ucGFyc2Uoc291cmNlVGV4dCksIGV4dDogJy4nK2NmZ1tleHRdLmV4dCwgaW5kZW50OiAnICAnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJkb24ndCBrbm93IGhvdyB0byBidWlsZCBmaWxlcyB3aXRoIGV4dG5hbWUgLiN7ZXh0LmJvbGR9IVwiLnllbGxvd1xuXG4gICAgY2F0Y2ggZVxuICAgICAgICBwb3MgPSBlLmxvY2F0aW9uPyBhbmQgJzonKyhlLmxvY2F0aW9uLmZpcnN0X2xpbmUrMSkrJzonK2UubG9jYXRpb24uZmlyc3RfY29sdW1uIG9yICcnXG4gICAgICAgIGtsb2cgcHJldHR5LnRpbWUoKSwgXCLwn5S6ICAje3ByZXR0eS5maWxlUGF0aCBzbGFzaC50aWxkZSBzb3VyY2VGaWxlfSN7cG9zfVwiXG4gICAgICAgIGtvbnJhZEVycm9yICdjb21waWxlIGVycm9yJywgZS5tZXNzYWdlLCBzb3VyY2VGaWxlXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIFxuICAgIGNvbXBpbGVkXG4gICAgXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBpbGVcblxuXG4iXX0=
//# sourceURL=../coffee/compile.coffee