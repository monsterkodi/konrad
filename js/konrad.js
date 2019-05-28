// koffee 0.50.0

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia29ucmFkLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRQSxNQUE2QyxPQUFBLENBQVEsS0FBUixDQUE3QyxFQUFFLGVBQUYsRUFBUSxtQkFBUixFQUFnQixpQkFBaEIsRUFBdUIsZUFBdkIsRUFBNkIsV0FBN0IsRUFBaUMsZUFBakMsRUFBdUM7O0FBRXZDLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxLQUFBLEdBQVMsT0FBQSxDQUFRLFNBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxLQUFBLEdBQVMsT0FBQSxDQUFRLFNBQVI7O0FBQ1QsSUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOztBQUNULEdBQUEsR0FBUyxPQUFBLENBQVcsU0FBRCxHQUFXLGFBQXJCOztBQUVULElBQUEsR0FBTyxJQUFJLENBQUMsSUFBTCxDQUFVLG8vQkFBVixFQWlCRTtJQUFBLEdBQUEsRUFBSSxHQUFKO0NBakJGOztBQW1CUCxPQUFBLEdBQVUsQ0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixTQUFuQixFQUE4QixRQUE5QixFQUF3QyxNQUF4QyxFQUFnRCxPQUFoRCxFQUF5RCxLQUF6RCxFQUFnRSxTQUFoRSxFQUEyRSxNQUEzRSxFQUFtRixRQUFuRixFQUE2RixNQUE3Rjs7QUFFVixJQUFHLENBQUksT0FBTyxDQUFDLEdBQVIsQ0FBWSxTQUFDLENBQUQ7V0FBTyxJQUFLLENBQUEsQ0FBQTtBQUFaLENBQVosQ0FBMkIsQ0FBQyxNQUE1QixDQUFtQyxTQUFDLEdBQUQsRUFBSyxHQUFMO1dBQWEsR0FBQSxJQUFPO0FBQXBCLENBQW5DLENBQVA7SUFDSSxJQUFJLENBQUMsR0FBTCxHQUFXLEtBRGY7OztBQVNBLEdBQUEsR0FBTSxJQUFJLENBQUMsS0FBTCxDQUFXLHVVQUFYOztBQWVOLEdBQUcsQ0FBQyxNQUFKLEdBQWEsQ0FDVCxrQkFEUyxFQUVULG1CQUZTLEVBR1QsaUJBSFMsRUFJVCxZQUpTOztBQU9iLEdBQUEsR0FDSTtJQUFBLE1BQUEsRUFBUSxDQUNKLGVBREksRUFFSixtQkFGSSxFQUdKLFFBSEksRUFJSixTQUpJLEVBS0osUUFMSSxFQU1KLFFBTkksRUFPSixTQVBJLEVBUUosVUFSSSxFQVNKLFVBVEksRUFVSixRQVZJLENBQVI7OztBQW1CSixLQUFBLEdBQVEsU0FBQyxVQUFELEVBQWEsVUFBYjtBQUVKLFFBQUE7SUFBQSxJQUFHLENBQUksRUFBRSxDQUFDLFVBQUgsQ0FBYyxVQUFkLENBQVA7QUFBcUMsZUFBTyxLQUE1Qzs7SUFDQSxFQUFBLEdBQUssRUFBRSxDQUFDLFFBQUgsQ0FBWSxVQUFaO0lBQ0wsRUFBQSxHQUFLLEVBQUUsQ0FBQyxRQUFILENBQVksVUFBWjtXQUNMLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBVCxDQUFBLENBQUEsR0FBcUIsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFULENBQUE7QUFMakI7O0FBYVIsSUFBRyxJQUFJLENBQUMsSUFBUjtJQUVHLE9BQUEsQ0FBQyxHQUFELENBQUssU0FBUyxDQUFDLElBQWY7SUFFQyxJQUFBLENBQUssR0FBTCxFQUFVLEdBQVYsRUFBZSxTQUFDLFVBQUQsRUFBYSxVQUFiO1FBRVosSUFBc0QsSUFBSSxDQUFDLE9BQTNEO1lBQUEsT0FBQSxDQUFDLEdBQUQsQ0FBSyxVQUFBLEdBQVcsVUFBWCxHQUFzQixXQUF0QixHQUFpQyxVQUF0QyxFQUFBOztRQUNDLElBQUcsS0FBQSxDQUFNLFVBQU4sRUFBa0IsVUFBbEIsQ0FBSDttQkFDRyxPQUFBLENBQUMsR0FBRCxDQUFLLE1BQU0sQ0FBQyxRQUFQLENBQWdCLENBQUMsQ0FBQyxNQUFGLENBQVMsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLE1BQUEsQ0FBQSxDQUEzQixDQUFULEVBQStDLEVBQS9DLENBQWhCLEVBQW9FLE1BQU0sQ0FBQyxNQUEzRSxDQUFMLEVBQXlGLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBbkcsRUFBd0csTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLE1BQUEsQ0FBQSxDQUEzQixDQUFoQixFQUFzRCxNQUFNLENBQUMsR0FBN0QsQ0FBeEcsRUFESDtTQUFBLE1BRUssSUFBRyxJQUFJLENBQUMsT0FBUjttQkFDRixPQUFBLENBQUMsR0FBRCxDQUFLLE1BQU0sQ0FBQyxRQUFQLENBQWdCLENBQUMsQ0FBQyxNQUFGLENBQVMsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLE1BQUEsQ0FBQSxDQUEzQixDQUFULEVBQStDLEVBQS9DLENBQWhCLEVBQW9FLE1BQU0sQ0FBQyxPQUEzRSxDQUFMLEVBQTBGLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBdEcsRUFBMkcsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLE1BQUEsQ0FBQSxDQUEzQixDQUFoQixFQUFzRCxNQUFNLENBQUMsS0FBN0QsQ0FBM0csRUFERTs7SUFMTSxDQUFmLEVBSko7OztBQVlBLElBQUcsSUFBSSxDQUFDLElBQVI7SUFFSSxJQUFJLENBQUMsTUFBTCxHQUFlLEtBRm5COzs7QUFJQSxJQUFHLElBQUksQ0FBQyxNQUFSO0lBRUksTUFBQSxHQUFTLENBQUMsQ0FBQyxRQUFGLENBQVcsR0FBWCxFQUFnQjtRQUFBLEdBQUEsRUFBSyxJQUFMO0tBQWhCO0lBQ1QsUUFBQSxHQUFXO0lBRVgsSUFBQSxDQUFLLEdBQUwsRUFBVSxNQUFWLEVBQWtCLFNBQUMsVUFBRCxFQUFhLFVBQWI7QUFFZCxZQUFBO1FBQUEsSUFBRyxDQUFJLFVBQVA7WUFFSSxJQUFHLEtBQUssQ0FBQyxRQUFOLENBQWUsVUFBZixDQUFBLEtBQThCLE1BQWpDO2dCQUNJLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFVBQWpCO2dCQUNBLFFBQUEsSUFBWSxFQUZoQjs7WUFJQSxJQUFHLEtBQUssQ0FBQyxTQUFOLENBQWdCLFVBQWhCLENBQUg7QUFDSTtBQUFBLHFCQUFBLHNDQUFBOztvQkFDSSxJQUFHLENBQUMsQ0FBQyxJQUFGLENBQU8sVUFBUCxDQUFIO0FBQ0ksK0JBQU8sTUFEWDs7QUFESixpQkFESjthQU5KOztlQVVBO0lBWmMsQ0FBbEI7SUFjQSxJQUFHLENBQUksUUFBUDtRQUNJLEtBQUEsR0FBUSxLQUFLLENBQUMsS0FBTixDQUFZLE1BQUEsQ0FBQSxDQUFaO0FBQ1IsZUFBTSxLQUFLLENBQUMsSUFBWjtZQUNJLE1BQUEsR0FBUyxLQUFLLENBQUMsSUFBTixDQUFXLEtBQUssQ0FBQyxHQUFqQixFQUFzQixNQUF0QjtZQUNULElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxNQUFkLENBQUg7Z0JBQ0ksTUFBTSxDQUFDLFNBQVAsQ0FBaUIsTUFBakI7QUFDQSxzQkFGSjs7WUFHQSxLQUFBLEdBQVEsS0FBSyxDQUFDLEtBQU4sQ0FBWSxLQUFLLENBQUMsR0FBbEI7UUFMWixDQUZKO0tBbkJKOzs7QUFrQ0EsSUFBRyxJQUFJLENBQUMsR0FBTCxJQUFZLElBQUksQ0FBQyxPQUFwQjtJQUVJLElBQUcsQ0FBSSxJQUFJLENBQUMsS0FBWjtRQUNJLElBQUEsQ0FBSyxPQUFBLEdBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTCxJQUFpQixTQUFqQixJQUE4QixLQUEvQixDQUFxQyxDQUFDLElBQXJELEVBREo7O0lBR0EsSUFBQSxDQUFLLEdBQUwsRUFBVSxHQUFWLEVBQWUsU0FBQyxVQUFELEVBQWEsVUFBYjtBQUNYLFlBQUE7UUFBQSxJQUFHLFVBQUg7WUFDSSxPQUFBLEdBQVUsS0FBQSxDQUFNLFVBQU4sRUFBa0IsVUFBbEI7WUFDVixJQUFHLElBQUksQ0FBQyxPQUFMLElBQWdCLE9BQW5CO2dCQUNJLEdBQUEsR0FBTSxNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFDLENBQUMsTUFBRixDQUFTLEtBQUssQ0FBQyxRQUFOLENBQWUsVUFBZixFQUEyQixNQUFBLENBQUEsQ0FBM0IsQ0FBVCxFQUErQyxFQUEvQyxDQUFoQixFQUFvRSxPQUFBLElBQVksTUFBTSxDQUFDLEdBQW5CLElBQTBCLE1BQU0sQ0FBQyxNQUFyRztnQkFDTixHQUFBLEdBQU0sTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLE1BQUEsQ0FBQSxDQUEzQixDQUFoQixFQUFzRCxNQUFNLENBQUMsS0FBN0Q7Z0JBQ04sSUFBRyxDQUFJLElBQUksQ0FBQyxLQUFaO29CQUNJLElBQUEsQ0FBSyxHQUFMLEVBQVUsTUFBVixFQUFrQixHQUFsQixFQURKOzt1QkFFQSxLQUFBLENBQU0sVUFBTixFQUFrQixHQUFsQixFQUF1QixTQUFDLFVBQUQsRUFBYSxVQUFiO0FBQ25CLHdCQUFBO29CQUFBLENBQUEsR0FBSSxNQUFNLENBQUMsR0FBUCxDQUFXLFVBQVgsRUFBdUIsR0FBdkI7b0JBQ0osSUFBRyxNQUFBLENBQU8sWUFBUCxFQUFxQixDQUFyQixFQUF3QixVQUF4QixDQUFIO3dCQUNJLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxLQUFLLENBQUMsUUFBTixDQUFlLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBNUIsRUFBa0MsTUFBQSxDQUFBLENBQWxDLENBQVQsRUFBc0QsRUFBdEQsQ0FBaEIsRUFBMkUsTUFBTSxDQUFDLE1BQWxGLENBQVosRUFBdUcsTUFBdkcsRUFBK0csTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQTVCLEVBQWlDLE1BQUEsQ0FBQSxDQUFqQyxDQUFoQixFQUE0RCxNQUFNLENBQUMsSUFBbkUsQ0FBL0c7K0JBQ0EsTUFBQSxDQUFPLFlBQVAsRUFBd0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFkLEdBQW1CLEdBQW5CLEdBQXNCLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBMUQsRUFBaUUsTUFBTSxDQUFDLElBQVAsQ0FBWSxZQUFaLEVBQTBCLEtBQUssQ0FBQyxPQUFOLENBQWMsVUFBZCxDQUExQixFQUFxRCxHQUFyRCxDQUFqRSxFQUZKOztnQkFGbUIsQ0FBdkIsRUFMSjthQUZKOztJQURXLENBQWYsRUFMSjs7O0FBbUJBO0FBQUEsS0FBQSxzQ0FBQTs7SUFFSSxJQUFHLElBQUssQ0FBQSxHQUFBLENBQVI7UUFFSSxJQUFHLENBQUksTUFBQSxDQUFPLEdBQVAsRUFBWSxJQUFJLEVBQUMsU0FBRCxFQUFVLENBQUMsSUFBZixDQUFvQixHQUFwQixFQUF5QixPQUFPLENBQUMsR0FBUixDQUFBLENBQXpCLENBQVosQ0FBUDtZQUNJLE9BQU8sQ0FBQyxJQUFSLENBQWEsQ0FBYjtBQUNBLGtCQUZKOztRQUlBLElBQXdCLElBQUksQ0FBQyxPQUE3QjtZQUFBLElBQUEsQ0FBSyxVQUFVLENBQUMsSUFBaEIsRUFBQTs7UUFFQSxJQUFHLElBQUksRUFBQyxTQUFELEVBQUosSUFBbUIsQ0FBQSxHQUFBLEtBQVEsUUFBUixJQUFBLEdBQUEsS0FBaUIsTUFBakIsQ0FBdEI7QUFDSSxrQkFESjtTQVJKOztBQUZKOztBQWFBLElBQUcsSUFBSSxDQUFDLEtBQVI7SUFDSSxLQUFBLENBQU0sR0FBTixFQUFXLEdBQVgsRUFESiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDBcbjAwMCAgMDAwICAgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbjAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMDAwICAwMDAgICAwMDBcbjAwMCAgMDAwICAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbjAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwXG4jIyNcblxueyBhcmdzLCBjb2xvcnMsIHNsYXNoLCBub29uLCBmcywga2xvZywgXyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5hcmdEaXIgPSByZXF1aXJlICcuL2FyZ2RpcidcbmJ1aWxkICA9IHJlcXVpcmUgJy4vYnVpbGQnXG5jb25maWcgPSByZXF1aXJlICcuL2NvbmZpZydcbnByZXR0eSA9IHJlcXVpcmUgJy4vcHJldHR5J1xucnVuY21kID0gcmVxdWlyZSAnLi9ydW5jbWQnXG5zaG91bGQgPSByZXF1aXJlICcuL3Nob3VsZCdcbnN0YXR1cyA9IHJlcXVpcmUgJy4vc3RhdHVzJ1xud2F0Y2ggID0gcmVxdWlyZSAnLi93YXRjaCdcbndhbGsgICA9IHJlcXVpcmUgJy4vd2FsaydcbnBrZyAgICA9IHJlcXVpcmUgXCIje19fZGlybmFtZX0vLi4vcGFja2FnZVwiXG5cbmFyZ3MgPSBhcmdzLmluaXQgXCJcIlwiXG4gICAgYXJndW1lbnRzICBkZXBlbmQgb24gb3B0aW9ucyAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKlxuICAgIHJ1biAgICAgICAgYnVpbGQgZGlydHkgb3IgbWlzc2luZyB0YXJnZXRzIGluIGRpciAgICAgICAgZmFsc2VcbiAgICByZWJ1aWxkICAgIHJlYnVpbGQgYWxsIHRhcmdldHMgaW4gZGlyICAgICAgICAgICAgICAgICAgIGZhbHNlICAtUlxuICAgIHdhdGNoICAgICAgd2F0Y2ggZGlyZWN0b3J5IGZvciBjaGFuZ2VzICAgICAgICAgICAgICAgICAgZmFsc2VcbiAgICBpbmZvICAgICAgIHNob3cgYnVpbGQgc3RhdHVzIG9mIGRpciAgICAgICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgYnVtcCAgICAgICBidW1wIHBhY2thZ2UuKiB2ZXJzaW9uIFttYWpvcnxtaW5vcnxwYXRjaF0gICBmYWxzZVxuICAgIGRpZmYgICAgICAgc2hvdyBnaXQgZGlmZiBvZiBmaWxlL2RpciAgICAgICAgICAgICAgICAgICAgZmFsc2VcbiAgICBzdGF0dXMgICAgIHNob3cgZ2l0IHN0YXR1cyBvZiBmaWxlL2RpciAgICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgY29tbWl0ICAgICBhZGQsIGNvbW1pdCBhbmQgcHVzaCBbbXNnXSAgICAgICAgICAgICAgICAgICBmYWxzZVxuICAgIHVwZGF0ZSAgICAgdXBkYXRlIG5wbSBwYWNrYWdlcyAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2VcbiAgICBwdWJsaXNoICAgIGJ1bXAsIGNvbW1pdCAmIHB1Ymxpc2ggdG8gbnBtIFttc2ddICAgICAgICAgIGZhbHNlXG4gICAgdGVzdCAgICAgICBydW4gdGVzdHMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZVxuICAgIHZlcmJvc2UgICAgbG9nIG1vcmUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2VcbiAgICBxdWlldCAgICAgIGxvZyBub3RoaW5nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgZGVidWcgICAgICBsb2cgZGVidWcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSAgLURcbiAgICBsb2d0aW1lICAgIGxvZyB3aXRoIHRpbWUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWVcbiAgICBcIlwiXCIsIHBrZzpwa2dcblxuYWN0aW9ucyA9IFsnYnVtcCcsICdjb21taXQnLCAncHVibGlzaCcsICd1cGRhdGUnLCAndGVzdCcsICd3YXRjaCcsICdydW4nLCAncmVidWlsZCcsICdpbmZvJywgJ3N0YXR1cycsICdkaWZmJ11cblxuaWYgbm90IGFjdGlvbnMubWFwKChhKSAtPiBhcmdzW2FdKS5yZWR1Y2UoKGFjYyx2YWwpIC0+IGFjYyBvciB2YWwpXG4gICAgYXJncy5ydW4gPSB0cnVlICMgbWFrZXMgcnVuIHRoZSBkZWZhdWx0IGFjdGlvbiBpZiBubyBvdGhlciBhY3Rpb24gaXMgc2V0XG4gICAgXG4jIDAwMDAwMDAgICAgMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwMDAwMDAwICAgMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgIDAwMCAgICAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwMDAwMCAgIDAwMDAwMCAgICAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgMDAwICAgICAwMDAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgMDAwICAgICAgICAgIDAwMFxuIyAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMFxuXG5vcHQgPSBub29uLnBhcnNlIFwiXCJcIlxuY29mZmVlICAuIGV4dCBqcyAgIC4gbWFwIHRydWUgLiByZXBsYWNlIC4uIC9jb2ZmZWUvIC9qcy8gLi4gXmNvZmZlZS8ganMvIFxua29mZmVlICAuIGV4dCBqcyAgIC4gbWFwIHRydWUgLiByZXBsYWNlIC4uIC9jb2ZmZWUvIC9qcy8gLi4gXmNvZmZlZS8ganMvIFxubm9vbiAgICAuIGV4dCBqc29uXG5qc29uICAgIC4gZXh0IG5vb24gLiBmaWx0ZXIgIC4uIHBhY2thZ2UuanNvbiRcbnN0eWwgICAgLiBleHQgY3NzICAuIHJlcGxhY2UgLi4gL3N0eWxlLyAvY3NzLyAuLiAvc3R5bC8gL2pzL2Nzcy9cbnB1ZyAgICAgLiBleHQgaHRtbCAuIHJlcGxhY2UgLi4gL3B1Zy8gL2pzL1xuXCJcIlwiXG5cbiMgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAwXG4jIDAwMCAgMDAwICAgICAgICAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDBcbiMgMDAwICAwMDAgIDAwMDAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDBcbiMgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMFxuIyAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcblxub3B0Lmlnbm9yZSA9IFtcbiAgICAvZ3VscGZpbGUuY29mZmVlJC9cbiAgICAvR3J1bnRmaWxlLmNvZmZlZSQvXG4gICAgL1xcLmtvbnJhZFxcLm5vb24kL1xuICAgIC9tZW51Lm5vb24kL1xuXVxuXG53bGsgPVxuICAgIGlnbm9yZTogW1xuICAgICAgICAvbm9kZV9tb2R1bGVzJC9cbiAgICAgICAgL2Jvd2VyX2NvbXBvbmVudHMkL1xuICAgICAgICAvXFwvaW1nJC9cbiAgICAgICAgL1xcL1xcLi4rJC9cbiAgICAgICAgL1xcLmdpdCQvXG4gICAgICAgIC9cXC5hcHAkL1xuICAgICAgICAvLioteDY0JC9cbiAgICAgICAgLy4qLWlhMzIkL1xuICAgICAgICAvXFwvP2lubm8kL1xuICAgICAgICAvXFwvP2pzJC9cbiAgICBdXG5cbiMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAgICAwMDBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgMDAwIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgICAgICAwMDAgICAgICAgMDAwMDBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgICAwMDBcbiMgMDAwMDAwMCAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgICAwMDBcblxuZGlydHkgPSAoc291cmNlRmlsZSwgdGFyZ2V0RmlsZSkgLT5cbiAgICBcbiAgICBpZiBub3QgZnMuZXhpc3RzU3luYyB0YXJnZXRGaWxlIHRoZW4gcmV0dXJuIHRydWVcbiAgICBzcyA9IGZzLnN0YXRTeW5jIHNvdXJjZUZpbGVcbiAgICB0cyA9IGZzLnN0YXRTeW5jIHRhcmdldEZpbGVcbiAgICBzcy5tdGltZS5nZXRUaW1lKCkgPiB0cy5tdGltZS5nZXRUaW1lKClcblxuIyAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwXG4jIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4jIDAwMCAgMDAwIDAgMDAwICAwMDAwMDAgICAgMDAwICAgMDAwXG4jIDAwMCAgMDAwICAwMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4jIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMDAwMDBcblxuaWYgYXJncy5pbmZvXG5cbiAgICBsb2cgJ+KXi+KXjyBpbmZvJy5ncmF5XG5cbiAgICB3YWxrIHdsaywgb3B0LCAoc291cmNlRmlsZSwgdGFyZ2V0RmlsZSkgLT5cblxuICAgICAgICBsb2cgXCJzb3VyY2U6ICN7c291cmNlRmlsZX0gdGFyZ2V0OiAje3RhcmdldEZpbGV9XCIgaWYgYXJncy52ZXJib3NlXG4gICAgICAgIGlmIGRpcnR5IHNvdXJjZUZpbGUsIHRhcmdldEZpbGVcbiAgICAgICAgICAgIGxvZyBwcmV0dHkuZmlsZVBhdGgoXy5wYWRFbmQoc2xhc2gucmVsYXRpdmUoc291cmNlRmlsZSwgYXJnRGlyKCkpLCA0MCksIGNvbG9ycy55ZWxsb3cpLCBcIiDilrogXCIucmVkLmRpbSwgcHJldHR5LmZpbGVQYXRoKHNsYXNoLnJlbGF0aXZlKHRhcmdldEZpbGUsIGFyZ0RpcigpKSwgY29sb3JzLnJlZClcbiAgICAgICAgZWxzZSBpZiBhcmdzLnZlcmJvc2VcbiAgICAgICAgICAgIGxvZyBwcmV0dHkuZmlsZVBhdGgoXy5wYWRFbmQoc2xhc2gucmVsYXRpdmUoc291cmNlRmlsZSwgYXJnRGlyKCkpLCA0MCksIGNvbG9ycy5tYWdlbnRhKSwgXCIg4pa6IFwiLmdyZWVuLmRpbSwgcHJldHR5LmZpbGVQYXRoKHNsYXNoLnJlbGF0aXZlKHRhcmdldEZpbGUsIGFyZ0RpcigpKSwgY29sb3JzLmdyZWVuKVxuXG5pZiBhcmdzLmRpZmZcbiAgICBcbiAgICBhcmdzLnN0YXR1cyAgPSB0cnVlXG5cbmlmIGFyZ3Muc3RhdHVzXG4gICAgXG4gICAgb3B0YWxsID0gXy5kZWZhdWx0cyBvcHQsIGFsbDogdHJ1ZVxuICAgIGdpdGNvdW50ID0gMFxuXG4gICAgd2FsayB3bGssIG9wdGFsbCwgKHNvdXJjZUZpbGUsIHRhcmdldEZpbGUpIC0+XG5cbiAgICAgICAgaWYgbm90IHRhcmdldEZpbGVcblxuICAgICAgICAgICAgaWYgc2xhc2guYmFzZW5hbWUoc291cmNlRmlsZSkgPT0gJy5naXQnXG4gICAgICAgICAgICAgICAgc3RhdHVzLmdpdFN0YXR1cyBzb3VyY2VGaWxlXG4gICAgICAgICAgICAgICAgZ2l0Y291bnQgKz0gMVxuXG4gICAgICAgICAgICBpZiBzbGFzaC5kaXJFeGlzdHMgc291cmNlRmlsZVxuICAgICAgICAgICAgICAgIGZvciBpIGluIG9wdC5pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgaWYgaS50ZXN0IHNvdXJjZUZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB0cnVlXG5cbiAgICBpZiBub3QgZ2l0Y291bnRcbiAgICAgICAgZ2l0dXAgPSBzbGFzaC5wYXJzZSBhcmdEaXIoKVxuICAgICAgICB3aGlsZSBnaXR1cC5iYXNlXG4gICAgICAgICAgICBkb3RHaXQgPSBzbGFzaC5qb2luIGdpdHVwLmRpciwgJy5naXQnXG4gICAgICAgICAgICBpZiBmcy5leGlzdHNTeW5jIGRvdEdpdFxuICAgICAgICAgICAgICAgIHN0YXR1cy5naXRTdGF0dXMgZG90R2l0XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGdpdHVwID0gc2xhc2gucGFyc2UgZ2l0dXAuZGlyXG4gICAgICAgICAgICBcbiMgMDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4jIDAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMFxuIyAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG5cbmlmIGFyZ3MucnVuIG9yIGFyZ3MucmVidWlsZFxuXG4gICAgaWYgbm90IGFyZ3MucXVpZXRcbiAgICAgICAga2xvZyAn8J+Up/CflKcgJyArIChhcmdzLnJlYnVpbGQgYW5kICdyZWJ1aWxkJyBvciAncnVuJykuZ3JheVxuICAgIFxuICAgIHdhbGsgd2xrLCBvcHQsIChzb3VyY2VGaWxlLCB0YXJnZXRGaWxlKSAtPlxuICAgICAgICBpZiB0YXJnZXRGaWxlXG4gICAgICAgICAgICBpc0RpcnR5ID0gZGlydHkgc291cmNlRmlsZSwgdGFyZ2V0RmlsZVxuICAgICAgICAgICAgaWYgYXJncy5yZWJ1aWxkIG9yIGlzRGlydHlcbiAgICAgICAgICAgICAgICBzcmMgPSBwcmV0dHkuZmlsZVBhdGgoXy5wYWRFbmQoc2xhc2gucmVsYXRpdmUoc291cmNlRmlsZSwgYXJnRGlyKCkpLCA0MCksIGlzRGlydHkgYW5kIGNvbG9ycy5yZWQgb3IgY29sb3JzLnllbGxvdylcbiAgICAgICAgICAgICAgICB0Z3QgPSBwcmV0dHkuZmlsZVBhdGgoc2xhc2gucmVsYXRpdmUodGFyZ2V0RmlsZSwgYXJnRGlyKCkpLCBjb2xvcnMuZ3JlZW4pXG4gICAgICAgICAgICAgICAgaWYgbm90IGFyZ3MucXVpZXRcbiAgICAgICAgICAgICAgICAgICAga2xvZyBzcmMsIFwi8J+UpyAgXCIsIHRndFxuICAgICAgICAgICAgICAgIGJ1aWxkIHNvdXJjZUZpbGUsIG9wdCwgKHNvdXJjZUZpbGUsIHRhcmdldEZpbGUpIC0+XG4gICAgICAgICAgICAgICAgICAgIG8gPSBjb25maWcub2JqIHRhcmdldEZpbGUsIG9wdFxuICAgICAgICAgICAgICAgICAgICBpZiBzaG91bGQgJ2Jyb3dzZXJpZnknLCBvLCB0YXJnZXRGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyBwcmV0dHkuZmlsZVBhdGgoXy5wYWRFbmQoc2xhc2gucmVsYXRpdmUoby5icm93c2VyaWZ5Lm1haW4sIGFyZ0RpcigpKSwgNDApLCBjb2xvcnMueWVsbG93KSwgXCLwn5SnICBcIiwgcHJldHR5LmZpbGVQYXRoKHNsYXNoLnJlbGF0aXZlKG8uYnJvd3NlcmlmeS5vdXQsIGFyZ0RpcigpKSwgY29sb3JzLmJsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICBydW5jbWQgJ2Jyb3dzZXJpZnknLCBcIiN7by5icm93c2VyaWZ5Lm1haW59ICN7by5icm93c2VyaWZ5Lm91dH1cIiwgY29uZmlnLnBhdGggJ2Jyb3dzZXJpZnknLCBzbGFzaC5yZXNvbHZlKHRhcmdldEZpbGUpLCBvcHRcblxuZm9yIGNtZCBpbiBbJ3VwZGF0ZScgJ2J1bXAnICdjb21taXQnICdwdWJsaXNoJyAndGVzdCddXG5cbiAgICBpZiBhcmdzW2NtZF1cblxuICAgICAgICBpZiBub3QgcnVuY21kIGNtZCwgYXJncy5hcmd1bWVudHMuam9pbiAnICcsIHByb2Nlc3MuY3dkKClcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCAxXG4gICAgICAgICAgICBicmVha1xuXG4gICAgICAgIGtsb2cgJ/CflKcgIGRvbmUnLmdyYXkgaWYgYXJncy52ZXJib3NlXG5cbiAgICAgICAgaWYgYXJncy5hcmd1bWVudHMgYW5kIGNtZCBpbiBbJ2NvbW1pdCcgJ2J1bXAnXVxuICAgICAgICAgICAgYnJlYWtcblxuaWYgYXJncy53YXRjaFxuICAgIHdhdGNoIHdsaywgb3B0XG4gICAgIl19
//# sourceURL=../coffee/konrad.coffee