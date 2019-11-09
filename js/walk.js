// koffee 1.4.0

/*
000   000   0000000   000      000   000
000 0 000  000   000  000      000  000 
000000000  000000000  000      0000000  
000   000  000   000  000      000  000 
00     00  000   000  0000000  000   000
 */
var _, argDir, config, kerror, ref, should, slash, target, walk, walkdir,
    indexOf = [].indexOf;

ref = require('kxk'), walkdir = ref.walkdir, slash = ref.slash, kerror = ref.kerror, _ = ref._;

argDir = require('./argdir');

should = require('./should');

target = require('./target');

config = require('./config');

walk = function(wlk, opt, cb) {
    var err;
    if (_.isFunction(opt)) {
        cb = opt;
        opt = {};
    }
    try {
        return walkdir.sync(argDir(), function(wp) {
            var o, p, ref1;
            p = slash.path(wp);
            o = config.obj(p, opt);
            if (should('ignore', o, p)) {
                if (opt.all) {
                    cb(p);
                }
                this.ignore(wp);
                return;
            }
            if (should('ignore', wlk, p)) {
                if (opt.all) {
                    cb(p);
                }
                this.ignore(wp);
                return;
            }
            if (ref1 = slash.ext(p), indexOf.call(_.keys(o), ref1) >= 0) {
                return cb(p, target(p, opt));
            } else {
                if (opt.all) {
                    if (!cb(p)) {
                        return this.ignore(wp);
                    }
                }
            }
        });
    } catch (error) {
        err = error;
        return kerror("walk", err.toString());
    }
};

module.exports = walk;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Fsay5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUEsb0VBQUE7SUFBQTs7QUFRQSxNQUFnQyxPQUFBLENBQVEsS0FBUixDQUFoQyxFQUFFLHFCQUFGLEVBQVcsaUJBQVgsRUFBa0IsbUJBQWxCLEVBQTBCOztBQUUxQixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBRVQsSUFBQSxHQUFPLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxFQUFYO0FBRUgsUUFBQTtJQUFBLElBQUcsQ0FBQyxDQUFDLFVBQUYsQ0FBYSxHQUFiLENBQUg7UUFDSSxFQUFBLEdBQUs7UUFDTCxHQUFBLEdBQU0sR0FGVjs7QUFJQTtlQUNJLE9BQU8sQ0FBQyxJQUFSLENBQWEsTUFBQSxDQUFBLENBQWIsRUFBdUIsU0FBQyxFQUFEO0FBRW5CLGdCQUFBO1lBQUEsQ0FBQSxHQUFJLEtBQUssQ0FBQyxJQUFOLENBQVcsRUFBWDtZQUNKLENBQUEsR0FBSSxNQUFNLENBQUMsR0FBUCxDQUFXLENBQVgsRUFBYyxHQUFkO1lBRUosSUFBRyxNQUFBLENBQU8sUUFBUCxFQUFnQixDQUFoQixFQUFtQixDQUFuQixDQUFIO2dCQUNJLElBQVEsR0FBRyxDQUFDLEdBQVo7b0JBQUEsRUFBQSxDQUFHLENBQUgsRUFBQTs7Z0JBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxFQUFSO0FBQ0EsdUJBSEo7O1lBS0EsSUFBRyxNQUFBLENBQU8sUUFBUCxFQUFnQixHQUFoQixFQUFxQixDQUFyQixDQUFIO2dCQUNJLElBQVEsR0FBRyxDQUFDLEdBQVo7b0JBQUEsRUFBQSxDQUFHLENBQUgsRUFBQTs7Z0JBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxFQUFSO0FBQ0EsdUJBSEo7O1lBS0EsV0FBRyxLQUFLLENBQUMsR0FBTixDQUFVLENBQVYsQ0FBQSxFQUFBLGFBQWdCLENBQUMsQ0FBQyxJQUFGLENBQU8sQ0FBUCxDQUFoQixFQUFBLElBQUEsTUFBSDt1QkFDSSxFQUFBLENBQUcsQ0FBSCxFQUFNLE1BQUEsQ0FBTyxDQUFQLEVBQVUsR0FBVixDQUFOLEVBREo7YUFBQSxNQUFBO2dCQUdJLElBQUcsR0FBRyxDQUFDLEdBQVA7b0JBQ0ksSUFBRyxDQUFJLEVBQUEsQ0FBRyxDQUFILENBQVA7K0JBQ0ksSUFBQyxDQUFBLE1BQUQsQ0FBUSxFQUFSLEVBREo7cUJBREo7aUJBSEo7O1FBZm1CLENBQXZCLEVBREo7S0FBQSxhQUFBO1FBc0JNO2VBQ0YsTUFBQSxDQUFPLE1BQVAsRUFBZSxHQUFHLENBQUMsUUFBSixDQUFBLENBQWYsRUF2Qko7O0FBTkc7O0FBK0JQLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4wMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwICAgMDAwXG4wMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAwMDAgXG4wMDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgICAgMDAwMDAwMCAgXG4wMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAwMDAgXG4wMCAgICAgMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwICAgMDAwXG4jIyNcblxueyB3YWxrZGlyLCBzbGFzaCwga2Vycm9yLCBfIH0gPSByZXF1aXJlICdreGsnXG5cbmFyZ0RpciA9IHJlcXVpcmUgJy4vYXJnZGlyJ1xuc2hvdWxkID0gcmVxdWlyZSAnLi9zaG91bGQnXG50YXJnZXQgPSByZXF1aXJlICcuL3RhcmdldCdcbmNvbmZpZyA9IHJlcXVpcmUgJy4vY29uZmlnJ1xuXG53YWxrID0gKHdsaywgb3B0LCBjYikgLT5cbiAgICBcbiAgICBpZiBfLmlzRnVuY3Rpb24gb3B0XG4gICAgICAgIGNiID0gb3B0XG4gICAgICAgIG9wdCA9IHt9XG5cbiAgICB0cnlcbiAgICAgICAgd2Fsa2Rpci5zeW5jIGFyZ0RpcigpLCAod3ApIC0+XG5cbiAgICAgICAgICAgIHAgPSBzbGFzaC5wYXRoIHdwXG4gICAgICAgICAgICBvID0gY29uZmlnLm9iaiBwLCBvcHRcblxuICAgICAgICAgICAgaWYgc2hvdWxkICdpZ25vcmUnIG8sIHBcbiAgICAgICAgICAgICAgICBjYiBwIGlmIG9wdC5hbGxcbiAgICAgICAgICAgICAgICBAaWdub3JlIHdwXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIGlmIHNob3VsZCAnaWdub3JlJyB3bGssIHBcbiAgICAgICAgICAgICAgICBjYiBwIGlmIG9wdC5hbGxcbiAgICAgICAgICAgICAgICBAaWdub3JlIHdwXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIGlmIHNsYXNoLmV4dChwKSBpbiBfLmtleXMgb1xuICAgICAgICAgICAgICAgIGNiIHAsIHRhcmdldCBwLCBvcHRcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBpZiBvcHQuYWxsXG4gICAgICAgICAgICAgICAgICAgIGlmIG5vdCBjYiBwXG4gICAgICAgICAgICAgICAgICAgICAgICBAaWdub3JlIHdwXG4gICAgY2F0Y2ggZXJyXG4gICAgICAgIGtlcnJvciBcIndhbGtcIiwgZXJyLnRvU3RyaW5nKClcblxubW9kdWxlLmV4cG9ydHMgPSB3YWxrXG4iXX0=
//# sourceURL=../coffee/walk.coffee