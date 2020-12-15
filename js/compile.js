// koffee 1.14.0

/*
 0000000   0000000   00     00  00000000   000  000      00000000  
000       000   000  000   000  000   000  000  000      000       
000       000   000  000000000  00000000   000  000      0000000   
000       000   000  000 0 000  000        000  000      000       
 0000000   0000000   000   000  000        000  0000000  00000000
 */
var compile, klog, koffee, kolor, konradError, noon, pretty, ref, slash;

ref = require('kxk'), klog = ref.klog, kolor = ref.kolor, noon = ref.noon, slash = ref.slash;

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
                            metalog: 'klog'
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb2ZmZWUiLCJzb3VyY2VzIjpbImNvbXBpbGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLE1BQStCLE9BQUEsQ0FBUSxLQUFSLENBQS9CLEVBQUUsZUFBRixFQUFRLGlCQUFSLEVBQWUsZUFBZixFQUFxQjs7QUFFckIsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxXQUFBLEdBQWMsT0FBQSxDQUFRLFNBQVI7O0FBRWQsT0FBQSxHQUFVLFNBQUMsVUFBRCxFQUFhLEdBQWIsRUFBa0IsVUFBbEIsRUFBOEIsVUFBOUIsRUFBMEMsR0FBMUM7QUFFTixRQUFBO0FBQUE7UUFDSSxRQUFBOztBQUFXLG9CQUFPLEdBQVA7QUFBQSxxQkFFRixRQUZFO29CQUlILG9DQUFXLENBQUUsWUFBYjt3QkFDSSxNQUFBLEdBQ0k7NEJBQUEsTUFBQSxFQUFlLFVBQWY7NEJBQ0EsSUFBQSxFQUFlLElBRGY7NEJBRUEsU0FBQSxFQUFlLElBRmY7NEJBR0EsU0FBQSxFQUFlLElBSGY7NEJBSUEsUUFBQSxFQUFlLEtBQUssQ0FBQyxRQUFOLENBQWUsVUFBZixFQUEyQixLQUFLLENBQUMsR0FBTixDQUFVLFVBQVYsQ0FBM0IsQ0FKZjs0QkFLQSxhQUFBLEVBQWUsVUFMZjs0QkFNQSxPQUFBLEVBQWUsTUFOZjs0QkFPQSxPQUFBLEVBQVM7Z0NBQUEsTUFBQSxFQUFRLElBQVI7NkJBUFQ7O3dCQVNKLEtBQUEsR0FBUSxNQUFNLENBQUMsT0FBUCxDQUFlLFVBQWYsRUFBMkIsTUFBM0I7K0JBQ1IsS0FBSyxDQUFDLEdBWlY7cUJBQUEsTUFBQTsrQkFjSSxNQUFNLENBQUMsT0FBUCxDQUFlLFVBQWYsRUFBMkI7NEJBQUEsSUFBQSxFQUFLLElBQUw7NEJBQVcsTUFBQSxFQUFPLFVBQWxCOzRCQUE4QixPQUFBLEVBQVEsTUFBdEM7eUJBQTNCLEVBZEo7O0FBRkM7QUFGRSxxQkFvQkYsTUFwQkU7b0JBcUJILE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjsyQkFDVCxNQUFBLENBQU8sVUFBUCxDQUNJLENBQUMsTUFETCxDQUFBO0FBdEJHLHFCQXlCRixLQXpCRTtvQkEwQkgsR0FBQSxHQUFTLE9BQUEsQ0FBUSxLQUFSOzJCQUNULEdBQUcsQ0FBQyxNQUFKLENBQVcsVUFBWCxFQUF1Qjt3QkFBQSxNQUFBLEVBQVEsSUFBUjtxQkFBdkI7QUEzQkcscUJBNkJGLE1BN0JFOzJCQStCSCxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsVUFBWCxDQUFmLEVBQXVDO3dCQUFBLEdBQUEsRUFBSyxHQUFBLEdBQUksR0FBSSxDQUFBLEdBQUEsQ0FBSSxDQUFDLEdBQWxCO3dCQUF1QixNQUFBLEVBQU8sSUFBOUI7d0JBQW1DLFFBQUEsRUFBVSxFQUE3QztxQkFBdkM7QUEvQkcscUJBaUNGLE1BakNFOzJCQW1DSCxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsVUFBWCxDQUFmLEVBQXVDO3dCQUFBLEdBQUEsRUFBSyxHQUFBLEdBQUksR0FBSSxDQUFBLEdBQUEsQ0FBSSxDQUFDLEdBQWxCO3dCQUF1QixNQUFBLEVBQVEsSUFBL0I7cUJBQXZDO0FBbkNHO0FBcUNILDBCQUFNLEtBQUssQ0FBQyxNQUFOLENBQWEsOENBQUEsR0FBOEMsQ0FBQyxLQUFLLENBQUMsSUFBTixDQUFXLEdBQVgsQ0FBRCxDQUE5QyxHQUErRCxHQUE1RTtBQXJDSDthQURmO0tBQUEsYUFBQTtRQXdDTTtRQUNGLEdBQUEsR0FBTSxvQkFBQSxJQUFnQixHQUFBLEdBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVgsR0FBc0IsQ0FBdkIsQ0FBSixHQUE4QixHQUE5QixHQUFrQyxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQTdELElBQTZFO1FBQ25GLElBQUEsQ0FBSyxNQUFNLENBQUMsSUFBUCxDQUFBLENBQUwsRUFBb0IsTUFBQSxHQUFNLENBQUMsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLEtBQU4sQ0FBWSxVQUFaLENBQWhCLENBQUQsQ0FBTixHQUFnRCxHQUFwRTtRQUNBLFdBQUEsQ0FBWSxlQUFaLEVBQTRCLENBQUMsQ0FBQyxPQUE5QixFQUF1QyxVQUF2QztBQUNBLGVBQU8sS0E1Q1g7O1dBOENBO0FBaERNOztBQWtEVixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIDAwMDAwMDAgICAwMDAwMDAwICAgMDAgICAgIDAwICAwMDAwMDAwMCAgIDAwMCAgMDAwICAgICAgMDAwMDAwMDAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgMDAwICAgICAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMCAgMDAwICAgICAgMDAwMDAwMCAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgMDAwICAgICAgIFxuIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIFxuIyMjXG5cbnsga2xvZywga29sb3IsIG5vb24sIHNsYXNoIH0gPSByZXF1aXJlICdreGsnXG5cbmtvZmZlZSA9IHJlcXVpcmUgJ2tvZmZlZSdcbnByZXR0eSA9IHJlcXVpcmUgJy4vcHJldHR5J1xua29ucmFkRXJyb3IgPSByZXF1aXJlICcuL2Vycm9yJ1xuXG5jb21waWxlID0gKHNvdXJjZVRleHQsIGV4dCwgc291cmNlRmlsZSwgdGFyZ2V0RmlsZSwgY2ZnKSAtPlxuXG4gICAgdHJ5XG4gICAgICAgIGNvbXBpbGVkID0gc3dpdGNoIGV4dFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdjb2ZmZWUnXG5cbiAgICAgICAgICAgICAgICBpZiBjZmdbZXh0XT8ubWFwXG4gICAgICAgICAgICAgICAgICAgIG1hcGNmZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6ICAgICAgICBzb3VyY2VGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXJlOiAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmxpbmVNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogICAgICBzbGFzaC5yZWxhdGl2ZSBzb3VyY2VGaWxlLCBzbGFzaC5kaXIgdGFyZ2V0RmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkRmlsZTogdGFyZ2V0RmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWxvZzogICAgICAgJ2tsb2cnXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWF0dXJlOiBoZWFkZXI6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBqc01hcCA9IGtvZmZlZS5jb21waWxlIHNvdXJjZVRleHQsIG1hcGNmZ1xuICAgICAgICAgICAgICAgICAgICBqc01hcC5qc1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAga29mZmVlLmNvbXBpbGUgc291cmNlVGV4dCwgYmFyZTp0cnVlLCBzb3VyY2U6c291cmNlRmlsZSwgbWV0YWxvZzona2xvZydcblxuICAgICAgICAgICAgd2hlbiAnc3R5bCdcbiAgICAgICAgICAgICAgICBzdHlsdXMgPSByZXF1aXJlICdzdHlsdXMnXG4gICAgICAgICAgICAgICAgc3R5bHVzIHNvdXJjZVRleHRcbiAgICAgICAgICAgICAgICAgICAgLnJlbmRlcigpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAncHVnJ1xuICAgICAgICAgICAgICAgIHB1ZyAgICA9IHJlcXVpcmUgJ3B1ZydcbiAgICAgICAgICAgICAgICBwdWcucmVuZGVyIHNvdXJjZVRleHQsIHByZXR0eTogdHJ1ZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnanNvbidcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBub29uLnN0cmluZ2lmeSBKU09OLnBhcnNlKHNvdXJjZVRleHQpLCBleHQ6ICcuJytjZmdbZXh0XS5leHQsIGluZGVudDonICAnIG1heGFsaWduOiAxNlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnbm9vbidcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBub29uLnN0cmluZ2lmeSBub29uLnBhcnNlKHNvdXJjZVRleHQpLCBleHQ6ICcuJytjZmdbZXh0XS5leHQsIGluZGVudDogJyAgJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IGtvbG9yLnllbGxvdyhcImRvbid0IGtub3cgaG93IHRvIGJ1aWxkIGZpbGVzIHdpdGggZXh0bmFtZSAuI3trb2xvci5ib2xkKGV4dCl9IVwiKVxuXG4gICAgY2F0Y2ggZVxuICAgICAgICBwb3MgPSBlLmxvY2F0aW9uPyBhbmQgJzonKyhlLmxvY2F0aW9uLmZpcnN0X2xpbmUrMSkrJzonK2UubG9jYXRpb24uZmlyc3RfY29sdW1uIG9yICcnXG4gICAgICAgIGtsb2cgcHJldHR5LnRpbWUoKSwgXCLwn5S6ICAje3ByZXR0eS5maWxlUGF0aCBzbGFzaC50aWxkZSBzb3VyY2VGaWxlfSN7cG9zfVwiXG4gICAgICAgIGtvbnJhZEVycm9yICdjb21waWxlIGVycm9yJyBlLm1lc3NhZ2UsIHNvdXJjZUZpbGVcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgXG4gICAgY29tcGlsZWRcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gY29tcGlsZVxuXG5cbiJdfQ==
//# sourceURL=../coffee/compile.coffee