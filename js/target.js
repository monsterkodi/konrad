// koffee 0.45.0

/*
000000000   0000000   00000000    0000000   00000000  000000000
   000     000   000  000   000  000        000          000   
   000     000000000  0000000    000  0000  0000000      000   
   000     000   000  000   000  000   000  000          000   
   000     000   000  000   000   0000000   00000000     000
 */
var _, argDir, args, colors, config, klog, ref, slash, target;

ref = require('kxk'), args = ref.args, slash = ref.slash, colors = ref.colors, klog = ref.klog, _ = ref._;

argDir = require('./argdir');

config = require('./config');

target = function(sourceFile, opt) {
    var ext, i, k, len, matches, o, r, ref1, ref2, ref3, ref4, ref5, targetFile, v;
    ext = slash.ext(sourceFile);
    o = config.obj(sourceFile, opt);
    if (((ref1 = o[ext]) != null ? ref1.filter : void 0) != null) {
        matches = false;
        ref2 = o[ext].filter;
        for (i = 0, len = ref2.length; i < len; i++) {
            r = ref2[i];
            if (new RegExp(r).test(sourceFile)) {
                matches = true;
            }
        }
        if (!matches) {
            if (args.debug) {
                klog(pretty.filePath(slash.relative(sourceFile, argDir()), colors.blue));
            }
            return;
        }
    }
    targetFile = _.clone(sourceFile);
    if (((ref3 = o[ext]) != null ? ref3.replace : void 0) != null) {
        ref4 = o[ext].replace;
        for (k in ref4) {
            v = ref4[k];
            targetFile = targetFile.replace(k, v);
        }
    }
    if (((ref5 = o[ext]) != null ? ref5.ext : void 0) == null) {
        return;
    }
    return targetFile = slash.join(slash.dir(targetFile), slash.base(targetFile) + '.' + o[ext].ext);
};

module.exports = target;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRQSxNQUFtQyxPQUFBLENBQVEsS0FBUixDQUFuQyxFQUFFLGVBQUYsRUFBUSxpQkFBUixFQUFlLG1CQUFmLEVBQXVCLGVBQXZCLEVBQTZCOztBQUU3QixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUVULE1BQUEsR0FBUyxTQUFDLFVBQUQsRUFBYSxHQUFiO0FBRUwsUUFBQTtJQUFBLEdBQUEsR0FBTSxLQUFLLENBQUMsR0FBTixDQUFVLFVBQVY7SUFDTixDQUFBLEdBQUksTUFBTSxDQUFDLEdBQVAsQ0FBVyxVQUFYLEVBQXVCLEdBQXZCO0lBRUosSUFBRyx3REFBSDtRQUNJLE9BQUEsR0FBVTtBQUNWO0FBQUEsYUFBQSxzQ0FBQTs7WUFDSSxJQUFHLElBQUksTUFBSixDQUFXLENBQVgsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsVUFBbkIsQ0FBSDtnQkFDSSxPQUFBLEdBQVUsS0FEZDs7QUFESjtRQUdBLElBQUcsQ0FBSSxPQUFQO1lBQ0ksSUFBMEUsSUFBSSxDQUFDLEtBQS9FO2dCQUFBLElBQUEsQ0FBSyxNQUFNLENBQUMsUUFBUCxDQUFnQixLQUFLLENBQUMsUUFBTixDQUFlLFVBQWYsRUFBMkIsTUFBQSxDQUFBLENBQTNCLENBQWhCLEVBQXNELE1BQU0sQ0FBQyxJQUE3RCxDQUFMLEVBQUE7O0FBQ0EsbUJBRko7U0FMSjs7SUFTQSxVQUFBLEdBQWEsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxVQUFSO0lBRWIsSUFBRyx5REFBSDtBQUNJO0FBQUEsYUFBQSxTQUFBOztZQUNJLFVBQUEsR0FBYSxVQUFVLENBQUMsT0FBWCxDQUFtQixDQUFuQixFQUFzQixDQUF0QjtBQURqQixTQURKOztJQUlBLElBQWMscURBQWQ7QUFBQSxlQUFBOztXQUVBLFVBQUEsR0FBYSxLQUFLLENBQUMsSUFBTixDQUFXLEtBQUssQ0FBQyxHQUFOLENBQVUsVUFBVixDQUFYLEVBQWtDLEtBQUssQ0FBQyxJQUFOLENBQVcsVUFBWCxDQUFBLEdBQXlCLEdBQXpCLEdBQStCLENBQUUsQ0FBQSxHQUFBLENBQUksQ0FBQyxHQUF4RTtBQXRCUjs7QUF3QlQsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbjAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAwMFxuICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAwMDAgICAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgICAwMDAgIDAwMDAgIDAwMDAwMDAgICAgICAwMDAgICBcbiAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAgMDAwICAgXG4jIyNcblxueyBhcmdzLCBzbGFzaCwgY29sb3JzLCBrbG9nLCBfIH0gPSByZXF1aXJlICdreGsnXG5cbmFyZ0RpciA9IHJlcXVpcmUgJy4vYXJnZGlyJ1xuY29uZmlnID0gcmVxdWlyZSAnLi9jb25maWcnXG5cbnRhcmdldCA9IChzb3VyY2VGaWxlLCBvcHQpIC0+XG4gICAgXG4gICAgZXh0ID0gc2xhc2guZXh0IHNvdXJjZUZpbGVcbiAgICBvID0gY29uZmlnLm9iaiBzb3VyY2VGaWxlLCBvcHRcblxuICAgIGlmIG9bZXh0XT8uZmlsdGVyP1xuICAgICAgICBtYXRjaGVzID0gZmFsc2VcbiAgICAgICAgZm9yIHIgaW4gb1tleHRdLmZpbHRlclxuICAgICAgICAgICAgaWYgbmV3IFJlZ0V4cChyKS50ZXN0KHNvdXJjZUZpbGUpXG4gICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHRydWVcbiAgICAgICAgaWYgbm90IG1hdGNoZXNcbiAgICAgICAgICAgIGtsb2cgcHJldHR5LmZpbGVQYXRoIHNsYXNoLnJlbGF0aXZlKHNvdXJjZUZpbGUsIGFyZ0RpcigpKSwgY29sb3JzLmJsdWUgaWYgYXJncy5kZWJ1Z1xuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICB0YXJnZXRGaWxlID0gXy5jbG9uZSBzb3VyY2VGaWxlXG5cbiAgICBpZiBvW2V4dF0/LnJlcGxhY2U/XG4gICAgICAgIGZvciBrLHYgb2Ygb1tleHRdLnJlcGxhY2VcbiAgICAgICAgICAgIHRhcmdldEZpbGUgPSB0YXJnZXRGaWxlLnJlcGxhY2UgaywgdlxuXG4gICAgcmV0dXJuIGlmIG5vdCBvW2V4dF0/LmV4dD9cblxuICAgIHRhcmdldEZpbGUgPSBzbGFzaC5qb2luIHNsYXNoLmRpcih0YXJnZXRGaWxlKSwgc2xhc2guYmFzZSh0YXJnZXRGaWxlKSArICcuJyArIG9bZXh0XS5leHRcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gdGFyZ2V0XG4iXX0=
//# sourceURL=../coffee/target.coffee