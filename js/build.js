// koffee 1.20.0

/*
0000000    000   000  000  000      0000000  
000   000  000   000  000  000      000   000
0000000    000   000  000  000      000   000
000   000  000   000  000  000      000   000
0000000     0000000   000  0000000  0000000
 */
var _, argDir, args, build, compile, config, empty, fs, kerror, klog, kolor, pretty, ref, runcmd, should, slash, target, writeCompiled;

ref = require('kxk'), _ = ref._, args = ref.args, empty = ref.empty, fs = ref.fs, kerror = ref.kerror, klog = ref.klog, kolor = ref.kolor, slash = ref.slash;

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
        klog(gray("source file"), sourceFile);
    }
    ext = slash.ext(sourceFile);
    cfg = config.obj(sourceFile, opt);
    if (ext === 'js' && should('browserify', cfg, sourceFile)) {
        main = cfg.browserify.main;
        out = cfg.browserify.out;
        pwd = config.path('browserify', slash.resolve(sourceFile), opt);
        if (out !== slash.relative(sourceFile, pwd)) {
            klog(pretty.filePath(_.padEnd(slash.relative(main, argDir()), 40), kolor.yellow), "🔧  ", pretty.filePath(slash.relative(out, argDir()), kolor.blue));
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
        klog(gray("target file"), targetFile);
    }
    return fs.readFile(sourceFile, 'utf8', function(err, sourceText) {
        var compiled, stat, ttat;
        if (err) {
            kerror("can't read " + sourceFile);
            cb();
            return;
        }
        compiled = compile(sourceText, ext, sourceFile, targetFile, cfg);
        if (empty(compiled)) {
            cb();
            return;
        }
        slash.logErrors = true;
        if (!slash.fileExists(targetFile) || slash.readText(targetFile) !== compiled) {
            return writeCompiled(sourceFile, targetFile, compiled, cb);
        } else {
            if (args.debug) {
                klog(kolor.green(kolor.dim('unchanged')), pretty.filePath(slash.relative(targetFile, argDir()), kolor.gray));
            }
            if (args.verbose) {
                console.log(pretty.time(), "👍  " + (pretty.filePath(sourceFile)) + " " + (kolor.bold(kolor.yellow('►'))) + " " + (pretty.filePath(targetFile)));
            }
            stat = fs.statSync(sourceFile);
            ttat = fs.statSync(targetFile);
            if (stat.mtime.getTime() !== ttat.mtime.getTime()) {
                return fs.utimesSync(slash.resolve(targetFile), stat.atime, stat.mtime);
            }
        }
    });
};

writeCompiled = function(sourceFile, targetFile, compiled, cb) {
    fs.mkdirSync(slash.dir(targetFile), {
        recursive: true
    });
    slash.writeText(targetFile, compiled);
    if (!args.quiet) {
        if (args.verbose) {
            console.log(pretty.time(), "👍   " + (pretty.filePath(slash.tilde(sourceFile))) + " " + (kolor.bold(kolor.yellow('►'))) + " " + (pretty.filePath(slash.tilde(targetFile))));
        } else {
            console.log(pretty.time(), "👍   " + (pretty.filePath(slash.tilde(targetFile))));
        }
    }
    return typeof cb === "function" ? cb(sourceFile, targetFile) : void 0;
};

