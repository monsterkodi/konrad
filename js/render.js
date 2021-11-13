// koffee 1.19.0

/*
00000000   00000000  000   000  0000000    00000000  00000000 
000   000  000       0000  000  000   000  000       000   000
0000000    0000000   000 0 000  000   000  0000000   0000000  
000   000  000       000  0000  000   000  000       000   000
000   000  00000000  000   000  0000000    00000000  000   000
 */
var kolor, render;

kolor = require('kxk').kolor;

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
            switch (rng.clss) {
                case 'text':
                    return function(s) {
                        return kolor.white(kolor.dim(s));
                    };
                case 'comment':
                    return function(s) {
                        return kolor.gray(kolor.bold(s));
                    };
                case 'punct comment':
                case 'punct':
                    return function(s) {
                        return kolor.gray(kolor.dim(s));
                    };
                case 'function':
                case 'function call':
                case 'string single':
                case 'string double':
                case 'dir text':
                case 'property':
                    return function(s) {
                        return kolor.green(kolor.bold(s));
                    };
                case 'punct function call':
                case 'punct string single':
                case 'punct string double':
                case 'punct dir':
                    return function(s) {
                        return kolor.green(kolor.dim(s));
                    };
                case 'obj':
                case 'class':
                case 'git file':
                    return function(s) {
                        return kolor.yellow(kolor.bold(s));
                    };
                case 'punct git':
                case 'git ext':
                    return function(s) {
                        return kolor.yellow(kolor.dim(s));
                    };
                case 'number':
                case 'keyword':
                case 'url domain':
                    return function(s) {
                        return kolor.blue(kolor.bold(s));
                    };
                case 'require':
                case 'punct property':
                    return function(s) {
                        return kolor.green(kolor.dim(s));
                    };
                case 'punct semver':
                case 'url protocol':
                case 'punct url':
                    return function(s) {
                        return kolor.magenta(s);
                    };
                case 'semver':
                case 'dir url tld':
                case 'punct url tld':
                    return function(s) {
                        return kolor.magenta(kolor.bold(s));
                    };
                default:
                    return function(s) {
                        return kolor.white(kolor.bold(s));
                    };
            }
        })();
        plain += rng.match;
        result += cfunc(rng.match);
    }
    return result;
};

