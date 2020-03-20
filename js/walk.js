// koffee 1.12.0

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Fsay5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb2ZmZWUiLCJzb3VyY2VzIjpbIndhbGsuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBLG9FQUFBO0lBQUE7O0FBUUEsTUFBZ0MsT0FBQSxDQUFRLEtBQVIsQ0FBaEMsRUFBRSxxQkFBRixFQUFXLGlCQUFYLEVBQWtCLG1CQUFsQixFQUEwQjs7QUFFMUIsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUVULElBQUEsR0FBTyxTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsRUFBWDtBQUVILFFBQUE7SUFBQSxJQUFHLENBQUMsQ0FBQyxVQUFGLENBQWEsR0FBYixDQUFIO1FBQ0ksRUFBQSxHQUFLO1FBQ0wsR0FBQSxHQUFNLEdBRlY7O0FBSUE7ZUFDSSxPQUFPLENBQUMsSUFBUixDQUFhLE1BQUEsQ0FBQSxDQUFiLEVBQXVCLFNBQUMsRUFBRDtBQUVuQixnQkFBQTtZQUFBLENBQUEsR0FBSSxLQUFLLENBQUMsSUFBTixDQUFXLEVBQVg7WUFDSixDQUFBLEdBQUksTUFBTSxDQUFDLEdBQVAsQ0FBVyxDQUFYLEVBQWMsR0FBZDtZQUVKLElBQUcsTUFBQSxDQUFPLFFBQVAsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBSDtnQkFDSSxJQUFRLEdBQUcsQ0FBQyxHQUFaO29CQUFBLEVBQUEsQ0FBRyxDQUFILEVBQUE7O2dCQUNBLElBQUMsQ0FBQSxNQUFELENBQVEsRUFBUjtBQUNBLHVCQUhKOztZQUtBLElBQUcsTUFBQSxDQUFPLFFBQVAsRUFBZ0IsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBSDtnQkFDSSxJQUFRLEdBQUcsQ0FBQyxHQUFaO29CQUFBLEVBQUEsQ0FBRyxDQUFILEVBQUE7O2dCQUNBLElBQUMsQ0FBQSxNQUFELENBQVEsRUFBUjtBQUNBLHVCQUhKOztZQUtBLFdBQUcsS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWLENBQUEsRUFBQSxhQUFnQixDQUFDLENBQUMsSUFBRixDQUFPLENBQVAsQ0FBaEIsRUFBQSxJQUFBLE1BQUg7dUJBQ0ksRUFBQSxDQUFHLENBQUgsRUFBTSxNQUFBLENBQU8sQ0FBUCxFQUFVLEdBQVYsQ0FBTixFQURKO2FBQUEsTUFBQTtnQkFHSSxJQUFHLEdBQUcsQ0FBQyxHQUFQO29CQUNJLElBQUcsQ0FBSSxFQUFBLENBQUcsQ0FBSCxDQUFQOytCQUNJLElBQUMsQ0FBQSxNQUFELENBQVEsRUFBUixFQURKO3FCQURKO2lCQUhKOztRQWZtQixDQUF2QixFQURKO0tBQUEsYUFBQTtRQXNCTTtlQUNGLE1BQUEsQ0FBTyxNQUFQLEVBQWUsR0FBRyxDQUFDLFFBQUosQ0FBQSxDQUFmLEVBdkJKOztBQU5HOztBQStCUCxNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMFxuMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgMDAwIFxuMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgICAgIDAwMDAwMDAgIFxuMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgMDAwIFxuMDAgICAgIDAwICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMCAgIDAwMFxuIyMjXG5cbnsgd2Fsa2Rpciwgc2xhc2gsIGtlcnJvciwgXyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5hcmdEaXIgPSByZXF1aXJlICcuL2FyZ2RpcidcbnNob3VsZCA9IHJlcXVpcmUgJy4vc2hvdWxkJ1xudGFyZ2V0ID0gcmVxdWlyZSAnLi90YXJnZXQnXG5jb25maWcgPSByZXF1aXJlICcuL2NvbmZpZydcblxud2FsayA9ICh3bGssIG9wdCwgY2IpIC0+XG4gICAgXG4gICAgaWYgXy5pc0Z1bmN0aW9uIG9wdFxuICAgICAgICBjYiA9IG9wdFxuICAgICAgICBvcHQgPSB7fVxuXG4gICAgdHJ5XG4gICAgICAgIHdhbGtkaXIuc3luYyBhcmdEaXIoKSwgKHdwKSAtPlxuXG4gICAgICAgICAgICBwID0gc2xhc2gucGF0aCB3cFxuICAgICAgICAgICAgbyA9IGNvbmZpZy5vYmogcCwgb3B0XG5cbiAgICAgICAgICAgIGlmIHNob3VsZCAnaWdub3JlJyBvLCBwXG4gICAgICAgICAgICAgICAgY2IgcCBpZiBvcHQuYWxsXG4gICAgICAgICAgICAgICAgQGlnbm9yZSB3cFxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBpZiBzaG91bGQgJ2lnbm9yZScgd2xrLCBwXG4gICAgICAgICAgICAgICAgY2IgcCBpZiBvcHQuYWxsXG4gICAgICAgICAgICAgICAgQGlnbm9yZSB3cFxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBpZiBzbGFzaC5leHQocCkgaW4gXy5rZXlzIG9cbiAgICAgICAgICAgICAgICBjYiBwLCB0YXJnZXQgcCwgb3B0XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaWYgb3B0LmFsbFxuICAgICAgICAgICAgICAgICAgICBpZiBub3QgY2IgcFxuICAgICAgICAgICAgICAgICAgICAgICAgQGlnbm9yZSB3cFxuICAgIGNhdGNoIGVyclxuICAgICAgICBrZXJyb3IgXCJ3YWxrXCIsIGVyci50b1N0cmluZygpXG5cbm1vZHVsZS5leHBvcnRzID0gd2Fsa1xuIl19
//# sourceURL=../coffee/walk.coffee