module.exports = build;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VSb290IjoiLi4vY29mZmVlIiwic291cmNlcyI6WyJidWlsZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUE7O0FBUUEsTUFBcUQsT0FBQSxDQUFRLEtBQVIsQ0FBckQsRUFBRSxTQUFGLEVBQUssZUFBTCxFQUFXLGlCQUFYLEVBQWtCLFdBQWxCLEVBQXNCLG1CQUF0QixFQUE4QixlQUE5QixFQUFvQyxpQkFBcEMsRUFBMkM7O0FBRTNDLE1BQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7QUFDVixNQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVI7O0FBQ1YsTUFBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSOztBQUNWLE1BQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7QUFDVixNQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVI7O0FBQ1YsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztBQUNWLE1BQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7QUFFVixLQUFBLEdBQVEsU0FBQyxVQUFELEVBQWEsR0FBYixFQUFrQixFQUFsQjtBQUVKLFFBQUE7SUFBQSxJQUF3QyxJQUFJLENBQUMsS0FBN0M7UUFBQSxJQUFBLENBQUssSUFBQSxDQUFLLGFBQUwsQ0FBTCxFQUEwQixVQUExQixFQUFBOztJQUVBLEdBQUEsR0FBTSxLQUFLLENBQUMsR0FBTixDQUFVLFVBQVY7SUFFTixHQUFBLEdBQU0sTUFBTSxDQUFDLEdBQVAsQ0FBVyxVQUFYLEVBQXVCLEdBQXZCO0lBRU4sSUFBRyxHQUFBLEtBQU8sSUFBUCxJQUFnQixNQUFBLENBQU8sWUFBUCxFQUFxQixHQUFyQixFQUEwQixVQUExQixDQUFuQjtRQUNJLElBQUEsR0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQ3RCLEdBQUEsR0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQ3RCLEdBQUEsR0FBTyxNQUFNLENBQUMsSUFBUCxDQUFZLFlBQVosRUFBMEIsS0FBSyxDQUFD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bnRlbnQiOlsiIyMjXG4wMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgICAwMDAwMDAwICBcbjAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuMDAwMDAwMCAgICAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwXG4wMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgICAwMDAgICAwMDBcbjAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgIFxuIyMjXG5cbnsgXywgYXJncywgZW1wdHksIGZzLCBrZXJyb3IsIGtsb2csIGtvbG9yLCBzbGFzaCB9ID0gcmVxdWlyZSAna3hrJ1xuXG5wcmV0dHkgID0gcmVxdWlyZSAnLi9wcmV0dHknXG5jb25maWcgID0gcmVxdWlyZSAnLi9jb25maWcnXG5hcmdEaXIgID0gcmVxdWlyZSAnLi9hcmdkaXInXG5zaG91bGQgID0gcmVxdWlyZSAnLi9zaG91bGQnXG50YXJnZXQgID0gcmVxdWlyZSAnLi90YXJnZXQnXG5jb21waWxlID0gcmVxdWlyZSAnLi9jb21waWxlJ1xucnVuY21kICA9IHJlcXVpcmUgJy4vcnVuY21kJ1xuXG5idWlsZCA9IChzb3VyY2VGaWxlLCBvcHQsIGNiKSAtPlxuXG4gICAga2xvZyBncmF5KFwic291cmNlIGZpbGVcIiksIHNvdXJjZUZpbGUgaWYgYXJncy5kZWJ1Z1xuXG4gICAgZXh0ID0gc2xhc2guZXh0IHNvdXJjZUZpbGVcblxuICAgIGNmZyA9IGNvbmZpZy5vYmogc291cmNlRmlsZSwgb3B0XG5cbiAgICBpZiBleHQgPT0gJ2pzJyBhbmQgc2hvdWxkICdicm93c2VyaWZ5JywgY2ZnLCBzb3VyY2VGaWxlXG4gICAgICAgIG1haW4gPSBjZmcuYnJvd3NlcmlmeS5tYWluXG4gICAgICAgIG91dCAgPSBjZmcuYnJvd3NlcmlmeS5vdXRcbiAgICAgICAgcHdkICA9IGNvbmZpZy5wYXRoICdicm93c2VyaWZ5Jywgc2xhc2gucmVzb2x2ZShzb3VyY2VGaWxlKSwgb3B0XG4gICAgICAgIGlmIG91dCAhPSBzbGFzaC5yZWxhdGl2ZSBzb3VyY2VGaWxlLCBwd2RcbiAgICAgICAgICAgIGtsb2cgcHJldHR5LmZpbGVQYXRoKF8ucGFkRW5kKHNsYXNoLnJlbGF0aXZlKG1haW4sIGFyZ0RpcigpKSwgNDApLCBrb2xvci55ZWxsb3cpLCBcIvCflKcgIFwiLCBwcmV0dHkuZmlsZVBhdGgoc2xhc2gucmVsYXRpdmUob3V0LCBhcmdEaXIoKSksIGtvbG9yLmJsdWUpXG4gICAgICAgICAgICBydW5jbWQgJ2Jyb3dzZXJpZnknLCBcIiN7bWFpbn0gI3tvdXR9XCIsIHB3ZFxuICAgICAgICByZXR1cm5cblxuICAgIHRhcmdldEZpbGUgPSB0YXJnZXQgc291cmNlRmlsZSwgb3B0XG4gICAgaWYgbm90IHRhcmdldEZpbGU/XG4gICAgICAgIHdhcm4gXCJubyB0YXJnZXRGaWxlIGZvciBzb3VyY2U6ICN7c291cmNlRmlsZX1cIiwgb3B0XG4gICAgICAgIHJldHVyblxuXG4gICAga2xvZyBncmF5KFwidGFyZ2V0IGZpbGVcIiksIHRhcmdldEZpbGUgaWYgYXJncy5kZWJ1Z1xuXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMFxuXG4gICAgZnMucmVhZEZpbGUgc291cmNlRmlsZSwgJ3V0ZjgnIChlcnIsIHNvdXJjZVRleHQpIC0+XG5cbiAgICAgICAgaWYgZXJyIFxuICAgICAgICAgICAga2Vycm9yIFwiY2FuJ3QgcmVhZCAje3NvdXJjZUZpbGV9XCJcbiAgICAgICAgICAgIGNiKClcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgXG4gICAgICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAgICAgIDAwICAwMDAwMDAwMCAgIDAwMCAgMDAwICAgICAgMDAwMDAwMDAgIFxuICAgICAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgIDAwMCAgICAgICBcbiAgICAgICAgIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwICAwMDAgICAgICAwMDAwMDAwICAgXG4gICAgICAgICMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgMDAwICAgICAgIFxuICAgICAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICBcbiBcbiAgICAgICAgY29tcGlsZWQgPSBjb21waWxlIHNvdXJjZVRleHQsIGV4dCwgc291cmNlRmlsZSwgdGFyZ2V0RmlsZSwgY2ZnXG4gICAgICAgICMgbG9nICdjb21waWxlZCcgc291cmNlVGV4dCwgY29tcGlsZWRcbiAgICAgICAgXG4gICAgICAgIGlmIGVtcHR5IGNvbXBpbGVkXG4gICAgICAgICAgICBjYigpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIHNsYXNoLmxvZ0Vycm9ycyA9IHRydWVcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBzbGFzaC5maWxlRXhpc3RzKHRhcmdldEZpbGUpIG9yIHNsYXNoLnJlYWRUZXh0KHRhcmdldEZpbGUpICE9IGNvbXBpbGVkXG4gICAgICAgICAgICB3cml0ZUNvbXBpbGVkIHNvdXJjZUZpbGUsIHRhcmdldEZpbGUsIGNvbXBpbGVkLCBjYlxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIGxvZyAnbm9Xcml0ZT8nIHRhcmdldEZpbGUsIHNsYXNoLmZpbGVFeGlzdHModGFyZ2V0RmlsZSksIHNsYXNoLnJlYWRUZXh0KHRhcmdldEZpbGUpXG4gICAgICAgICAgICBrbG9nIGtvbG9yLmdyZWVuKGtvbG9yLmRpbSgndW5jaGFuZ2VkJykpLCBwcmV0dHkuZmlsZVBhdGgoc2xhc2gucmVsYXRpdmUodGFyZ2V0RmlsZSwgYXJnRGlyKCkpLCBrb2xvci5ncmF5KSBpZiBhcmdzLmRlYnVnXG4gICAgICAgICAgICBpZiBhcmdzLnZlcmJvc2VcbiAgICAgICAgICAgICAgICBsb2cgcHJldHR5LnRpbWUoKSwgXCLwn5GNICAje3ByZXR0eS5maWxlUGF0aCBzb3VyY2VGaWxlfSAje2tvbG9yLmJvbGQoa29sb3IueWVsbG93KCfilronKSl9ICN7cHJldHR5LmZpbGVQYXRoIHRhcmdldEZpbGV9XCJcbiAgICAgICAgICAgIHN0YXQgPSBmcy5zdGF0U3luYyBzb3VyY2VGaWxlXG4gICAgICAgICAgICB0dGF0ID0gZnMuc3RhdFN5bmMgdGFyZ2V0RmlsZVxuICAgICAgICAgICAgaWYgc3RhdC5tdGltZS5nZXRUaW1lKCkgIT0gdHRhdC5tdGltZS5nZXRUaW1lKClcbiAgICAgICAgICAgICAgICBmcy51dGltZXNTeW5jIHNsYXNoLnJlc29sdmUodGFyZ2V0RmlsZSksIHN0YXQuYXRpbWUsIHN0YXQubXRpbWVcblxuIyAwMDAgICAwMDAgIDAwMDAwMDAwICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwXG4jIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIDAwMCAgICAgMDAwXG4jIDAwMDAwMDAwMCAgMDAwMDAwMCAgICAwMDAgICAgIDAwMCAgICAgMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAwMDAgICAgIDAwMFxuIyAwMCAgICAgMDAgIDAwMCAgIDAwMCAgMDAwICAgICAwMDAgICAgIDAwMDAwMDAwXG5cbndyaXRlQ29tcGlsZWQgPSAoc291cmNlRmlsZSwgdGFyZ2V0RmlsZSwgY29tcGlsZWQsIGNiKSAtPlxuICAgIFxuICAgIGZzLm1rZGlyU3luYyBzbGFzaC5kaXIodGFyZ2V0RmlsZSksIHJlY3Vyc2l2ZTp0cnVlXG5cbiAgICBzbGFzaC53cml0ZVRleHQgdGFyZ2V0RmlsZSwgY29tcGlsZWRcblxuICAgIGlmIG5vdCBhcmdzLnF1aWV0XG4gICAgICAgIGlmIGFyZ3MudmVyYm9zZVxuICAgICAgICAgICAgbG9nIHByZXR0eS50aW1lKCksIFwi8J+RjSAgICN7cHJldHR5LmZpbGVQYXRoIHNsYXNoLnRpbGRlIHNvdXJjZUZpbGV9ICN7a29sb3IuYm9sZChrb2xvci55ZWxsb3coJ+KWuicpKX0gI3twcmV0dHkuZmlsZVBhdGggc2xhc2gudGlsZGUgdGFyZ2V0RmlsZX1cIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBsb2cgcHJldHR5LnRpbWUoKSwgXCLwn5GNICAgI3twcmV0dHkuZmlsZVBhdGggc2xhc2gudGlsZGUgdGFyZ2V0RmlsZX1cIlxuXG4gICAgY2I/IHNvdXJjZUZpbGUsIHRhcmdldEZpbGVcblxubW9kdWxlLmV4cG9ydHMgPSBidWlsZFxuIl19
//# sourceURL=../coffee/build.coffee