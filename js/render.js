// koffee 0.43.0

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
                    return colors.white.bold;
            }
        })();
        plain += rng.match;
        result += cfunc(rng.match);
    }
    return result;
};

module.exports = render;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRRSxTQUFXLE9BQUEsQ0FBUSxLQUFSOztBQUViLE1BQUEsR0FBUyxTQUFDLEdBQUQ7QUFFTCxRQUFBO0lBQUEsTUFBQSxHQUFTO0lBQ1QsS0FBQSxHQUFTO0FBRVQsU0FBYSwyRkFBYjtRQUNJLEdBQUEsR0FBTSxHQUFJLENBQUEsS0FBQTtBQUNWLGVBQU0sS0FBSyxDQUFDLE1BQU4sR0FBZSxHQUFHLENBQUMsS0FBekI7WUFDSSxLQUFBLElBQVU7WUFDVixNQUFBLElBQVU7UUFGZDtRQUlBLEtBQUE7QUFBUSxvQkFBTyxHQUFHLENBQUMsS0FBWDtBQUFBLHFCQUNDLE1BREQ7MkJBRUEsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUZiLHFCQUdDLFNBSEQ7MkJBSUEsTUFBTSxDQUFDLElBQUksQ0FBQztBQUpaLHFCQUtDLHFCQUxEO0FBQUEscUJBS3dCLGFBTHhCOzJCQU1BLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFOWixxQkFPQyxVQVBEO0FBQUEscUJBT2EsZUFQYjtBQUFBLHFCQU84QixlQVA5QjtBQUFBLHFCQU8rQyxlQVAvQztBQUFBLHFCQU9nRSxVQVBoRTtBQUFBLHFCQU80RSxVQVA1RTsyQkFRQSxNQUFNLENBQUMsS0FBSyxDQUFDO0FBUmIscUJBU0MsMkJBVEQ7QUFBQSxxQkFTOEIsMkJBVDlCO0FBQUEscUJBUzJELDJCQVQzRDtBQUFBLHFCQVN3RixpQkFUeEY7MkJBVUEsTUFBTSxDQUFDLEtBQUssQ0FBQztBQVZiLHFCQVdDLEtBWEQ7QUFBQSxxQkFXUSxPQVhSO0FBQUEscUJBV2lCLFVBWGpCOzJCQVlBLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFaZCxxQkFhQyxpQkFiRDtBQUFBLHFCQWFvQixTQWJwQjsyQkFjQSxNQUFNLENBQUMsTUFBTSxDQUFDO0FBZGQscUJBZUMsUUFmRDtBQUFBLHFCQWVXLFNBZlg7QUFBQSxxQkFlc0IsWUFmdEI7MkJBZ0JBLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFoQloscUJBaUJDLFNBakJEO0FBQUEscUJBaUJZLHNCQWpCWjsyQkFrQkEsTUFBTSxDQUFDLEtBQUssQ0FBQztBQWxCYixxQkFtQkMsb0JBbkJEO0FBQUEscUJBbUJ1QixjQW5CdkI7QUFBQSxxQkFtQnVDLGlCQW5CdkM7MkJBb0JBLE1BQU0sQ0FBQztBQXBCUCxxQkFxQkMsUUFyQkQ7QUFBQSxxQkFxQlcsYUFyQlg7QUFBQSxxQkFxQjBCLHFCQXJCMUI7MkJBc0JBLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUF0QmY7MkJBd0JBLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUF4QmI7O1FBMEJSLEtBQUEsSUFBVSxHQUFHLENBQUM7UUFDZCxNQUFBLElBQVUsS0FBQSxDQUFNLEdBQUcsQ0FBQyxLQUFWO0FBakNkO1dBbUNBO0FBeENLOztBQTBDVCxNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAwMDAwMCBcbjAwMCAgIDAwMCAgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4wMDAwMDAwICAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAgIFxuMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbjAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwMCAgMDAwICAgMDAwXG4jIyNcblxueyBjb2xvcnMgfSA9IHJlcXVpcmUgJ2t4aydcblxucmVuZGVyID0gKHJncykgLT5cblxuICAgIHJlc3VsdCA9ICcnXG4gICAgcGxhaW4gID0gJydcbiAgICBcbiAgICBmb3IgaW5kZXggaW4gWzAuLi5yZ3MubGVuZ3RoXVxuICAgICAgICBybmcgPSByZ3NbaW5kZXhdXG4gICAgICAgIHdoaWxlIHBsYWluLmxlbmd0aCA8IHJuZy5zdGFydFxuICAgICAgICAgICAgcGxhaW4gICs9ICcgJ1xuICAgICAgICAgICAgcmVzdWx0ICs9ICcgJ1xuXG4gICAgICAgIGNmdW5jID0gc3dpdGNoIHJuZy52YWx1ZVxuICAgICAgICAgICAgd2hlbiAndGV4dCdcbiAgICAgICAgICAgICAgICBjb2xvcnMud2hpdGUuZGltXG4gICAgICAgICAgICB3aGVuICdjb21tZW50J1xuICAgICAgICAgICAgICAgIGNvbG9ycy5ncmF5LmJvbGRcbiAgICAgICAgICAgIHdoZW4gJ2NvbW1lbnQgcHVuY3R1YXRpb24nLCAncHVuY3R1YXRpb24nXG4gICAgICAgICAgICAgICAgY29sb3JzLmdyYXkuZGltXG4gICAgICAgICAgICB3aGVuICdmdW5jdGlvbicsICdmdW5jdGlvbiBjYWxsJywgJ3N0cmluZyBzaW5nbGUnLCAnc3RyaW5nIGRvdWJsZScsICdkaXIgdGV4dCcsICdwcm9wZXJ0eSdcbiAgICAgICAgICAgICAgICBjb2xvcnMuZ3JlZW4uYm9sZFxuICAgICAgICAgICAgd2hlbiAnZnVuY3Rpb24gY2FsbCBwdW5jdHVhdGlvbicsICdzdHJpbmcgc2luZ2xlIHB1bmN0dWF0aW9uJywgJ3N0cmluZyBkb3VibGUgcHVuY3R1YXRpb24nLCAnZGlyIHB1bmN0dWF0aW9uJ1xuICAgICAgICAgICAgICAgIGNvbG9ycy5ncmVlbi5kaW1cbiAgICAgICAgICAgIHdoZW4gJ29iaicsICdjbGFzcycsICdnaXQgZmlsZSdcbiAgICAgICAgICAgICAgICBjb2xvcnMueWVsbG93LmJvbGRcbiAgICAgICAgICAgIHdoZW4gJ2dpdCBwdW5jdHVhdGlvbicsICdnaXQgZXh0J1xuICAgICAgICAgICAgICAgIGNvbG9ycy55ZWxsb3cuZGltXG4gICAgICAgICAgICB3aGVuICdudW1iZXInLCAna2V5d29yZCcsICd1cmwgZG9tYWluJ1xuICAgICAgICAgICAgICAgIGNvbG9ycy5ibHVlLmJvbGRcbiAgICAgICAgICAgIHdoZW4gJ3JlcXVpcmUnLCAncHJvcGVydHkgcHVuY3R1YXRpb24nXG4gICAgICAgICAgICAgICAgY29sb3JzLmdyZWVuLmRpbVxuICAgICAgICAgICAgd2hlbiAnc2VtdmVyIHB1bmN0dWF0aW9uJywgJ3VybCBwcm90b2NvbCcsICd1cmwgcHVuY3R1YXRpb24nXG4gICAgICAgICAgICAgICAgY29sb3JzLm1hZ2VudGFcbiAgICAgICAgICAgIHdoZW4gJ3NlbXZlcicsICdkaXIgdXJsIHRsZCcsICd1cmwgdGxkIHB1bmN0dWF0aW9uJ1xuICAgICAgICAgICAgICAgIGNvbG9ycy5tYWdlbnRhLmJvbGRcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjb2xvcnMud2hpdGUuYm9sZFxuICAgICAgICAgICAgXG4gICAgICAgIHBsYWluICArPSBybmcubWF0Y2hcbiAgICAgICAgcmVzdWx0ICs9IGNmdW5jIHJuZy5tYXRjaFxuICAgIFxuICAgIHJlc3VsdFxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbmRlclxuIl19
//# sourceURL=../coffee/render.coffee