// koffee 1.3.0

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
            klog('info', info.path, info.change);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2guanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBLDRHQUFBO0lBQUE7O0FBUUEsTUFBa0QsT0FBQSxDQUFRLEtBQVIsQ0FBbEQsRUFBRSxpQkFBRixFQUFTLGVBQVQsRUFBZSxpQkFBZixFQUFzQixtQkFBdEIsRUFBOEIsbUJBQTlCLEVBQXNDLGVBQXRDLEVBQTRDOztBQUU1QyxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsS0FBQSxHQUFTLE9BQUEsQ0FBUSxTQUFSOztBQUNULEdBQUEsR0FBUyxPQUFBLENBQVEsaUJBQVI7O0FBRVQsT0FBQSxHQUFVOztBQUVWLEtBQUEsR0FBUSxTQUFDLEdBQUQsRUFBTSxHQUFOO0FBSUosUUFBQTtJQUFBLEtBQUEsR0FBUSxTQUFDLEVBQUQ7QUFFSixZQUFBO1FBQUEsSUFBQSxHQUFPLFNBQUMsQ0FBRDtBQUNILGdCQUFBO1lBQUEsV0FBRyxLQUFLLENBQUMsR0FBTixDQUFVLENBQVYsQ0FBQSxFQUFBLGFBQWdCLENBQUMsQ0FBQyxJQUFGLENBQU8sR0FBUCxDQUFoQixFQUFBLElBQUEsTUFBSDt1QkFDSSxLQURKOztRQURHO1FBSVAsQ0FBQSxrREFBd0I7UUFDeEIsQ0FBQSxHQUFJLENBQUcsR0FBRyxDQUFDLE9BQUwsR0FBYSxJQUFmLENBQWtCLENBQUMsR0FBRyxDQUFDO1FBQzNCLElBQUEsQ0FBSyxNQUFNLENBQUMsSUFBUCxDQUFBLENBQUwsRUFBb0IsQ0FBQSxPQUFBLEdBQVEsQ0FBUixHQUFVLEdBQVYsR0FBWSxDQUFDLE1BQU0sQ0FBQyxRQUFQLENBQWdCLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxDQUFoQixFQUFrQyxNQUFNLENBQUMsS0FBekMsQ0FBRCxDQUFaLENBQTZELENBQUMsSUFBbEY7UUFDQSxPQUFBLEdBQVUsS0FBSyxDQUFDLEtBQU4sQ0FBWSxDQUFaLEVBQWU7WUFBQSxTQUFBLEVBQVUsSUFBVjtZQUFnQixNQUFBLEVBQU8sR0FBRyxDQUFDLE1BQTNCO1NBQWY7ZUFDVixPQUFPLENBQUMsRUFBUixDQUFXLFFBQVgsRUFBb0IsU0FBQyxJQUFEO1lBQ2hCLElBQUEsQ0FBSyxNQUFMLEVBQVksSUFBSSxDQUFDLElBQWpCLEVBQXVCLElBQUksQ0FBQyxNQUE1QjtZQUNBLElBQUcsSUFBQSxDQUFLLElBQUksQ0FBQyxJQUFWLENBQUg7dUJBQXVCLEVBQUEsQ0FBRyxLQUFLLENBQUMsSUFBTixDQUFXLElBQUksQ0FBQyxJQUFoQixDQUFILEVBQXZCOztRQUZnQixDQUFwQjtJQVZJO1dBY1IsS0FBQSxDQUFNLFNBQUMsVUFBRDtBQUVGLFlBQUE7UUFBQSxVQUFBLEdBQWEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxVQUFkO1FBQ2IsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxHQUFQLENBQVcsVUFBWCxFQUF1QixHQUF2QjtRQUVKLElBQUEsR0FBTyxTQUFDLE1BQUQ7WUFDSCxJQUFHLE1BQUEsQ0FBTyxNQUFQLEVBQWMsQ0FBZCxFQUFpQixNQUFqQixDQUFIO3VCQUNJLE1BQUEsQ0FBTyxNQUFQLEVBQWMsTUFBZCxFQUFzQixNQUFNLENBQUMsSUFBUCxDQUFZLE1BQVosRUFBbUIsS0FBSyxDQUFDLE9BQU4sQ0FBYyxNQUFkLENBQW5CLEVBQTBDLEdBQTFDLENBQXRCLEVBREo7O1FBREc7UUFJUCxJQUFHLENBQUksTUFBQSxDQUFPLFFBQVAsRUFBZ0IsQ0FBaEIsRUFBbUIsVUFBbkIsQ0FBUDttQkFDSSxLQUFBLENBQU0sVUFBTixFQUFrQixHQUFsQixFQUF1QixJQUF2QixFQURKO1NBQUEsTUFBQTttQkFHSSxJQUFBLENBQUssVUFBTCxFQUhKOztJQVRFLENBQU47QUFsQkk7O0FBZ0NSLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4wMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwXG4wMDAgMCAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4wMDAwMDAwMDAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwMDAwMDAwXG4wMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4wMCAgICAgMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgMDAwMDAwMCAgMDAwICAgMDAwXG4jIyNcblxueyB3YXRjaCwgYXJncywgc2xhc2gsIGNoaWxkcCwgY29sb3JzLCBrbG9nLCBfIH0gPSByZXF1aXJlICdreGsnXG5cbnByZXR0eSA9IHJlcXVpcmUgJy4vcHJldHR5J1xuc2hvdWxkID0gcmVxdWlyZSAnLi9zaG91bGQnXG5ydW5jbWQgPSByZXF1aXJlICcuL3J1bmNtZCdcbmNvbmZpZyA9IHJlcXVpcmUgJy4vY29uZmlnJ1xuYnVpbGQgID0gcmVxdWlyZSAnLi9idWlsZCdcbnBrZyAgICA9IHJlcXVpcmUgJy4uL3BhY2thZ2UuanNvbidcblxud2F0Y2hlciA9IG51bGxcblxuV2F0Y2ggPSAod2xrLCBvcHQpIC0+XG4gICAgXG4gICAgIyBrbG9nICd3YXRjaCcgd2xrLCBvcHRcbiAgICBcbiAgICBzdGFydCA9IChjYikgLT5cblxuICAgICAgICBwYXNzID0gKHApIC0+IFxuICAgICAgICAgICAgaWYgc2xhc2guZXh0KHApIGluIF8ua2V5cyhvcHQpXG4gICAgICAgICAgICAgICAgdHJ1ZVxuXG4gICAgICAgIGQgPSBhcmdzLmFyZ3VtZW50c1swXSA/ICcuJ1xuICAgICAgICB2ID0gXCIje3BrZy52ZXJzaW9ufSDil49cIi5kaW0uZ3JheVxuICAgICAgICBrbG9nIHByZXR0eS50aW1lKCksIFwi8J+RgSAgICN7dn0gI3twcmV0dHkuZmlsZVBhdGggc2xhc2gucmVzb2x2ZShkKSwgY29sb3JzLndoaXRlfVwiLmdyYXlcbiAgICAgICAgd2F0Y2hlciA9IHdhdGNoLndhdGNoIGQsIHJlY3Vyc2l2ZTp0cnVlLCBpZ25vcmU6d2xrLmlnbm9yZVxuICAgICAgICB3YXRjaGVyLm9uICdjaGFuZ2UnIChpbmZvKSAtPiBcbiAgICAgICAgICAgIGtsb2cgJ2luZm8nIGluZm8ucGF0aCwgaW5mby5jaGFuZ2VcbiAgICAgICAgICAgIGlmIHBhc3MgaW5mby5wYXRoIHRoZW4gY2Igc2xhc2gucGF0aCBpbmZvLnBhdGhcblxuICAgIHN0YXJ0IChzb3VyY2VGaWxlKSAtPlxuXG4gICAgICAgIHNvdXJjZUZpbGUgPSBzbGFzaC5yZXNvbHZlIHNvdXJjZUZpbGVcbiAgICAgICAgbyA9IGNvbmZpZy5vYmogc291cmNlRmlsZSwgb3B0XG5cbiAgICAgICAgdGVzdCA9IChzb3VyY2UpIC0+XG4gICAgICAgICAgICBpZiBzaG91bGQgJ3Rlc3QnIG8sIHNvdXJjZVxuICAgICAgICAgICAgICAgIHJ1bmNtZCAndGVzdCcgc291cmNlLCBjb25maWcucGF0aCAndGVzdCcgc2xhc2gucmVzb2x2ZShzb3VyY2UpLCBvcHRcblxuICAgICAgICBpZiBub3Qgc2hvdWxkICdpZ25vcmUnIG8sIHNvdXJjZUZpbGVcbiAgICAgICAgICAgIGJ1aWxkIHNvdXJjZUZpbGUsIG9wdCwgdGVzdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0ZXN0IHNvdXJjZUZpbGVcblxubW9kdWxlLmV4cG9ydHMgPSBXYXRjaFxuIl19
//# sourceURL=../coffee/watch.coffee