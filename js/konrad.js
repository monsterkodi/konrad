(function() {
  /*
  000   000   0000000   000   000  00000000    0000000   0000000
  000  000   000   000  0000  000  000   000  000   000  000   000
  0000000    000   000  000 0 000  0000000    000000000  000   000
  000  000   000   000  000  0000  000   000  000   000  000   000
  000   000   0000000   000   000  000   000  000   000  0000000
  */
  var _, actions, argDir, args, build, cmd, colors, config, dirty, dotGit, fs, gitcount, gitup, j, len, log, noon, opt, optall, pkg, pretty, ref, runcmd, should, slash, status, walk, watch, wlk;

  ({args, colors, slash, noon, fs, log, _} = require('kxk'));

  argDir = require('./argdir');

  build = require('./build');

  config = require('./config');

  pretty = require('./pretty');

  runcmd = require('./runcmd');

  should = require('./should');

  status = require('./status');

  watch = require('./watch');

  walk = require('./walk');

  pkg = require(`${__dirname}/../package`);

  args = args.init("arguments  depend on options                            **\nrun        build dirty or missing targets in dir        false\nrebuild    rebuild all targets in dir                   false  -R\nwatch      watch directory for changes                  false\ninfo       show build status of dir                     false\nbump       bump package.* version [major|minor|patch]   false\ndiff       show git diff of file/dir                    false\nstatus     show git status of file/dir                  false\ncommit     add, commit and push [msg]                   false\nupdate     update npm packages                          false\npublish    bump, commit & publish to npm [msg]          false\ntest       run tests                                    false\nverbose    log more                                     false\nquiet      log nothing                                  false\ndebug      log debug                                    false  -D\nlogtime    log with time                                true");

  actions = ['bump', 'commit', 'publish', 'update', 'test', 'watch', 'run', 'rebuild', 'info', 'status', 'diff'];

  if (!actions.map(function(a) {
    return args[a];
  }).reduce(function(acc, val) {
    return acc || val;
  })) {
    args.run = true; // makes run the default action if no other action is set
  }

  
  // 0000000    00000000  00000000   0000000   000   000  000      000000000   0000000
  // 000   000  000       000       000   000  000   000  000         000     000
  // 000   000  0000000   000000    000000000  000   000  000         000     0000000
  // 000   000  000       000       000   000  000   000  000         000          000
  // 0000000    00000000  000       000   000   0000000   0000000     000     0000000
  opt = noon.parse("coffee  . ext js   . map true . replace .. /coffee/ /js/ .. ^coffee/ js/ \nnoon    . ext json\njson    . ext noon . filter  .. package.json$\nstyl    . ext css  . replace .. /style/ /css/ .. /styl/ /js/css/\npug     . ext html . replace .. /pug/ /js/");

  // 000   0000000   000   000   0000000   00000000   00000000
  // 000  000        0000  000  000   000  000   000  000
  // 000  000  0000  000 0 000  000   000  0000000    0000000
  // 000  000   000  000  0000  000   000  000   000  000
  // 000   0000000   000   000   0000000   000   000  00000000
  opt.ignore = [/gulpfile.coffee$/, /Gruntfile.coffee$/, /\.konrad\.noon$/, /menu.noon$/];

  wlk = {
    ignore: [/node_modules/, /bower_components/, /\/img$/, /\/\..+$/, /\.git$/, /\.app$/, /_misc/, /.*-x64/, /inno/]
  };

  // 0000000    000  00000000   000000000  000   000
  // 000   000  000  000   000     000      000 000
  // 000   000  000  0000000       000       00000
  // 000   000  000  000   000     000        000
  // 0000000    000  000   000     000        000
  dirty = function(sourceFile, targetFile) {
    var ss, ts;
    if (!fs.existsSync(targetFile)) {
      return true;
    }
    ss = fs.statSync(sourceFile);
    ts = fs.statSync(targetFile);
    return ss.mtime.getTime() > ts.mtime.getTime();
  };

  // 000  000   000  00000000   0000000
  // 000  0000  000  000       000   000
  // 000  000 0 000  000000    000   000
  // 000  000  0000  000       000   000
  // 000  000   000  000        0000000
  if (args.info) {
    console.log('○● info'.gray);
    walk(wlk, opt, function(sourceFile, targetFile) {
      if (args.verbose) {
        log(`source: ${sourceFile} target: ${targetFile}`);
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
      var i, j, len, ref;
      if (!targetFile) {
        if (slash.basename(sourceFile) === '.git') {
          status.gitStatus(sourceFile);
          gitcount += 1;
        }
        if (slash.dirExists(sourceFile)) {
          ref = opt.ignore;
          for (j = 0, len = ref.length; j < len; j++) {
            i = ref[j];
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

  // 00000000   000   000  000   000
  // 000   000  000   000  0000  000
  // 0000000    000   000  000 0 000
  // 000   000  000   000  000  0000
  // 000   000   0000000   000   000
  if (args.run || args.rebuild) {
    console.log('🔧🔧 ' + (args.rebuild && 'rebuild' || 'run').gray);
    walk(wlk, opt, function(sourceFile, targetFile) {
      var isDirty, src, tgt;
      if (targetFile) {
        isDirty = dirty(sourceFile, targetFile);
        if (args.rebuild || isDirty) {
          src = pretty.filePath(_.padEnd(slash.relative(sourceFile, argDir()), 40), isDirty && colors.red || colors.yellow);
          tgt = pretty.filePath(slash.relative(targetFile, argDir()), colors.green);
          console.log(src, "🔧  ", tgt);
          return build(sourceFile, opt, function(sourceFile, targetFile) {
            var o;
            o = config.obj(targetFile, opt);
            if (should('browserify', o, targetFile)) {
              console.log(pretty.filePath(_.padEnd(slash.relative(o.browserify.main, argDir()), 40), colors.yellow), "🔧  ", pretty.filePath(slash.relative(o.browserify.out, argDir()), colors.blue));
              return runcmd('browserify', `${o.browserify.main} ${o.browserify.out}`, config.path('browserify', slash.resolve(targetFile), opt));
            }
          });
        }
      }
    });
  }

  ref = ['update', 'bump', 'commit', 'publish', 'test'];
  for (j = 0, len = ref.length; j < len; j++) {
    cmd = ref[j];
    if (args[cmd]) {
      if (!runcmd(cmd, args.arguments.join(' ', process.cwd()))) {
        break;
      }
      if (args.verbose) {
        console.log('🔧  done'.gray);
      }
      if (args.arguments && (cmd === 'commit' || cmd === 'bump')) {
        break;
      }
    }
  }

  if (args.watch) {
    watch(wlk, opt);
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia29ucmFkLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIi4uL2NvZmZlZS9rb25yYWQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7Ozs7Ozs7QUFBQSxNQUFBLENBQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsUUFBQSxFQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQTs7RUFRQSxDQUFBLENBQUUsSUFBRixFQUFRLE1BQVIsRUFBZ0IsS0FBaEIsRUFBdUIsSUFBdkIsRUFBNkIsRUFBN0IsRUFBaUMsR0FBakMsRUFBc0MsQ0FBdEMsQ0FBQSxHQUE0QyxPQUFBLENBQVEsS0FBUixDQUE1Qzs7RUFFQSxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0VBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztFQUNkLE1BQUEsR0FBYyxPQUFBLENBQVEsVUFBUjs7RUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0VBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztFQUNkLE1BQUEsR0FBYyxPQUFBLENBQVEsVUFBUjs7RUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0VBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztFQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7RUFDZCxHQUFBLEdBQWMsT0FBQSxDQUFRLENBQUEsQ0FBQSxDQUFHLFNBQUgsQ0FBYSxXQUFiLENBQVI7O0VBRWQsSUFBQSxHQUFPLElBQUks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QSxHQUFBLEtBQVEsUUFBUixJQUFBLEdBQUEsS0FBa0IsTUFBbEIsQ0FBdEI7QUFDSSxjQURKO09BUEo7O0VBRko7O0VBWUEsSUFBRyxJQUFJLENBQUMsS0FBUjtJQUNJLEtBQUEsQ0FBTSxHQUFOLEVBQVcsR0FBWCxFQURKOztBQXZMQSIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDBcbjAwMCAgMDAwICAgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbjAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMDAwICAwMDAgICAwMDBcbjAwMCAgMDAwICAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbjAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwXG4jIyNcblxueyBhcmdzLCBjb2xvcnMsIHNsYXNoLCBub29uLCBmcywgbG9nLCBfIH0gPSByZXF1aXJlICdreGsnXG5cbmFyZ0RpciAgICAgID0gcmVxdWlyZSAnLi9hcmdkaXInXG5idWlsZCAgICAgICA9IHJlcXVpcmUgJy4vYnVpbGQnXG5jb25maWcgICAgICA9IHJlcXVpcmUgJy4vY29uZmlnJ1xucHJldHR5ICAgICAgPSByZXF1aXJlICcuL3ByZXR0eSdcbnJ1bmNtZCAgICAgID0gcmVxdWlyZSAnLi9ydW5jbWQnXG5zaG91bGQgICAgICA9IHJlcXVpcmUgJy4vc2hvdWxkJ1xuc3RhdHVzICAgICAgPSByZXF1aXJlICcuL3N0YXR1cydcbndhdGNoICAgICAgID0gcmVxdWlyZSAnLi93YXRjaCdcbndhbGsgICAgICAgID0gcmVxdWlyZSAnLi93YWxrJ1xucGtnICAgICAgICAgPSByZXF1aXJlIFwiI3tfX2Rpcm5hbWV9Ly4uL3BhY2thZ2VcIlxuXG5hcmdzID0gYXJncy5pbml0IFwiXCJcIlxuICAgIGFyZ3VtZW50cyAgZGVwZW5kIG9uIG9wdGlvbnMgICAgICAgICAgICAgICAgICAgICAgICAgICAgKipcbiAgICBydW4gICAgICAgIGJ1aWxkIGRpcnR5IG9yIG1pc3NpbmcgdGFyZ2V0cyBpbiBkaXIgICAgICAgIGZhbHNlXG4gICAgcmVidWlsZCAgICByZWJ1aWxkIGFsbCB0YXJnZXRzIGluIGRpciAgICAgICAgICAgICAgICAgICBmYWxzZSAgLVJcbiAgICB3YXRjaCAgICAgIHdhdGNoIGRpcmVjdG9yeSBmb3IgY2hhbmdlcyAgICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgaW5mbyAgICAgICBzaG93IGJ1aWxkIHN0YXR1cyBvZiBkaXIgICAgICAgICAgICAgICAgICAgICBmYWxzZVxuICAgIGJ1bXAgICAgICAgYnVtcCBwYWNrYWdlLiogdmVyc2lvbiBbbWFqb3J8bWlub3J8cGF0Y2hdICAgZmFsc2VcbiAgICBkaWZmICAgICAgIHNob3cgZ2l0IGRpZmYgb2YgZmlsZS9kaXIgICAgICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgc3RhdHVzICAgICBzaG93IGdpdCBzdGF0dXMgb2YgZmlsZS9kaXIgICAgICAgICAgICAgICAgICBmYWxzZVxuICAgIGNvbW1pdCAgICAgYWRkLCBjb21taXQgYW5kIHB1c2ggW21zZ10gICAgICAgICAgICAgICAgICAgZmFsc2VcbiAgICB1cGRhdGUgICAgIHVwZGF0ZSBucG0gcGFja2FnZXMgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgcHVibGlzaCAgICBidW1wLCBjb21taXQgJiBwdWJsaXNoIHRvIG5wbSBbbXNnXSAgICAgICAgICBmYWxzZVxuICAgIHRlc3QgICAgICAgcnVuIHRlc3RzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2VcbiAgICB2ZXJib3NlICAgIGxvZyBtb3JlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgcXVpZXQgICAgICBsb2cgbm90aGluZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZVxuICAgIGRlYnVnICAgICAgbG9nIGRlYnVnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UgIC1EXG4gICAgbG9ndGltZSAgICBsb2cgd2l0aCB0aW1lICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlXG4gICAgXCJcIlwiXG5cbmFjdGlvbnMgPSBbJ2J1bXAnLCAnY29tbWl0JywgJ3B1Ymxpc2gnLCAndXBkYXRlJywgJ3Rlc3QnLCAnd2F0Y2gnLCAncnVuJywgJ3JlYnVpbGQnLCAnaW5mbycsICdzdGF0dXMnLCAnZGlmZiddXG5cbmlmIG5vdCBhY3Rpb25zLm1hcCgoYSkgLT4gYXJnc1thXSkucmVkdWNlKChhY2MsdmFsKSAtPiBhY2Mgb3IgdmFsKVxuICAgIGFyZ3MucnVuID0gdHJ1ZSAjIG1ha2VzIHJ1biB0aGUgZGVmYXVsdCBhY3Rpb24gaWYgbm8gb3RoZXIgYWN0aW9uIGlzIHNldFxuICAgIFxuIyAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMDAwMDAwMCAgIDAwMDAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgICAwMDAgICAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMDAwMDAgICAwMDAwMDAgICAgMDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgIDAwMCAgICAgMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgIDAwMCAgICAgICAgICAwMDBcbiMgMDAwMDAwMCAgICAwMDAwMDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgIDAwMDAwMDBcblxub3B0ID0gbm9vbi5wYXJzZSBcIlwiXCJcbmNvZmZlZSAgLiBleHQganMgICAuIG1hcCB0cnVlIC4gcmVwbGFjZSAuLiAvY29mZmVlLyAvanMvIC4uIF5jb2ZmZWUvIGpzLyBcbm5vb24gICAgLiBleHQganNvblxuanNvbiAgICAuIGV4dCBub29uIC4gZmlsdGVyICAuLiBwYWNrYWdlLmpzb24kXG5zdHlsICAgIC4gZXh0IGNzcyAgLiByZXBsYWNlIC4uIC9zdHlsZS8gL2Nzcy8gLi4gL3N0eWwvIC9qcy9jc3MvXG5wdWcgICAgIC4gZXh0IGh0bWwgLiByZXBsYWNlIC4uIC9wdWcvIC9qcy9cblwiXCJcIlxuXG4jIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwMFxuIyAwMDAgIDAwMCAgICAgICAgMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwXG4jIDAwMCAgMDAwICAwMDAwICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwXG4jIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDBcbiMgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwXG5cbm9wdC5pZ25vcmUgPSBbXG4gICAgL2d1bHBmaWxlLmNvZmZlZSQvXG4gICAgL0dydW50ZmlsZS5jb2ZmZWUkL1xuICAgIC9cXC5rb25yYWRcXC5ub29uJC9cbiAgICAvbWVudS5ub29uJC9cbl1cblxud2xrID1cbiAgICBpZ25vcmU6IFtcbiAgICAgICAgL25vZGVfbW9kdWxlcy9cbiAgICAgICAgL2Jvd2VyX2NvbXBvbmVudHMvXG4gICAgICAgIC9cXC9pbWckL1xuICAgICAgICAvXFwvXFwuLiskL1xuICAgICAgICAvXFwuZ2l0JC9cbiAgICAgICAgL1xcLmFwcCQvXG4gICAgICAgIC9fbWlzYy9cbiAgICAgICAgLy4qLXg2NC9cbiAgICAgICAgL2lubm8vXG4gICAgXVxuXG4jIDAwMDAwMDAgICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwICAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgIDAwMCAwMDBcbiMgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgICAgICAgMDAwICAgICAgIDAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgICAgMDAwXG4jIDAwMDAwMDAgICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgICAgMDAwXG5cbmRpcnR5ID0gKHNvdXJjZUZpbGUsIHRhcmdldEZpbGUpIC0+XG4gICAgXG4gICAgaWYgbm90IGZzLmV4aXN0c1N5bmMgdGFyZ2V0RmlsZSB0aGVuIHJldHVybiB0cnVlXG4gICAgc3MgPSBmcy5zdGF0U3luYyBzb3VyY2VGaWxlXG4gICAgdHMgPSBmcy5zdGF0U3luYyB0YXJnZXRGaWxlXG4gICAgc3MubXRpbWUuZ2V0VGltZSgpID4gdHMubXRpbWUuZ2V0VGltZSgpXG5cbiMgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMFxuIyAwMDAgIDAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuIyAwMDAgIDAwMCAwIDAwMCAgMDAwMDAwICAgIDAwMCAgIDAwMFxuIyAwMDAgIDAwMCAgMDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuIyAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAwMDAwXG5cbmlmIGFyZ3MuaW5mb1xuXG4gICAgY29uc29sZS5sb2cgJ+KXi+KXjyBpbmZvJy5ncmF5XG5cbiAgICB3YWxrIHdsaywgb3B0LCAoc291cmNlRmlsZSwgdGFyZ2V0RmlsZSkgLT5cblxuICAgICAgICBsb2cgXCJzb3VyY2U6ICN7c291cmNlRmlsZX0gdGFyZ2V0OiAje3RhcmdldEZpbGV9XCIgaWYgYXJncy52ZXJib3NlXG4gICAgICAgIGlmIGRpcnR5IHNvdXJjZUZpbGUsIHRhcmdldEZpbGVcbiAgICAgICAgICAgIGNvbnNvbGUubG9nIHByZXR0eS5maWxlUGF0aChfLnBhZEVuZChzbGFzaC5yZWxhdGl2ZShzb3VyY2VGaWxlLCBhcmdEaXIoKSksIDQwKSwgY29sb3JzLnllbGxvdyksIFwiIOKWuiBcIi5yZWQuZGltLCBwcmV0dHkuZmlsZVBhdGgoc2xhc2gucmVsYXRpdmUodGFyZ2V0RmlsZSwgYXJnRGlyKCkpLCBjb2xvcnMucmVkKVxuICAgICAgICBlbHNlIGlmIGFyZ3MudmVyYm9zZVxuICAgICAgICAgICAgY29uc29sZS5sb2cgcHJldHR5LmZpbGVQYXRoKF8ucGFkRW5kKHNsYXNoLnJlbGF0aXZlKHNvdXJjZUZpbGUsIGFyZ0RpcigpKSwgNDApLCBjb2xvcnMubWFnZW50YSksIFwiIOKWuiBcIi5ncmVlbi5kaW0sIHByZXR0eS5maWxlUGF0aChzbGFzaC5yZWxhdGl2ZSh0YXJnZXRGaWxlLCBhcmdEaXIoKSksIGNvbG9ycy5ncmVlbilcblxuaWYgYXJncy5kaWZmXG4gICAgXG4gICAgYXJncy5zdGF0dXMgID0gdHJ1ZVxuXG5pZiBhcmdzLnN0YXR1c1xuICAgIFxuICAgIG9wdGFsbCA9IF8uZGVmYXVsdHMgb3B0LCBhbGw6IHRydWVcbiAgICBnaXRjb3VudCA9IDBcblxuICAgIHdhbGsgd2xrLCBvcHRhbGwsIChzb3VyY2VGaWxlLCB0YXJnZXRGaWxlKSAtPlxuXG4gICAgICAgIGlmIG5vdCB0YXJnZXRGaWxlXG5cbiAgICAgICAgICAgIGlmIHNsYXNoLmJhc2VuYW1lKHNvdXJjZUZpbGUpID09ICcuZ2l0J1xuICAgICAgICAgICAgICAgIHN0YXR1cy5naXRTdGF0dXMgc291cmNlRmlsZVxuICAgICAgICAgICAgICAgIGdpdGNvdW50ICs9IDFcblxuICAgICAgICAgICAgaWYgc2xhc2guZGlyRXhpc3RzIHNvdXJjZUZpbGVcbiAgICAgICAgICAgICAgICBmb3IgaSBpbiBvcHQuaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIGlmIGkudGVzdCBzb3VyY2VGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgdHJ1ZVxuXG4gICAgaWYgbm90IGdpdGNvdW50XG4gICAgICAgIGdpdHVwID0gc2xhc2gucGFyc2UgYXJnRGlyKClcbiAgICAgICAgd2hpbGUgZ2l0dXAuYmFzZVxuICAgICAgICAgICAgZG90R2l0ID0gc2xhc2guam9pbiBnaXR1cC5kaXIsICcuZ2l0J1xuICAgICAgICAgICAgaWYgZnMuZXhpc3RzU3luYyBkb3RHaXRcbiAgICAgICAgICAgICAgICBzdGF0dXMuZ2l0U3RhdHVzIGRvdEdpdFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBnaXR1cCA9IHNsYXNoLnBhcnNlIGdpdHVwLmRpclxuXG4jIDAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMFxuIyAwMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiMgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuXG5pZiBhcmdzLnJ1biBvciBhcmdzLnJlYnVpbGRcblxuICAgIGNvbnNvbGUubG9nICfwn5Sn8J+UpyAnICsgKGFyZ3MucmVidWlsZCBhbmQgJ3JlYnVpbGQnIG9yICdydW4nKS5ncmF5XG4gICAgXG4gICAgd2FsayB3bGssIG9wdCwgKHNvdXJjZUZpbGUsIHRhcmdldEZpbGUpIC0+XG4gICAgICAgIGlmIHRhcmdldEZpbGVcbiAgICAgICAgICAgIGlzRGlydHkgPSBkaXJ0eSBzb3VyY2VGaWxlLCB0YXJnZXRGaWxlXG4gICAgICAgICAgICBpZiBhcmdzLnJlYnVpbGQgb3IgaXNEaXJ0eVxuICAgICAgICAgICAgICAgIHNyYyA9IHByZXR0eS5maWxlUGF0aChfLnBhZEVuZChzbGFzaC5yZWxhdGl2ZShzb3VyY2VGaWxlLCBhcmdEaXIoKSksIDQwKSwgaXNEaXJ0eSBhbmQgY29sb3JzLnJlZCBvciBjb2xvcnMueWVsbG93KVxuICAgICAgICAgICAgICAgIHRndCA9IHByZXR0eS5maWxlUGF0aChzbGFzaC5yZWxhdGl2ZSh0YXJnZXRGaWxlLCBhcmdEaXIoKSksIGNvbG9ycy5ncmVlbilcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyBzcmMsIFwi8J+UpyAgXCIsIHRndFxuICAgICAgICAgICAgICAgIGJ1aWxkIHNvdXJjZUZpbGUsIG9wdCwgKHNvdXJjZUZpbGUsIHRhcmdldEZpbGUpIC0+XG4gICAgICAgICAgICAgICAgICAgIG8gPSBjb25maWcub2JqIHRhcmdldEZpbGUsIG9wdFxuICAgICAgICAgICAgICAgICAgICBpZiBzaG91bGQgJ2Jyb3dzZXJpZnknLCBvLCB0YXJnZXRGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyBwcmV0dHkuZmlsZVBhdGgoXy5wYWRFbmQoc2xhc2gucmVsYXRpdmUoby5icm93c2VyaWZ5Lm1haW4sIGFyZ0RpcigpKSwgNDApLCBjb2xvcnMueWVsbG93KSwgXCLwn5SnICBcIiwgcHJldHR5LmZpbGVQYXRoKHNsYXNoLnJlbGF0aXZlKG8uYnJvd3NlcmlmeS5vdXQsIGFyZ0RpcigpKSwgY29sb3JzLmJsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICBydW5jbWQgJ2Jyb3dzZXJpZnknLCBcIiN7by5icm93c2VyaWZ5Lm1haW59ICN7by5icm93c2VyaWZ5Lm91dH1cIiwgY29uZmlnLnBhdGggJ2Jyb3dzZXJpZnknLCBzbGFzaC5yZXNvbHZlKHRhcmdldEZpbGUpLCBvcHRcblxuZm9yIGNtZCBpbiBbJ3VwZGF0ZScsICdidW1wJywgJ2NvbW1pdCcsICdwdWJsaXNoJywgJ3Rlc3QnXVxuXG4gICAgaWYgYXJnc1tjbWRdXG5cbiAgICAgICAgaWYgbm90IHJ1bmNtZCBjbWQsIGFyZ3MuYXJndW1lbnRzLmpvaW4gJyAnLCBwcm9jZXNzLmN3ZCgpXG4gICAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNvbnNvbGUubG9nICfwn5SnICBkb25lJy5ncmF5IGlmIGFyZ3MudmVyYm9zZVxuXG4gICAgICAgIGlmIGFyZ3MuYXJndW1lbnRzIGFuZCBjbWQgaW4gWydjb21taXQnLCAnYnVtcCddXG4gICAgICAgICAgICBicmVha1xuXG5pZiBhcmdzLndhdGNoXG4gICAgd2F0Y2ggd2xrLCBvcHRcbiAgICAiXX0=
//# sourceURL=../coffee/konrad.coffee