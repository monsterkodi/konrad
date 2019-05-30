// koffee 0.52.0

/*
 0000000   0000000   000   000  00000000  000   0000000 
000       000   000  0000  000  000       000  000      
000       000   000  000 0 000  000000    000  000  0000
000       000   000  000  0000  000       000  000   000
 0000000   0000000   000   000  000       000   0000000
 */

(function() {
    var _, fs, noon, obj, path, ref, slash;

    ref = require('kxk'), slash = ref.slash, fs = ref.fs, noon = ref.noon, _ = ref._;

    path = function(key, p, opt) {
        var o, ref1;
        while (slash.dir(p).length && ((ref1 = slash.dir(p)) !== '.' && ref1 !== '/')) {
            p = slash.dir(p);
            if (fs.existsSync(slash.join(p, '.konrad.noon'))) {
                o = _.defaultsDeep(noon.load(slash.join(p, '.konrad.noon')), opt);
                if (o[key] != null) {
                    return slash.resolve(p);
                }
            }
        }
        return null;
    };

    obj = function(p, opt) {
        var o, ref1, ref2;
        while (slash.dir(p).length && ((ref2 = slash.dir(p)) !== '.' && ref2 !== '/') && !/^\w\:\/$/.test(slash.dir(p))) {
            p = slash.dir(p);
            if (fs.existsSync(slash.join(p, '.konrad.noon'))) {
                o = _.defaultsDeep(noon.load(slash.join(p, '.konrad.noon')), opt);
                if (((ref1 = o.ignore) != null ? ref1.map : void 0) != null) {
                    o.ignore = o.ignore.map(function(i) {
                        if (_.isString(i)) {
                            return new RegExp(i);
                        } else {
                            return i;
                        }
                    });
                }
                return o;
            }
        }
        return opt;
    };

    module.exports = {
        path: path,
        obj: obj
    };

}).call(this);
