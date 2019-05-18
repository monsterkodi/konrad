// koffee 0.43.0

/*
000   000   0000000   000   000  00000000    0000000   0000000
000  000   000   000  0000  000  000   000  000   000  000   000
0000000    000   000  000 0 000  0000000    000000000  000   000
000  000   000   000  000  0000  000   000  000   000  000   000
000   000   0000000   000   000  000   000  000   000  0000000
 */
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia29ucmFkLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRQSxNQUE2QyxPQUFBLENBQVEsS0FBUixDQUE3QyxFQUFFLGVBQUYsRUFBUSxtQkFBUixFQUFnQixpQkFBaEIsRUFBdUIsZUFBdkIsRUFBNkIsV0FBN0IsRUFBaUMsZUFBakMsRUFBdUM7O0FBRXZDLE1BQUEsR0FBYyxPQUFBLENBQVEsVUFBUjs7QUFDZCxLQUFBLEdBQWMsT0FBQSxDQUFRLFNBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLE1BQUEsR0FBYyxPQUFBLENBQVEsVUFBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLE1BQUEsR0FBYyxPQUFBLENBQVEsVUFBUjs7QUFDZCxLQUFBLEdBQWMsT0FBQSxDQUFRLFNBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxRQUFSOztBQUNkLEdBQUEsR0FBYyxPQUFBLENBQVcsU0FBRCxHQUFXLGFBQXJCOztBQUVkLElBQUEsR0FBTyxJQUFJLENBQUMsSUFBTCxDQUFVLG8vQkFBVixFQWlCRTtJQUFBLEdBQUEsRUFBSSxHQUFKO0NBakJGOztBQW1CUCxPQUFBLEdBQVUsQ0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixTQUFuQixFQUE4QixRQUE5QixFQUF3QyxNQUF4QyxFQUFnRCxPQUFoRCxFQUF5RCxLQUF6RCxFQUFnRSxTQUFoRSxFQUEyRSxNQUEzRSxFQUFtRixRQUFuRixFQUE2RixNQUE3Rjs7QUFFVixJQUFHLENBQUksT0FBTyxDQUFDLEdBQVIsQ0FBWSxTQUFDLENBQUQ7V0FBTyxJQUFLLENBQUEsQ0FBQTtBQUFaLENBQVosQ0FBMkIsQ0FBQyxNQUE1QixDQUFtQyxTQUFDLEdBQUQsRUFBSyxHQUFMO1dBQWEsR0FBQSxJQUFPO0FBQXBCLENBQW5DLENBQVA7SUFDSSxJQUFJLENBQUMsR0FBTCxHQUFXLEtBRGY7OztBQVNBLEdBQUEsR0FBTSxJQUFJLENBQUMsS0FBTCxDQUFXLHVVQUFYOztBQWVOLEdBQUcsQ0FBQyxNQUFKLEdBQWEsQ0FDVCxrQkFEUyxFQUVULG1CQUZTLEVBR1QsaUJBSFMsRUFJVCxZQUpTOztBQU9iLEdBQUEsR0FDSTtJQUFBLE1BQUEsRUFBUSxDQUNKLGVBREksRUFFSixtQkFGSSxFQUdKLFFBSEksRUFJSixTQUpJLEVBS0osUUFMSSxFQU1KLFFBTkksRUFPSixTQVBJLEVBUUosVUFSSSxFQVNKLFVBVEksRUFVSixRQVZJLENBQVI7OztBQW1CSixLQUFBLEdBQVEsU0FBQyxVQUFELEVBQWEsVUFBYjtBQUVKLFFBQUE7SUFBQSxJQUFHLENBQUksRUFBRSxDQUFDLFVBQUgsQ0FBYyxVQUFkLENBQVA7QUFBcUMsZUFBTyxLQUE1Qzs7SUFDQSxFQUFBLEdBQUssRUFBRSxDQUFDLFFBQUgsQ0FBWSxVQUFaO0lBQ0wsRUFBQSxHQUFLLEVBQUUsQ0FBQyxRQUFILENBQVksVUFBWjtXQUNMLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBVCxDQUFBLENBQUEsR0FBcUIsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFULENBQUE7QUFMakI7O0FBYVIsSUFBRyxJQUFJLENBQUMsSUFBUjtJQUVHLE9BQUEsQ0FBQyxHQUFELENBQUssU0FBUyxDQUFDLElBQWY7SUFFQyxJQUFBLENBQUssR0FBTCxFQUFVLEdBQVYsRUFBZSxTQUFDLFVBQUQsRUFBYSxVQUFiO1FBRVosSUFBc0QsSUFBSSxDQUFDLE9BQTNEO1lBQUEsT0FBQSxDQUFDLEdBQUQsQ0FBSyxVQUFBLEdBQVcsVUFBWCxHQUFzQixXQUF0QixHQUFpQyxVQUF0QyxFQUFBOztRQUNDLElBQUcsS0FBQSxDQUFNLFVBQU4sRUFBa0IsVUFBbEIsQ0FBSDttQkFDRyxPQUFBLENBQUMsR0FBRCxDQUFLLE1BQU0sQ0FBQyxRQUFQLENBQWdCLENBQUMsQ0FBQyxNQUFGLENBQVMsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLE1BQUEsQ0FBQSxDQUEzQixDQUFULEVBQStDLEVBQS9DLENBQWhCLEVBQW9FLE1BQU0sQ0FBQyxNQUEzRSxDQUFMLEVBQXlGLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBbkcsRUFBd0csTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLE1BQUEsQ0FBQSxDQUEzQixDQUFoQixFQUFzRCxNQUFNLENBQUMsR0FBN0QsQ0FBeEcsRUFESDtTQUFBLE1BRUssSUFBRyxJQUFJLENBQUMsT0FBUjttQkFDRixPQUFBLENBQUMsR0FBRCxDQUFLLE1BQU0sQ0FBQyxRQUFQLENBQWdCLENBQUMsQ0FBQyxNQUFGLENBQVMsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLE1BQUEsQ0FBQSxDQUEzQixDQUFULEVBQStDLEVBQS9DLENBQWhCLEVBQW9FLE1BQU0sQ0FBQyxPQUEzRSxDQUFMLEVBQTBGLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBdEcsRUFBMkcsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLE1BQUEsQ0FBQSxDQUEzQixDQUFoQixFQUFzRCxNQUFNLENBQUMsS0FBN0QsQ0FBM0csRUFERTs7SUFMTSxDQUFmLEVBSko7OztBQVlBLElBQUcsSUFBSSxDQUFDLElBQVI7SUFFSSxJQUFJLENBQUMsTUFBTCxHQUFlLEtBRm5COzs7QUFJQSxJQUFHLElBQUksQ0FBQyxNQUFSO0lBRUksTUFBQSxHQUFTLENBQUMsQ0FBQyxRQUFGLENBQVcsR0FBWCxFQUFnQjtRQUFBLEdBQUEsRUFBSyxJQUFMO0tBQWhCO0lBQ1QsUUFBQSxHQUFXO0lBRVgsSUFBQSxDQUFLLEdBQUwsRUFBVSxNQUFWLEVBQWtCLFNBQUMsVUFBRCxFQUFhLFVBQWI7QUFFZCxZQUFBO1FBQUEsSUFBRyxDQUFJLFVBQVA7WUFFSSxJQUFHLEtBQUssQ0FBQyxRQUFOLENBQWUsVUFBZixDQUFBLEtBQThCLE1BQWpDO2dCQUNJLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFVBQWpCO2dCQUNBLFFBQUEsSUFBWSxFQUZoQjs7WUFJQSxJQUFHLEtBQUssQ0FBQyxTQUFOLENBQWdCLFVBQWhCLENBQUg7QUFDSTtBQUFBLHFCQUFBLHNDQUFBOztvQkFDSSxJQUFHLENBQUMsQ0FBQyxJQUFGLENBQU8sVUFBUCxDQUFIO0FBQ0ksK0JBQU8sTUFEWDs7QUFESixpQkFESjthQU5KOztlQVVBO0lBWmMsQ0FBbEI7SUFjQSxJQUFHLENBQUksUUFBUDtRQUNJLEtBQUEsR0FBUSxLQUFLLENBQUMsS0FBTixDQUFZLE1BQUEsQ0FBQSxDQUFaO0FBQ1IsZUFBTSxLQUFLLENBQUMsSUFBWjtZQUNJLE1BQUEsR0FBUyxLQUFLLENBQUMsSUFBTixDQUFXLEtBQUssQ0FBQyxHQUFqQixFQUFzQixNQUF0QjtZQUNULElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxNQUFkLENBQUg7Z0JBQ0ksTUFBTSxDQUFDLFNBQVAsQ0FBaUIsTUFBakI7QUFDQSxzQkFGSjs7WUFHQSxLQUFBLEdBQVEsS0FBSyxDQUFDLEtBQU4sQ0FBWSxLQUFLLENBQUMsR0FBbEI7UUFMWixDQUZKO0tBbkJKOzs7QUFrQ0EsSUFBRyxJQUFJLENBQUMsR0FBTCxJQUFZLElBQUksQ0FBQyxPQUFwQjtJQUVJLElBQUcsQ0FBSSxJQUFJLENBQUMsS0FBWjtRQUNJLElBQUEsQ0FBSyxPQUFBLEdBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTCxJQUFpQixTQUFqQixJQUE4QixLQUEvQixDQUFxQyxDQUFDLElBQXJELEVBREo7O0lBR0EsSUFBQSxDQUFLLEdBQUwsRUFBVSxHQUFWLEVBQWUsU0FBQyxVQUFELEVBQWEsVUFBYjtBQUNYLFlBQUE7UUFBQSxJQUFHLFVBQUg7WUFDSSxPQUFBLEdBQVUsS0FBQSxDQUFNLFVBQU4sRUFBa0IsVUFBbEI7WUFDVixJQUFHLElBQUksQ0FBQyxPQUFMLElBQWdCLE9BQW5CO2dCQUNJLEdBQUEsR0FBTSxNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFDLENBQUMsTUFBRixDQUFTLEtBQUssQ0FBQyxRQUFOLENBQWUsVUFBZixFQUEyQixNQUFBLENBQUEsQ0FBM0IsQ0FBVCxFQUErQyxFQUEvQyxDQUFoQixFQUFvRSxPQUFBLElBQVksTUFBTSxDQUFDLEdBQW5CLElBQTBCLE1BQU0sQ0FBQyxNQUFyRztnQkFDTixHQUFBLEdBQU0sTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLE1BQUEsQ0FBQSxDQUEzQixDQUFoQixFQUFzRCxNQUFNLENBQUMsS0FBN0Q7Z0JBQ04sSUFBRyxDQUFJLElBQUksQ0FBQyxLQUFaO29CQUNJLElBQUEsQ0FBSyxHQUFMLEVBQVUsTUFBVixFQUFrQixHQUFsQixFQURKOzt1QkFFQSxLQUFBLENBQU0sVUFBTixFQUFrQixHQUFsQixFQUF1QixTQUFDLFVBQUQsRUFBYSxVQUFiO0FBQ25CLHdCQUFBO29CQUFBLENBQUEsR0FBSSxNQUFNLENBQUMsR0FBUCxDQUFXLFVBQVgsRUFBdUIsR0FBdkI7b0JBQ0osSUFBRyxNQUFBLENBQU8sWUFBUCxFQUFxQixDQUFyQixFQUF3QixVQUF4QixDQUFIO3dCQUNJLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxLQUFLLENBQUMsUUFBTixDQUFlLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBNUIsRUFBa0MsTUFBQSxDQUFBLENBQWxDLENBQVQsRUFBc0QsRUFBdEQsQ0FBaEIsRUFBMkUsTUFBTSxDQUFDLE1BQWxGLENBQVosRUFBdUcsTUFBdkcsRUFBK0csTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQTVCLEVBQWlDLE1BQUEsQ0FBQSxDQUFqQyxDQUFoQixFQUE0RCxNQUFNLENBQUMsSUFBbkUsQ0FBL0c7K0JBQ0EsTUFBQSxDQUFPLFlBQVAsRUFBd0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFkLEdBQW1CLEdBQW5CLEdBQXNCLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBMUQsRUFBaUUsTUFBTSxDQUFDLElBQVAsQ0FBWSxZQUFaLEVBQTBCLEtBQUssQ0FBQyxPQUFOLENBQWMsVUFBZCxDQUExQixFQUFxRCxHQUFyRCxDQUFqRSxFQUZKOztnQkFGbUIsQ0FBdkIsRUFMSjthQUZKOztJQURXLENBQWYsRUFMSjs7O0FBbUJBO0FBQUEsS0FBQSxzQ0FBQTs7SUFFSSxJQUFHLElBQUssQ0FBQSxHQUFBLENBQVI7UUFFSSxJQUFHLENBQUksTUFBQSxDQUFPLEdBQVAsRUFBWSxJQUFJLEVBQUMsU0FBRCxFQUFVLENBQUMsSUFBZixDQUFvQixHQUFwQixFQUF5QixPQUFPLENBQUMsR0FBUixDQUFBLENBQXpCLENBQVosQ0FBUDtZQUNJLE9BQU8sQ0FBQyxJQUFSLENBQWEsQ0FBYjtBQUNBLGtCQUZKOztRQUlBLElBQXdCLElBQUksQ0FBQyxPQUE3QjtZQUFBLElBQUEsQ0FBSyxVQUFVLENBQUMsSUFBaEIsRUFBQTs7UUFFQSxJQUFHLElBQUksRUFBQyxTQUFELEVBQUosSUFBbUIsQ0FBQSxHQUFBLEtBQVEsUUFBUixJQUFBLEdBQUEsS0FBa0IsTUFBbEIsQ0FBdEI7QUFDSSxrQkFESjtTQVJKOztBQUZKOztBQWFBLElBQUcsSUFBSSxDQUFDLEtBQVI7SUFDSSxLQUFBLENBQU0sR0FBTixFQUFXLEdBQVgsRUFESiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDBcbjAwMCAgMDAwICAgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbjAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMDAwICAwMDAgICAwMDBcbjAwMCAgMDAwICAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbjAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwXG4jIyNcblxueyBhcmdzLCBjb2xvcnMsIHNsYXNoLCBub29uLCBmcywga2xvZywgXyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5hcmdEaXIgICAgICA9IHJlcXVpcmUgJy4vYXJnZGlyJ1xuYnVpbGQgICAgICAgPSByZXF1aXJlICcuL2J1aWxkJ1xuY29uZmlnICAgICAgPSByZXF1aXJlICcuL2NvbmZpZydcbnByZXR0eSAgICAgID0gcmVxdWlyZSAnLi9wcmV0dHknXG5ydW5jbWQgICAgICA9IHJlcXVpcmUgJy4vcnVuY21kJ1xuc2hvdWxkICAgICAgPSByZXF1aXJlICcuL3Nob3VsZCdcbnN0YXR1cyAgICAgID0gcmVxdWlyZSAnLi9zdGF0dXMnXG53YXRjaCAgICAgICA9IHJlcXVpcmUgJy4vd2F0Y2gnXG53YWxrICAgICAgICA9IHJlcXVpcmUgJy4vd2FsaydcbnBrZyAgICAgICAgID0gcmVxdWlyZSBcIiN7X19kaXJuYW1lfS8uLi9wYWNrYWdlXCJcblxuYXJncyA9IGFyZ3MuaW5pdCBcIlwiXCJcbiAgICBhcmd1bWVudHMgIGRlcGVuZCBvbiBvcHRpb25zICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqXG4gICAgcnVuICAgICAgICBidWlsZCBkaXJ0eSBvciBtaXNzaW5nIHRhcmdldHMgaW4gZGlyICAgICAgICBmYWxzZVxuICAgIHJlYnVpbGQgICAgcmVidWlsZCBhbGwgdGFyZ2V0cyBpbiBkaXIgICAgICAgICAgICAgICAgICAgZmFsc2UgIC1SXG4gICAgd2F0Y2ggICAgICB3YXRjaCBkaXJlY3RvcnkgZm9yIGNoYW5nZXMgICAgICAgICAgICAgICAgICBmYWxzZVxuICAgIGluZm8gICAgICAgc2hvdyBidWlsZCBzdGF0dXMgb2YgZGlyICAgICAgICAgICAgICAgICAgICAgZmFsc2VcbiAgICBidW1wICAgICAgIGJ1bXAgcGFja2FnZS4qIHZlcnNpb24gW21ham9yfG1pbm9yfHBhdGNoXSAgIGZhbHNlXG4gICAgZGlmZiAgICAgICBzaG93IGdpdCBkaWZmIG9mIGZpbGUvZGlyICAgICAgICAgICAgICAgICAgICBmYWxzZVxuICAgIHN0YXR1cyAgICAgc2hvdyBnaXQgc3RhdHVzIG9mIGZpbGUvZGlyICAgICAgICAgICAgICAgICAgZmFsc2VcbiAgICBjb21taXQgICAgIGFkZCwgY29tbWl0IGFuZCBwdXNoIFttc2ddICAgICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgdXBkYXRlICAgICB1cGRhdGUgbnBtIHBhY2thZ2VzICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZVxuICAgIHB1Ymxpc2ggICAgYnVtcCwgY29tbWl0ICYgcHVibGlzaCB0byBucG0gW21zZ10gICAgICAgICAgZmFsc2VcbiAgICB0ZXN0ICAgICAgIHJ1biB0ZXN0cyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgdmVyYm9zZSAgICBsb2cgbW9yZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZVxuICAgIHF1aWV0ICAgICAgbG9nIG5vdGhpbmcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2VcbiAgICBkZWJ1ZyAgICAgIGxvZyBkZWJ1ZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlICAtRFxuICAgIGxvZ3RpbWUgICAgbG9nIHdpdGggdGltZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZVxuICAgIFwiXCJcIiwgcGtnOnBrZ1xuXG5hY3Rpb25zID0gWydidW1wJywgJ2NvbW1pdCcsICdwdWJsaXNoJywgJ3VwZGF0ZScsICd0ZXN0JywgJ3dhdGNoJywgJ3J1bicsICdyZWJ1aWxkJywgJ2luZm8nLCAnc3RhdHVzJywgJ2RpZmYnXVxuXG5pZiBub3QgYWN0aW9ucy5tYXAoKGEpIC0+IGFyZ3NbYV0pLnJlZHVjZSgoYWNjLHZhbCkgLT4gYWNjIG9yIHZhbClcbiAgICBhcmdzLnJ1biA9IHRydWUgIyBtYWtlcyBydW4gdGhlIGRlZmF1bHQgYWN0aW9uIGlmIG5vIG90aGVyIGFjdGlvbiBpcyBzZXRcbiAgICBcbiMgMDAwMDAwMCAgICAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAwMDAwMDAgICAwMDAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgMDAwICAgICAwMDBcbiMgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwMDAwICAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgICAwMDAgICAgIDAwMDAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgICAwMDAgICAgICAgICAgMDAwXG4jIDAwMDAwMDAgICAgMDAwMDAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwXG5cbm9wdCA9IG5vb24ucGFyc2UgXCJcIlwiXG5jb2ZmZWUgIC4gZXh0IGpzICAgLiBtYXAgdHJ1ZSAuIHJlcGxhY2UgLi4gL2NvZmZlZS8gL2pzLyAuLiBeY29mZmVlLyBqcy8gXG5rb2ZmZWUgIC4gZXh0IGpzICAgLiBtYXAgdHJ1ZSAuIHJlcGxhY2UgLi4gL2NvZmZlZS8gL2pzLyAuLiBeY29mZmVlLyBqcy8gXG5ub29uICAgIC4gZXh0IGpzb25cbmpzb24gICAgLiBleHQgbm9vbiAuIGZpbHRlciAgLi4gcGFja2FnZS5qc29uJFxuc3R5bCAgICAuIGV4dCBjc3MgIC4gcmVwbGFjZSAuLiAvc3R5bGUvIC9jc3MvIC4uIC9zdHlsLyAvanMvY3NzL1xucHVnICAgICAuIGV4dCBodG1sIC4gcmVwbGFjZSAuLiAvcHVnLyAvanMvXG5cIlwiXCJcblxuIyAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMDBcbiMgMDAwICAwMDAgICAgICAgIDAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMFxuIyAwMDAgIDAwMCAgMDAwMCAgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMFxuIyAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwXG4jIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMFxuXG5vcHQuaWdub3JlID0gW1xuICAgIC9ndWxwZmlsZS5jb2ZmZWUkL1xuICAgIC9HcnVudGZpbGUuY29mZmVlJC9cbiAgICAvXFwua29ucmFkXFwubm9vbiQvXG4gICAgL21lbnUubm9vbiQvXG5dXG5cbndsayA9XG4gICAgaWdub3JlOiBbXG4gICAgICAgIC9ub2RlX21vZHVsZXMkL1xuICAgICAgICAvYm93ZXJfY29tcG9uZW50cyQvXG4gICAgICAgIC9cXC9pbWckL1xuICAgICAgICAvXFwvXFwuLiskL1xuICAgICAgICAvXFwuZ2l0JC9cbiAgICAgICAgL1xcLmFwcCQvXG4gICAgICAgIC8uKi14NjQkL1xuICAgICAgICAvLiotaWEzMiQvXG4gICAgICAgIC9cXC8/aW5ubyQvXG4gICAgICAgIC9cXC8/anMkL1xuICAgIF1cblxuIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMCAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgICAwMDAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwICAgICAgIDAwMCAgICAgICAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgICAgIDAwMFxuIyAwMDAwMDAwICAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgICAgIDAwMFxuXG5kaXJ0eSA9IChzb3VyY2VGaWxlLCB0YXJnZXRGaWxlKSAtPlxuICAgIFxuICAgIGlmIG5vdCBmcy5leGlzdHNTeW5jIHRhcmdldEZpbGUgdGhlbiByZXR1cm4gdHJ1ZVxuICAgIHNzID0gZnMuc3RhdFN5bmMgc291cmNlRmlsZVxuICAgIHRzID0gZnMuc3RhdFN5bmMgdGFyZ2V0RmlsZVxuICAgIHNzLm10aW1lLmdldFRpbWUoKSA+IHRzLm10aW1lLmdldFRpbWUoKVxuXG4jIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDBcbiMgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbiMgMDAwICAwMDAgMCAwMDAgIDAwMDAwMCAgICAwMDAgICAwMDBcbiMgMDAwICAwMDAgIDAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbiMgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwMDAwMFxuXG5pZiBhcmdzLmluZm9cblxuICAgIGxvZyAn4peL4pePIGluZm8nLmdyYXlcblxuICAgIHdhbGsgd2xrLCBvcHQsIChzb3VyY2VGaWxlLCB0YXJnZXRGaWxlKSAtPlxuXG4gICAgICAgIGxvZyBcInNvdXJjZTogI3tzb3VyY2VGaWxlfSB0YXJnZXQ6ICN7dGFyZ2V0RmlsZX1cIiBpZiBhcmdzLnZlcmJvc2VcbiAgICAgICAgaWYgZGlydHkgc291cmNlRmlsZSwgdGFyZ2V0RmlsZVxuICAgICAgICAgICAgbG9nIHByZXR0eS5maWxlUGF0aChfLnBhZEVuZChzbGFzaC5yZWxhdGl2ZShzb3VyY2VGaWxlLCBhcmdEaXIoKSksIDQwKSwgY29sb3JzLnllbGxvdyksIFwiIOKWuiBcIi5yZWQuZGltLCBwcmV0dHkuZmlsZVBhdGgoc2xhc2gucmVsYXRpdmUodGFyZ2V0RmlsZSwgYXJnRGlyKCkpLCBjb2xvcnMucmVkKVxuICAgICAgICBlbHNlIGlmIGFyZ3MudmVyYm9zZVxuICAgICAgICAgICAgbG9nIHByZXR0eS5maWxlUGF0aChfLnBhZEVuZChzbGFzaC5yZWxhdGl2ZShzb3VyY2VGaWxlLCBhcmdEaXIoKSksIDQwKSwgY29sb3JzLm1hZ2VudGEpLCBcIiDilrogXCIuZ3JlZW4uZGltLCBwcmV0dHkuZmlsZVBhdGgoc2xhc2gucmVsYXRpdmUodGFyZ2V0RmlsZSwgYXJnRGlyKCkpLCBjb2xvcnMuZ3JlZW4pXG5cbmlmIGFyZ3MuZGlmZlxuICAgIFxuICAgIGFyZ3Muc3RhdHVzICA9IHRydWVcblxuaWYgYXJncy5zdGF0dXNcbiAgICBcbiAgICBvcHRhbGwgPSBfLmRlZmF1bHRzIG9wdCwgYWxsOiB0cnVlXG4gICAgZ2l0Y291bnQgPSAwXG5cbiAgICB3YWxrIHdsaywgb3B0YWxsLCAoc291cmNlRmlsZSwgdGFyZ2V0RmlsZSkgLT5cblxuICAgICAgICBpZiBub3QgdGFyZ2V0RmlsZVxuXG4gICAgICAgICAgICBpZiBzbGFzaC5iYXNlbmFtZShzb3VyY2VGaWxlKSA9PSAnLmdpdCdcbiAgICAgICAgICAgICAgICBzdGF0dXMuZ2l0U3RhdHVzIHNvdXJjZUZpbGVcbiAgICAgICAgICAgICAgICBnaXRjb3VudCArPSAxXG5cbiAgICAgICAgICAgIGlmIHNsYXNoLmRpckV4aXN0cyBzb3VyY2VGaWxlXG4gICAgICAgICAgICAgICAgZm9yIGkgaW4gb3B0Lmlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBpZiBpLnRlc3Qgc291cmNlRmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIHRydWVcblxuICAgIGlmIG5vdCBnaXRjb3VudFxuICAgICAgICBnaXR1cCA9IHNsYXNoLnBhcnNlIGFyZ0RpcigpXG4gICAgICAgIHdoaWxlIGdpdHVwLmJhc2VcbiAgICAgICAgICAgIGRvdEdpdCA9IHNsYXNoLmpvaW4gZ2l0dXAuZGlyLCAnLmdpdCdcbiAgICAgICAgICAgIGlmIGZzLmV4aXN0c1N5bmMgZG90R2l0XG4gICAgICAgICAgICAgICAgc3RhdHVzLmdpdFN0YXR1cyBkb3RHaXRcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgZ2l0dXAgPSBzbGFzaC5wYXJzZSBnaXR1cC5kaXJcblxuIyAwMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwICAwMDBcbiMgMDAwMDAwMCAgICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwXG4jIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcblxuaWYgYXJncy5ydW4gb3IgYXJncy5yZWJ1aWxkXG5cbiAgICBpZiBub3QgYXJncy5xdWlldFxuICAgICAgICBrbG9nICfwn5Sn8J+UpyAnICsgKGFyZ3MucmVidWlsZCBhbmQgJ3JlYnVpbGQnIG9yICdydW4nKS5ncmF5XG4gICAgXG4gICAgd2FsayB3bGssIG9wdCwgKHNvdXJjZUZpbGUsIHRhcmdldEZpbGUpIC0+XG4gICAgICAgIGlmIHRhcmdldEZpbGVcbiAgICAgICAgICAgIGlzRGlydHkgPSBkaXJ0eSBzb3VyY2VGaWxlLCB0YXJnZXRGaWxlXG4gICAgICAgICAgICBpZiBhcmdzLnJlYnVpbGQgb3IgaXNEaXJ0eVxuICAgICAgICAgICAgICAgIHNyYyA9IHByZXR0eS5maWxlUGF0aChfLnBhZEVuZChzbGFzaC5yZWxhdGl2ZShzb3VyY2VGaWxlLCBhcmdEaXIoKSksIDQwKSwgaXNEaXJ0eSBhbmQgY29sb3JzLnJlZCBvciBjb2xvcnMueWVsbG93KVxuICAgICAgICAgICAgICAgIHRndCA9IHByZXR0eS5maWxlUGF0aChzbGFzaC5yZWxhdGl2ZSh0YXJnZXRGaWxlLCBhcmdEaXIoKSksIGNvbG9ycy5ncmVlbilcbiAgICAgICAgICAgICAgICBpZiBub3QgYXJncy5xdWlldFxuICAgICAgICAgICAgICAgICAgICBrbG9nIHNyYywgXCLwn5SnICBcIiwgdGd0XG4gICAgICAgICAgICAgICAgYnVpbGQgc291cmNlRmlsZSwgb3B0LCAoc291cmNlRmlsZSwgdGFyZ2V0RmlsZSkgLT5cbiAgICAgICAgICAgICAgICAgICAgbyA9IGNvbmZpZy5vYmogdGFyZ2V0RmlsZSwgb3B0XG4gICAgICAgICAgICAgICAgICAgIGlmIHNob3VsZCAnYnJvd3NlcmlmeScsIG8sIHRhcmdldEZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nIHByZXR0eS5maWxlUGF0aChfLnBhZEVuZChzbGFzaC5yZWxhdGl2ZShvLmJyb3dzZXJpZnkubWFpbiwgYXJnRGlyKCkpLCA0MCksIGNvbG9ycy55ZWxsb3cpLCBcIvCflKcgIFwiLCBwcmV0dHkuZmlsZVBhdGgoc2xhc2gucmVsYXRpdmUoby5icm93c2VyaWZ5Lm91dCwgYXJnRGlyKCkpLCBjb2xvcnMuYmx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bmNtZCAnYnJvd3NlcmlmeScsIFwiI3tvLmJyb3dzZXJpZnkubWFpbn0gI3tvLmJyb3dzZXJpZnkub3V0fVwiLCBjb25maWcucGF0aCAnYnJvd3NlcmlmeScsIHNsYXNoLnJlc29sdmUodGFyZ2V0RmlsZSksIG9wdFxuXG5mb3IgY21kIGluIFsndXBkYXRlJywgJ2J1bXAnLCAnY29tbWl0JywgJ3B1Ymxpc2gnLCAndGVzdCddXG5cbiAgICBpZiBhcmdzW2NtZF1cblxuICAgICAgICBpZiBub3QgcnVuY21kIGNtZCwgYXJncy5hcmd1bWVudHMuam9pbiAnICcsIHByb2Nlc3MuY3dkKClcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCAxXG4gICAgICAgICAgICBicmVha1xuXG4gICAgICAgIGtsb2cgJ/CflKcgIGRvbmUnLmdyYXkgaWYgYXJncy52ZXJib3NlXG5cbiAgICAgICAgaWYgYXJncy5hcmd1bWVudHMgYW5kIGNtZCBpbiBbJ2NvbW1pdCcsICdidW1wJ11cbiAgICAgICAgICAgIGJyZWFrXG5cbmlmIGFyZ3Mud2F0Y2hcbiAgICB3YXRjaCB3bGssIG9wdFxuICAgICJdfQ==
//# sourceURL=../coffee/konrad.coffee