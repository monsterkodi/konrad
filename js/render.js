// koffee 0.45.0

/*
00000000   00000000  000   000  0000000    00000000  00000000 
000   000  000       0000  000  000   000  000       000   000
0000000    0000000   000 0 000  000   000  0000000   0000000  
000   000  000       000  0000  000   000  000       000   000
000   000  00000000  000   000  0000000    00000000  000   000
 */
var colors, render;

colors = require('kxk').colors;

render = function(rgs) {
    var cfunc, i, index, plain, ref, result, rng;
    result = '';
    plain = '';
    for (index = i = 0, ref = rgs.length; 0 <= ref ? i < ref : i > ref; index = 0 <= ref ? ++i : --i) {
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
                case 'punct comment':
                case 'punct':
                    return colors.gray.dim;
                case 'function':
                case 'function call':
                case 'string single':
                case 'string double':
                case 'dir text':
                case 'property':
                    return colors.green.bold;
                case 'punct function call':
                case 'punct string single':
                case 'punct string double':
                case 'punct dir':
                    return colors.green.dim;
                case 'obj':
                case 'class':
                case 'git file':
                    return colors.yellow.bold;
                case 'punct git':
                case 'git ext':
                    return colors.yellow.dim;
                case 'number':
                case 'keyword':
                case 'url domain':
                    return colors.blue.bold;
                case 'require':
                case 'punct property':
                    return colors.green.dim;
                case 'punct semver':
                case 'url protocol':
                case 'punct url':
                    return colors.magenta;
                case 'semver':
                case 'dir url tld':
                case 'punct url tld':
                    return colors.magenta.bold;
                default:
                    return colors.white.bold;
            }
        })();
        plain += rng.match;
        result += cfunc(rng.match);
    }
    return result;
};

