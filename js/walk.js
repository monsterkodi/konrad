// koffee 0.43.0

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
        return kerror("walk", err);
    }
};

module.exports = walk;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Fsay5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUEsb0VBQUE7SUFBQTs7QUFRQSxNQUFnQyxPQUFBLENBQVEsS0FBUixDQUFoQyxFQUFFLHFCQUFGLEVBQVcsaUJBQVgsRUFBa0IsbUJBQWxCLEVBQTBCOztBQUUxQixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBRVQsSUFBQSxHQUFPLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxFQUFYO0FBRUgsUUFBQTtJQUFBLElBQUcsQ0FBQyxDQUFDLFVBQUYsQ0FBYSxHQUFiLENBQUg7UUFDSSxFQUFBLEdBQUs7UUFDTCxHQUFBLEdBQU0sR0FGVjs7QUFJQTtlQUNJLE9BQU8sQ0FBQyxJQUFSLENBQWEsTUFBQSxDQUFBLENBQWIsRUFBdUIsU0FBQyxFQUFEO0FBRW5CLGdCQUFBO1lBQUEsQ0FBQSxHQUFJLEtBQUssQ0FBQyxJQUFOLENBQVcsRUFBWDtZQUNKLENBQUEsR0FBSSxNQUFNLENBQUMsR0FBUCxDQUFXLENBQVgsRUFBYyxHQUFkO1lBRUosSUFBRyxNQUFBLENBQU8sUUFBUCxFQUFpQixDQUFqQixFQUFvQixDQUFwQixDQUFIO2dCQUNJLElBQVEsR0FBRyxDQUFDLEdBQVo7b0JBQUEsRUFBQSxDQUFHLENBQUgsRUFBQTs7Z0JBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxFQUFSO0FBQ0EsdUJBSEo7O1lBS0EsSUFBRyxNQUFBLENBQU8sUUFBUCxFQUFpQixHQUFqQixFQUFzQixDQUF0QixDQUFIO2dCQUNJLElBQVEsR0FBRyxDQUFDLEdBQVo7b0JBQUEsRUFBQSxDQUFHLENBQUgsRUFBQTs7Z0JBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxFQUFSO0FBQ0EsdUJBSEo7O1lBS0EsV0FBRyxLQUFLLENBQUMsR0FBTixDQUFVLENBQVYsQ0FBQSxFQUFBLGFBQWdCLENBQUMsQ0FBQyxJQUFGLENBQU8sQ0FBUCxDQUFoQixFQUFBLElBQUEsTUFBSDt1QkFDSSxFQUFBLENBQUcsQ0FBSCxFQUFNLE1BQUEsQ0FBTyxDQUFQLEVBQVUsR0FBVixDQUFOLEVBREo7YUFBQSxNQUFBO2dCQUdJLElBQUcsR0FBRyxDQUFDLEdBQVA7b0JBQ0ksSUFBRyxDQUFJLEVBQUEsQ0FBRyxDQUFILENBQVA7K0JBQ0ksSUFBQyxDQUFBLE1BQUQsQ0FBUSxFQUFSLEVBREo7cUJBREo7aUJBSEo7O1FBZm1CLENBQXZCLEVBREo7S0FBQSxhQUFBO1FBc0JNO2VBQ0YsTUFBQSxDQUFPLE1BQVAsRUFBZSxHQUFmLEVBdkJKOztBQU5HOztBQStCUCxNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMFxuMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgMDAwIFxuMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgICAgIDAwMDAwMDAgIFxuMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgMDAwIFxuMDAgICAgIDAwICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMCAgIDAwMFxuIyMjXG5cbnsgd2Fsa2Rpciwgc2xhc2gsIGtlcnJvciwgXyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5hcmdEaXIgPSByZXF1aXJlICcuL2FyZ2RpcidcbnNob3VsZCA9IHJlcXVpcmUgJy4vc2hvdWxkJ1xudGFyZ2V0ID0gcmVxdWlyZSAnLi90YXJnZXQnXG5jb25maWcgPSByZXF1aXJlICcuL2NvbmZpZydcblxud2FsayA9ICh3bGssIG9wdCwgY2IpIC0+XG4gICAgXG4gICAgaWYgXy5pc0Z1bmN0aW9uIG9wdFxuICAgICAgICBjYiA9IG9wdFxuICAgICAgICBvcHQgPSB7fVxuXG4gICAgdHJ5XG4gICAgICAgIHdhbGtkaXIuc3luYyBhcmdEaXIoKSwgKHdwKSAtPlxuXG4gICAgICAgICAgICBwID0gc2xhc2gucGF0aCB3cFxuICAgICAgICAgICAgbyA9IGNvbmZpZy5vYmogcCwgb3B0XG5cbiAgICAgICAgICAgIGlmIHNob3VsZCAnaWdub3JlJywgbywgcFxuICAgICAgICAgICAgICAgIGNiIHAgaWYgb3B0LmFsbFxuICAgICAgICAgICAgICAgIEBpZ25vcmUgd3BcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgaWYgc2hvdWxkICdpZ25vcmUnLCB3bGssIHBcbiAgICAgICAgICAgICAgICBjYiBwIGlmIG9wdC5hbGxcbiAgICAgICAgICAgICAgICBAaWdub3JlIHdwXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIGlmIHNsYXNoLmV4dChwKSBpbiBfLmtleXMgb1xuICAgICAgICAgICAgICAgIGNiIHAsIHRhcmdldCBwLCBvcHRcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBpZiBvcHQuYWxsXG4gICAgICAgICAgICAgICAgICAgIGlmIG5vdCBjYiBwXG4gICAgICAgICAgICAgICAgICAgICAgICBAaWdub3JlIHdwXG4gICAgY2F0Y2ggZXJyXG4gICAgICAgIGtlcnJvciBcIndhbGtcIiwgZXJyXG5cbm1vZHVsZS5leHBvcnRzID0gd2Fsa1xuIl19
//# sourceURL=../coffee/walk.coffee