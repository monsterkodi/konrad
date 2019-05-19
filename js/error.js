// koffee 0.43.0

/*
00000000  00000000   00000000    0000000   00000000
000       000   000  000   000  000   000  000   000
0000000   0000000    0000000    000   000  0000000
000       000   000  000   000  000   000  000   000
00000000  000   000  000   000   0000000   000   000
 */

(function() {
    var klog, konradError, pretty, ref, slash;

    ref = require('kxk'), slash = ref.slash, klog = ref.klog;

    pretty = require('./pretty');

    konradError = function(title, msg, srcFile) {
        var col, errStr, file, fileLine, line, ref1, ref2, rest, sourceFile, splitted, stripped;
        stripped = String(msg).strip;
        splitted = stripped.split('\n');
        if (title === 'compile error') {
            ref1 = splitted[0].split(': '), fileLine = ref1[0], rest = ref1[1];
            ref2 = slash.splitFileLine(fileLine), file = ref2[0], line = ref2[1], col = ref2[2];
            splitted[0] = rest.bold.yellow;
            errStr = splitted.join('\n');
            if (srcFile) {
                file = slash.tilde(srcFile);
            }
            sourceFile = file;
            if (line) {
                sourceFile += ":" + line;
            }
            if (col) {
                sourceFile += ":" + col;
            }
            klog(pretty.time(), "😡  " + (pretty.filePath(sourceFile)) + "\n" + errStr);
        } else {
            klog(title.bold.yellow + " " + (String(stripped).red));
        }
        return false;
    };

    module.exports = konradError;

}).call(this);
