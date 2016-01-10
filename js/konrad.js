
/*
000   000   0000000   000   000  00000000    0000000   0000000  
000  000   000   000  0000  000  000   000  000   000  000   000
0000000    000   000  000 0 000  0000000    000000000  000   000
000  000   000   000  000  0000  000   000  000   000  000   000
000   000   0000000   000   000  000   000  000   000  0000000
 */

(function() {
  var _, args, chalk, choki, coffee, colors, error, fs, log, noon, notify, opt, path, stylus, watch, write,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  path = require('path');

  noon = require('noon');

  write = require('write-file-atomic');

  stylus = require('stylus');

  colors = require('colors');

  chalk = require('chalk');

  coffee = require('coffee-script');

  choki = require('chokidar');

  notify = require('growl');

  path = require('path');

  _ = require('lodash');

  log = console.log;

  args = require('karg')("konrad\n    directory  . ? the directory to watch . * . = .\n    verbose    . ? log more . = false\n    quiet      . ? log nothing . = false\n    version    . - V . = " + (require(__dirname + "/../package.json").version));

  opt = noon.parse("coffee  . ext js . replace .. /coffee/ /js/\nnoon    . ext json\njson    . ext noon . filter .. package.json$\nstyl    . ext css");


  /*
  00000000  00000000   00000000    0000000   00000000 
  000       000   000  000   000  000   000  000   000
  0000000   0000000    0000000    000   000  0000000  
  000       000   000  000   000  000   000  000   000
  00000000  000   000  000   000   0000000   000   000
   */

  error = function(e) {
    notify(chalk.stripColor(String(e)), {
      title: 'ERROR',
      sticky: true
    });
    return log(String(e));
  };


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
    watcher = choki.watch((ref = opt.dir) != null ? ref : '.', {
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
      if (opt[ext].replace != null) {
        ref = opt[ext].replace;
        for (k in ref) {
          v = ref[k];
          f = f.replace(k, v);
        }
      }
      if (opt[ext].filter != null) {
        matches = false;
        ref1 = opt[ext].filter;
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
      f = path.join(path.dirname(f), path.basename(f, path.extname(f)) + '.' + opt[ext].ext);
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
            case 'json':
              return noon.stringify(JSON.parse(data));
            case 'noon':
              return JSON.stringify(noon.parse(data), null, '  ');
            case 'styl':
              return stylus.render(data);
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
