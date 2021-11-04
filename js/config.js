// koffee 1.14.0

/*
 0000000   0000000   000   000  00000000  000   0000000 
000       000   000  0000  000  000       000  000      
000       000   000  000 0 000  000000    000  000  0000
000       000   000  000  0000  000       000  000   000
 0000000   0000000   000   000  000       000   0000000
 */
var _, noon, obj, path, ref, slash;

ref = require('kxk'), _ = ref._, noon = ref.noon, slash = ref.slash;

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
    var dotkonrad, ignore, o, ref1;
    if (opt == null) {
        opt = {};
    }
    while (slash.dir(p).length && ((ref1 = slash.dir(p)) !== '.' && ref1 !== '/') && !/^\w\:\/$/.test(slash.dir(p))) {
        p = slash.dir(p);
        if (slash.fileExists(slash.join(p, '.konrad.noon'))) {
            dotkonrad = noon.load(slash.join(p, '.konrad.noon'));
            ignore = [].concat(dotkonrad.ignore, opt.ignore);
            o = _.defaultsDeep(dotkonrad, opt);
            o.ignore = ignore.map(function(i) {
                if (_.isString(i)) {
                    return new RegExp(i);
                } else {
                    return i;
                }
            });
            return o;
        }
    }
    return opt;
};