module.exports = render;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRRSxTQUFXLE9BQUEsQ0FBUSxLQUFSOztBQUViLE1BQUEsR0FBUyxTQUFDLEdBQUQ7QUFFTCxRQUFBO0lBQUEsTUFBQSxHQUFTO0lBQ1QsS0FBQSxHQUFTO0FBRVQsU0FBYSwyRkFBYjtRQUNJLEdBQUEsR0FBTSxHQUFJLENBQUEsS0FBQTtBQUNWLGVBQU0sS0FBSyxDQUFDLE1BQU4sR0FBZSxHQUFHLENBQUMsS0FBekI7WUFDSSxLQUFBLElBQVU7WUFDVixNQUFBLElBQVU7UUFGZDtRQUlBLEtBQUE7QUFBUSxvQkFBTyxHQUFHLENBQUMsS0FBWDtBQUFBLHFCQUNDLE1BREQ7MkJBRUEsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUZiLHFCQUdDLFNBSEQ7MkJBSUEsTUFBTSxDQUFDLElBQUksQ0FBQztBQUpaLHFCQUtDLGVBTEQ7QUFBQSxxQkFLa0IsT0FMbEI7MkJBTUEsTUFBTSxDQUFDLElBQUksQ0FBQztBQU5aLHFCQU9DLFVBUEQ7QUFBQSxxQkFPYSxlQVBiO0FBQUEscUJBTzhCLGVBUDlCO0FBQUEscUJBTytDLGVBUC9DO0FBQUEscUJBT2dFLFVBUGhFO0FBQUEscUJBTzRFLFVBUDVFOzJCQVFBLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFSYixxQkFTQyxxQkFURDtBQUFBLHFCQVN3QixxQkFUeEI7QUFBQSxxQkFTK0MscUJBVC9DO0FBQUEscUJBU3NFLFdBVHRFOzJCQVVBLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFWYixxQkFXQyxLQVhEO0FBQUEscUJBV1EsT0FYUjtBQUFBLHFCQVdpQixVQVhqQjsyQkFZQSxNQUFNLENBQUMsTUFBTSxDQUFDO0FBWmQscUJBYUMsV0FiRDtBQUFBLHFCQWFjLFNBYmQ7MkJBY0EsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQWRkLHFCQWVDLFFBZkQ7QUFBQSxxQkFlVyxTQWZYO0FBQUEscUJBZXNCLFlBZnRCOzJCQWdCQSxNQUFNLENBQUMsSUFBSSxDQUFDO0FBaEJaLHFCQWlCQyxTQWpCRDtBQUFBLHFCQWlCWSxnQkFqQlo7MkJBa0JBLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFsQmIscUJBbUJDLGNBbkJEO0FBQUEscUJBbUJpQixjQW5CakI7QUFBQSxxQkFtQmlDLFdBbkJqQzsyQkFvQkEsTUFBTSxDQUFDO0FBcEJQLHFCQXFCQyxRQXJCRDtBQUFBLHFCQXFCVyxhQXJCWDtBQUFBLHFCQXFCMEIsZUFyQjFCOzJCQXNCQSxNQUFNLENBQUMsT0FBTyxDQUFDO0FBdEJmOzJCQXdCQSxNQUFNLENBQUMsS0FBSyxDQUFDO0FBeEJiOztRQTBCUixLQUFBLElBQVUsR0FBRyxDQUFDO1FBQ2QsTUFBQSxJQUFVLEtBQUEsQ0FBTSxHQUFHLENBQUMsS0FBVjtBQWpDZDtXQW1DQTtBQXhDSzs7QUEwQ1QsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbjAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwMCAgMDAwMDAwMDAgXG4wMDAgICAwMDAgIDAwMCAgICAgICAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAwMDAwMDAwICBcbjAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4wMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMFxuIyMjXG5cbnsgY29sb3JzIH0gPSByZXF1aXJlICdreGsnXG5cbnJlbmRlciA9IChyZ3MpIC0+XG5cbiAgICByZXN1bHQgPSAnJ1xuICAgIHBsYWluICA9ICcnXG4gICAgXG4gICAgZm9yIGluZGV4IGluIFswLi4ucmdzLmxlbmd0aF1cbiAgICAgICAgcm5nID0gcmdzW2luZGV4XVxuICAgICAgICB3aGlsZSBwbGFpbi5sZW5ndGggPCBybmcuc3RhcnRcbiAgICAgICAgICAgIHBsYWluICArPSAnICdcbiAgICAgICAgICAgIHJlc3VsdCArPSAnICdcblxuICAgICAgICBjZnVuYyA9IHN3aXRjaCBybmcudmFsdWVcbiAgICAgICAgICAgIHdoZW4gJ3RleHQnXG4gICAgICAgICAgICAgICAgY29sb3JzLndoaXRlLmRpbVxuICAgICAgICAgICAgd2hlbiAnY29tbWVudCdcbiAgICAgICAgICAgICAgICBjb2xvcnMuZ3JheS5ib2xkXG4gICAgICAgICAgICB3aGVuICdwdW5jdCBjb21tZW50JywgJ3B1bmN0J1xuICAgICAgICAgICAgICAgIGNvbG9ycy5ncmF5LmRpbVxuICAgICAgICAgICAgd2hlbiAnZnVuY3Rpb24nLCAnZnVuY3Rpb24gY2FsbCcsICdzdHJpbmcgc2luZ2xlJywgJ3N0cmluZyBkb3VibGUnLCAnZGlyIHRleHQnLCAncHJvcGVydHknXG4gICAgICAgICAgICAgICAgY29sb3JzLmdyZWVuLmJvbGRcbiAgICAgICAgICAgIHdoZW4gJ3B1bmN0IGZ1bmN0aW9uIGNhbGwnLCAncHVuY3Qgc3RyaW5nIHNpbmdsZScsICdwdW5jdCBzdHJpbmcgZG91YmxlJywgJ3B1bmN0IGRpcidcbiAgICAgICAgICAgICAgICBjb2xvcnMuZ3JlZW4uZGltXG4gICAgICAgICAgICB3aGVuICdvYmonLCAnY2xhc3MnLCAnZ2l0IGZpbGUnXG4gICAgICAgICAgICAgICAgY29sb3JzLnllbGxvdy5ib2xkXG4gICAgICAgICAgICB3aGVuICdwdW5jdCBnaXQnLCAnZ2l0IGV4dCdcbiAgICAgICAgICAgICAgICBjb2xvcnMueWVsbG93LmRpbVxuICAgICAgICAgICAgd2hlbiAnbnVtYmVyJywgJ2tleXdvcmQnLCAndXJsIGRvbWFpbidcbiAgICAgICAgICAgICAgICBjb2xvcnMuYmx1ZS5ib2xkXG4gICAgICAgICAgICB3aGVuICdyZXF1aXJlJywgJ3B1bmN0IHByb3BlcnR5J1xuICAgICAgICAgICAgICAgIGNvbG9ycy5ncmVlbi5kaW1cbiAgICAgICAgICAgIHdoZW4gJ3B1bmN0IHNlbXZlcicsICd1cmwgcHJvdG9jb2wnLCAncHVuY3QgdXJsJ1xuICAgICAgICAgICAgICAgIGNvbG9ycy5tYWdlbnRhXG4gICAgICAgICAgICB3aGVuICdzZW12ZXInLCAnZGlyIHVybCB0bGQnLCAncHVuY3QgdXJsIHRsZCdcbiAgICAgICAgICAgICAgICBjb2xvcnMubWFnZW50YS5ib2xkXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY29sb3JzLndoaXRlLmJvbGRcbiAgICAgICAgICAgIFxuICAgICAgICBwbGFpbiAgKz0gcm5nLm1hdGNoXG4gICAgICAgIHJlc3VsdCArPSBjZnVuYyBybmcubWF0Y2hcbiAgICBcbiAgICByZXN1bHRcblxubW9kdWxlLmV4cG9ydHMgPSByZW5kZXJcbiJdfQ==
//# sourceURL=../coffee/render.coffee