module.exports = render;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLmpzIiwic291cmNlUm9vdCI6Ii4uL2NvZmZlZSIsInNvdXJjZXMiOlsicmVuZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRRSxRQUFVLE9BQUEsQ0FBUSxLQUFSOztBQUVaLE1BQUEsR0FBUyxTQUFDLEdBQUQ7QUFFTCxRQUFBO0lBQUEsTUFBQSxHQUFTO0lBQ1QsS0FBQSxHQUFTO0FBRVQsU0FBYSwyRkFBYjtRQUNJLEdBQUEsR0FBTSxHQUFJLENBQUEsS0FBQTtBQUNWLGVBQU0sS0FBSyxDQUFDLE1BQU4sR0FBZSxHQUFHLENBQUMsS0FBekI7WUFDSSxLQUFBLElBQVU7WUFDVixNQUFBLElBQVU7UUFGZDtRQUlBLEtBQUE7QUFBUSxvQkFBTyxHQUFHLENBQUMsSUFBWDtBQUFBLHFCQUNDLE1BREQ7MkJBRUEsU0FBQyxDQUFEOytCQUFPLEtBQUssQ0FBQyxLQUFOLENBQVksS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWLENBQVo7b0JBQVA7QUFGQSxxQkFHQyxTQUhEOzJCQUlBLFNBQUMsQ0FBRDsrQkFBTyxLQUFLLENBQUMsSUFBTixDQUFXLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBWCxDQUFYO29CQUFQO0FBSkEscUJBS0MsZUFMRDtBQUFBLHFCQUtpQixPQUxqQjsyQkFNQSxTQUFDLENBQUQ7K0JBQU8sS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFLLENBQUMsR0FBTixDQUFVLENBQVYsQ0FBWDtvQkFBUDtBQU5BLHFCQU9DLFVBUEQ7QUFBQSxxQkFPWSxlQVBaO0FBQUEscUJBTzRCLGVBUDVCO0FBQUEscUJBTzRDLGVBUDVDO0FBQUEscUJBTzRELFVBUDVEO0FBQUEscUJBT3VFLFVBUHZFOzJCQVFBLFNBQUMsQ0FBRDsrQkFBTyxLQUFLLENBQUMsS0FBTixDQUFZLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBWCxDQUFaO29CQUFQO0FBUkEscUJBU0MscUJBVEQ7QUFBQSxxQkFTdUIscUJBVHZCO0FBQUEscUJBUzZDLHFCQVQ3QztBQUFBLHFCQVNtRSxXQVRuRTsyQkFVQSxTQUFDLENBQUQ7K0JBQU8sS0FBSyxDQUFDLEtBQU4sQ0FBWSxLQUFLLENBQUMsR0FBTixDQUFVLENBQVYsQ0FBWjtvQkFBUDtBQVZBLHFCQVdDLEtBWEQ7QUFBQSxxQkFXTyxPQVhQO0FBQUEscUJBV2UsVUFYZjsyQkFZQSxTQUFDLENBQUQ7K0JBQU8sS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsQ0FBYjtvQkFBUDtBQVpBLHFCQWFDLFdBYkQ7QUFBQSxxQkFhYSxTQWJiOzJCQWNBLFNBQUMsQ0FBRDsrQkFBTyxLQUFLLENBQUMsTUFBTixDQUFhLEtBQUssQ0FBQyxHQUFOLENBQVUsQ0FBVixDQUFiO29CQUFQO0FBZEEscUJBZUMsUUFmRDtBQUFBLHFCQWVVLFNBZlY7QUFBQSxxQkFlb0IsWUFmcEI7MkJBZ0JBLFNBQUMsQ0FBRDsrQkFBTyxLQUFLLENBQUMsSUFBTixDQUFXLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBWCxDQUFYO29CQUFQO0FBaEJBLHFCQWlCQyxTQWpCRDtBQUFBLHFCQWlCVyxnQkFqQlg7MkJBa0JBLFNBQUMsQ0FBRDsrQkFBTyxLQUFLLENBQUMsS0FBTixDQUFZLEtBQUssQ0FBQyxHQUFOLENBQVUsQ0FBVixDQUFaO29CQUFQO0FBbEJBLHFCQW1CQyxjQW5CRDtBQUFBLHFCQW1CZ0IsY0FuQmhCO0FBQUEscUJBbUIrQixXQW5CL0I7MkJBb0JBLFNBQUMsQ0FBRDsrQkFBTyxLQUFLLENBQUMsT0FBTixDQUFjLENBQWQ7b0JBQVA7QUFwQkEscUJBcUJDLFFBckJEO0FBQUEscUJBcUJVLGFBckJWO0FBQUEscUJBcUJ3QixlQXJCeEI7MkJBc0JBLFNBQUMsQ0FBRDsrQkFBTyxLQUFLLENBQUMsT0FBTixDQUFjLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBWCxDQUFkO29CQUFQO0FBdEJBOzJCQXdCQSxTQUFDLENBQUQ7K0JBQU8sS0FBSyxDQUFDLEtBQU4sQ0FBWSxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsQ0FBWjtvQkFBUDtBQXhCQTs7UUEwQlIsS0FBQSxJQUFVLEdBQUcsQ0FBQztRQUNkLE1BQUEsSUFBVSxLQUFBLENBQU0sR0FBRyxDQUFDLEtBQVY7QUFqQ2Q7V0FtQ0E7QUF4Q0s7O0FBMENULE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4wMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMDAgIDAwMDAwMDAwIFxuMDAwICAgMDAwICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbjAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwMDAwMCAgXG4wMDAgICAwMDAgIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAgICAwMDBcbiMjI1xuXG57IGtvbG9yIH0gPSByZXF1aXJlICdreGsnXG5cbnJlbmRlciA9IChyZ3MpIC0+XG5cbiAgICByZXN1bHQgPSAnJ1xuICAgIHBsYWluICA9ICcnXG4gICAgXG4gICAgZm9yIGluZGV4IGluIFswLi4ucmdzLmxlbmd0aF1cbiAgICAgICAgcm5nID0gcmdzW2luZGV4XVxuICAgICAgICB3aGlsZSBwbGFpbi5sZW5ndGggPCBybmcuc3RhcnRcbiAgICAgICAgICAgIHBsYWluICArPSAnICdcbiAgICAgICAgICAgIHJlc3VsdCArPSAnICdcblxuICAgICAgICBjZnVuYyA9IHN3aXRjaCBybmcuY2xzc1xuICAgICAgICAgICAgd2hlbiAndGV4dCdcbiAgICAgICAgICAgICAgICAocykgLT4ga29sb3Iud2hpdGUga29sb3IuZGltIHNcbiAgICAgICAgICAgIHdoZW4gJ2NvbW1lbnQnXG4gICAgICAgICAgICAgICAgKHMpIC0+IGtvbG9yLmdyYXkga29sb3IuYm9sZCBzXG4gICAgICAgICAgICB3aGVuICdwdW5jdCBjb21tZW50JyAncHVuY3QnXG4gICAgICAgICAgICAgICAgKHMpIC0+IGtvbG9yLmdyYXkga29sb3IuZGltIHNcbiAgICAgICAgICAgIHdoZW4gJ2Z1bmN0aW9uJyAnZnVuY3Rpb24gY2FsbCcgJ3N0cmluZyBzaW5nbGUnICdzdHJpbmcgZG91YmxlJyAnZGlyIHRleHQnICdwcm9wZXJ0eSdcbiAgICAgICAgICAgICAgICAocykgLT4ga29sb3IuZ3JlZW4ga29sb3IuYm9sZCBzXG4gICAgICAgICAgICB3aGVuICdwdW5jdCBmdW5jdGlvbiBjYWxsJyAncHVuY3Qgc3RyaW5nIHNpbmdsZScgJ3B1bmN0IHN0cmluZyBkb3VibGUnICdwdW5jdCBkaXInXG4gICAgICAgICAgICAgICAgKHMpIC0+IGtvbG9yLmdyZWVuIGtvbG9yLmRpbSBzXG4gICAgICAgICAgICB3aGVuICdvYmonICdjbGFzcycgJ2dpdCBmaWxlJ1xuICAgICAgICAgICAgICAgIChzKSAtPiBrb2xvci55ZWxsb3cga29sb3IuYm9sZCBzXG4gICAgICAgICAgICB3aGVuICdwdW5jdCBnaXQnICdnaXQgZXh0J1xuICAgICAgICAgICAgICAgIChzKSAtPiBrb2xvci55ZWxsb3cga29sb3IuZGltIHNcbiAgICAgICAgICAgIHdoZW4gJ251bWJlcicgJ2tleXdvcmQnICd1cmwgZG9tYWluJ1xuICAgICAgICAgICAgICAgIChzKSAtPiBrb2xvci5ibHVlIGtvbG9yLmJvbGQgc1xuICAgICAgICAgICAgd2hlbiAncmVxdWlyZScgJ3B1bmN0IHByb3BlcnR5J1xuICAgICAgICAgICAgICAgIChzKSAtPiBrb2xvci5ncmVlbiBrb2xvci5kaW0gc1xuICAgICAgICAgICAgd2hlbiAncHVuY3Qgc2VtdmVyJyAndXJsIHByb3RvY29sJyAncHVuY3QgdXJsJ1xuICAgICAgICAgICAgICAgIChzKSAtPiBrb2xvci5tYWdlbnRhIHNcbiAgICAgICAgICAgIHdoZW4gJ3NlbXZlcicgJ2RpciB1cmwgdGxkJyAncHVuY3QgdXJsIHRsZCdcbiAgICAgICAgICAgICAgICAocykgLT4ga29sb3IubWFnZW50YSBrb2xvci5ib2xkIHNcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAocykgLT4ga29sb3Iud2hpdGUga29sb3IuYm9sZCBzXG4gICAgICAgICAgICBcbiAgICAgICAgcGxhaW4gICs9IHJuZy5tYXRjaFxuICAgICAgICByZXN1bHQgKz0gY2Z1bmMgcm5nLm1hdGNoXG4gICAgXG4gICAgcmVzdWx0XG5cbm1vZHVsZS5leHBvcnRzID0gcmVuZGVyXG4iXX0=
//# sourceURL=../coffee/render.coffee