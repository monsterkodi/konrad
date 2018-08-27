/*
 0000000   0000000   00     00  00000000   000  000      00000000  
000       000   000  000   000  000   000  000  000      000       
000       000   000  000000000  00000000   000  000      0000000   
000       000   000  000 0 000  000        000  000      000       
 0000000   0000000   000   000  000        000  0000000  00000000  
*/
var _, compile, error, fs, konradError, log, noon, slash;

({noon, slash, error, log, fs, _} = require('kxk'));

konradError = require('./error');

compile = function(sourceText, ext, sourceFile, targetFile, cfg) {
  var coffee, compiled, e, jsMap, mapcfg, pug, stylus;
  try {
    compiled = (function() {
      var ref;
      switch (ext) {
        case 'coffee':
          coffee = require('coffeescript');
          if ((ref = cfg[ext]) != null ? ref.map : void 0) {
            mapcfg = {
              bare: true,
              sourceMap: true,
              inlineMap: true,
              sourceRoot: '.',
              filename: slash.relative(sourceFile, slash.dir(targetFile)),
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
          throw `don't know how to build files with extname .${ext.bold}!`.yellow;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIuLi9jb2ZmZWUvY29tcGlsZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUFBQSxJQUFBLENBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLEVBQUEsRUFBQSxXQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQTs7QUFRQSxDQUFBLENBQUUsSUFBRixFQUFRLEtBQVIsRUFBZSxLQUFmLEVBQXNCLEdBQXRCLEVBQTJCLEVBQTNCLEVBQStCLENBQS9CLENBQUEsR0FBcUMsT0FBQSxDQUFRLEtBQVIsQ0FBckM7O0FBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUVkLE9BQUEsR0FBVSxRQUFBLENBQUMsVUFBRCxFQUFhLEdBQWIsRUFBa0IsVUFBbEIsRUFBOEIsVUFBOUIsRUFBMEMsR0FBMUMsQ0FBQTtBQUVOLE1BQUEsTUFBQSxFQUFBLFFBQUEsRUFBQSxDQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUE7QUFBQTtJQUNJLFFBQUE7O0FBQVcsY0FBTyxHQUFQO0FBQUEsYUFFRixRQUZFO1VBSUgsTUFBQSxHQUFTLE9BQUEsQ0FBUSxjQUFSO1VBRVQsa0NBQVcsQ0FBRSxZQUFiO1lBQ0ksTUFBQSxHQUNJO2NBQUEsSUFBQSxFQUFlLElBQWY7Y0FDQSxTQUFBLEVBQWUsSUFEZjtjQUVBLFNBQUEsRUFBZSxJQUZmO2NBR0EsVUFBQSxFQUFlLEdBSGY7Y0FJQSxRQUFBLEVBQWUsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLEtBQUssQ0FBQyxHQUFOLENBQVUsVUFBVixDQUEzQixDQUpmO2NBS0EsYUFBQSxFQUFlLEtBQUssQ0FBQyxJQUFOLENBQVcsVUFBWDtZQUxmO1lBT0osS0FBQSxHQUFRLE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZixFQUEyQixNQUEzQjttQkFDUixLQUFLLENBQUMsR0FWVjtXQUFBLE1BQUE7bUJBWUksTUFBTSxDQUFDLE9BQVAsQ0FBZSxVQUFmLEVBQTJCO2NBQUEsSUFBQSxFQUFLO1lBQUwsQ0FBM0IsRUFaSjs7QUFKQztBQUZFLGFBb0JGLE1BcEJFO1VBc0JILE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjtpQkFDVCxNQUFBLENBQU8sVUFBUCxDQUNJLENBQUMsR0FETCxDQUNTLFVBRFQsRUFDcUIsVUFEckIsQ0FFSSxDQUFDLEdBRkwsQ0FFUyxPQUZULEVBRWtCLENBQUMsS0FBSyxDQUFDLEdBQU4sQ0FBVSxVQUFWLENBQUQsQ0FGbEIsQ0FHSSxDQUFDLE1BSEwsQ0FBQTtBQXZCRyxhQTRCRixLQTVCRTtVQThCSCxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVI7aUJBQ04sR0FBRyxDQUFDLE1BQUosQ0FBVyxVQUFYLEVBQXVCO1lBQUEsTUFBQSxFQUFRO1VBQVIsQ0FBdkI7QUEvQkcsYUFpQ0YsTUFqQ0U7aUJBbUNILElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxVQUFYLENBQWYsRUFBdUM7WUFBQSxHQUFBLEVBQUssR0FBQSxHQUFJLEdBQUksQ0FBQSxHQUFBLENBQUksQ0FBQyxHQUFsQjtZQUF1QixNQUFBLEVBQVEsSUFBL0I7WUFBcUMsUUFBQSxFQUFVO1VBQS9DLENBQXZDO0FBbkNHLGFBcUNGLE1BckNFO2lCQXVDSCxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsVUFBWCxDQUFmLEVBQXVDO1lBQUEsR0FBQSxFQUFLLEdBQUEsR0FBSSxHQUFJLENBQUEsR0FBQSxDQUFJLENBQUMsR0FBbEI7WUFBdUIsTUFBQSxFQUFRO1VBQS9CLENBQXZDO0FBdkNHO1VBeUNILE1BQU0sQ0FBQSw0Q0FBQSxDQUFBLENBQStDLEdBQUcsQ0FBQyxJQUFuRCxDQUF3RCxDQUF4RCxDQUEwRCxDQUFDO0FBekM5RDtTQURmO0dBQUEsY0FBQTtJQTRDTTtJQUNGLFdBQUEsQ0FBWSxlQUFaLEVBQTZCLENBQTdCLEVBQWdDLFVBQWhDO0FBQ0EsV0FBTyxLQTlDWDs7U0FnREE7QUFsRE07O0FBb0RWLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMCAgICAgMDAgIDAwMDAwMDAwICAgMDAwICAwMDAgICAgICAwMDAwMDAwMCAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgICAwMDAgICAgICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwICAwMDAgICAgICAwMDAwMDAwICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAwMDAgICAgICAgXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgXG4jIyNcblxueyBub29uLCBzbGFzaCwgZXJyb3IsIGxvZywgZnMsIF8gfSA9IHJlcXVpcmUgJ2t4aydcblxua29ucmFkRXJyb3IgPSByZXF1aXJlICcuL2Vycm9yJ1xuXG5jb21waWxlID0gKHNvdXJjZVRleHQsIGV4dCwgc291cmNlRmlsZSwgdGFyZ2V0RmlsZSwgY2ZnKSAtPlxuICAgIFxuICAgIHRyeVxuICAgICAgICBjb21waWxlZCA9IHN3aXRjaCBleHRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnY29mZmVlJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvZmZlZSA9IHJlcXVpcmUgJ2NvZmZlZXNjcmlwdCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiBjZmdbZXh0XT8ubWFwXG4gICAgICAgICAgICAgICAgICAgIG1hcGNmZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXJlOiAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmxpbmVNYXA6ICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VSb290OiAgICAnLidcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiAgICAgIHNsYXNoLnJlbGF0aXZlIHNvdXJjZUZpbGUsIHNsYXNoLmRpciB0YXJnZXRGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWRGaWxlOiBzbGFzaC5maWxlIHRhcmdldEZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBqc01hcCA9IGNvZmZlZS5jb21waWxlIHNvdXJjZVRleHQsIG1hcGNmZ1xuICAgICAgICAgICAgICAgICAgICBqc01hcC5qc1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY29mZmVlLmNvbXBpbGUgc291cmNlVGV4dCwgYmFyZTp0cnVlXG5cbiAgICAgICAgICAgIHdoZW4gJ3N0eWwnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc3R5bHVzID0gcmVxdWlyZSAnc3R5bHVzJ1xuICAgICAgICAgICAgICAgIHN0eWx1cyBzb3VyY2VUZXh0XG4gICAgICAgICAgICAgICAgICAgIC5zZXQgJ2ZpbGVuYW1lJywgc291cmNlRmlsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0ICdwYXRocycsIFtzbGFzaC5kaXIgc291cmNlRmlsZV1cbiAgICAgICAgICAgICAgICAgICAgLnJlbmRlcigpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAncHVnJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHB1ZyA9IHJlcXVpcmUgJ3B1ZydcbiAgICAgICAgICAgICAgICBwdWcucmVuZGVyIHNvdXJjZVRleHQsIHByZXR0eTogdHJ1ZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnanNvbidcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBub29uLnN0cmluZ2lmeSBKU09OLnBhcnNlKHNvdXJjZVRleHQpLCBleHQ6ICcuJytjZmdbZXh0XS5leHQsIGluZGVudDogJyAgJywgbWF4YWxpZ246IDE2XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdub29uJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIG5vb24uc3RyaW5naWZ5IG5vb24ucGFyc2Uoc291cmNlVGV4dCksIGV4dDogJy4nK2NmZ1tleHRdLmV4dCwgaW5kZW50OiAnICAnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJkb24ndCBrbm93IGhvdyB0byBidWlsZCBmaWxlcyB3aXRoIGV4dG5hbWUgLiN7ZXh0LmJvbGR9IVwiLnllbGxvd1xuXG4gICAgY2F0Y2ggZVxuICAgICAgICBrb25yYWRFcnJvciAnY29tcGlsZSBlcnJvcicsIGUsIHNvdXJjZUZpbGVcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgXG4gICAgY29tcGlsZWRcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gY29tcGlsZVxuXG5cbiJdfQ==
//# sourceURL=../coffee/compile.coffee