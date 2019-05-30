// koffee 0.52.0

/*
000   000   0000000   000      000   000
000 0 000  000   000  000      000  000 
000000000  000000000  000      0000000  
000   000  000   000  000      000  000 
00     00  000   000  0000000  000   000
 */

(function() {
    var _, argDir, config, kerror, ref, should, slash, target, walk, walkdir,
        indexOf = [].indexOf;

    ref = require('kxk'), walkdir = ref.walkdir, slash = ref.slash, kerror = ref.kerror, _ = ref._;

    argDir = require('./argdir');

    should = require('./should');

    target = require('./target');

    config = require('./config');

    walk = function(wlk, opt, cb) {
        var err;
        if (_.isFunction(opt)) {
            cb = opt;
            opt = {};
        }
        try {
            return walkdir.sync(argDir(), function(wp) {
                var o, p, ref1;
                p = slash.path(wp);
                o = config.obj(p, opt);
                if (should('ignore', o, p)) {
                    if (opt.all) {
                        cb(p);
                    }
                    this.ignore(wp);
                    return;
                }
                if (should('ignore', wlk, p)) {
                    if (opt.all) {
                        cb(p);
                    }
                    this.ignore(wp);
                    return;
                }
                if (ref1 = slash.ext(p), indexOf.call(_.keys(o), ref1) >= 0) {
                    return cb(p, target(p, opt));
                } else {
                    if (opt.all) {
                        if (!cb(p)) {
                            return this.ignore(wp);
                        }
                    }
                }
            });
        } catch (error) {
            err = error;
            return kerror("walk", err.toString());
        }
    };

    module.exports = walk;

}).call(this);
