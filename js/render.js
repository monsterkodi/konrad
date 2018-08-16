(function() {
  /*
  00000000   00000000  000   000  0000000    00000000  00000000 
  000   000  000       0000  000  000   000  000       000   000
  0000000    0000000   000 0 000  000   000  0000000   0000000  
  000   000  000       000  0000  000   000  000       000   000
  000   000  00000000  000   000  0000000    00000000  000   000
  */
  var colors, log, render;

  ({colors, log} = require('kxk'));

  render = function(rgs) {
    var cfunc, i, index, plain, ref, result, rng;
    result = '';
    plain = '';
    for (index = i = 0, ref = rgs.length; (0 <= ref ? i < ref : i > ref); index = 0 <= ref ? ++i : --i) {
      rng = rgs[index];
      while (plain.length < rng.start) {
        plain += ' ';
        result += ' ';
      }
      cfunc = (function() {
        switch (rng.value) {
          case 'text':
            return colors.white.dim;
          case 'comment':
            return colors.gray.bold;
          case 'comment punctuation':
          case 'punctuation':
            return colors.gray.dim;
          case 'function':
          case 'function call':
          case 'string single':
          case 'string double':
          case 'dir text':
          case 'property':
            return colors.green.bold;
          case 'function call punctuation':
          case 'string single punctuation':
          case 'string double punctuation':
          case 'dir punctuation':
            return colors.green.dim;
          case 'obj':
          case 'class':
          case 'git file':
            return colors.yellow.bold;
          case 'git punctuation':
          case 'git ext':
            return colors.yellow.dim;
          case 'number':
          case 'keyword':
          case 'url domain':
            return colors.blue.bold;
          case 'require':
          case 'property punctuation':
            return colors.green.dim;
          case 'semver punctuation':
          case 'url protocol':
          case 'url punctuation':
            return colors.magenta;
          case 'semver':
          case 'dir url tld':
          case 'url tld punctuation':
            return colors.magenta.bold;
          default:
            // log 'rng.value', rng.value
            return colors.white.bold;
        }
      })();
      plain += rng.match;
      result += cfunc(rng.match);
    }
    return result;
  };

  module.exports = render;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIi4uL2NvZmZlZS9yZW5kZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7Ozs7Ozs7QUFBQSxNQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUE7O0VBUUEsQ0FBQSxDQUFFLE1BQUYsRUFBVSxHQUFWLENBQUEsR0FBa0IsT0FBQSxDQUFRLEtBQVIsQ0FBbEI7O0VBRUEsTUFBQSxHQUFTLFFBQUEsQ0FBQyxHQUFELENBQUE7QUFFTCxRQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBO0lBQUEsTUFBQSxHQUFTO0lBQ1QsS0FBQSxHQUFTO0lBRVQsS0FBYSw2RkFBYjtNQUNJLEdBQUEsR0FBTSxHQUFJLENBQUEsS0FBQTtBQUNWLGFBQU0sS0FBSyxDQUFDLE1BQU4sR0FBZSxHQUFHLENBQUMsS0FBekI7UUFDSSxLQUFBLElBQVU7UUFDVixNQUFBLElBQVU7TUFGZDtNQUlBLEtBQUE7QUFBUSxnQkFBTyxHQUFHLENBQUMsS0FBWDtBQUFBLGVBQ0MsTUFERDttQkFFQSxNQUFNLENBQUMsS0FBSyxDQUFDO0FBRmIsZUFHQyxTQUhEO21CQUlBLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFKWixlQUtDLHFCQUxEO0FBQUEsZUFLd0IsYUFMeEI7bUJBTUEsTUFBTSxDQUFDLElBQUksQ0FBQztBQU5aLGVBT0MsVUFQRDtBQUFBLGVBT2EsZUFQYjtBQUFBLGVBTzhCLGVBUDlCO0FBQUEsZUFPK0MsZUFQL0M7QUFBQSxlQU9nRSxVQVBoRTtBQUFBLGVBTzRFLFVBUDVFO21CQVFBLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFSYixlQVNDLDJCQVREO0FBQUEsZUFTOEIsMkJBVDlCO0FBQUEsZUFTMkQsMkJBVDNEO0FBQUEsZUFTd0YsaUJBVHhGO21CQVVBLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFWYixlQVdDLEtBWEQ7QUFBQSxlQVdRLE9BWFI7QUFBQSxlQVdpQixVQVhqQjttQkFZQSxNQUFNLENBQUMsTUFBTSxDQUFDO0FBWmQsZUFhQyxpQkFiRDtBQUFBLGVBYW9CLFNBYnBCO21CQWNBLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFkZCxlQWVDLFFBZkQ7QUFBQSxlQWVXLFNBZlg7QUFBQSxlQWVzQixZQWZ0QjttQkFnQkEsTUFBTSxDQUFDLElBQUksQ0FBQztBQWhCWixlQWlCQyxTQWpCRDtBQUFBLGVBaUJZLHNCQWpCWjttQkFrQkEsTUFBTSxDQUFDLEtBQUssQ0FBQztBQWxCYixlQW1CQyxvQkFuQkQ7QUFBQSxlQW1CdUIsY0FuQnZCO0FBQUEsZUFtQnVDLGlCQW5CdkM7bUJBb0JBLE1BQU0sQ0FBQztBQXBCUCxlQXFCQyxRQXJCRDtBQUFBLGVBcUJXLGFBckJYO0FBQUEsZUFxQjBCLHFCQXJCMUI7bUJBc0JBLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUF0QmY7O21CQXlCQSxNQUFNLENBQUMsS0FBSyxDQUFDO0FBekJiOztNQTJCUixLQUFBLElBQVUsR0FBRyxDQUFDO01BQ2QsTUFBQSxJQUFVLEtBQUEsQ0FBTSxHQUFHLENBQUMsS0FBVjtJQWxDZDtXQW9DQTtFQXpDSzs7RUEyQ1QsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFyRGpCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4wMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMDAgIDAwMDAwMDAwIFxuMDAwICAgMDAwICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbjAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwMDAwMCAgXG4wMDAgICAwMDAgIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAgICAwMDBcbiMjI1xuXG57IGNvbG9ycywgbG9nIH0gPSByZXF1aXJlICdreGsnXG5cbnJlbmRlciA9IChyZ3MpIC0+XG5cbiAgICByZXN1bHQgPSAnJ1xuICAgIHBsYWluICA9ICcnXG4gICAgXG4gICAgZm9yIGluZGV4IGluIFswLi4ucmdzLmxlbmd0aF1cbiAgICAgICAgcm5nID0gcmdzW2luZGV4XVxuICAgICAgICB3aGlsZSBwbGFpbi5sZW5ndGggPCBybmcuc3RhcnRcbiAgICAgICAgICAgIHBsYWluICArPSAnICdcbiAgICAgICAgICAgIHJlc3VsdCArPSAnICdcblxuICAgICAgICBjZnVuYyA9IHN3aXRjaCBybmcudmFsdWVcbiAgICAgICAgICAgIHdoZW4gJ3RleHQnXG4gICAgICAgICAgICAgICAgY29sb3JzLndoaXRlLmRpbVxuICAgICAgICAgICAgd2hlbiAnY29tbWVudCdcbiAgICAgICAgICAgICAgICBjb2xvcnMuZ3JheS5ib2xkXG4gICAgICAgICAgICB3aGVuICdjb21tZW50IHB1bmN0dWF0aW9uJywgJ3B1bmN0dWF0aW9uJ1xuICAgICAgICAgICAgICAgIGNvbG9ycy5ncmF5LmRpbVxuICAgICAgICAgICAgd2hlbiAnZnVuY3Rpb24nLCAnZnVuY3Rpb24gY2FsbCcsICdzdHJpbmcgc2luZ2xlJywgJ3N0cmluZyBkb3VibGUnLCAnZGlyIHRleHQnLCAncHJvcGVydHknXG4gICAgICAgICAgICAgICAgY29sb3JzLmdyZWVuLmJvbGRcbiAgICAgICAgICAgIHdoZW4gJ2Z1bmN0aW9uIGNhbGwgcHVuY3R1YXRpb24nLCAnc3RyaW5nIHNpbmdsZSBwdW5jdHVhdGlvbicsICdzdHJpbmcgZG91YmxlIHB1bmN0dWF0aW9uJywgJ2RpciBwdW5jdHVhdGlvbidcbiAgICAgICAgICAgICAgICBjb2xvcnMuZ3JlZW4uZGltXG4gICAgICAgICAgICB3aGVuICdvYmonLCAnY2xhc3MnLCAnZ2l0IGZpbGUnXG4gICAgICAgICAgICAgICAgY29sb3JzLnllbGxvdy5ib2xkXG4gICAgICAgICAgICB3aGVuICdnaXQgcHVuY3R1YXRpb24nLCAnZ2l0IGV4dCdcbiAgICAgICAgICAgICAgICBjb2xvcnMueWVsbG93LmRpbVxuICAgICAgICAgICAgd2hlbiAnbnVtYmVyJywgJ2tleXdvcmQnLCAndXJsIGRvbWFpbidcbiAgICAgICAgICAgICAgICBjb2xvcnMuYmx1ZS5ib2xkXG4gICAgICAgICAgICB3aGVuICdyZXF1aXJlJywgJ3Byb3BlcnR5IHB1bmN0dWF0aW9uJ1xuICAgICAgICAgICAgICAgIGNvbG9ycy5ncmVlbi5kaW1cbiAgICAgICAgICAgIHdoZW4gJ3NlbXZlciBwdW5jdHVhdGlvbicsICd1cmwgcHJvdG9jb2wnLCAndXJsIHB1bmN0dWF0aW9uJ1xuICAgICAgICAgICAgICAgIGNvbG9ycy5tYWdlbnRhXG4gICAgICAgICAgICB3aGVuICdzZW12ZXInLCAnZGlyIHVybCB0bGQnLCAndXJsIHRsZCBwdW5jdHVhdGlvbidcbiAgICAgICAgICAgICAgICBjb2xvcnMubWFnZW50YS5ib2xkXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgIyBsb2cgJ3JuZy52YWx1ZScsIHJuZy52YWx1ZVxuICAgICAgICAgICAgICAgIGNvbG9ycy53aGl0ZS5ib2xkXG4gICAgICAgICAgICBcbiAgICAgICAgcGxhaW4gICs9IHJuZy5tYXRjaFxuICAgICAgICByZXN1bHQgKz0gY2Z1bmMgcm5nLm1hdGNoXG4gICAgXG4gICAgcmVzdWx0XG5cbm1vZHVsZS5leHBvcnRzID0gcmVuZGVyXG4iXX0=
//# sourceURL=../coffee/render.coffee