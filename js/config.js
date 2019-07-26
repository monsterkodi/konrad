// koffee 1.3.0

/*
 0000000   0000000   000   000  00000000  000   0000000 
000       000   000  0000  000  000       000  000      
000       000   000  000 0 000  000000    000  000  0000
000       000   000  000  0000  000       000  000   000
 0000000   0000000   000   000  000       000   0000000
 */
var _, fs, noon, obj, path, ref, slash;

ref = require('kxk'), slash = ref.slash, fs = ref.fs, noon = ref.noon, _ = ref._;

path = function(key, p, opt) {
    var o, ref1;
    while (slash.dir(p).length && ((ref1 = slash.dir(p)) !== '.' && ref1 !== '/')) {
        p = slash.dir(p);
        if (fs.existsSync(slash.join(p, '.konrad.noon'))) {
            o = _.defaultsDeep(noon.load(slash.join(p, '.konrad.noon')), opt);
            if (o[key] != null) {
                return slash.resolve(p);
            }
        }
    }
    return null;
};

obj = function(p, opt) {
    var o, ref1, ref2;
    while (slash.dir(p).length && ((ref2 = slash.dir(p)) !== '.' && ref2 !== '/') && !/^\w\:\/$/.test(slash.dir(p))) {
        p = slash.dir(p);
        if (fs.existsSync(slash.join(p, '.konrad.noon'))) {
            o = _.defaultsDeep(noon.load(slash.join(p, '.konrad.noon')), opt);
            if (((ref1 = o.ignore) != null ? ref1.map : void 0) != null) {
                o.ignore = o.ignore.map(function(i) {
                    if (_.isString(i)) {
                        return new RegExp(i);
                    } else {
                        return i;
                    }
                });
            }
            return o;
        }
    }
    return opt;
};

