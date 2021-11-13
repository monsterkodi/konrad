// koffee 1.19.0

/*
000   000   0000000   000000000   0000000  000   000
000 0 000  000   000     000     000       000   000
000000000  000000000     000     000       000000000
000   000  000   000     000     000       000   000
00     00  000   000     000      0000000  000   000
 */
var Watch, _, args, build, config, klog, kolor, kxk, pkg, pretty, runcmd, should, slash, watch, watcher,
    indexOf = [].indexOf;

kxk = require('kxk');

_ = kxk._, args = kxk.args, klog = kxk.klog, kolor = kxk.kolor, slash = kxk.slash, watch = kxk.watch;

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
        var d, pass, ref, v;
        pass = function(p) {
            var ref;
            return ref = slash.ext(p), indexOf.call(_.keys(opt), ref) >= 0;
        };
        d = (ref = args["arguments"][0]) != null ? ref : '.';
        v = kolor.dim(kolor.gray(pkg.version + " ●"));
        klog(pretty.time(), kolor.gray("👁   " + v + " " + (pretty.filePath(slash.resolve(d), kolor.white))));
        return watcher = watch.watch(d, {
            recursive: true,
            ignore: wlk.ignore,
            cb: function(watcher) {
                return watcher.on('change', function(info) {
                    if (pass(info.path)) {
                        return cb(slash.path(info.path));
                    }
                });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2guanMiLCJzb3VyY2VSb290IjoiLi4vY29mZmVlIiwic291cmNlcyI6WyJ3YXRjaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUEsbUdBQUE7SUFBQTs7QUFRQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVI7O0FBQ0osU0FBRixFQUFLLGVBQUwsRUFBVyxlQUFYLEVBQWlCLGlCQUFqQixFQUF3QixpQkFBeEIsRUFBK0I7O0FBRS9CLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxLQUFBLEdBQVMsT0FBQSxDQUFRLFNBQVI7O0FBQ1QsR0FBQSxHQUFTLE9BQUEsQ0FBUSxpQkFBUjs7QUFFVCxPQUFBLEdBQVU7O0FBRVYsS0FBQSxHQUFRLFNBQUMsR0FBRCxFQUFNLEdBQU47QUFJSixRQUFBO0lBQUEsS0FBQSxHQUFRLFNBQUMsRUFBRDtBQUVKLFlBQUE7UUFBQSxJQUFBLEdBQU8sU0FBQyxDQUFEO0FBQU8sZ0JBQUE7eUJBQUEsS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWLENBQUEsRUFBQSxhQUFnQixDQUFDLENBQUMsSUFBRixDQUFPLEdBQVAsQ0FBaEIsRUFBQSxHQUFBO1FBQVA7UUFFUCxDQUFBLGdEQUF3QjtRQUN4QixDQUFBLEdBQUksS0FBSyxDQUFDLEdBQU4sQ0FBVSxLQUFLLENBQUMsSUFBTixDQUFjLEdBQUcsQ0FBQyxPQUFMLEdBQWEsSUFBMUIsQ0FBVjtRQUNKLElBQUEsQ0FBSyxNQUFNLENBQUMsSUFBUCxDQUFBLENBQUwsRUFBb0IsS0FBSyxDQUFDLElBQU4sQ0FBVyxPQUFBLEdBQVEsQ0FBUixHQUFVLEdBQVYsR0FBWSxDQUFDLE1BQU0sQ0FBQyxRQUFQLENBQWdCLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxDQUFoQixFQUFrQyxLQUFLLENBQUMsS0FBeEMsQ0FBRCxDQUF2QixDQUFwQjtlQUNBLE9BQUEsR0FBVSxLQUFLLENBQUMsS0FBTixDQUFZLENBQVosRUFBZTtZQUFBLFNBQUEsRUFBVSxJQUFWO1lBQWdCLE1BQUEsRUFBTyxHQUFHLENBQUMsTUFBM0I7WUFBbUMsRUFBQSxFQUFHLFNBQUMsT0FBRDt1QkFDM0QsT0FBTyxDQUFDLEVBQVIsQ0FBVyxRQUFYLEVBQW9CLFNBQUMsSUFBRDtvQkFDaEIsSUFBRyxJQUFBLENBQUssSUFBSSxDQUFDLElBQVYsQ0FBSDsrQkFBdUIsRUFBQSxDQUFHLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBSSxDQUFDLElBQWhCLENBQUgsRUFBdkI7O2dCQURnQixDQUFwQjtZQUQyRCxDQUF0QztTQUFmO0lBUE47V0FXUixLQUFBLENBQU0sU0FBQyxVQUFEO0FBRUYsWUFBQTtRQUFBLFVBQUEsR0FBYSxLQUFLLENBQUMsT0FBTixDQUFjLFVBQWQ7UUFDYixDQUFBLEdBQUksTUFBTSxDQUFDLEdBQVAsQ0FBVyxVQUFYLEVBQXVCLEdBQXZCO1FBRUosSUFBQSxHQUFPLFNBQUMsTUFBRDtZQUNILElBQUcsTUFBQSxDQUFPLE1BQVAsRUFBYyxDQUFkLEVBQWlCLE1BQWpCLENBQUg7dUJBQ0ksTUFBQSxDQUFPLE1BQVAsRUFBYyxNQUFkLEVBQXNCLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBWixFQUFtQixLQUFLLENBQUMsT0FBTixDQUFjLE1BQWQsQ0FBbkIsRUFBMEMsR0FBMUMsQ0FBdEIsRUFESjs7UUFERztRQUlQLElBQUcsQ0FBSSxNQUFBLENBQU8sUUFBUCxFQUFnQixDQUFoQixFQUFtQixVQUFuQixDQUFQO21CQUNJLEtBQUEsQ0FBTSxVQUFOLEVBQWtCLEdBQWxCLEVBQXVCLElBQXZCLEVBREo7U0FBQSxNQUFBO21CQUdJLElBQUEsQ0FBSyxVQUFMLEVBSEo7O0lBVEUsQ0FBTjtBQWZJOztBQTZCUixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMFxuMDAwIDAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuMDAwMDAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMDAwMDAwMFxuMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuMDAgICAgIDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgIDAwMDAwMDAgIDAwMCAgIDAwMFxuIyMjXG5cbmt4ayA9IHJlcXVpcmUgJ2t4aydcbnsgXywgYXJncywga2xvZywga29sb3IsIHNsYXNoLCB3YXRjaCB9ID0ga3hrXG5cbnByZXR0eSA9IHJlcXVpcmUgJy4vcHJldHR5J1xuc2hvdWxkID0gcmVxdWlyZSAnLi9zaG91bGQnXG5ydW5jbWQgPSByZXF1aXJlICcuL3J1bmNtZCdcbmNvbmZpZyA9IHJlcXVpcmUgJy4vY29uZmlnJ1xuYnVpbGQgID0gcmVxdWlyZSAnLi9idWlsZCdcbnBrZyAgICA9IHJlcXVpcmUgJy4uL3BhY2thZ2UuanNvbidcblxud2F0Y2hlciA9IG51bGxcblxuV2F0Y2ggPSAod2xrLCBvcHQpIC0+XG4gICAgXG4gICAgIyBrbG9nICd3YXRjaCcgd2xrLCBvcHRcbiAgICBcbiAgICBzdGFydCA9IChjYikgLT5cblxuICAgICAgICBwYXNzID0gKHApIC0+IHNsYXNoLmV4dChwKSBpbiBfLmtleXMob3B0KVxuXG4gICAgICAgIGQgPSBhcmdzLmFyZ3VtZW50c1swXSA/ICcuJ1xuICAgICAgICB2ID0ga29sb3IuZGltIGtvbG9yLmdyYXkgXCIje3BrZy52ZXJzaW9ufSDil49cIlxuICAgICAgICBrbG9nIHByZXR0eS50aW1lKCksIGtvbG9yLmdyYXkgXCLwn5GBICAgI3t2fSAje3ByZXR0eS5maWxlUGF0aCBzbGFzaC5yZXNvbHZlKGQpLCBrb2xvci53aGl0ZX1cIlxuICAgICAgICB3YXRjaGVyID0gd2F0Y2gud2F0Y2ggZCwgcmVjdXJzaXZlOnRydWUsIGlnbm9yZTp3bGsuaWdub3JlLCBjYjood2F0Y2hlcikgLT5cbiAgICAgICAgICAgIHdhdGNoZXIub24gJ2NoYW5nZScgKGluZm8pIC0+IFxuICAgICAgICAgICAgICAgIGlmIHBhc3MgaW5mby5wYXRoIHRoZW4gY2Igc2xhc2gucGF0aCBpbmZvLnBhdGhcblxuICAgIHN0YXJ0IChzb3VyY2VGaWxlKSAtPlxuXG4gICAgICAgIHNvdXJjZUZpbGUgPSBzbGFzaC5yZXNvbHZlIHNvdXJjZUZpbGVcbiAgICAgICAgbyA9IGNvbmZpZy5vYmogc291cmNlRmlsZSwgb3B0XG5cbiAgICAgICAgdGVzdCA9IChzb3VyY2UpIC0+XG4gICAgICAgICAgICBpZiBzaG91bGQgJ3Rlc3QnIG8sIHNvdXJjZVxuICAgICAgICAgICAgICAgIHJ1bmNtZCAndGVzdCcgc291cmNlLCBjb25maWcucGF0aCAndGVzdCcgc2xhc2gucmVzb2x2ZShzb3VyY2UpLCBvcHRcblxuICAgICAgICBpZiBub3Qgc2hvdWxkICdpZ25vcmUnIG8sIHNvdXJjZUZpbGVcbiAgICAgICAgICAgIGJ1aWxkIHNvdXJjZUZpbGUsIG9wdCwgdGVzdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0ZXN0IHNvdXJjZUZpbGVcblxubW9kdWxlLmV4cG9ydHMgPSBXYXRjaFxuIl19
//# sourceURL=../coffee/watch.coffee