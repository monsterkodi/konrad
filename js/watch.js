// koffee 1.12.0

/*
000   000   0000000   000000000   0000000  000   000
000 0 000  000   000     000     000       000   000
000000000  000000000     000     000       000000000
000   000  000   000     000     000       000   000
00     00  000   000     000      0000000  000   000
 */
var Watch, _, args, build, colors, config, klog, pkg, pretty, ref, runcmd, should, slash, watcher,
    indexOf = [].indexOf;

ref = require('kxk'), colors = ref.colors, slash = ref.slash, args = ref.args, klog = ref.klog, _ = ref._;

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
            return ref1 = slash.ext(p), indexOf.call(_.keys(opt), ref1) >= 0;
        };
        d = (ref1 = args["arguments"][0]) != null ? ref1 : '.';
        v = (pkg.version + " ●").dim.gray;
        klog(pretty.time(), ("👁   " + v + " " + (pretty.filePath(slash.resolve(d), colors.white))).gray);
        watcher = require('kxk').watch.watch(d, {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2guanMiLCJzb3VyY2VSb290IjoiLi4vY29mZmVlIiwic291cmNlcyI6WyJ3YXRjaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUEsNkZBQUE7SUFBQTs7QUFRQSxNQUFtQyxPQUFBLENBQVEsS0FBUixDQUFuQyxFQUFFLG1CQUFGLEVBQVUsaUJBQVYsRUFBaUIsZUFBakIsRUFBdUIsZUFBdkIsRUFBNkI7O0FBRTdCLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxLQUFBLEdBQVMsT0FBQSxDQUFRLFNBQVI7O0FBQ1QsR0FBQSxHQUFTLE9BQUEsQ0FBUSxpQkFBUjs7QUFFVCxPQUFBLEdBQVU7O0FBRVYsS0FBQSxHQUFRLFNBQUMsR0FBRCxFQUFNLEdBQU47QUFJSixRQUFBO0lBQUEsS0FBQSxHQUFRLFNBQUMsRUFBRDtBQUVKLFlBQUE7UUFBQSxJQUFBLEdBQU8sU0FBQyxDQUFEO0FBQU8sZ0JBQUE7MEJBQUEsS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWLENBQUEsRUFBQSxhQUFnQixDQUFDLENBQUMsSUFBRixDQUFPLEdBQVAsQ0FBaEIsRUFBQSxJQUFBO1FBQVA7UUFFUCxDQUFBLGtEQUF3QjtRQUN4QixDQUFBLEdBQUksQ0FBRyxHQUFHLENBQUMsT0FBTCxHQUFhLElBQWYsQ0FBa0IsQ0FBQyxHQUFHLENBQUM7UUFDM0IsSUFBQSxDQUFLLE1BQU0sQ0FBQyxJQUFQLENBQUEsQ0FBTCxFQUFvQixDQUFBLE9BQUEsR0FBUSxDQUFSLEdBQVUsR0FBVixHQUFZLENBQUMsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLE9BQU4sQ0FBYyxDQUFkLENBQWhCLEVBQWtDLE1BQU0sQ0FBQyxLQUF6QyxDQUFELENBQVosQ0FBNkQsQ0FBQyxJQUFsRjtRQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsS0FBUixDQUFjLENBQUMsS0FBSyxDQUFDLEtBQXJCLENBQTJCLENBQTNCLEVBQThCO1lBQUEsU0FBQSxFQUFVLElBQVY7WUFBZ0IsTUFBQSxFQUFPLEdBQUcsQ0FBQyxNQUEzQjtTQUE5QjtlQUNWLE9BQU8sQ0FBQyxFQUFSLENBQVcsUUFBWCxFQUFvQixTQUFDLElBQUQ7WUFDaEIsSUFBRyxJQUFBLENBQUssSUFBSSxDQUFDLElBQVYsQ0FBSDt1QkFBdUIsRUFBQSxDQUFHLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBSSxDQUFDLElBQWhCLENBQUgsRUFBdkI7O1FBRGdCLENBQXBCO0lBUkk7V0FXUixLQUFBLENBQU0sU0FBQyxVQUFEO0FBRUYsWUFBQTtRQUFBLFVBQUEsR0FBYSxLQUFLLENBQUMsT0FBTixDQUFjLFVBQWQ7UUFDYixDQUFBLEdBQUksTUFBTSxDQUFDLEdBQVAsQ0FBVyxVQUFYLEVBQXVCLEdBQXZCO1FBRUosSUFBQSxHQUFPLFNBQUMsTUFBRDtZQUNILElBQUcsTUFBQSxDQUFPLE1BQVAsRUFBYyxDQUFkLEVBQWlCLE1BQWpCLENBQUg7dUJBQ0ksTUFBQSxDQUFPLE1BQVAsRUFBYyxNQUFkLEVBQXNCLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBWixFQUFtQixLQUFLLENBQUMsT0FBTixDQUFjLE1BQWQsQ0FBbkIsRUFBMEMsR0FBMUMsQ0FBdEIsRUFESjs7UUFERztRQUlQLElBQUcsQ0FBSSxNQUFBLENBQU8sUUFBUCxFQUFnQixDQUFoQixFQUFtQixVQUFuQixDQUFQO21CQUNJLEtBQUEsQ0FBTSxVQUFOLEVBQWtCLEdBQWxCLEVBQXVCLElBQXZCLEVBREo7U0FBQSxNQUFBO21CQUdJLElBQUEsQ0FBSyxVQUFMLEVBSEo7O0lBVEUsQ0FBTjtBQWZJOztBQTZCUixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMFxuMDAwIDAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuMDAwMDAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMDAwMDAwMFxuMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuMDAgICAgIDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgIDAwMDAwMDAgIDAwMCAgIDAwMFxuIyMjXG5cbnsgY29sb3JzLCBzbGFzaCwgYXJncywga2xvZywgXyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5wcmV0dHkgPSByZXF1aXJlICcuL3ByZXR0eSdcbnNob3VsZCA9IHJlcXVpcmUgJy4vc2hvdWxkJ1xucnVuY21kID0gcmVxdWlyZSAnLi9ydW5jbWQnXG5jb25maWcgPSByZXF1aXJlICcuL2NvbmZpZydcbmJ1aWxkICA9IHJlcXVpcmUgJy4vYnVpbGQnXG5wa2cgICAgPSByZXF1aXJlICcuLi9wYWNrYWdlLmpzb24nXG5cbndhdGNoZXIgPSBudWxsXG5cbldhdGNoID0gKHdsaywgb3B0KSAtPlxuICAgIFxuICAgICMga2xvZyAnd2F0Y2gnIHdsaywgb3B0XG4gICAgXG4gICAgc3RhcnQgPSAoY2IpIC0+XG5cbiAgICAgICAgcGFzcyA9IChwKSAtPiBzbGFzaC5leHQocCkgaW4gXy5rZXlzKG9wdClcblxuICAgICAgICBkID0gYXJncy5hcmd1bWVudHNbMF0gPyAnLidcbiAgICAgICAgdiA9IFwiI3twa2cudmVyc2lvbn0g4pePXCIuZGltLmdyYXlcbiAgICAgICAga2xvZyBwcmV0dHkudGltZSgpLCBcIvCfkYEgICAje3Z9ICN7cHJldHR5LmZpbGVQYXRoIHNsYXNoLnJlc29sdmUoZCksIGNvbG9ycy53aGl0ZX1cIi5ncmF5XG4gICAgICAgIHdhdGNoZXIgPSByZXF1aXJlKCdreGsnKS53YXRjaC53YXRjaCBkLCByZWN1cnNpdmU6dHJ1ZSwgaWdub3JlOndsay5pZ25vcmVcbiAgICAgICAgd2F0Y2hlci5vbiAnY2hhbmdlJyAoaW5mbykgLT4gXG4gICAgICAgICAgICBpZiBwYXNzIGluZm8ucGF0aCB0aGVuIGNiIHNsYXNoLnBhdGggaW5mby5wYXRoXG5cbiAgICBzdGFydCAoc291cmNlRmlsZSkgLT5cblxuICAgICAgICBzb3VyY2VGaWxlID0gc2xhc2gucmVzb2x2ZSBzb3VyY2VGaWxlXG4gICAgICAgIG8gPSBjb25maWcub2JqIHNvdXJjZUZpbGUsIG9wdFxuXG4gICAgICAgIHRlc3QgPSAoc291cmNlKSAtPlxuICAgICAgICAgICAgaWYgc2hvdWxkICd0ZXN0JyBvLCBzb3VyY2VcbiAgICAgICAgICAgICAgICBydW5jbWQgJ3Rlc3QnIHNvdXJjZSwgY29uZmlnLnBhdGggJ3Rlc3QnIHNsYXNoLnJlc29sdmUoc291cmNlKSwgb3B0XG5cbiAgICAgICAgaWYgbm90IHNob3VsZCAnaWdub3JlJyBvLCBzb3VyY2VGaWxlXG4gICAgICAgICAgICBidWlsZCBzb3VyY2VGaWxlLCBvcHQsIHRlc3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGVzdCBzb3VyY2VGaWxlXG5cbm1vZHVsZS5leHBvcnRzID0gV2F0Y2hcbiJdfQ==
//# sourceURL=../coffee/watch.coffee