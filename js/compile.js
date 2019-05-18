// koffee 0.43.0

/*
 0000000   0000000   00     00  00000000   000  000      00000000  
000       000   000  000   000  000   000  000  000      000       
000       000   000  000000000  00000000   000  000      0000000   
000       000   000  000 0 000  000        000  000      000       
 0000000   0000000   000   000  000        000  0000000  00000000
 */
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUE7O0FBUUEsTUFBeUIsT0FBQSxDQUFRLEtBQVIsQ0FBekIsRUFBRSxlQUFGLEVBQVEsaUJBQVIsRUFBZSxXQUFmLEVBQW1COztBQUVuQixXQUFBLEdBQWMsT0FBQSxDQUFRLFNBQVI7O0FBRWQsT0FBQSxHQUFVLFNBQUMsVUFBRCxFQUFhLEdBQWIsRUFBa0IsVUFBbEIsRUFBOEIsVUFBOUIsRUFBMEMsR0FBMUM7QUFFTixRQUFBO0FBQUE7UUFDSSxRQUFBOztBQUFXLG9CQUFPLEdBQVA7QUFBQSxxQkFFRixRQUZFO29CQUtILE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjtvQkFFVCxvQ0FBVyxDQUFFLFlBQWI7d0JBQ0ksTUFBQSxHQUNJOzRCQUFBLElBQUEsRUFBZSxJQUFmOzRCQUNBLFNBQUEsRUFBZSxJQURmOzRCQUVBLFNBQUEsRUFBZSxJQUZmOzRCQUdBLFVBQUEsRUFBZSxHQUhmOzRCQUlBLFFBQUEsRUFBZSxLQUFLLENBQUMsUUFBTixDQUFlLFVBQWYsRUFBMkIsS0FBSyxDQUFDLEdBQU4sQ0FBVSxVQUFWLENBQTNCLENBSmY7NEJBS0EsT0FBQSxFQUFTO2dDQUFBLE1BQUEsRUFBUSxJQUFSOzZCQUxUOzRCQU1BLGFBQUEsRUFBZSxLQUFLLENBQUMsSUFBTixDQUFXLFVBQVgsQ0FOZjs7d0JBUUosS0FBQSxHQUFRLE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZixFQUEyQixNQUEzQjsrQkFDUixLQUFLLENBQUMsR0FYVjtxQkFBQSxNQUFBOytCQWFJLE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZixFQUEyQjs0QkFBQSxJQUFBLEVBQUssSUFBTDt5QkFBM0IsRUFiSjs7QUFMQztBQUZFLHFCQXNCRixNQXRCRTtvQkF3QkgsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOzJCQUNULE1BQUEsQ0FBTyxVQUFQLENBQ0ksQ0FBQyxHQURMLENBQ1MsVUFEVCxFQUNxQixVQURyQixDQUVJLENBQUMsR0FGTCxDQUVTLE9BRlQsRUFFa0IsQ0FBQyxLQUFLLENBQUMsR0FBTixDQUFVLFVBQVYsQ0FBRCxDQUZsQixDQUdJLENBQUMsTUFITCxDQUFBO0FBekJHLHFCQThCRixLQTlCRTtvQkFnQ0gsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSOzJCQUNOLEdBQUcsQ0FBQyxNQUFKLENBQVcsVUFBWCxFQUF1Qjt3QkFBQSxNQUFBLEVBQVEsSUFBUjtxQkFBdkI7QUFqQ0cscUJBbUNGLE1BbkNFOzJCQXFDSCxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsVUFBWCxDQUFmLEVBQXVDO3dCQUFBLEdBQUEsRUFBSyxHQUFBLEdBQUksR0FBSSxDQUFBLEdBQUEsQ0FBSSxDQUFDLEdBQWxCO3dCQUF1QixNQUFBLEVBQVEsSUFBL0I7d0JBQXFDLFFBQUEsRUFBVSxFQUEvQztxQkFBdkM7QUFyQ0cscUJBdUNGLE1BdkNFOzJCQXlDSCxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsVUFBWCxDQUFmLEVBQXVDO3dCQUFBLEdBQUEsRUFBSyxHQUFBLEdBQUksR0FBSSxDQUFBLEdBQUEsQ0FBSSxDQUFDLEdBQWxCO3dCQUF1QixNQUFBLEVBQVEsSUFBL0I7cUJBQXZDO0FBekNHO0FBMkNILDBCQUFNLENBQUEsOENBQUEsR0FBK0MsR0FBRyxDQUFDLElBQW5ELEdBQXdELEdBQXhELENBQTBELENBQUM7QUEzQzlEO2FBRGY7S0FBQSxhQUFBO1FBOENNO1FBQ0YsV0FBQSxDQUFZLGVBQVosRUFBNkIsQ0FBN0IsRUFBZ0MsVUFBaEM7QUFDQSxlQUFPLEtBaERYOztXQWtEQTtBQXBETTs7QUFzRFYsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbiAwMDAwMDAwICAgMDAwMDAwMCAgIDAwICAgICAwMCAgMDAwMDAwMDAgICAwMDAgIDAwMCAgICAgIDAwMDAwMDAwICBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgIDAwMCAgICAgICBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAgIDAwMCAgICAgIDAwMDAwMDAgICBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICAgICAwMDAgIDAwMCAgICAgIDAwMCAgICAgICBcbiAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICBcbiMjI1xuXG57IG5vb24sIHNsYXNoLCBmcywgXyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5rb25yYWRFcnJvciA9IHJlcXVpcmUgJy4vZXJyb3InXG5cbmNvbXBpbGUgPSAoc291cmNlVGV4dCwgZXh0LCBzb3VyY2VGaWxlLCB0YXJnZXRGaWxlLCBjZmcpIC0+XG4gICAgXG4gICAgdHJ5XG4gICAgICAgIGNvbXBpbGVkID0gc3dpdGNoIGV4dFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdjb2ZmZWUnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgIyBjb2ZmZWUgPSByZXF1aXJlICdjb2ZmZWVzY3JpcHQnXG4gICAgICAgICAgICAgICAgY29mZmVlID0gcmVxdWlyZSAna29mZmVlJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIGNmZ1tleHRdPy5tYXBcbiAgICAgICAgICAgICAgICAgICAgbWFwY2ZnID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJhcmU6ICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZU1hcDogICAgIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlubGluZU1hcDogICAgIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVJvb3Q6ICAgICcuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6ICAgICAgc2xhc2gucmVsYXRpdmUgc291cmNlRmlsZSwgc2xhc2guZGlyIHRhcmdldEZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGZlYXR1cmU6IGhlYWRlcjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkRmlsZTogc2xhc2guZmlsZSB0YXJnZXRGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAganNNYXAgPSBjb2ZmZWUuY29tcGlsZSBzb3VyY2VUZXh0LCBtYXBjZmdcbiAgICAgICAgICAgICAgICAgICAganNNYXAuanNcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNvZmZlZS5jb21waWxlIHNvdXJjZVRleHQsIGJhcmU6dHJ1ZVxuXG4gICAgICAgICAgICB3aGVuICdzdHlsJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHN0eWx1cyA9IHJlcXVpcmUgJ3N0eWx1cydcbiAgICAgICAgICAgICAgICBzdHlsdXMgc291cmNlVGV4dFxuICAgICAgICAgICAgICAgICAgICAuc2V0ICdmaWxlbmFtZScsIHNvdXJjZUZpbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldCAncGF0aHMnLCBbc2xhc2guZGlyIHNvdXJjZUZpbGVdXG4gICAgICAgICAgICAgICAgICAgIC5yZW5kZXIoKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gJ3B1ZydcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBwdWcgPSByZXF1aXJlICdwdWcnXG4gICAgICAgICAgICAgICAgcHVnLnJlbmRlciBzb3VyY2VUZXh0LCBwcmV0dHk6IHRydWVcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gJ2pzb24nXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbm9vbi5zdHJpbmdpZnkgSlNPTi5wYXJzZShzb3VyY2VUZXh0KSwgZXh0OiAnLicrY2ZnW2V4dF0uZXh0LCBpbmRlbnQ6ICcgICcsIG1heGFsaWduOiAxNlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnbm9vbidcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBub29uLnN0cmluZ2lmeSBub29uLnBhcnNlKHNvdXJjZVRleHQpLCBleHQ6ICcuJytjZmdbZXh0XS5leHQsIGluZGVudDogJyAgJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IFwiZG9uJ3Qga25vdyBob3cgdG8gYnVpbGQgZmlsZXMgd2l0aCBleHRuYW1lIC4je2V4dC5ib2xkfSFcIi55ZWxsb3dcblxuICAgIGNhdGNoIGVcbiAgICAgICAga29ucmFkRXJyb3IgJ2NvbXBpbGUgZXJyb3InLCBlLCBzb3VyY2VGaWxlXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIFxuICAgIGNvbXBpbGVkXG4gICAgXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBpbGVcblxuXG4iXX0=
//# sourceURL=../coffee/compile.coffee