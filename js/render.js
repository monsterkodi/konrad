// koffee 1.4.0

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRRSxTQUFXLE9BQUEsQ0FBUSxLQUFSOztBQUViLE1BQUEsR0FBUyxTQUFDLEdBQUQ7QUFFTCxRQUFBO0lBQUEsTUFBQSxHQUFTO0lBQ1QsS0FBQSxHQUFTO0FBRVQsU0FBYSwyRkFBYjtRQUNJLEdBQUEsR0FBTSxHQUFJLENBQUEsS0FBQTtBQUNWLGVBQU0sS0FBSyxDQUFDLE1BQU4sR0FBZSxHQUFHLENBQUMsS0FBekI7WUFDSSxLQUFBLElBQVU7WUFDVixNQUFBLElBQVU7UUFGZDtRQUlBLEtBQUE7QUFBUSxvQkFBTyxHQUFHLENBQUMsS0FBWDtBQUFBLHFCQUNDLE1BREQ7MkJBRUEsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUZiLHFCQUdDLFNBSEQ7MkJBSUEsTUFBTSxDQUFDLElBQUksQ0FBQztBQUpaLHFCQUtDLGVBTEQ7QUFBQSxxQkFLaUIsT0FMakI7MkJBTUEsTUFBTSxDQUFDLElBQUksQ0FBQztBQU5aLHFCQU9DLFVBUEQ7QUFBQSxxQkFPWSxlQVBaO0FBQUEscUJBTzRCLGVBUDVCO0FBQUEscUJBTzRDLGVBUDVDO0FBQUEscUJBTzRELFVBUDVEO0FBQUEscUJBT3VFLFVBUHZFOzJCQVFBLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFSYixxQkFTQyxxQkFURDtBQUFBLHFCQVN1QixxQkFUdkI7QUFBQSxxQkFTNkMscUJBVDdDO0FBQUEscUJBU21FLFdBVG5FOzJCQVVBLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFWYixxQkFXQyxLQVhEO0FBQUEscUJBV08sT0FYUDtBQUFBLHFCQVdlLFVBWGY7MkJBWUEsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQVpkLHFCQWFDLFdBYkQ7QUFBQSxxQkFhYSxTQWJiOzJCQWNBLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFkZCxxQkFlQyxRQWZEO0FBQUEscUJBZVUsU0FmVjtBQUFBLHFCQWVvQixZQWZwQjsyQkFnQkEsTUFBTSxDQUFDLElBQUksQ0FBQztBQWhCWixxQkFpQkMsU0FqQkQ7QUFBQSxxQkFpQlcsZ0JBakJYOzJCQWtCQSxNQUFNLENBQUMsS0FBSyxDQUFDO0FBbEJiLHFCQW1CQyxjQW5CRDtBQUFBLHFCQW1CZ0IsY0FuQmhCO0FBQUEscUJBbUIrQixXQW5CL0I7MkJBb0JBLE1BQU0sQ0FBQztBQXBCUCxxQkFxQkMsUUFyQkQ7QUFBQSxxQkFxQlUsYUFyQlY7QUFBQSxxQkFxQndCLGVBckJ4QjsyQkFzQkEsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQXRCZjsyQkF3QkEsTUFBTSxDQUFDLEtBQUssQ0FBQztBQXhCYjs7UUEwQlIsS0FBQSxJQUFVLEdBQUcsQ0FBQztRQUNkLE1BQUEsSUFBVSxLQUFBLENBQU0sR0FBRyxDQUFDLEtBQVY7QUFqQ2Q7V0FtQ0E7QUF4Q0s7O0FBMENULE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4wMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMDAgIDAwMDAwMDAwIFxuMDAwICAgMDAwICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbjAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwMDAwMCAgXG4wMDAgICAwMDAgIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAgICAwMDBcbiMjI1xuXG57IGNvbG9ycyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5yZW5kZXIgPSAocmdzKSAtPlxuXG4gICAgcmVzdWx0ID0gJydcbiAgICBwbGFpbiAgPSAnJ1xuICAgIFxuICAgIGZvciBpbmRleCBpbiBbMC4uLnJncy5sZW5ndGhdXG4gICAgICAgIHJuZyA9IHJnc1tpbmRleF1cbiAgICAgICAgd2hpbGUgcGxhaW4ubGVuZ3RoIDwgcm5nLnN0YXJ0XG4gICAgICAgICAgICBwbGFpbiAgKz0gJyAnXG4gICAgICAgICAgICByZXN1bHQgKz0gJyAnXG5cbiAgICAgICAgY2Z1bmMgPSBzd2l0Y2ggcm5nLnZhbHVlXG4gICAgICAgICAgICB3aGVuICd0ZXh0J1xuICAgICAgICAgICAgICAgIGNvbG9ycy53aGl0ZS5kaW1cbiAgICAgICAgICAgIHdoZW4gJ2NvbW1lbnQnXG4gICAgICAgICAgICAgICAgY29sb3JzLmdyYXkuYm9sZFxuICAgICAgICAgICAgd2hlbiAncHVuY3QgY29tbWVudCcgJ3B1bmN0J1xuICAgICAgICAgICAgICAgIGNvbG9ycy5ncmF5LmRpbVxuICAgICAgICAgICAgd2hlbiAnZnVuY3Rpb24nICdmdW5jdGlvbiBjYWxsJyAnc3RyaW5nIHNpbmdsZScgJ3N0cmluZyBkb3VibGUnICdkaXIgdGV4dCcgJ3Byb3BlcnR5J1xuICAgICAgICAgICAgICAgIGNvbG9ycy5ncmVlbi5ib2xkXG4gICAgICAgICAgICB3aGVuICdwdW5jdCBmdW5jdGlvbiBjYWxsJyAncHVuY3Qgc3RyaW5nIHNpbmdsZScgJ3B1bmN0IHN0cmluZyBkb3VibGUnICdwdW5jdCBkaXInXG4gICAgICAgICAgICAgICAgY29sb3JzLmdyZWVuLmRpbVxuICAgICAgICAgICAgd2hlbiAnb2JqJyAnY2xhc3MnICdnaXQgZmlsZSdcbiAgICAgICAgICAgICAgICBjb2xvcnMueWVsbG93LmJvbGRcbiAgICAgICAgICAgIHdoZW4gJ3B1bmN0IGdpdCcgJ2dpdCBleHQnXG4gICAgICAgICAgICAgICAgY29sb3JzLnllbGxvdy5kaW1cbiAgICAgICAgICAgIHdoZW4gJ251bWJlcicgJ2tleXdvcmQnICd1cmwgZG9tYWluJ1xuICAgICAgICAgICAgICAgIGNvbG9ycy5ibHVlLmJvbGRcbiAgICAgICAgICAgIHdoZW4gJ3JlcXVpcmUnICdwdW5jdCBwcm9wZXJ0eSdcbiAgICAgICAgICAgICAgICBjb2xvcnMuZ3JlZW4uZGltXG4gICAgICAgICAgICB3aGVuICdwdW5jdCBzZW12ZXInICd1cmwgcHJvdG9jb2wnICdwdW5jdCB1cmwnXG4gICAgICAgICAgICAgICAgY29sb3JzLm1hZ2VudGFcbiAgICAgICAgICAgIHdoZW4gJ3NlbXZlcicgJ2RpciB1cmwgdGxkJyAncHVuY3QgdXJsIHRsZCdcbiAgICAgICAgICAgICAgICBjb2xvcnMubWFnZW50YS5ib2xkXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY29sb3JzLndoaXRlLmJvbGRcbiAgICAgICAgICAgIFxuICAgICAgICBwbGFpbiAgKz0gcm5nLm1hdGNoXG4gICAgICAgIHJlc3VsdCArPSBjZnVuYyBybmcubWF0Y2hcbiAgICBcbiAgICByZXN1bHRcblxubW9kdWxlLmV4cG9ydHMgPSByZW5kZXJcbiJdfQ==
//# sourceURL=../coffee/render.coffee