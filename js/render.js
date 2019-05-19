// koffee 0.43.0

/*
00000000   00000000  000   000  0000000    00000000  00000000 
000   000  000       0000  000  000   000  000       000   000
0000000    0000000   000 0 000  000   000  0000000   0000000  
000   000  000       000  0000  000   000  000       000   000
000   000  00000000  000   000  0000000    00000000  000   000
 */

(function() {
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

}).call(this);
