// koffee 0.45.0

/*
000   000   0000000   000000000   0000000  000   000
000 0 000  000   000     000     000       000   000
000000000  000000000     000     000       000000000
000   000  000   000     000     000       000   000
00     00  000   000     000      0000000  000   000
 */

(function() {
    var Watch, _, args, build, childp, colors, config, klog, pkg, pretty, ref, runcmd, should, slash, watch, watcher,
        indexOf = [].indexOf;

    ref = require('kxk'), watch = ref.watch, args = ref.args, slash = ref.slash, childp = ref.childp, colors = ref.colors, klog = ref.klog, _ = ref._;

    pretty = require('./pretty');

    should = require('./should');

    runcmd = require('./runcmd');

    config = require('./config');

    build = require('./build');

    pkg = require('../package.json');

    watcher = null;

    Watch = function(wlk, opt) {
        var start;
        start = function(cb) {
            var d, pass, ref1, v;
            pass = function(p) {
                var ref1;
                if (ref1 = slash.ext(p), indexOf.call(_.keys(opt), ref1) >= 0) {
                    return true;
                }
            };
            d = (ref1 = args["arguments"][0]) != null ? ref1 : '.';
            v = (pkg.version + " ●").dim.gray;
            klog(pretty.time(), ("👁   " + v + " " + (pretty.filePath(slash.resolve(d), colors.white))).gray);
            watcher = watch.watch(d, {
                recursive: true,
                ignore: wlk.ignore
            });
            return watcher.on('change', function(info) {
                if (pass(info.path)) {
                    return cb(slash.path(info.path));
                }
            });
        };
        return start(function(sourceFile) {
            var o, test;
            sourceFile = slash.resolve(sourceFile);
            o = config.obj(sourceFile, opt);
            test = function(source) {
                if (should('test', o, source)) {
                    return runcmd('test', source, config.path('test', slash.resolve(source), opt));
                }
            };
            if (!should('ignore', o, sourceFile)) {
                return build(sourceFile, opt, test);
            } else {
                return test(sourceFile);
            }
        });
    };

    module.exports = Watch;

}).call(this);
