// koffee 1.12.0

/*
000000000   0000000   00000000    0000000   00000000  000000000
   000     000   000  000   000  000        000          000   
   000     000000000  0000000    000  0000  0000000      000   
   000     000   000  000   000  000   000  000          000   
   000     000   000  000   000   0000000   00000000     000
 */
var _, argDir, args, colors, config, klog, pretty, ref, slash, target;

ref = require('kxk'), args = ref.args, slash = ref.slash, colors = ref.colors, klog = ref.klog, _ = ref._;

argDir = require('./argdir');

config = require('./config');

pretty = require('./pretty');

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0LmpzIiwic291cmNlUm9vdCI6Ii4uL2NvZmZlZSIsInNvdXJjZXMiOlsidGFyZ2V0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRQSxNQUFtQyxPQUFBLENBQVEsS0FBUixDQUFuQyxFQUFFLGVBQUYsRUFBUSxpQkFBUixFQUFlLG1CQUFmLEVBQXVCLGVBQXZCLEVBQTZCOztBQUU3QixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFFVCxNQUFBLEdBQVMsU0FBQyxVQUFELEVBQWEsR0FBYjtBQUVMLFFBQUE7SUFBQSxHQUFBLEdBQU0sS0FBSyxDQUFDLEdBQU4sQ0FBVSxVQUFWO0lBQ04sQ0FBQSxHQUFJLE1BQU0sQ0FBQyxHQUFQLENBQVcsVUFBWCxFQUF1QixHQUF2QjtJQUVKLElBQUcsd0RBQUg7UUFDSSxPQUFBLEdBQVU7QUFDVjtBQUFBLGFBQUEsc0NBQUE7O1lBQ0ksSUFBRyxJQUFJLE1BQUosQ0FBVyxDQUFYLENBQWEsQ0FBQyxJQUFkLENBQW1CLFVBQW5CLENBQUg7Z0JBQ0ksT0FBQSxHQUFVLEtBRGQ7O0FBREo7UUFHQSxJQUFHLENBQUksT0FBUDtZQUNJLElBQTBFLElBQUksQ0FBQyxLQUEvRTtnQkFBQSxJQUFBLENBQUssTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLE1BQUEsQ0FBQSxDQUEzQixDQUFoQixFQUFzRCxNQUFNLENBQUMsSUFBN0QsQ0FBTCxFQUFBOztBQUNBLG1CQUZKO1NBTEo7O0lBU0EsVUFBQSxHQUFhLENBQUMsQ0FBQyxLQUFGLENBQVEsVUFBUjtJQUViLElBQUcseURBQUg7QUFDSTtBQUFBLGFBQUEsU0FBQTs7WUFDSSxVQUFBLEdBQWEsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEI7QUFEakIsU0FESjs7SUFJQSxJQUFjLHFEQUFkO0FBQUEsZUFBQTs7V0FFQSxVQUFBLEdBQWEsS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFLLENBQUMsR0FBTixDQUFVLFVBQVYsQ0FBWCxFQUFrQyxLQUFLLENBQUMsSUFBTixDQUFXLFVBQVgsQ0FBQSxHQUF5QixHQUF6QixHQUErQixDQUFFLENBQUEsR0FBQSxDQUFJLENBQUMsR0FBeEU7QUF0QlI7O0FBd0JULE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4wMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAwMDAwMDBcbiAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgMDAwICAgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAgMDAwICAwMDAwICAwMDAwMDAwICAgICAgMDAwICAgXG4gICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAgIDAwMCAgIFxuIyMjXG5cbnsgYXJncywgc2xhc2gsIGNvbG9ycywga2xvZywgXyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5hcmdEaXIgPSByZXF1aXJlICcuL2FyZ2RpcidcbmNvbmZpZyA9IHJlcXVpcmUgJy4vY29uZmlnJ1xucHJldHR5ID0gcmVxdWlyZSAnLi9wcmV0dHknXG5cbnRhcmdldCA9IChzb3VyY2VGaWxlLCBvcHQpIC0+XG4gICAgXG4gICAgZXh0ID0gc2xhc2guZXh0IHNvdXJjZUZpbGVcbiAgICBvID0gY29uZmlnLm9iaiBzb3VyY2VGaWxlLCBvcHRcblxuICAgIGlmIG9bZXh0XT8uZmlsdGVyP1xuICAgICAgICBtYXRjaGVzID0gZmFsc2VcbiAgICAgICAgZm9yIHIgaW4gb1tleHRdLmZpbHRlclxuICAgICAgICAgICAgaWYgbmV3IFJlZ0V4cChyKS50ZXN0KHNvdXJjZUZpbGUpXG4gICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHRydWVcbiAgICAgICAgaWYgbm90IG1hdGNoZXNcbiAgICAgICAgICAgIGtsb2cgcHJldHR5LmZpbGVQYXRoIHNsYXNoLnJlbGF0aXZlKHNvdXJjZUZpbGUsIGFyZ0RpcigpKSwgY29sb3JzLmJsdWUgaWYgYXJncy5kZWJ1Z1xuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICB0YXJnZXRGaWxlID0gXy5jbG9uZSBzb3VyY2VGaWxlXG5cbiAgICBpZiBvW2V4dF0/LnJlcGxhY2U/XG4gICAgICAgIGZvciBrLHYgb2Ygb1tleHRdLnJlcGxhY2VcbiAgICAgICAgICAgIHRhcmdldEZpbGUgPSB0YXJnZXRGaWxlLnJlcGxhY2UgaywgdlxuXG4gICAgcmV0dXJuIGlmIG5vdCBvW2V4dF0/LmV4dD9cblxuICAgIHRhcmdldEZpbGUgPSBzbGFzaC5qb2luIHNsYXNoLmRpcih0YXJnZXRGaWxlKSwgc2xhc2guYmFzZSh0YXJnZXRGaWxlKSArICcuJyArIG9bZXh0XS5leHRcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gdGFyZ2V0XG4iXX0=
//# sourceURL=../coffee/target.coffee