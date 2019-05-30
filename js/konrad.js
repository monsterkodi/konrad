// koffee 0.52.0

/*
000   000   0000000   000   000  00000000    0000000   0000000
000  000   000   000  0000  000  000   000  000   000  000   000
0000000    000   000  000 0 000  0000000    000000000  000   000
000  000   000   000  000  0000  000   000  000   000  000   000
000   000   0000000   000   000  000   000  000   000  0000000
 */

(function() {
    var _, actions, argDir, args, build, cmd, colors, config, dirty, dotGit, fs, gitcount, gitup, j, klog, len, noon, opt, optall, pkg, pretty, ref, ref1, runcmd, should, slash, status, walk, watch, wlk;

    ref = require('kxk'), args = ref.args, colors = ref.colors, slash = ref.slash, noon = ref.noon, fs = ref.fs, klog = ref.klog, _ = ref._;

    argDir = require('./argdir');

    build = require('./build');

    config = require('./config');

    pretty = require('./pretty');

    runcmd = require('./runcmd');

    should = require('./should');

    status = require('./status');

    watch = require('./watch');

    walk = require('./walk');

    pkg = require(__dirname + "/../package");

    args = args.init("arguments  depend on options                            **\nrun        build dirty or missing targets in dir        false\nrebuild    rebuild all targets in dir                   false  -R\nwatch      watch directory for changes                  false\ninfo       show build status of dir                     false\nbump       bump package.* version [major|minor|patch]   false\ndiff       show git diff of file/dir                    false\nstatus     show git status of file/dir                  false\ncommit     add, commit and push [msg]                   false\nupdate     update npm packages                          false\npublish    bump, commit & publish to npm [msg]          false\ntest       run tests                                    false\nverbose    log more                                     false\nquiet      log nothing                                  false\ndebug      log debug                                    false  -D\nlogtime    log with time                                true", {
        pkg: pkg
    });

    actions = ['bump', 'commit', 'publish', 'update', 'test', 'watch', 'run', 'rebuild', 'info', 'status', 'diff'];

    if (!actions.map(function(a) {
        return args[a];
    }).reduce(function(acc, val) {
        return acc || val;
    })) {
        args.run = true;
    }

    opt = noon.parse("coffee  . ext js   . map true . replace .. /coffee/ /js/ .. ^coffee/ js/ \nkoffee  . ext js   . map true . replace .. /coffee/ /js/ .. ^coffee/ js/ \nnoon    . ext json\njson    . ext noon . filter  .. package.json$\nstyl    . ext css  . replace .. /style/ /css/ .. /styl/ /js/css/\npug     . ext html . replace .. /pug/ /js/");

    opt.ignore = [/gulpfile.coffee$/, /Gruntfile.coffee$/, /\.konrad\.noon$/, /menu.noon$/];

    wlk = {
        ignore: [/node_modules$/, /bower_components$/, /\/img$/, /\/\..+$/, /\.git$/, /\.app$/, /.*-x64$/, /.*-ia32$/, /\/?inno$/, /\/?js$/]
    };

    dirty = function(sourceFile, targetFile) {
        var ss, ts;
        if (!fs.existsSync(targetFile)) {
            return true;
        }
        ss = fs.statSync(sourceFile);
        ts = fs.statSync(targetFile);
        return ss.mtime.getTime() > ts.mtime.getTime();
    };

    if (args.info) {
        console.log('○● info'.gray);
        walk(wlk, opt, function(sourceFile, targetFile) {
            if (args.verbose) {
                console.log("source: " + sourceFile + " target: " + targetFile);
            }
            if (dirty(sourceFile, targetFile)) {
                return console.log(pretty.filePath(_.padEnd(slash.relative(sourceFile, argDir()), 40), colors.yellow), " ► ".red.dim, pretty.filePath(slash.relative(targetFile, argDir()), colors.red));
            } else if (args.verbose) {
                return console.log(pretty.filePath(_.padEnd(slash.relative(sourceFile, argDir()), 40), colors.magenta), " ► ".green.dim, pretty.filePath(slash.relative(targetFile, argDir()), colors.green));
            }
        });
    }

    if (args.diff) {
        args.status = true;
    }

    if (args.status) {
        optall = _.defaults(opt, {
            all: true
        });
        gitcount = 0;
        walk(wlk, optall, function(sourceFile, targetFile) {
            var i, j, len, ref1;
            if (!targetFile) {
                if (slash.basename(sourceFile) === '.git') {
                    status.gitStatus(sourceFile);
                    gitcount += 1;
                }
                if (slash.dirExists(sourceFile)) {
                    ref1 = opt.ignore;
                    for (j = 0, len = ref1.length; j < len; j++) {
                        i = ref1[j];
                        if (i.test(sourceFile)) {
                            return false;
                        }
                    }
                }
            }
            return true;
        });
        if (!gitcount) {
            gitup = slash.parse(argDir());
            while (gitup.base) {
                dotGit = slash.join(gitup.dir, '.git');
                if (fs.existsSync(dotGit)) {
                    status.gitStatus(dotGit);
                    break;
                }
                gitup = slash.parse(gitup.dir);
            }
        }
    }

    if (args.run || args.rebuild) {
        if (!args.quiet) {
            klog('🔧🔧 ' + (args.rebuild && 'rebuild' || 'run').gray);
        }
        walk(wlk, opt, function(sourceFile, targetFile) {
            var isDirty, src, tgt;
            if (targetFile) {
                isDirty = dirty(sourceFile, targetFile);
                if (args.rebuild || isDirty) {
                    src = pretty.filePath(_.padEnd(slash.relative(sourceFile, argDir()), 40), isDirty && colors.red || colors.yellow);
                    tgt = pretty.filePath(slash.relative(targetFile, argDir()), colors.green);
                    if (!args.quiet) {
                        klog(src, "🔧  ", tgt);
                    }
                    return build(sourceFile, opt, function(sourceFile, targetFile) {
                        var o;
                        o = config.obj(targetFile, opt);
                        if (should('browserify', o, targetFile)) {
                            console.log(pretty.filePath(_.padEnd(slash.relative(o.browserify.main, argDir()), 40), colors.yellow), "🔧  ", pretty.filePath(slash.relative(o.browserify.out, argDir()), colors.blue));
                            return runcmd('browserify', o.browserify.main + " " + o.browserify.out, config.path('browserify', slash.resolve(targetFile), opt));
                        }
                    });
                }
            }
        });
    }

    ref1 = ['update', 'bump', 'commit', 'publish', 'test'];
    for (j = 0, len = ref1.length; j < len; j++) {
        cmd = ref1[j];
        if (args[cmd]) {
            if (!runcmd(cmd, args["arguments"].join(' ', process.cwd()))) {
                process.exit(1);
                break;
            }
            if (args.verbose) {
                klog('🔧  done'.gray);
            }
            if (args["arguments"] && (cmd === 'commit' || cmd === 'bump')) {
                break;
            }
        }
    }

    if (args.watch) {
        watch(wlk, opt);
    }

}).call(this);
