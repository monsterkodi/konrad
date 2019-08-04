// koffee 1.3.0

/*
00000000  00000000   00000000    0000000   00000000
000       000   000  000   000  000   000  000   000
0000000   0000000    0000000    000   000  0000000
000       000   000  000   000  000   000  000   000
00000000  000   000  000   000   0000000   000   000
 */

(function() {
    var klog, kolor, konradError, kstr, pretty, ref;

    ref = require('kxk'), klog = ref.klog, kstr = ref.kstr, kolor = ref.kolor;

    pretty = require('./pretty');

    konradError = function(title, msg, srcFile) {
        var msgsplit, stripped;
        if (title === 'compile error') {
            klog(pretty.time(), "😡  " + msg);
        } else {
            msgsplit = msg.split('\n');
            stripped = msgsplit.map(function(s) {
                return kstr.stripAnsi(s);
            });
            klog(title.bold.yellow + " " + (kolor.r5(stripped)));
        }
        return false;
    };

    module.exports = konradError;

}).call(this);
