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
                            metalog: 'log',
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb2ZmZWUiLCJzb3VyY2VzIjpbImNvbXBpbGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLE1BQStCLE9BQUEsQ0FBUSxLQUFSLENBQS9CLEVBQUUsZUFBRixFQUFRLGlCQUFSLEVBQWUsZUFBZixFQUFxQjs7QUFFckIsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOztBQUNULElBQUEsR0FBUyxPQUFBLENBQVEsTUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsV0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUVkLE9BQUEsR0FBVSxTQUFDLFVBQUQsRUFBYSxHQUFiLEVBQWtCLFVBQWxCLEVBQThCLFVBQTlCLEVBQTBDLEdBQTFDO0FBRU4sUUFBQTtBQUFBO1FBQ0ksUUFBQTs7QUFBVyxvQkFBTyxHQUFQO0FBQUEscUJBRUYsUUFGRTtvQkFJSCxvQ0FBVyxDQUFFLFlBQWI7d0JBQ0ksTUFBQSxHQUNJOzRCQUFBLE1BQUEsRUFBZSxVQUFmOzRCQUNBLElBQUEsRUFBZSxJQURmOzRCQUVBLFNBQUEsRUFBZSxJQUZmOzRCQUdBLFNBQUEsRUFBZSxJQUhmOzRCQUlBLFFBQUEsRUFBZSxLQUFLLENBQUMsUUFBTixDQUFlLFVBQWYsRUFBMkIsS0FBSyxDQUFDLEdBQU4sQ0FBVSxVQUFWLENBQTNCLENBSmY7NEJBS0EsYUFBQSxFQUFlLFVBTGY7NEJBTUEsT0FBQSxFQUFlLEtBTmY7NEJBT0EsT0FBQSxFQUFTO2dDQUFBLE1BQUEsRUFBUSxJQUFSOzZCQVBUOzt3QkFTSixLQUFBLEdBQVEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxVQUFmLEVBQTJCLE1BQTNCOytCQUNSLEtBQUssQ0FBQyxHQVpWO3FCQUFBLE1BQUE7K0JBY0ksTUFBTSxDQUFDLE9BQVAsQ0FBZSxVQUFmLEVBQTJCOzRCQUFBLElBQUEsRUFBSyxJQUFMOzRCQUFXLE1BQUEsRUFBTyxVQUFsQjs0QkFBOEIsT0FBQSxFQUFRLEtBQXRDO3lCQUEzQixFQWRKOztBQUZDO0FBRkUscUJBb0JGLE1BcEJFOzJCQXNCSCxJQUFJLENBQUMsT0FBTCxDQUFhLFVBQWIsRUFBeUI7d0JBQUEsTUFBQSxFQUFPLElBQVA7cUJBQXpCO0FBdEJHLHFCQXdCRixNQXhCRTtvQkF5QkgsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOzJCQUNULE1BQUEsQ0FBTyxVQUFQLENBQ0ksQ0FBQyxNQURMLENBQUE7QUExQkcscUJBNkJGLEtBN0JFO29CQThCSCxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVI7MkJBQ04sR0FBRyxDQUFDLE1BQUosQ0FBVyxVQUFYLEVBQXVCO3dCQUFBLE1BQUEsRUFBUSxJQUFSO3FCQUF2QjtBQS9CRyxxQkFpQ0YsTUFqQ0U7MkJBbUNILElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxVQUFYLENBQWYsRUFBdUM7d0JBQUEsR0FBQSxFQUFLLEdBQUEsR0FBSSxHQUFJLENBQUEsR0FBQSxDQUFJLENBQUMsR0FBbEI7d0JBQXVCLE1BQUEsRUFBTyxJQUE5Qjt3QkFBbUMsUUFBQSxFQUFVLEVBQTdDO3FCQUF2QztBQW5DRyxxQkFxQ0YsTUFyQ0U7MkJBdUNILElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxVQUFYLENBQWYsRUFBdUM7d0JBQUEsR0FBQSxFQUFLLEdBQUEsR0FBSSxHQUFJLENBQUEsR0FBQSxDQUFJLENBQUMsR0FBbEI7d0JBQXVCLE1BQUEsRUFBUSxJQUEvQjtxQkFBdkM7QUF2Q0c7QUEwQ0gsMEJBQU0sS0FBSyxDQUFDLE1BQU4sQ0FBYSw4Q0FBQSxHQUE4QyxDQUFDLEtBQUssQ0FBQyxJQUFOLENBQVcsR0FBWCxDQUFELENBQTlDLEdBQStELEdBQTVFO0FBMUNIO2FBRGY7S0FBQSxhQUFBO1FBNkNNO1FBQ0YsR0FBQSxHQUFNLG9CQUFBLElBQWdCLEdBQUEsR0FBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBWCxHQUFzQixDQUF2QixDQUFKLEdBQThCLEdBQTlCLEdBQWtDLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBN0QsSUFBNkU7UUFDbkYsSUFBQSxDQUFLLE1BQU0sQ0FBQyxJQUFQLENBQUEsQ0FBTCxFQUFvQixNQUFBLEdBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUCxDQUFnQixLQUFLLENBQUMsS0FBTixDQUFZLFVBQVosQ0FBaEIsQ0FBRCxDQUFOLEdBQWdELEdBQXBFO1FBQ0EsV0FBQSxDQUFZLGVBQVosRUFBNEIsQ0FBQyxDQUFDLE9BQTlCLEVBQXVDLFVBQXZDO0FBQ0EsZUFBTyxLQWpEWDs7V0FtREE7QUFyRE07O0FBdURWLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMCAgICAgMDAgIDAwMDAwMDAwICAgMDAwICAwMDAgICAgICAwMDAwMDAwMCAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgICAwMDAgICAgICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwICAwMDAgICAgICAwMDAwMDAwICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAwMDAgICAgICAgXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgXG4jIyNcblxueyBrbG9nLCBrb2xvciwgbm9vbiwgc2xhc2ggfSA9IHJlcXVpcmUgJ2t4aydcblxua29mZmVlID0gcmVxdWlyZSAna29mZmVlJ1xua29kZSAgID0gcmVxdWlyZSAna29kZSdcbnByZXR0eSA9IHJlcXVpcmUgJy4vcHJldHR5J1xua29ucmFkRXJyb3IgPSByZXF1aXJlICcuL2Vycm9yJ1xuXG5jb21waWxlID0gKHNvdXJjZVRleHQsIGV4dCwgc291cmNlRmlsZSwgdGFyZ2V0RmlsZSwgY2ZnKSAtPlxuXG4gICAgdHJ5XG4gICAgICAgIGNvbXBpbGVkID0gc3dpdGNoIGV4dFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdjb2ZmZWUnXG5cbiAgICAgICAgICAgICAgICBpZiBjZmdbZXh0XT8ubWFwXG4gICAgICAgICAgICAgICAgICAgIG1hcGNmZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6ICAgICAgICBzb3VyY2VGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXJlOiAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmxpbmVNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogICAgICBzbGFzaC5yZWxhdGl2ZSBzb3VyY2VGaWxlLCBzbGFzaC5kaXIgdGFyZ2V0RmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkRmlsZTogdGFyZ2V0RmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWxvZzogICAgICAgJ2xvZydcbiAgICAgICAgICAgICAgICAgICAgICAgIGZlYXR1cmU6IGhlYWRlcjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGpzTWFwID0ga29mZmVlLmNvbXBpbGUgc291cmNlVGV4dCwgbWFwY2ZnXG4gICAgICAgICAgICAgICAgICAgIGpzTWFwLmpzXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBrb2ZmZWUuY29tcGlsZSBzb3VyY2VUZXh0LCBiYXJlOnRydWUsIHNvdXJjZTpzb3VyY2VGaWxlLCBtZXRhbG9nOidsb2cnXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAna29kZSdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBrb2RlLmNvbXBpbGUgc291cmNlVGV4dCwgaGVhZGVyOnRydWVcblxuICAgICAgICAgICAgd2hlbiAnc3R5bCdcbiAgICAgICAgICAgICAgICBzdHlsdXMgPSByZXF1aXJlICdzdHlsdXMnXG4gICAgICAgICAgICAgICAgc3R5bHVzIHNvdXJjZVRleHRcbiAgICAgICAgICAgICAgICAgICAgLnJlbmRlcigpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAncHVnJ1xuICAgICAgICAgICAgICAgIHB1ZyA9IHJlcXVpcmUgJ3B1ZydcbiAgICAgICAgICAgICAgICBwdWcucmVuZGVyIHNvdXJjZVRleHQsIHByZXR0eTogdHJ1ZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnanNvbidcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBub29uLnN0cmluZ2lmeSBKU09OLnBhcnNlKHNvdXJjZVRleHQpLCBleHQ6ICcuJytjZmdbZXh0XS5leHQsIGluZGVudDonICAnIG1heGFsaWduOiAxNlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnbm9vbidcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBub29uLnN0cmluZ2lmeSBub29uLnBhcnNlKHNvdXJjZVRleHQpLCBleHQ6ICcuJytjZmdbZXh0XS5leHQsIGluZGVudDogJyAgJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IGtvbG9yLnllbGxvdyhcImRvbid0IGtub3cgaG93IHRvIGJ1aWxkIGZpbGVzIHdpdGggZXh0bmFtZSAuI3trb2xvci5ib2xkKGV4dCl9IVwiKVxuXG4gICAgY2F0Y2ggZVxuICAgICAgICBwb3MgPSBlLmxvY2F0aW9uPyBhbmQgJzonKyhlLmxvY2F0aW9uLmZpcnN0X2xpbmUrMSkrJzonK2UubG9jYXRpb24uZmlyc3RfY29sdW1uIG9yICcnXG4gICAgICAgIGtsb2cgcHJldHR5LnRpbWUoKSwgXCLwn5S6ICAje3ByZXR0eS5maWxlUGF0aCBzbGFzaC50aWxkZSBzb3VyY2VGaWxlfSN7cG9zfVwiXG4gICAgICAgIGtvbnJhZEVycm9yICdjb21waWxlIGVycm9yJyBlLm1lc3NhZ2UsIHNvdXJjZUZpbGVcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgXG4gICAgY29tcGlsZWRcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gY29tcGlsZVxuXG5cbiJdfQ==
//# sourceURL=../coffee/compile.coffee