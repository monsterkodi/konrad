// koffee 0.43.0

/*
0000000    000   000  000  000      0000000  
000   000  000   000  000  000      000   000
0000000    000   000  000  000      000   000
000   000  000   000  000  000      000   000
0000000     0000000   000  0000000  0000000
 */

(function() {
    var _, argDir, args, build, colors, compile, config, empty, fs, kerror, klog, pretty, ref, runcmd, should, slash, target, writeCompiled;

    ref = require('kxk'), args = ref.args, slash = ref.slash, empty = ref.empty, fs = ref.fs, colors = ref.colors, klog = ref.klog, kerror = ref.kerror, _ = ref._;

    pretty = require('./pretty');

    config = require('./config');

    argDir = require('./argdir');

    should = require('./should');

    target = require('./target');

    compile = require('./compile');

    runcmd = require('./runcmd');

    build = function(sourceFile, opt, cb) {
        var cfg, ext, main, out, pwd, targetFile;
        if (args.debug) {
            klog("source file".gray, sourceFile);
        }
        ext = slash.extname(sourceFile).substr(1);
        cfg = config.obj(sourceFile, opt);
        if (ext === 'js' && should('browserify', cfg, sourceFile)) {
            main = cfg.browserify.main;
            out = cfg.browserify.out;
            pwd = config.path('browserify', slash.resolve(sourceFile), opt);
            if (out !== slash.relative(sourceFile, pwd)) {
                klog(pretty.filePath(_.padEnd(slash.relative(main, argDir()), 40), colors.yellow), "🔧  ", pretty.filePath(slash.relative(out, argDir()), colors.blue));
                runcmd('browserify', main + " " + out, pwd);
            }
            return;
        }
        targetFile = target(sourceFile, opt);
        if (targetFile == null) {
            console.warn("no targetFile for source: " + sourceFile, opt);
            return;
        }
        if (args.debug) {
            klog("target file".gray, targetFile);
        }
        return fs.readFile(sourceFile, 'utf8', function(err, sourceText) {
            var compiled;
            if (err) {
                return kerror("can't read " + sourceFile);
            }
            compiled = compile(sourceText, ext, sourceFile, targetFile, cfg);
            if (empty(compiled)) {
                if (args.verbose) {
                    kerror("compile failed for " + sourceFile);
                }
                return;
            }
            return fs.readFile(targetFile, 'utf8', function(err, targetData) {
                var stat, ttat;
                if (err || compiled !== targetData) {
                    return writeCompiled(sourceFile, targetFile, compiled, cb);
                } else {
                    if (args.debug) {
                        klog('unchanged'.green.dim, pretty.filePath(slash.relative(targetFile, argDir()), colors.gray));
                    }
                    if (args.verbose) {
                        klog(pretty.time(), "👍  " + (pretty.filePath(sourceFile)) + " " + '►'.bold.yellow + " " + (pretty.filePath(targetFile)));
                    }
                    stat = fs.statSync(sourceFile);
                    ttat = fs.statSync(targetFile);
                    if (stat.mtime.getTime() !== ttat.mtime.getTime()) {
                        return fs.utimesSync(slash.resolve(targetFile), stat.atime, stat.mtime);
                    }
                }
            });
        });
    };

    writeCompiled = function(sourceFile, targetFile, compiled, cb) {
        return fs.ensureDir(slash.dir(targetFile), function(err) {
            if (err) {
                return kerror("can't create output  directory" + (slash.dir(targetFile)));
            }
            return fs.writeFile(targetFile, compiled, function(err) {
                if (!empty(err)) {
                    return kerror("can't  write" + targetFile + "!", err);
                }
                if (!args.quiet) {
                    if (args.verbose) {
                        klog(pretty.time(), "👍   " + (pretty.filePath(slash.tilde(sourceFile))) + " " + '►'.bold.yellow + " " + (pretty.filePath(slash.tilde(targetFile))));
                    } else {
                        klog(pretty.time(), "👍   " + (pretty.filePath(slash.tilde(targetFile))));
                    }
                }
                return typeof cb === "function" ? cb(sourceFile, targetFile) : void 0;
            });
        });
    };

    module.exports = build;

}).call(this);
