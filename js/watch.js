// koffee 0.45.0

/*
000   000   0000000   000000000   0000000  000   000
000 0 000  000   000     000     000       000   000
000000000  000000000     000     000       000000000
000   000  000   000     000     000       000   000
00     00  000   000     000      0000000  000   000
 */
var Watch, _, args, build, childp, colors, config, klog, pkg, pretty, ref, runcmd, should, slash, watch, watcher,
    indexOf = [].indexOf;

ref = require('kxk'), watch = ref.watch, args = ref.args, slash = ref.slash, childp = ref.childp, colors = ref.colors, klog = ref.klog, _ = ref._;

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
            if (ref1 = slash.ext(p), indexOf.call(_.keys(opt), ref1) >= 0) {
                return true;
            }
        };
        d = (ref1 = args["arguments"][0]) != null ? ref1 : '.';
        v = (pkg.version + " ●").dim.gray;
        klog(pretty.time(), ("👁   " + v + " " + (pretty.filePath(slash.resolve(d), colors.white))).gray);
        watcher = watch.watch(d, {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2guanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBLDRHQUFBO0lBQUE7O0FBUUEsTUFBa0QsT0FBQSxDQUFRLEtBQVIsQ0FBbEQsRUFBRSxpQkFBRixFQUFTLGVBQVQsRUFBZSxpQkFBZixFQUFzQixtQkFBdEIsRUFBOEIsbUJBQTlCLEVBQXNDLGVBQXRDLEVBQTRDOztBQUU1QyxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsS0FBQSxHQUFTLE9BQUEsQ0FBUSxTQUFSOztBQUNULEdBQUEsR0FBUyxPQUFBLENBQVEsaUJBQVI7O0FBRVQsT0FBQSxHQUFVOztBQUVWLEtBQUEsR0FBUSxTQUFDLEdBQUQsRUFBTSxHQUFOO0FBRUosUUFBQTtJQUFBLEtBQUEsR0FBUSxTQUFDLEVBQUQ7QUFFSixZQUFBO1FBQUEsSUFBQSxHQUFPLFNBQUMsQ0FBRDtBQUNILGdCQUFBO1lBQUEsV0FBRyxLQUFLLENBQUMsR0FBTixDQUFVLENBQVYsQ0FBQSxFQUFBLGFBQWdCLENBQUMsQ0FBQyxJQUFGLENBQU8sR0FBUCxDQUFoQixFQUFBLElBQUEsTUFBSDt1QkFDSSxLQURKOztRQURHO1FBSVAsQ0FBQSxrREFBd0I7UUFDeEIsQ0FBQSxHQUFJLENBQUcsR0FBRyxDQUFDLE9BQUwsR0FBYSxJQUFmLENBQWtCLENBQUMsR0FBRyxDQUFDO1FBQzNCLElBQUEsQ0FBSyxNQUFNLENBQUMsSUFBUCxDQUFBLENBQUwsRUFBb0IsQ0FBQSxPQUFBLEdBQVEsQ0FBUixHQUFVLEdBQVYsR0FBWSxDQUFDLE1BQU0sQ0FBQyxRQUFQLENBQWdCLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxDQUFoQixFQUFrQyxNQUFNLENBQUMsS0FBekMsQ0FBRCxDQUFaLENBQTZELENBQUMsSUFBbEY7UUFDQSxPQUFBLEdBQVUsS0FBSyxDQUFDLEtBQU4sQ0FBWSxDQUFaLEVBQWU7WUFBQSxTQUFBLEVBQVUsSUFBVjtZQUFnQixNQUFBLEVBQU8sR0FBRyxDQUFDLE1BQTNCO1NBQWY7ZUFDVixPQUFPLENBQUMsRUFBUixDQUFXLFFBQVgsRUFBcUIsU0FBQyxJQUFEO1lBQVUsSUFBRyxJQUFBLENBQUssSUFBSSxDQUFDLElBQVYsQ0FBSDt1QkFBdUIsRUFBQSxDQUFHLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBSSxDQUFDLElBQWhCLENBQUgsRUFBdkI7O1FBQVYsQ0FBckI7SUFWSTtXQVlSLEtBQUEsQ0FBTSxTQUFDLFVBQUQ7QUFFRixZQUFBO1FBQUEsVUFBQSxHQUFhLEtBQUssQ0FBQyxPQUFOLENBQWMsVUFBZDtRQUNiLENBQUEsR0FBSSxNQUFNLENBQUMsR0FBUCxDQUFXLFVBQVgsRUFBdUIsR0FBdkI7UUFFSixJQUFBLEdBQU8sU0FBQyxNQUFEO1lBQ0gsSUFBRyxNQUFBLENBQU8sTUFBUCxFQUFlLENBQWYsRUFBa0IsTUFBbEIsQ0FBSDt1QkFDSSxNQUFBLENBQU8sTUFBUCxFQUFlLE1BQWYsRUFBdUIsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFaLEVBQW9CLEtBQUssQ0FBQyxPQUFOLENBQWMsTUFBZCxDQUFwQixFQUEyQyxHQUEzQyxDQUF2QixFQURKOztRQURHO1FBSVAsSUFBRyxDQUFJLE1BQUEsQ0FBTyxRQUFQLEVBQWlCLENBQWpCLEVBQW9CLFVBQXBCLENBQVA7bUJBQ0ksS0FBQSxDQUFNLFVBQU4sRUFBa0IsR0FBbEIsRUFBdUIsSUFBdkIsRUFESjtTQUFBLE1BQUE7bUJBR0ksSUFBQSxDQUFLLFVBQUwsRUFISjs7SUFURSxDQUFOO0FBZEk7O0FBNEJSLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4wMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwXG4wMDAgMCAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4wMDAwMDAwMDAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwMDAwMDAwXG4wMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4wMCAgICAgMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgMDAwMDAwMCAgMDAwICAgMDAwXG4jIyNcblxueyB3YXRjaCwgYXJncywgc2xhc2gsIGNoaWxkcCwgY29sb3JzLCBrbG9nLCBfIH0gPSByZXF1aXJlICdreGsnXG5cbnByZXR0eSA9IHJlcXVpcmUgJy4vcHJldHR5J1xuc2hvdWxkID0gcmVxdWlyZSAnLi9zaG91bGQnXG5ydW5jbWQgPSByZXF1aXJlICcuL3J1bmNtZCdcbmNvbmZpZyA9IHJlcXVpcmUgJy4vY29uZmlnJ1xuYnVpbGQgID0gcmVxdWlyZSAnLi9idWlsZCdcbnBrZyAgICA9IHJlcXVpcmUgJy4uL3BhY2thZ2UuanNvbidcblxud2F0Y2hlciA9IG51bGxcblxuV2F0Y2ggPSAod2xrLCBvcHQpIC0+XG4gICAgXG4gICAgc3RhcnQgPSAoY2IpIC0+XG5cbiAgICAgICAgcGFzcyA9IChwKSAtPiBcbiAgICAgICAgICAgIGlmIHNsYXNoLmV4dChwKSBpbiBfLmtleXMob3B0KVxuICAgICAgICAgICAgICAgIHRydWVcblxuICAgICAgICBkID0gYXJncy5hcmd1bWVudHNbMF0gPyAnLidcbiAgICAgICAgdiA9IFwiI3twa2cudmVyc2lvbn0g4pePXCIuZGltLmdyYXlcbiAgICAgICAga2xvZyBwcmV0dHkudGltZSgpLCBcIvCfkYEgICAje3Z9ICN7cHJldHR5LmZpbGVQYXRoIHNsYXNoLnJlc29sdmUoZCksIGNvbG9ycy53aGl0ZX1cIi5ncmF5XG4gICAgICAgIHdhdGNoZXIgPSB3YXRjaC53YXRjaCBkLCByZWN1cnNpdmU6dHJ1ZSwgaWdub3JlOndsay5pZ25vcmVcbiAgICAgICAgd2F0Y2hlci5vbiAnY2hhbmdlJywgKGluZm8pIC0+IGlmIHBhc3MgaW5mby5wYXRoIHRoZW4gY2Igc2xhc2gucGF0aCBpbmZvLnBhdGhcblxuICAgIHN0YXJ0IChzb3VyY2VGaWxlKSAtPlxuXG4gICAgICAgIHNvdXJjZUZpbGUgPSBzbGFzaC5yZXNvbHZlIHNvdXJjZUZpbGVcbiAgICAgICAgbyA9IGNvbmZpZy5vYmogc291cmNlRmlsZSwgb3B0XG5cbiAgICAgICAgdGVzdCA9IChzb3VyY2UpIC0+XG4gICAgICAgICAgICBpZiBzaG91bGQgJ3Rlc3QnLCBvLCBzb3VyY2VcbiAgICAgICAgICAgICAgICBydW5jbWQgJ3Rlc3QnLCBzb3VyY2UsIGNvbmZpZy5wYXRoICd0ZXN0Jywgc2xhc2gucmVzb2x2ZShzb3VyY2UpLCBvcHRcblxuICAgICAgICBpZiBub3Qgc2hvdWxkICdpZ25vcmUnLCBvLCBzb3VyY2VGaWxlXG4gICAgICAgICAgICBidWlsZCBzb3VyY2VGaWxlLCBvcHQsIHRlc3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGVzdCBzb3VyY2VGaWxlXG5cbm1vZHVsZS5leHBvcnRzID0gV2F0Y2hcbiJdfQ==
//# sourceURL=../coffee/watch.coffee