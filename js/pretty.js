// koffee 1.3.0

/*
00000000   00000000   00000000  000000000  000000000  000   000
000   000  000   000  000          000        000      000 000
00000000   0000000    0000000      000        000       00000
000        000   000  000          000        000        000
000        000   000  00000000     000        000        000
 */

(function() {
    var _, args, colors, os, pretty, ref, slash, valid;

    ref = require('kxk'), args = ref.args, valid = ref.valid, colors = ref.colors, slash = ref.slash, os = ref.os, _ = ref._;

    pretty = {};

    pretty.path = function(p, c) {
        if (c == null) {
            c = colors.yellow;
        }
        return p.split('/').map(function(n) {
            return c(n);
        }).join(c('/').dim);
    };

    pretty.ext = function(e, c) {
        if (c == null) {
            c = colors.yellow;
        }
        if (e.length) {
            return c('.').dim + c(e.substr(1));
        } else {
            return '';
        }
    };

    pretty.file = function(f, c) {
        if (c == null) {
            c = colors.yellow;
        }
        return "" + (c(slash.base(f)).bold) + (pretty.ext(slash.extname(f), c));
    };

    pretty.filePath = function(p, c) {
        if (c == null) {
            c = colors.yellow;
        }
        p = p.replace(os.homedir(), "~");
        if (valid(slash.dir(p))) {
            return "" + (pretty.path(slash.dir(p), c)) + (pretty.path('/', c)) + (pretty.file(slash.basename(p), c));
        } else {
            return "" + (pretty.file(slash.basename(p), c));
        }
    };

    pretty.time = function() {
        var d;
        if (args.logtime) {
            d = new Date();
            return ["" + (_.padStart(String(d.getHours()), 2, '0').gray) + ':'.dim.gray, "" + (_.padStart(String(d.getMinutes()), 2, '0').gray) + ':'.dim.gray, "" + (_.padStart(String(d.getSeconds()), 2, '0').gray)].join('');
        } else {
            return '';
        }
    };

    module.exports = pretty;

}).call(this);
