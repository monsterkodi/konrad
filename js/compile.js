// koffee 0.50.0

/*
 0000000   0000000   00     00  00000000   000  000      00000000  
000       000   000  000   000  000   000  000  000      000       
000       000   000  000000000  00000000   000  000      0000000   
000       000   000  000 0 000  000        000  000      000       
 0000000   0000000   000   000  000        000  0000000  00000000
 */
var _, compile, fs, kerror, klog, koffee, noon, ref, slash;

ref = require('kxk'), noon = ref.noon, slash = ref.slash, klog = ref.klog, fs = ref.fs, _ = ref._;

koffee = require('koffee');

kerror = require('./error');

compile = function(sourceText, ext, sourceFile, targetFile, cfg) {
    var compiled, e, jsMap, mapcfg, pug, stylus;
    try {
        compiled = (function() {
            var ref1;
            switch (ext) {
                case 'coffee':
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
                        jsMap = koffee.compile(sourceText, mapcfg);
                        return jsMap.js;
                    } else {
                        return koffee.compile(sourceText, {
                            bare: true
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
        kerror('compile error', e, sourceFile);
        return null;
    }
    return compiled;
};

module.exports = compile;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUE7O0FBUUEsTUFBK0IsT0FBQSxDQUFRLEtBQVIsQ0FBL0IsRUFBRSxlQUFGLEVBQVEsaUJBQVIsRUFBZSxlQUFmLEVBQXFCLFdBQXJCLEVBQXlCOztBQUV6QixNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxTQUFSOztBQUVULE9BQUEsR0FBVSxTQUFDLFVBQUQsRUFBYSxHQUFiLEVBQWtCLFVBQWxCLEVBQThCLFVBQTlCLEVBQTBDLEdBQTFDO0FBRU4sUUFBQTtBQUFBO1FBQ0ksUUFBQTs7QUFBVyxvQkFBTyxHQUFQO0FBQUEscUJBRUYsUUFGRTtvQkFJSCxvQ0FBVyxDQUFFLFlBQWI7d0JBQ0ksTUFBQSxHQUNJOzRCQUFBLElBQUEsRUFBZSxJQUFmOzRCQUNBLFNBQUEsRUFBZSxJQURmOzRCQUVBLFNBQUEsRUFBZSxJQUZmOzRCQUdBLFVBQUEsRUFBZSxHQUhmOzRCQUlBLFFBQUEsRUFBZSxLQUFLLENBQUMsUUFBTixDQUFlLFVBQWYsRUFBMkIsS0FBSyxDQUFDLEdBQU4sQ0FBVSxVQUFWLENBQTNCLENBSmY7NEJBS0EsT0FBQSxFQUFTO2dDQUFBLE1BQUEsRUFBUSxJQUFSOzZCQUxUOzRCQU1BLGFBQUEsRUFBZSxLQUFLLENBQUMsSUFBTixDQUFXLFVBQVgsQ0FOZjs7d0JBUUosS0FBQSxHQUFRLE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZixFQUEyQixNQUEzQjsrQkFDUixLQUFLLENBQUMsR0FYVjtxQkFBQSxNQUFBOytCQWFJLE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZixFQUEyQjs0QkFBQSxJQUFBLEVBQUssSUFBTDt5QkFBM0IsRUFiSjs7QUFGQztBQUZFLHFCQW1CRixNQW5CRTtvQkFvQkgsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOzJCQUNULE1BQUEsQ0FBTyxVQUFQLENBQ0ksQ0FBQyxNQURMLENBQUE7QUFyQkcscUJBd0JGLEtBeEJFO29CQXlCSCxHQUFBLEdBQVMsT0FBQSxDQUFRLEtBQVI7MkJBQ1QsR0FBRyxDQUFDLE1BQUosQ0FBVyxVQUFYLEVBQXVCO3dCQUFBLE1BQUEsRUFBUSxJQUFSO3FCQUF2QjtBQTFCRyxxQkE0QkYsTUE1QkU7MkJBOEJILElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxVQUFYLENBQWYsRUFBdUM7d0JBQUEsR0FBQSxFQUFLLEdBQUEsR0FBSSxHQUFJLENBQUEsR0FBQSxDQUFJLENBQUMsR0FBbEI7d0JBQXVCLE1BQUEsRUFBUSxJQUEvQjt3QkFBcUMsUUFBQSxFQUFVLEVBQS9DO3FCQUF2QztBQTlCRyxxQkFnQ0YsTUFoQ0U7MkJBa0NILElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxVQUFYLENBQWYsRUFBdUM7d0JBQUEsR0FBQSxFQUFLLEdBQUEsR0FBSSxHQUFJLENBQUEsR0FBQSxDQUFJLENBQUMsR0FBbEI7d0JBQXVCLE1BQUEsRUFBUSxJQUEvQjtxQkFBdkM7QUFsQ0c7QUFvQ0gsMEJBQU0sQ0FBQSw4Q0FBQSxHQUErQyxHQUFHLENBQUMsSUFBbkQsR0FBd0QsR0FBeEQsQ0FBMEQsQ0FBQztBQXBDOUQ7YUFEZjtLQUFBLGFBQUE7UUF1Q007UUFDRixNQUFBLENBQU8sZUFBUCxFQUF3QixDQUF4QixFQUEyQixVQUEzQjtBQUNBLGVBQU8sS0F6Q1g7O1dBMkNBO0FBN0NNOztBQStDVixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIDAwMDAwMDAgICAwMDAwMDAwICAgMDAgICAgIDAwICAwMDAwMDAwMCAgIDAwMCAgMDAwICAgICAgMDAwMDAwMDAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgMDAwICAgICAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMCAgMDAwICAgICAgMDAwMDAwMCAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgMDAwICAgICAgIFxuIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIFxuIyMjXG5cbnsgbm9vbiwgc2xhc2gsIGtsb2csIGZzLCBfIH0gPSByZXF1aXJlICdreGsnXG5cbmtvZmZlZSA9IHJlcXVpcmUgJ2tvZmZlZSdcbmtlcnJvciA9IHJlcXVpcmUgJy4vZXJyb3InXG5cbmNvbXBpbGUgPSAoc291cmNlVGV4dCwgZXh0LCBzb3VyY2VGaWxlLCB0YXJnZXRGaWxlLCBjZmcpIC0+XG4gICAgXG4gICAgdHJ5XG4gICAgICAgIGNvbXBpbGVkID0gc3dpdGNoIGV4dFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdjb2ZmZWUnXG5cbiAgICAgICAgICAgICAgICBpZiBjZmdbZXh0XT8ubWFwXG4gICAgICAgICAgICAgICAgICAgIG1hcGNmZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXJlOiAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmxpbmVNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VSb290OiAgICAnLidcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiAgICAgIHNsYXNoLnJlbGF0aXZlIHNvdXJjZUZpbGUsIHNsYXNoLmRpciB0YXJnZXRGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWF0dXJlOiBoZWFkZXI6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZEZpbGU6IHNsYXNoLmZpbGUgdGFyZ2V0RmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGpzTWFwID0ga29mZmVlLmNvbXBpbGUgc291cmNlVGV4dCwgbWFwY2ZnXG4gICAgICAgICAgICAgICAgICAgIGpzTWFwLmpzXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBrb2ZmZWUuY29tcGlsZSBzb3VyY2VUZXh0LCBiYXJlOnRydWVcblxuICAgICAgICAgICAgd2hlbiAnc3R5bCdcbiAgICAgICAgICAgICAgICBzdHlsdXMgPSByZXF1aXJlICdzdHlsdXMnXG4gICAgICAgICAgICAgICAgc3R5bHVzIHNvdXJjZVRleHRcbiAgICAgICAgICAgICAgICAgICAgLnJlbmRlcigpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAncHVnJ1xuICAgICAgICAgICAgICAgIHB1ZyAgICA9IHJlcXVpcmUgJ3B1ZydcbiAgICAgICAgICAgICAgICBwdWcucmVuZGVyIHNvdXJjZVRleHQsIHByZXR0eTogdHJ1ZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnanNvbidcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBub29uLnN0cmluZ2lmeSBKU09OLnBhcnNlKHNvdXJjZVRleHQpLCBleHQ6ICcuJytjZmdbZXh0XS5leHQsIGluZGVudDogJyAgJywgbWF4YWxpZ246IDE2XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdub29uJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIG5vb24uc3RyaW5naWZ5IG5vb24ucGFyc2Uoc291cmNlVGV4dCksIGV4dDogJy4nK2NmZ1tleHRdLmV4dCwgaW5kZW50OiAnICAnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJkb24ndCBrbm93IGhvdyB0byBidWlsZCBmaWxlcyB3aXRoIGV4dG5hbWUgLiN7ZXh0LmJvbGR9IVwiLnllbGxvd1xuXG4gICAgY2F0Y2ggZVxuICAgICAgICBrZXJyb3IgJ2NvbXBpbGUgZXJyb3InLCBlLCBzb3VyY2VGaWxlXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIFxuICAgIGNvbXBpbGVkXG4gICAgXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBpbGVcblxuXG4iXX0=
//# sourceURL=../coffee/compile.coffee