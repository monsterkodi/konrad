// koffee 1.12.0

/*
 0000000   0000000   000   000  00000000  000   0000000 
000       000   000  0000  000  000       000  000      
000       000   000  000 0 000  000000    000  000  0000
000       000   000  000  0000  000       000  000   000
 0000000   0000000   000   000  000       000   0000000
 */
var _, klog, noon, obj, path, ref, slash;

ref = require('kxk'), _ = ref._, klog = ref.klog, noon = ref.noon, slash = ref.slash;

path = function(key, p, opt) {
    var o, ref1;
    while (slash.dir(p).length && ((ref1 = slash.dir(p)) !== '.' && ref1 !== '/')) {
        p = slash.dir(p);
        if (slash.fileExists(slash.join(p, '.konrad.noon'))) {
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
    if (opt == null) {
        opt = {};
    }
    while (slash.dir(p).length && ((ref2 = slash.dir(p)) !== '.' && ref2 !== '/') && !/^\w\:\/$/.test(slash.dir(p))) {
        p = slash.dir(p);
        if (slash.fileExists(slash.join(p, '.konrad.noon'))) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6Ii4uL2NvZmZlZSIsInNvdXJjZXMiOlsiY29uZmlnLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRQSxNQUEyQixPQUFBLENBQVEsS0FBUixDQUEzQixFQUFFLFNBQUYsRUFBSyxlQUFMLEVBQVcsZUFBWCxFQUFpQjs7QUFFakIsSUFBQSxHQUFPLFNBQUMsR0FBRCxFQUFNLENBQU4sRUFBUyxHQUFUO0FBRUgsUUFBQTtBQUFBLFdBQU0sS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWLENBQVksQ0FBQyxNQUFiLElBQXdCLFNBQUEsS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWLEVBQUEsS0FBcUIsR0FBckIsSUFBQSxJQUFBLEtBQXlCLEdBQXpCLENBQTlCO1FBQ0ksQ0FBQSxHQUFJLEtBQUssQ0FBQyxHQUFOLENBQVUsQ0FBVjtRQUNKLElBQUcsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFYLEVBQWMsY0FBZCxDQUFqQixDQUFIO1lBQ0ksQ0FBQSxHQUFJLENBQUMsQ0FBQyxZQUFGLENBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsRUFBYyxjQUFkLENBQVYsQ0FBZixFQUF3RCxHQUF4RDtZQUNKLElBQUcsY0FBSDtBQUNJLHVCQUFPLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxFQURYO2FBRko7O0lBRko7V0FNQTtBQVJHOztBQVVQLEdBQUEsR0FBTSxTQUFDLENBQUQsRUFBSSxHQUFKO0FBRUYsUUFBQTs7UUFGTSxNQUFJOztBQUVWLFdBQU0sS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWLENBQVksQ0FBQyxNQUFiLElBQXdCLFNBQUEsS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWLEVBQUEsS0FBcUIsR0FBckIsSUFBQSxJQUFBLEtBQXlCLEdBQXpCLENBQXhCLElBQTBELENBQUksVUFBVSxDQUFDLElBQVgsQ0FBZ0IsS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWLENBQWhCLENBQXBFO1FBQ0ksQ0FBQSxHQUFJLEtBQUssQ0FBQyxHQUFOLENBQVUsQ0FBVjtRQUNKLElBQUcsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFYLEVBQWMsY0FBZCxDQUFqQixDQUFIO1lBQ0ksQ0FBQSxHQUFJLENBQUMsQ0FBQyxZQUFGLENBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsRUFBYyxjQUFkLENBQVYsQ0FBZixFQUF3RCxHQUF4RDtZQUNKLElBQUcsdURBQUg7Z0JBQ0ksQ0FBQyxDQUFDLE1BQUYsR0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQVQsQ0FBYSxTQUFDLENBQUQ7b0JBQ3BCLElBQUcsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxDQUFYLENBQUg7K0JBQ0ksSUFBSSxNQUFKLENBQVcsQ0FBWCxFQURKO3FCQUFBLE1BQUE7K0JBR0ksRUFISjs7Z0JBRG9CLENBQWIsRUFEZjs7QUFNQSxtQkFBTyxFQVJYOztJQUZKO1dBV0E7QUFiRTs7QUFlTixNQUFNLENBQUMsT0FBUCxHQUNJO0lBQUEsSUFBQSxFQUFLLElBQUw7SUFDQSxHQUFBLEVBQUksR0FESiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgMDAwICAgICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMDAwMCAgICAwMDAgIDAwMCAgMDAwMFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAgICAgMDAwICAwMDAgICAwMDBcbiAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMDAwMDAgXG4jIyNcblxueyBfLCBrbG9nLCBub29uLCBzbGFzaCB9ID0gcmVxdWlyZSAna3hrJ1xuXG5wYXRoID0gKGtleSwgcCwgb3B0KSAtPlxuICAgIFxuICAgIHdoaWxlIHNsYXNoLmRpcihwKS5sZW5ndGggYW5kIHNsYXNoLmRpcihwKSBub3QgaW4gWycuJyAnLyddXG4gICAgICAgIHAgPSBzbGFzaC5kaXIgcFxuICAgICAgICBpZiBzbGFzaC5maWxlRXhpc3RzIHNsYXNoLmpvaW4gcCwgJy5rb25yYWQubm9vbidcbiAgICAgICAgICAgIG8gPSBfLmRlZmF1bHRzRGVlcCBub29uLmxvYWQoc2xhc2guam9pbiBwLCAnLmtvbnJhZC5ub29uJyksIG9wdFxuICAgICAgICAgICAgaWYgb1trZXldP1xuICAgICAgICAgICAgICAgIHJldHVybiBzbGFzaC5yZXNvbHZlIHBcbiAgICBudWxsXG5cbm9iaiA9IChwLCBvcHQ9e30pIC0+XG4gICAgXG4gICAgd2hpbGUgc2xhc2guZGlyKHApLmxlbmd0aCBhbmQgc2xhc2guZGlyKHApIG5vdCBpbiBbJy4nICcvJ10gYW5kIG5vdCAvXlxcd1xcOlxcLyQvLnRlc3Qgc2xhc2guZGlyKHApXG4gICAgICAgIHAgPSBzbGFzaC5kaXIgcFxuICAgICAgICBpZiBzbGFzaC5maWxlRXhpc3RzIHNsYXNoLmpvaW4gcCwgJy5rb25yYWQubm9vbidcbiAgICAgICAgICAgIG8gPSBfLmRlZmF1bHRzRGVlcCBub29uLmxvYWQoc2xhc2guam9pbiBwLCAnLmtvbnJhZC5ub29uJyksIG9wdFxuICAgICAgICAgICAgaWYgby5pZ25vcmU/Lm1hcD9cbiAgICAgICAgICAgICAgICBvLmlnbm9yZSA9IG8uaWdub3JlLm1hcCAoaSkgLT5cbiAgICAgICAgICAgICAgICAgICAgaWYgXy5pc1N0cmluZyBpXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgUmVnRXhwIGlcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlcbiAgICAgICAgICAgIHJldHVybiBvXG4gICAgb3B0XG4gICAgXG5tb2R1bGUuZXhwb3J0cyA9IFxuICAgIHBhdGg6cGF0aFxuICAgIG9iajpvYmpcbiJdfQ==
//# sourceURL=../coffee/config.coffee