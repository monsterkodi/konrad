// koffee 0.52.0

/*
000000000   0000000   00000000    0000000   00000000  000000000
   000     000   000  000   000  000        000          000   
   000     000000000  0000000    000  0000  0000000      000   
   000     000   000  000   000  000   000  000          000   
   000     000   000  000   000   0000000   00000000     000
 */

(function() {
    var _, argDir, args, colors, config, klog, ref, slash, target;

    ref = require('kxk'), args = ref.args, slash = ref.slash, colors = ref.colors, klog = ref.klog, _ = ref._;

    argDir = require('./argdir');

    config = require('./config');

    target = function(sourceFile, opt) {
        var ext, i, k, len, matches, o, r, ref1, ref2, ref3, ref4, ref5, targetFile, v;
        ext = slash.ext(sourceFile);
        o = config.obj(sourceFile, opt);
        if (((ref1 = o[ext]) != null ? ref1.filter : void 0) != null) {
            matches = false;
            ref2 = o[ext].filter;
            for (i = 0, len = ref2.length; i < len; i++) {
                r = ref2[i];
                if (new RegExp(r).test(sourceFile)) {
                    matches = true;
                }
            }
            if (!matches) {
                if (args.debug) {
                    klog(pretty.filePath(slash.relative(sourceFile, argDir()), colors.blue));
                }
                return;
            }
        }
        targetFile = _.clone(sourceFile);
        if (((ref3 = o[ext]) != null ? ref3.replace : void 0) != null) {
            ref4 = o[ext].replace;
            for (k in ref4) {
                v = ref4[k];
                targetFile = targetFile.replace(k, v);
            }
        }
        if (((ref5 = o[ext]) != null ? ref5.ext : void 0) == null) {
            return;
        }
        return targetFile = slash.join(slash.dir(targetFile), slash.base(targetFile) + '.' + o[ext].ext);
    };

    module.exports = target;

}).call(this);
