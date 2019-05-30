// koffee 0.56.0

/*
 0000000  000   000   0000000   000   000  000      0000000  
000       000   000  000   000  000   000  000      000   000
0000000   000000000  000   000  000   000  000      000   000
     000  000   000  000   000  000   000  000      000   000
0000000   000   000   0000000    0000000   0000000  0000000
 */

(function() {
    var _, argDir, args, colors, klog, pretty, ref, should, slash;

    ref = require('kxk'), args = ref.args, slash = ref.slash, colors = ref.colors, klog = ref.klog, _ = ref._;

    argDir = require('./argdir');

    pretty = require('./pretty');

    should = function(k, o, p) {
        var i, j, keys, len, r;
        if (o[k] == null) {
            return false;
        }
        if (_.isArray(o[k])) {
            keys = o[k];
        } else if (_.isObject(o[k])) {
            keys = _.keys(o[k]);
        } else {
            keys = [o[k]];
        }
        for (j = 0, len = keys.length; j < len; j++) {
            i = keys[j];
            r = i;
            if (_.isString(i)) {
                r = new RegExp(i);
            }
            if (r.test(p)) {
                if (args.debug) {
                    klog(pretty.filePath(slash.relative(p, argDir()), colors.gray), 'should '.blue + k.bold.blue);
                }
                return true;
            }
        }
        return false;
    };

    module.exports = should;

}).call(this);
