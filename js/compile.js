// koffee 1.12.0

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb2ZmZWUiLCJzb3VyY2VzIjpbImNvbXBpbGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLE1BQXdCLE9BQUEsQ0FBUSxLQUFSLENBQXhCLEVBQUUsZUFBRixFQUFRLGVBQVIsRUFBYzs7QUFFZCxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULFdBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFFZCxPQUFBLEdBQVUsU0FBQyxVQUFELEVBQWEsR0FBYixFQUFrQixVQUFsQixFQUE4QixVQUE5QixFQUEwQyxHQUExQztBQUVOLFFBQUE7QUFBQTtRQUNJLFFBQUE7O0FBQVcsb0JBQU8sR0FBUDtBQUFBLHFCQUVGLFFBRkU7b0JBSUgsb0NBQVcsQ0FBRSxZQUFiO3dCQUNJLE1BQUEsR0FDSTs0QkFBQSxNQUFBLEVBQWUsVUFBZjs0QkFDQSxJQUFBLEVBQWUsSUFEZjs0QkFFQSxTQUFBLEVBQWUsSUFGZjs0QkFHQSxTQUFBLEVBQWUsSUFIZjs0QkFJQSxRQUFBLEVBQWUsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLEtBQUssQ0FBQyxHQUFOLENBQVUsVUFBVixDQUEzQixDQUpmOzRCQUtBLGFBQUEsRUFBZSxVQUxmOzRCQU1BLE9BQUEsRUFBZSxNQU5mOzRCQU9BLE9BQUEsRUFBUztnQ0FBQSxNQUFBLEVBQVEsSUFBUjs2QkFQVDs7d0JBU0osS0FBQSxHQUFRLE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZixFQUEyQixNQUEzQjsrQkFDUixLQUFLLENBQUMsR0FaVjtxQkFBQSxNQUFBOytCQWNJLE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZixFQUEyQjs0QkFBQSxJQUFBLEVBQUssSUFBTDs0QkFBVyxNQUFBLEVBQU8sVUFBbEI7NEJBQThCLE9BQUEsRUFBUSxNQUF0Qzt5QkFBM0IsRUFkSjs7QUFGQztBQUZFLHFCQW9CRixNQXBCRTtvQkFxQkgsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOzJCQUNULE1BQUEsQ0FBTyxVQUFQLENBQ0ksQ0FBQyxNQURMLENBQUE7QUF0QkcscUJBeUJGLEtBekJFO29CQTBCSCxHQUFBLEdBQVMsT0FBQSxDQUFRLEtBQVI7MkJBQ1QsR0FBRyxDQUFDLE1BQUosQ0FBVyxVQUFYLEVBQXVCO3dCQUFBLE1BQUEsRUFBUSxJQUFSO3FCQUF2QjtBQTNCRyxxQkE2QkYsTUE3QkU7MkJBK0JILElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxVQUFYLENBQWYsRUFBdUM7d0JBQUEsR0FBQSxFQUFLLEdBQUEsR0FBSSxHQUFJLENBQUEsR0FBQSxDQUFJLENBQUMsR0FBbEI7d0JBQXVCLE1BQUEsRUFBTyxJQUE5Qjt3QkFBbUMsUUFBQSxFQUFVLEVBQTdDO3FCQUF2QztBQS9CRyxxQkFpQ0YsTUFqQ0U7MkJBbUNILElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxVQUFYLENBQWYsRUFBdUM7d0JBQUEsR0FBQSxFQUFLLEdBQUEsR0FBSSxHQUFJLENBQUEsR0FBQSxDQUFJLENBQUMsR0FBbEI7d0JBQXVCLE1BQUEsRUFBUSxJQUEvQjtxQkFBdkM7QUFuQ0c7QUFxQ0gsMEJBQU0sQ0FBQSw4Q0FBQSxHQUErQyxHQUFHLENBQUMsSUFBbkQsR0FBd0QsR0FBeEQsQ0FBMEQsQ0FBQztBQXJDOUQ7YUFEZjtLQUFBLGFBQUE7UUF3Q007UUFDRixHQUFBLEdBQU0sb0JBQUEsSUFBZ0IsR0FBQSxHQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFYLEdBQXNCLENBQXZCLENBQUosR0FBOEIsR0FBOUIsR0FBa0MsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUE3RCxJQUE2RTtRQUNuRixJQUFBLENBQUssTUFBTSxDQUFDLElBQVAsQ0FBQSxDQUFMLEVBQW9CLE1BQUEsR0FBTSxDQUFDLE1BQU0sQ0FBQyxRQUFQLENBQWdCLEtBQUssQ0FBQyxLQUFOLENBQVksVUFBWixDQUFoQixDQUFELENBQU4sR0FBZ0QsR0FBcEU7UUFDQSxXQUFBLENBQVksZUFBWixFQUE0QixDQUFDLENBQUMsT0FBOUIsRUFBdUMsVUFBdkM7QUFDQSxlQUFPLEtBNUNYOztXQThDQTtBQWhETTs7QUFrRFYsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbiAwMDAwMDAwICAgMDAwMDAwMCAgIDAwICAgICAwMCAgMDAwMDAwMDAgICAwMDAgIDAwMCAgICAgIDAwMDAwMDAwICBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgIDAwMCAgICAgICBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAgIDAwMCAgICAgIDAwMDAwMDAgICBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICAgICAwMDAgIDAwMCAgICAgIDAwMCAgICAgICBcbiAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICBcbiMjI1xuXG57IGtsb2csIG5vb24sIHNsYXNoIH0gPSByZXF1aXJlICdreGsnXG5cbmtvZmZlZSA9IHJlcXVpcmUgJ2tvZmZlZSdcbnByZXR0eSA9IHJlcXVpcmUgJy4vcHJldHR5J1xua29ucmFkRXJyb3IgPSByZXF1aXJlICcuL2Vycm9yJ1xuXG5jb21waWxlID0gKHNvdXJjZVRleHQsIGV4dCwgc291cmNlRmlsZSwgdGFyZ2V0RmlsZSwgY2ZnKSAtPlxuXG4gICAgdHJ5XG4gICAgICAgIGNvbXBpbGVkID0gc3dpdGNoIGV4dFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdjb2ZmZWUnXG5cbiAgICAgICAgICAgICAgICBpZiBjZmdbZXh0XT8ubWFwXG4gICAgICAgICAgICAgICAgICAgIG1hcGNmZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6ICAgICAgICBzb3VyY2VGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXJlOiAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmxpbmVNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogICAgICBzbGFzaC5yZWxhdGl2ZSBzb3VyY2VGaWxlLCBzbGFzaC5kaXIgdGFyZ2V0RmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkRmlsZTogdGFyZ2V0RmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWxvZzogICAgICAgJ2tsb2cnXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWF0dXJlOiBoZWFkZXI6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBqc01hcCA9IGtvZmZlZS5jb21waWxlIHNvdXJjZVRleHQsIG1hcGNmZ1xuICAgICAgICAgICAgICAgICAgICBqc01hcC5qc1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAga29mZmVlLmNvbXBpbGUgc291cmNlVGV4dCwgYmFyZTp0cnVlLCBzb3VyY2U6c291cmNlRmlsZSwgbWV0YWxvZzona2xvZydcblxuICAgICAgICAgICAgd2hlbiAnc3R5bCdcbiAgICAgICAgICAgICAgICBzdHlsdXMgPSByZXF1aXJlICdzdHlsdXMnXG4gICAgICAgICAgICAgICAgc3R5bHVzIHNvdXJjZVRleHRcbiAgICAgICAgICAgICAgICAgICAgLnJlbmRlcigpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAncHVnJ1xuICAgICAgICAgICAgICAgIHB1ZyAgICA9IHJlcXVpcmUgJ3B1ZydcbiAgICAgICAgICAgICAgICBwdWcucmVuZGVyIHNvdXJjZVRleHQsIHByZXR0eTogdHJ1ZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnanNvbidcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBub29uLnN0cmluZ2lmeSBKU09OLnBhcnNlKHNvdXJjZVRleHQpLCBleHQ6ICcuJytjZmdbZXh0XS5leHQsIGluZGVudDonICAnIG1heGFsaWduOiAxNlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnbm9vbidcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBub29uLnN0cmluZ2lmeSBub29uLnBhcnNlKHNvdXJjZVRleHQpLCBleHQ6ICcuJytjZmdbZXh0XS5leHQsIGluZGVudDogJyAgJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IFwiZG9uJ3Qga25vdyBob3cgdG8gYnVpbGQgZmlsZXMgd2l0aCBleHRuYW1lIC4je2V4dC5ib2xkfSFcIi55ZWxsb3dcblxuICAgIGNhdGNoIGVcbiAgICAgICAgcG9zID0gZS5sb2NhdGlvbj8gYW5kICc6JysoZS5sb2NhdGlvbi5maXJzdF9saW5lKzEpKyc6JytlLmxvY2F0aW9uLmZpcnN0X2NvbHVtbiBvciAnJ1xuICAgICAgICBrbG9nIHByZXR0eS50aW1lKCksIFwi8J+UuiAgI3twcmV0dHkuZmlsZVBhdGggc2xhc2gudGlsZGUgc291cmNlRmlsZX0je3Bvc31cIlxuICAgICAgICBrb25yYWRFcnJvciAnY29tcGlsZSBlcnJvcicgZS5tZXNzYWdlLCBzb3VyY2VGaWxlXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIFxuICAgIGNvbXBpbGVkXG4gICAgXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBpbGVcblxuXG4iXX0=
//# sourceURL=../coffee/compile.coffee