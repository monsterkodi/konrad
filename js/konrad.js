
/*
000   000   0000000   000   000  00000000    0000000   0000000  
000  000   000   000  0000  000  000   000  000   000  000   000
0000000    000   000  000 0 000  0000000    000000000  000   000
000  000   000   000  000  0000  000   000  000   000  000   000
000   000   0000000   000   000  000   000  000   000  0000000
 */

(function() {
  var _, args, childp, choki, coffee, colors, config, error, fs, jade, log, noon, notify, opt, path, resolve, sds, stylus, watch, write,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  path = require('path');

  sds = require('sds');

  noon = require('noon');

  write = require('write-file-atomic');

  jade = require('jade');

  childp = require('child_process');

  colors = require('colors');

  stylus = require('stylus');

  coffee = require('coffee-script');

  choki = require('chokidar');

  notify = require('growl');

  path = require('path');

  _ = require('lodash');

  log = console.log;

  args = require('karg')("konrad\n    directory  . ? the directory to watch . * . = .\n    publish    . ? bump, commit and publish   . = false\n    verbose    . ? log more                   . = false\n    quiet      . ? log nothing                . = false\nversion  " + (require(__dirname + "/../package.json").version));


  /*
  00000000   00000000   0000000   0000000   000      000   000  00000000
  000   000  000       000       000   000  000      000   000  000     
  0000000    0000000   0000000   000   000  000       000 000   0000000 
  000   000  000            000  000   000  000         000     000     
  000   000  00000000  0000000    0000000   0000000      0      00000000
   */

  resolve = function(unresolved) {
    var p;
    p = unresolved.replace(/\~/, process.env.HOME);
    p = path.resolve(p);
    p = path.normalize(p);
    return p;
  };


  /*
   0000000   0000000   000   000  00000000  000   0000000 
  000       000   000  0000  000  000       000  000      
  000       000   000  000 0 000  000000    000  000  0000
  000       000   000  000  0000  000       000  000   000
   0000000   0000000   000   000  000       000   0000000
   */

  opt = noon.parse("coffee  . ext js  . replace .. /coffee/ /js/\nnoon    . ext json\njson    . ext noon . filter .. package.json$\nstyl    . ext css\njade    . ext html");

  config = function(p) {
    while (path.dirname(p).length && path.dirname(p) !== '.') {
      p = path.dirname(p);
      if (fs.existsSync(path.join(p, '.konrad.noon'))) {
        return _.defaultsDeep(sds.load(path.join(p, '.konrad.noon')), opt);
      }
    }
    return opt;
  };


  /*
  00000000  00000000   00000000    0000000   00000000 
  000       000   000  000   000  000   000  000   000
  0000000   0000000    0000000    000   000  0000000  
  000       000   000  000   000  000   000  000   000
  00000000  000   000  000   000   0000000   000   000
   */

  error = function(e) {
    notify(String(e).strip, {
      title: 'ERROR',
      sticky: true
    });
    return log(String(e));
  };


  /*
  00000000   000   000  0000000    000      000   0000000  000   000
  000   000  000   000  000   000  000      000  000       000   000
  00000000   000   000  0000000    000      000  0000000   000000000
  000        000   000  000   000  000      000       000  000   000
  000         0000000   0000000    0000000  000  0000000   000   000
   */

  if (args.publish) {
    log('publish', process.cwd());
    childp.execSync(__dirname + "/../bin/publish", {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: 'inherit'
    });
    log('done');
    process.exit(0);
  }


  /*
  000   000   0000000   000000000   0000000  000   000
  000 0 000  000   000     000     000       000   000
  000000000  000000000     000     000       000000000
  000   000  000   000     000     000       000   000
  00     00  000   000     000      0000000  000   000
   */

  watch = function(opt, cb) {
    var ignore, pass, ref, watcher;
    ignore = [/node_modules/, /\/\..+$/, /\.git$/, /\.app$/];
    pass = function(p) {
      var ref;
      if (ref = path.extname(p).substr(1), indexOf.call(_.keys(opt), ref) >= 0) {
        return true;
      }
    };
    watcher = choki.watch((ref = args.directory) != null ? ref : '.', {
      ignored: ignore,
      ignoreInitial: true
    });
    return watcher.on('add', function(p) {
      if (pass(p)) {
        return cb(p);
      }
    }).on('change', function(p) {
      if (pass(p)) {
        return cb(p);
      }
    });
  };

  watch(opt, function(sourceFile) {
    var o;
    o = config(sourceFile);
    if (indexOf.call(_.keys(o), 'ignore') >= 0) {
      return;
    }

    /*
    00000000   00000000   0000000   0000000  
    000   000  000       000   000  000   000
    0000000    0000000   000000000  000   000
    000   000  000       000   000  000   000
    000   000  00000000  000   000  0000000
     */
    return fs.readFile(sourceFile, 'utf8', function(err, data) {
      var compiled, e, error1, ext, f, i, k, len, matches, r, ref, ref1, v;
      if (err) {
        log("can't read " + sourceFile);
        return;
      }
      if (args.verbose) {
        log("source file".gray, sourceFile);
      }
      ext = path.extname(sourceFile).substr(1);
      f = sourceFile;
      if (o[ext].replace != null) {
        ref = o[ext].replace;
        for (k in ref) {
          v = ref[k];
          f = f.replace(k, v);
        }
      }
      if (o[ext].filter != null) {
        matches = false;
        ref1 = o[ext].filter;
        for (i = 0, len = ref1.length; i < len; i++) {
          r = ref1[i];
          if (new RegExp(r).test(sourceFile)) {
            matches = true;
          }
        }
        if (!matches) {
          return;
        }
      }
      if (o[ext].ext == null) {
        return;
      }
      f = path.join(path.dirname(f), path.basename(f, path.extname(f)) + '.' + o[ext].ext);
      if (args.verbose) {
        log("target file".gray, f);
      }
      try {

        /*
         0000000   0000000   00     00  00000000   000  000      00000000
        000       000   000  000   000  000   000  000  000      000     
        000       000   000  000000000  00000000   000  000      0000000 
        000       000   000  000 0 000  000        000  000      000     
         0000000   0000000   000   000  000        000  0000000  00000000
         */
        compiled = (function() {
          switch (ext) {
            case 'coffee':
              return coffee.compile(data, {
                filename: sourceFile
              });
            case 'styl':
              return stylus.render(data);
            case 'jade':
              return jade.render(data, {
                pretty: true
              });
            case 'json':
              return sds.stringify(JSON.parse(data, {
                ext: '.' + o[ext].ext,
                indent: '  '
              }));
            case 'noon':
              return sds.stringify(noon.parse(data), {
                ext: '.' + o[ext].ext,
                indent: '  '
              });
          }
        })();
      } catch (error1) {
        e = error1;
        error(e);
        return;
      }
      return fs.readFile(f, 'utf8', function(err, targetData) {
        if (compiled !== targetData) {

          /*
          000   000  00000000   000  000000000  00000000
          000 0 000  000   000  000     000     000     
          000000000  0000000    000     000     0000000 
          000   000  000   000  000     000     000     
          00     00  000   000  000     000     00000000
           */
          return write(f, compiled, function(err) {
            if (err) {
              log("can't write " + f);
              return;
            }
            if (!args.quiet) {
              log("->".gray, f.yellow);
            }
            if (path.resolve(f) === __filename) {
              log('exit'.yellow);
              return process.exit(0);
            }
          });
        } else {
          if (args.verbose) {
            return log('unchanged'.green, path.resolve(f));
          }
        }
      });
    });
  });

}).call(this);
