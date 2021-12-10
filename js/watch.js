// koffee 1.20.0

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
        return watch.watch(d, {
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
            console.log('build?', sourceFile, opt, test);
            return build(sourceFile, opt, test);
        } else {
            return test(sourceFile);
        }
    });
};

module.exports = Watch;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2guanMiLCJzb3VyY2VSb290IjoiLi4vY29mZmVlIiwic291cmNlcyI6WyJ3YXRjaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUEsbUdBQUE7SUFBQTs7QUFRQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVI7O0FBQ0osU0FBRixFQUFLLGVBQUwsRUFBVyxlQUFYLEVBQWlCLGlCQUFqQixFQUF3QixpQkFBeEIsRUFBK0I7O0FBRS9CLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxLQUFBLEdBQVMsT0FBQSxDQUFRLFNBQVI7O0FBQ1QsR0FBQSxHQUFTLE9BQUEsQ0FBUSxpQkFBUjs7QUFFVCxPQUFBLEdBQVU7O0FBRVYsS0FBQSxHQUFRLFNBQUMsR0FBRCxFQUFNLEdBQU47QUFJSixRQUFBO0lBQUEsS0FBQSxHQUFRLFNBQUMsRUFBRDtBQUVKLFlBQUE7UUFBQSxJQUFBLEdBQU8sU0FBQyxDQUFEO0FBQU8sZ0JBQUE7eUJBQUEsS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWLENBQUEsRUFBQSxhQUFnQixDQUFDLENBQUMsSUFBRixDQUFPLEdBQVAsQ0FBaEIsRUFBQSxHQUFBO1FBQVA7UUFFUCxDQUFBLGdEQUF3QjtRQUN4QixDQUFBLEdBQUksS0FBSyxDQUFDLEdBQU4sQ0FBVSxLQUFLLENBQUMsSUFBTixDQUFjLEdBQUcsQ0FBQyxPQUFMLEdBQWEsSUFBMUIsQ0FBVjtRQUNKLElBQUEsQ0FBSyxNQUFNLENBQUMsSUFBUCxDQUFBLENBQUwsRUFBb0IsS0FBSyxDQUFDLElBQU4sQ0FBVyxPQUFBLEdBQVEsQ0FBUixHQUFVLEdBQVYsR0FBWSxDQUFDLE1BQU0sQ0FBQyxRQUFQLENBQWdCLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxDQUFoQixFQUFrQyxLQUFLLENBQUMsS0FBeEMsQ0FBRCxDQUF2QixDQUFwQjtlQUNBLEtBQUssQ0FBQyxLQUFOLENBQVksQ0FBWixFQUFlO1lBQUEsU0FBQSxFQUFVLElBQVY7WUFBZ0IsTUFBQSxFQUFPLEdBQUcsQ0FBQyxNQUEzQjtZQUFtQyxFQUFBLEVBQUcsU0FBQyxPQUFEO3VCQUNqRCxPQUFPLENBQUMsRUFBUixDQUFXLFFBQVgsRUFBb0IsU0FBQyxJQUFEO29CQUNoQixJQUFHLElBQUEsQ0FBSyxJQUFJLENBQUMsSUFBVixDQUFIOytCQUF1QixFQUFBLENBQUcsS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFJLENBQUMsSUFBaEIsQ0FBSCxFQUF2Qjs7Z0JBRGdCLENBQXBCO1lBRGlELENBQXRDO1NBQWY7SUFQSTtXQVdSLEtBQUEsQ0FBTSxTQUFDLFVBQUQ7QUFFRixZQUFBO1FBQUEsVUFBQSxHQUFhLEtBQUssQ0FBQyxPQUFOLENBQWMsVUFBZDtRQUNiLENBQUEsR0FBSSxNQUFNLENBQUMsR0FBUCxDQUFXLFVBQVgsRUFBdUIsR0FBdkI7UUFFSixJQUFBLEdBQU8sU0FBQyxNQUFEO1lBQ0gsSUFBRyxNQUFBLENBQU8sTUFBUCxFQUFjLENBQWQsRUFBaUIsTUFBakIsQ0FBSDt1QkFDSSxNQUFBLENBQU8sTUFBUCxFQUFjLE1BQWQsRUFBc0IsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFaLEVBQW1CLEtBQUssQ0FBQyxPQUFOLENBQWMsTUFBZCxDQUFuQixFQUEwQyxHQUExQyxDQUF0QixFQURKOztRQURHO1FBSVAsSUFBRyxDQUFJLE1BQUEsQ0FBTyxRQUFQLEVBQWdCLENBQWhCLEVBQW1CLFVBQW5CLENBQVA7WUFDRyxPQUFBLENBQUMsR0FBRCxDQUFLLFFBQUwsRUFBYyxVQUFkLEVBQTBCLEdBQTFCLEVBQStCLElBQS9CO21CQUNDLEtBQUEsQ0FBTSxVQUFOLEVBQWtCLEdBQWxCLEVBQXVCLElBQXZCLEVBRko7U0FBQSxNQUFBO21CQUlJLElBQUEsQ0FBSyxVQUFMLEVBSko7O0lBVEUsQ0FBTjtBQWZJOztBQThCUixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMFxuMDAwIDAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuMDAwMDAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMDAwMDAwMFxuMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuMDAgICAgIDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgIDAwMDAwMDAgIDAwMCAgIDAwMFxuIyMjXG5cbmt4ayA9IHJlcXVpcmUgJ2t4aydcbnsgXywgYXJncywga2xvZywga29sb3IsIHNsYXNoLCB3YXRjaCB9ID0ga3hrXG5cbnByZXR0eSA9IHJlcXVpcmUgJy4vcHJldHR5J1xuc2hvdWxkID0gcmVxdWlyZSAnLi9zaG91bGQnXG5ydW5jbWQgPSByZXF1aXJlICcuL3J1bmNtZCdcbmNvbmZpZyA9IHJlcXVpcmUgJy4vY29uZmlnJ1xuYnVpbGQgID0gcmVxdWlyZSAnLi9idWlsZCdcbnBrZyAgICA9IHJlcXVpcmUgJy4uL3BhY2thZ2UuanNvbidcblxud2F0Y2hlciA9IG51bGxcblxuV2F0Y2ggPSAod2xrLCBvcHQpIC0+XG4gICAgXG4gICAgIyBsb2cgJ3dhdGNoJyB3bGssIG9wdFxuICAgIFxuICAgIHN0YXJ0ID0gKGNiKSAtPlxuXG4gICAgICAgIHBhc3MgPSAocCkgLT4gc2xhc2guZXh0KHApIGluIF8ua2V5cyhvcHQpXG5cbiAgICAgICAgZCA9IGFyZ3MuYXJndW1lbnRzWzBdID8gJy4nXG4gICAgICAgIHYgPSBrb2xvci5kaW0ga29sb3IuZ3JheSBcIiN7cGtnLnZlcnNpb259IOKXj1wiXG4gICAgICAgIGtsb2cgcHJldHR5LnRpbWUoKSwga29sb3IuZ3JheSBcIvCfkYEgICAje3Z9ICN7cHJldHR5LmZpbGVQYXRoIHNsYXNoLnJlc29sdmUoZCksIGtvbG9yLndoaXRlfVwiXG4gICAgICAgIHdhdGNoLndhdGNoIGQsIHJlY3Vyc2l2ZTp0cnVlLCBpZ25vcmU6d2xrLmlnbm9yZSwgY2I6KHdhdGNoZXIpIC0+XG4gICAgICAgICAgICB3YXRjaGVyLm9uICdjaGFuZ2UnIChpbmZvKSAtPiBcbiAgICAgICAgICAgICAgICBpZiBwYXNzIGluZm8ucGF0aCB0aGVuIGNiIHNsYXNoLnBhdGggaW5mby5wYXRoXG5cbiAgICBzdGFydCAoc291cmNlRmlsZSkgLT5cblxuICAgICAgICBzb3VyY2VGaWxlID0gc2xhc2gucmVzb2x2ZSBzb3VyY2VGaWxlXG4gICAgICAgIG8gPSBjb25maWcub2JqIHNvdXJjZUZpbGUsIG9wdFxuXG4gICAgICAgIHRlc3QgPSAoc291cmNlKSAtPlxuICAgICAgICAgICAgaWYgc2hvdWxkICd0ZXN0JyBvLCBzb3VyY2VcbiAgICAgICAgICAgICAgICBydW5jbWQgJ3Rlc3QnIHNvdXJjZSwgY29uZmlnLnBhdGggJ3Rlc3QnIHNsYXNoLnJlc29sdmUoc291cmNlKSwgb3B0XG5cbiAgICAgICAgaWYgbm90IHNob3VsZCAnaWdub3JlJyBvLCBzb3VyY2VGaWxlXG4gICAgICAgICAgICBsb2cgJ2J1aWxkPycgc291cmNlRmlsZSwgb3B0LCB0ZXN0XG4gICAgICAgICAgICBidWlsZCBzb3VyY2VGaWxlLCBvcHQsIHRlc3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGVzdCBzb3VyY2VGaWxlXG5cbm1vZHVsZS5leHBvcnRzID0gV2F0Y2hcbiJdfQ==
//# sourceURL=../coffee/watch.coffee