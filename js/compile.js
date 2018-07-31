(function() {
  /*
   0000000   0000000   00     00  00000000   000  000      00000000  
  000       000   000  000   000  000   000  000  000      000       
  000       000   000  000000000  00000000   000  000      0000000   
  000       000   000  000 0 000  000        000  000      000       
   0000000   0000000   000   000  000        000  0000000  00000000  
  */
  var _, atomic, compile, error, fs, konradError, log, noon, slash;

  ({atomic, noon, slash, error, log, fs, _} = require('kxk'));

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
                sourceMap: true,
                inlineMap: true,
                sourceRoot: '.',
                filename: slash.relative(sourceFile, slash.dir(targetFile)),
                generatedFile: slash.file(targetFile)
              };
              jsMap = coffee.compile(sourceText, mapcfg);
              return jsMap.js;
            } else {
              return coffee.compile(sourceText);
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

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIuLi9jb2ZmZWUvY29tcGlsZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTs7Ozs7OztBQUFBLE1BQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLEVBQUEsRUFBQSxXQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQTs7RUFRQSxDQUFBLENBQUUsTUFBRixFQUFVLElBQVYsRUFBZ0IsS0FBaEIsRUFBdUIsS0FBdkIsRUFBOEIsR0FBOUIsRUFBbUMsRUFBbkMsRUFBdUMsQ0FBdkMsQ0FBQSxHQUE2QyxPQUFBLENBQVEsS0FBUixDQUE3Qzs7RUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLFNBQVI7O0VBRWQsT0FBQSxHQUFVLFFBQUEsQ0FBQyxVQUFELEVBQWEsR0FBYixFQUFrQixVQUFsQixFQUE4QixVQUE5QixFQUEwQyxHQUExQyxDQUFBO0FBRU4sUUFBQSxNQUFBLEVBQUEsUUFBQSxFQUFBLENBQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQTtBQUFBO01BQ0ksUUFBQTs7QUFBVyxnQkFBTyxHQUFQO0FBQUEsZUFFRixRQUZFO1lBSUgsTUFBQSxHQUFTLE9BQUEsQ0FBUSxjQUFSO1lBRVQsa0NBQVcsQ0FBRSxZQUFiO2NBQ0ksTUFBQSxHQUNJO2dCQUFBLFNBQUEsRUFBZSxJQUFmO2dCQUNBLFNBQUEsRUFBZSxJQURmO2dCQUVBLFVBQUEsRUFBZSxHQUZmO2dCQUdBLFFBQUEsRUFBZSxLQUFLLENBQUMsUUFBTixDQUFlLFVBQWYsRUFBMkIsS0FBSyxDQUFDLEdBQU4sQ0FBVSxVQUFWLENBQTNCLENBSGY7Z0JBSUEsYUFBQSxFQUFlLEtBQUssQ0FBQyxJQUFOLENBQVcsVUFBWDtjQUpmO2NBTUosS0FBQSxHQUFRLE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZixFQUEyQixNQUEzQjtxQkFDUixLQUFLLENBQUMsR0FUVjthQUFBLE1BQUE7cUJBV0ksTUFBTSxDQUFDLE9BQVAsQ0FBZSxVQUFmLEVBWEo7O0FBSkM7QUFGRSxlQW1CRixNQW5CRTtZQXFCSCxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7bUJBQ1QsTUFBQSxDQUFPLFVBQVAsQ0FDSSxDQUFDLEdBREwsQ0FDUyxVQURULEVBQ3FCLFVBRHJCLENBRUksQ0FBQyxHQUZMLENBRVMsT0FGVCxFQUVrQixDQUFDLEtBQUssQ0FBQyxHQUFOLENBQVUsVUFBVixDQUFELENBRmxCLENBR0ksQ0FBQyxNQUhMLENBQUE7QUF0QkcsZUEyQkYsS0EzQkU7WUE2QkgsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSO21CQUNOLEdBQUcsQ0FBQyxNQUFKLENBQVcsVUFBWCxFQUF1QjtjQUFBLE1BQUEsRUFBUTtZQUFSLENBQXZCO0FBOUJHLGVBZ0NGLE1BaENFO21CQWtDSCxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsVUFBWCxDQUFmLEVBQXVDO2NBQUEsR0FBQSxFQUFLLEdBQUEsR0FBSSxHQUFJLENBQUEsR0FBQSxDQUFJLENBQUMsR0FBbEI7Y0FBdUIsTUFBQSxFQUFRLElBQS9CO2NBQXFDLFFBQUEsRUFBVTtZQUEvQyxDQUF2QztBQWxDRyxlQW9DRixNQXBDRTttQkFzQ0gsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsS0FBTCxDQUFXLFVBQVgsQ0FBZixFQUF1QztjQUFBLEdBQUEsRUFBSyxHQUFBLEdBQUksR0FBSSxDQUFBLEdBQUEsQ0FBSSxDQUFDLEdBQWxCO2NBQXVCLE1BQUEsRUFBUTtZQUEvQixDQUF2QztBQXRDRztZQXdDSCxNQUFNLENBQUEsNENBQUEsQ0FBQSxDQUErQyxHQUFHLENBQUMsSUFBbkQsQ0FBd0QsQ0FBeEQsQ0FBMEQsQ0FBQztBQXhDOUQ7V0FEZjtLQUFBLGNBQUE7TUEyQ007TUFDRixXQUFBLENBQVksZUFBWixFQUE2QixDQUE3QixFQUFnQyxVQUFoQztBQUNBLGFBQU8sS0E3Q1g7O1dBK0NBO0VBakRNOztFQW1EVixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQS9EakIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbiAwMDAwMDAwICAgMDAwMDAwMCAgIDAwICAgICAwMCAgMDAwMDAwMDAgICAwMDAgIDAwMCAgICAgIDAwMDAwMDAwICBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgIDAwMCAgICAgICBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAgIDAwMCAgICAgIDAwMDAwMDAgICBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICAgICAwMDAgIDAwMCAgICAgIDAwMCAgICAgICBcbiAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICBcbiMjI1xuXG57IGF0b21pYywgbm9vbiwgc2xhc2gsIGVycm9yLCBsb2csIGZzLCBfIH0gPSByZXF1aXJlICdreGsnXG5cbmtvbnJhZEVycm9yID0gcmVxdWlyZSAnLi9lcnJvcidcblxuY29tcGlsZSA9IChzb3VyY2VUZXh0LCBleHQsIHNvdXJjZUZpbGUsIHRhcmdldEZpbGUsIGNmZykgLT5cbiAgICBcbiAgICB0cnlcbiAgICAgICAgY29tcGlsZWQgPSBzd2l0Y2ggZXh0XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gJ2NvZmZlZSdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb2ZmZWUgPSByZXF1aXJlICdjb2ZmZWVzY3JpcHQnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgY2ZnW2V4dF0/Lm1hcFxuICAgICAgICAgICAgICAgICAgICBtYXBjZmcgPVxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlTWFwOiAgICAgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5saW5lTWFwOiAgICAgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlUm9vdDogICAgJy4nXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogICAgICBzbGFzaC5yZWxhdGl2ZSBzb3VyY2VGaWxlLCBzbGFzaC5kaXIgdGFyZ2V0RmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkRmlsZTogc2xhc2guZmlsZSB0YXJnZXRGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAganNNYXAgPSBjb2ZmZWUuY29tcGlsZSBzb3VyY2VUZXh0LCBtYXBjZmdcbiAgICAgICAgICAgICAgICAgICAganNNYXAuanNcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNvZmZlZS5jb21waWxlIHNvdXJjZVRleHRcblxuICAgICAgICAgICAgd2hlbiAnc3R5bCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzdHlsdXMgPSByZXF1aXJlICdzdHlsdXMnXG4gICAgICAgICAgICAgICAgc3R5bHVzIHNvdXJjZVRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldCAnZmlsZW5hbWUnLCBzb3VyY2VGaWxlXG4gICAgICAgICAgICAgICAgICAgIC5zZXQgJ3BhdGhzJywgW3NsYXNoLmRpciBzb3VyY2VGaWxlXVxuICAgICAgICAgICAgICAgICAgICAucmVuZGVyKClcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdwdWcnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcHVnID0gcmVxdWlyZSAncHVnJ1xuICAgICAgICAgICAgICAgIHB1Zy5yZW5kZXIgc291cmNlVGV4dCwgcHJldHR5OiB0cnVlXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdqc29uJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIG5vb24uc3RyaW5naWZ5IEpTT04ucGFyc2Uoc291cmNlVGV4dCksIGV4dDogJy4nK2NmZ1tleHRdLmV4dCwgaW5kZW50OiAnICAnLCBtYXhhbGlnbjogMTZcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gJ25vb24nXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbm9vbi5zdHJpbmdpZnkgbm9vbi5wYXJzZShzb3VyY2VUZXh0KSwgZXh0OiAnLicrY2ZnW2V4dF0uZXh0LCBpbmRlbnQ6ICcgICdcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBcImRvbid0IGtub3cgaG93IHRvIGJ1aWxkIGZpbGVzIHdpdGggZXh0bmFtZSAuI3tleHQuYm9sZH0hXCIueWVsbG93XG5cbiAgICBjYXRjaCBlXG4gICAgICAgIGtvbnJhZEVycm9yICdjb21waWxlIGVycm9yJywgZSwgc291cmNlRmlsZVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICBcbiAgICBjb21waWxlZFxuICAgIFxubW9kdWxlLmV4cG9ydHMgPSBjb21waWxlXG5cblxuIl19
//# sourceURL=../coffee/compile.coffee