module.exports = {
    path: path,
    obj: obj
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6Ii4uL2NvZmZlZSIsInNvdXJjZXMiOlsiY29uZmlnLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRQSxNQUFxQixPQUFBLENBQVEsS0FBUixDQUFyQixFQUFFLFNBQUYsRUFBSyxlQUFMLEVBQVc7O0FBRVgsSUFBQSxHQUFPLFNBQUMsR0FBRCxFQUFNLENBQU4sRUFBUyxHQUFUO0FBRUgsUUFBQTtBQUFBLFdBQU0sS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWLENBQVksQ0FBQyxNQUFiLElBQXdCLFNBQUEsS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWLEVBQUEsS0FBcUIsR0FBckIsSUFBQSxJQUFBLEtBQXlCLEdBQXpCLENBQTlCO1FBQ0ksQ0FBQSxHQUFJLEtBQUssQ0FBQyxHQUFOLENBQVUsQ0FBVjtRQUNKLElBQUcsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFYLEVBQWMsY0FBZCxDQUFqQixDQUFIO1lBQ0ksQ0FBQSxHQUFJLENBQUMsQ0FBQyxZQUFGLENBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsRUFBYyxjQUFkLENBQVYsQ0FBZixFQUF3RCxHQUF4RDtZQUNKLElBQUcsY0FBSDtBQUNJLHVCQUFPLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxFQURYO2FBRko7O0lBRko7V0FNQTtBQVJHOztBQVVQLEdBQUEsR0FBTSxTQUFDLENBQUQsRUFBSSxHQUFKO0FBRUYsUUFBQTs7UUFGTSxNQUFJOztBQUVWLFdBQU0sS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWLENBQVksQ0FBQyxNQUFiLElBQXdCLFNBQUEsS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWLEVBQUEsS0FBcUIsR0FBckIsSUFBQSxJQUFBLEtBQXlCLEdBQXpCLENBQXhCLElBQTBELENBQUksVUFBVSxDQUFDLElBQVgsQ0FBZ0IsS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFWLENBQWhCLENBQXBFO1FBQ0ksQ0FBQSxHQUFJLEtBQUssQ0FBQyxHQUFOLENBQVUsQ0FBVjtRQUNKLElBQUcsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFYLEVBQWMsY0FBZCxDQUFqQixDQUFIO1lBRUksU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFYLEVBQWMsY0FBZCxDQUFWO1lBQ1osTUFBQSxHQUFTLEVBQUUsQ0FBQyxNQUFILENBQVUsU0FBUyxDQUFDLE1BQXBCLEVBQTRCLEdBQUcsQ0FBQyxNQUFoQztZQUNULENBQUEsR0FBSSxDQUFDLENBQUMsWUFBRixDQUFlLFNBQWYsRUFBMEIsR0FBMUI7WUFDSixDQUFDLENBQUMsTUFBRixHQUFXLE1BQU0sQ0FBQyxHQUFQLENBQVcsU0FBQyxDQUFEO2dCQUNsQixJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsQ0FBWCxDQUFIOzJCQUNJLElBQUksTUFBSixDQUFXLENBQVgsRUFESjtpQkFBQSxNQUFBOzJCQUdJLEVBSEo7O1lBRGtCLENBQVg7QUFLWCxtQkFBTyxFQVZYOztJQUZKO1dBYUE7QUFmRTs7QUFpQk4sTUFBTSxDQUFDLE9BQVAsR0FDSTtJQUFBLElBQUEsRUFBSyxJQUFMO0lBQ0EsR0FBQSxFQUFJLEdBREoiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbiAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgICAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwICAwMDAwMDAgICAgMDAwICAwMDAgIDAwMDBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAwMDAwIFxuIyMjXG5cbnsgXywgbm9vbiwgc2xhc2ggfSA9IHJlcXVpcmUgJ2t4aydcblxucGF0aCA9IChrZXksIHAsIG9wdCkgLT5cbiAgICBcbiAgICB3aGlsZSBzbGFzaC5kaXIocCkubGVuZ3RoIGFuZCBzbGFzaC5kaXIocCkgbm90IGluIFsnLicgJy8nXVxuICAgICAgICBwID0gc2xhc2guZGlyIHBcbiAgICAgICAgaWYgc2xhc2guZmlsZUV4aXN0cyBzbGFzaC5qb2luIHAsICcua29ucmFkLm5vb24nXG4gICAgICAgICAgICBvID0gXy5kZWZhdWx0c0RlZXAgbm9vbi5sb2FkKHNsYXNoLmpvaW4gcCwgJy5rb25yYWQubm9vbicpLCBvcHRcbiAgICAgICAgICAgIGlmIG9ba2V5XT9cbiAgICAgICAgICAgICAgICByZXR1cm4gc2xhc2gucmVzb2x2ZSBwXG4gICAgbnVsbFxuXG5vYmogPSAocCwgb3B0PXt9KSAtPlxuICAgIFxuICAgIHdoaWxlIHNsYXNoLmRpcihwKS5sZW5ndGggYW5kIHNsYXNoLmRpcihwKSBub3QgaW4gWycuJyAnLyddIGFuZCBub3QgL15cXHdcXDpcXC8kLy50ZXN0IHNsYXNoLmRpcihwKVxuICAgICAgICBwID0gc2xhc2guZGlyIHBcbiAgICAgICAgaWYgc2xhc2guZmlsZUV4aXN0cyBzbGFzaC5qb2luIHAsICcua29ucmFkLm5vb24nXG5cbiAgICAgICAgICAgIGRvdGtvbnJhZCA9IG5vb24ubG9hZCBzbGFzaC5qb2luIHAsICcua29ucmFkLm5vb24nXG4gICAgICAgICAgICBpZ25vcmUgPSBbXS5jb25jYXQgZG90a29ucmFkLmlnbm9yZSwgb3B0Lmlnbm9yZVxuICAgICAgICAgICAgbyA9IF8uZGVmYXVsdHNEZWVwIGRvdGtvbnJhZCwgb3B0XG4gICAgICAgICAgICBvLmlnbm9yZSA9IGlnbm9yZS5tYXAgKGkpIC0+XG4gICAgICAgICAgICAgICAgaWYgXy5pc1N0cmluZyBpXG4gICAgICAgICAgICAgICAgICAgIG5ldyBSZWdFeHAgaVxuICAgICAgICAgICAgICAgIGVsc2UgXG4gICAgICAgICAgICAgICAgICAgIGlcbiAgICAgICAgICAgIHJldHVybiBvXG4gICAgb3B0XG4gICAgXG5tb2R1bGUuZXhwb3J0cyA9IFxuICAgIHBhdGg6cGF0aFxuICAgIG9iajpvYmpcbiJdfQ==
//# sourceURL=../coffee/config.coffee