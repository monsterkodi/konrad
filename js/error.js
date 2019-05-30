// koffee 0.52.0

/*
00000000  00000000   00000000    0000000   00000000
000       000   000  000   000  000   000  000   000
0000000   0000000    0000000    000   000  0000000
000       000   000  000   000  000   000  000   000
00000000  000   000  000   000   0000000   000   000
 */

(function() {
    var colors, klog, konradError, pretty, ref, slash;

    ref = require('kxk'), slash = ref.slash, klog = ref.klog, colors = ref.colors;

    pretty = require('./pretty');

    konradError = function(title, msg, srcFile) {
        var msgsplit, stripped;
        msgsplit = msg.split('\n');
        stripped = msgsplit.map(function(s) {
            return colors.strip(s);
        });
        if (title === 'compile error') {
            klog(pretty.time(), "😡  " + msg);
        } else {
            klog(title.bold.yellow + " " + (colors.red(stripped)));
        }
        return false;
    };

    module.exports = konradError;

}).call(this);