module.exports = {
    path: path,
    obj: obj
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRQSxNQUF5QixPQUFBLENBQVEsS0FBUixDQUF6QixFQUFFLGlCQUFGLEVBQVMsV0FBVCxFQUFhLGVBQWIsRUFBbUI7O0FBRW5CLElBQUEsR0FBTyxTQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsR0FBVDtBQUVILFFBQUE7QUFBQSxXQUFNLEtBQUssQ0FBQyxHQUFOLENBQVUsQ0FBVixDQUFZLENBQUMsTUFBYixJQUF3QixTQUFBLEtBQUssQ0FBQyxHQUFOLENBQVUsQ0FBVixFQUFBLEtBQXFCLEdBQXJCLElBQUEsSUFBQSxLQUEwQixHQUExQixDQUE5QjtRQUNJLENBQUEsR0FBSSxLQUFLLENBQUMsR0FBTixDQUFVLENBQVY7UUFDSixJQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFYLEVBQWMsY0FBZCxDQUFkLENBQUg7WUFDSSxDQUFBLEdBQUksQ0FBQyxDQUFDLFlBQUYsQ0FBZSxJQUFJLENBQUMsSUFBTCxDQUFVLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBWCxFQUFjLGNBQWQsQ0FBVixDQUFmLEVBQXdELEdBQXhEO1lBQ0osSUFBRyxjQUFIO0FBQ0ksdUJBQU8sS0FBSyxDQUFDLE9BQU4sQ0FBYyxDQUFkLEVBRFg7YUFGSjs7SUFGSjtXQU1BO0FBUkc7O0FBVVAsR0FBQSxHQUFNLFNBQUMsQ0FBRCxFQUFJLEdBQUo7QUFFRixRQUFBO0FBQUEsV0FBTSxLQUFLLENBQUMsR0FBTixDQUFVLENBQVYsQ0FBWSxDQUFDLE1BQWIsSUFBd0IsU0FBQSxLQUFLLENBQUMsR0FBTixDQUFVLENBQVYsRUFBQSxLQUFxQixHQUFyQixJQUFBLElBQUEsS0FBMEIsR0FBMUIsQ0FBeEIsSUFBMkQsQ0FBSSxVQUFVLENBQUMsSUFBWCxDQUFnQixLQUFLLENBQUMsR0FBTixDQUFVLENBQVYsQ0FBaEIsQ0FBckU7UUFDSSxDQUFBLEdBQUksS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWO1FBQ0osSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBWCxFQUFjLGNBQWQsQ0FBZCxDQUFIO1lBQ0ksQ0FBQSxHQUFJLENBQUMsQ0FBQyxZQUFGLENBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsRUFBYyxjQUFkLENBQVYsQ0FBZixFQUF3RCxHQUF4RDtZQUNKLElBQUcsdURBQUg7Z0JBQ0ksQ0FBQyxDQUFDLE1BQUYsR0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQVQsQ0FBYSxTQUFDLENBQUQ7b0JBQ3BCLElBQUcsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxDQUFYLENBQUg7K0JBQ0ksSUFBSSxNQUFKLENBQVcsQ0FBWCxFQURKO3FCQUFBLE1BQUE7K0JBR0ksRUFISjs7Z0JBRG9CLENBQWIsRUFEZjs7QUFNQSxtQkFBTyxFQVJYOztJQUZKO1dBV0E7QUFiRTs7QUFlTixNQUFNLENBQUMsT0FBUCxHQUNJO0lBQUEsSUFBQSxFQUFLLElBQUw7SUFDQSxHQUFBLEVBQUksR0FESiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgMDAwICAgICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMDAwMCAgICAwMDAgIDAwMCAgMDAwMFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAgICAgMDAwICAwMDAgICAwMDBcbiAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMDAwMDAgXG4jIyNcblxueyBzbGFzaCwgZnMsIG5vb24sIF8gfSA9IHJlcXVpcmUgJ2t4aydcblxucGF0aCA9IChrZXksIHAsIG9wdCkgLT5cbiAgICBcbiAgICB3aGlsZSBzbGFzaC5kaXIocCkubGVuZ3RoIGFuZCBzbGFzaC5kaXIocCkgbm90IGluIFsnLicsICcvJ11cbiAgICAgICAgcCA9IHNsYXNoLmRpciBwXG4gICAgICAgIGlmIGZzLmV4aXN0c1N5bmMgc2xhc2guam9pbiBwLCAnLmtvbnJhZC5ub29uJ1xuICAgICAgICAgICAgbyA9IF8uZGVmYXVsdHNEZWVwIG5vb24ubG9hZChzbGFzaC5qb2luIHAsICcua29ucmFkLm5vb24nKSwgb3B0XG4gICAgICAgICAgICBpZiBvW2tleV0/XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNsYXNoLnJlc29sdmUgcFxuICAgIG51bGxcblxub2JqID0gKHAsIG9wdCkgLT5cbiAgICBcbiAgICB3aGlsZSBzbGFzaC5kaXIocCkubGVuZ3RoIGFuZCBzbGFzaC5kaXIocCkgbm90IGluIFsnLicsICcvJ10gYW5kIG5vdCAvXlxcd1xcOlxcLyQvLnRlc3Qgc2xhc2guZGlyKHApXG4gICAgICAgIHAgPSBzbGFzaC5kaXIgcFxuICAgICAgICBpZiBmcy5leGlzdHNTeW5jIHNsYXNoLmpvaW4gcCwgJy5rb25yYWQubm9vbidcbiAgICAgICAgICAgIG8gPSBfLmRlZmF1bHRzRGVlcCBub29uLmxvYWQoc2xhc2guam9pbiBwLCAnLmtvbnJhZC5ub29uJyksIG9wdFxuICAgICAgICAgICAgaWYgby5pZ25vcmU/Lm1hcD9cbiAgICAgICAgICAgICAgICBvLmlnbm9yZSA9IG8uaWdub3JlLm1hcCAoaSkgLT5cbiAgICAgICAgICAgICAgICAgICAgaWYgXy5pc1N0cmluZyBpXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgUmVnRXhwIGlcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgaVxuICAgICAgICAgICAgcmV0dXJuIG9cbiAgICBvcHRcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gXG4gICAgcGF0aDpwYXRoXG4gICAgb2JqOm9ialxuIl19
//# sourceURL=../coffee/config.coffee