// koffee 1.20.0

/*
000000000   0000000   00000000    0000000   00000000  000000000
   000     000   000  000   000  000        000          000   
   000     000000000  0000000    000  0000  0000000      000   
   000     000   000  000   000  000   000  000          000   
   000     000   000  000   000   0000000   00000000     000
 */
var _, argDir, args, config, klog, kolor, pretty, ref, slash, swapLastDir, target;

ref = require('kxk'), _ = ref._, args = ref.args, klog = ref.klog, kolor = ref.kolor, slash = ref.slash;

argDir = require('./argdir');

config = require('./config');

pretty = require('./pretty');

swapLastDir = function(path, from, to) {
    var lastIndex;
    lastIndex = path.lastIndexOf("/" + from + "/");
    if (lastIndex >= 0) {
        path = path.slice(0, +lastIndex + 1 || 9e9) + to + path.slice(lastIndex + ("/" + from).length);
    }
    return path;
};

target = function(sourceFile, opt) {
    var ext, i, k, len, matches, o, r, ref1, ref2, ref3, ref4, ref5, ref6, ref7, targetFile, v;
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
                klog(pretty.filePath(slash.relative(sourceFile, argDir()), kolor.blue));
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
    if (((ref5 = o[ext]) != null ? ref5.out : void 0) != null) {
        targetFile = swapLastDir(targetFile, ext, (ref6 = o[ext]) != null ? ref6.out : void 0);
        console.log('konrad out', sourceFile, targetFile);
    }
    if (((ref7 = o[ext]) != null ? ref7.ext : void 0) == null) {
        return;
    }
    return targetFile = slash.join(slash.dir(targetFile), slash.base(targetFile) + '.' + o[ext].ext);
};

module.exports = target;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0LmpzIiwic291cmNlUm9vdCI6Ii4uL2NvZmZlZSIsInNvdXJjZXMiOlsidGFyZ2V0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRQSxNQUFrQyxPQUFBLENBQVEsS0FBUixDQUFsQyxFQUFFLFNBQUYsRUFBSyxlQUFMLEVBQVcsZUFBWCxFQUFpQixpQkFBakIsRUFBd0I7O0FBRXhCLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUVULFdBQUEsR0FBYyxTQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsRUFBYjtBQUVWLFFBQUE7SUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLFdBQUwsQ0FBaUIsR0FBQSxHQUFJLElBQUosR0FBUyxHQUExQjtJQUNaLElBQUcsU0FBQSxJQUFhLENBQWhCO1FBQ0ksSUFBQSxHQUFPLElBQUssZ0NBQUwsR0FBb0IsRUFBcEIsR0FBeUIsSUFBSyx3Q0FEekM7O1dBRUE7QUFMVTs7QUFPZCxNQUFBLEdBQVMsU0FBQyxVQUFELEVBQWEsR0FBYjtBQUVMLFFBQUE7SUFBQSxHQUFBLEdBQU0sS0FBSyxDQUFDLEdBQU4sQ0FBVSxVQUFWO0lBQ04sQ0FBQSxHQUFJLE1BQU0sQ0FBQyxHQUFQLENBQVcsVUFBWCxFQUF1QixHQUF2QjtJQUVKLElBQUcsd0RBQUg7UUFDSSxPQUFBLEdBQVU7QUFDVjtBQUFBLGFBQUEsc0NBQUE7O1lBQ0ksSUFBRyxJQUFJLE1BQUosQ0FBVyxDQUFYLENBQWEsQ0FBQyxJQUFkLENBQW1CLFVBQW5CLENBQUg7Z0JBQ0ksT0FBQSxHQUFVLEtBRGQ7O0FBREo7UUFHQSxJQUFHLENBQUksT0FBUDtZQUNJLElBQXlFLElBQUksQ0FBQyxLQUE5RTtnQkFBQSxJQUFBLENBQUssTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLE1BQUEsQ0FBQSxDQUEzQixDQUFoQixFQUFzRCxLQUFLLENBQUMsSUFBNUQsQ0FBTCxFQUFBOztBQUNBLG1CQUZKO1NBTEo7O0lBU0EsVUFBQSxHQUFhLENBQUMsQ0FBQyxLQUFGLENBQVEsVUFBUjtJQUViLElBQUcseURBQUg7QUFDSTtBQUFBLGFBQUEsU0FBQTs7WUFDSSxVQUFBLEdBQWEsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEI7QUFEakIsU0FESjs7SUFJQSxJQUFHLHFEQUFIO1FBQ0ksVUFBQSxHQUFhLFdBQUEsQ0FBWSxVQUFaLEVBQXdCLEdBQXhCLGdDQUFtQyxDQUFFLFlBQXJDO1FBQXdDLE9BQUEsQ0FDckQsR0FEcUQsQ0FDakQsWUFEaUQsRUFDcEMsVUFEb0MsRUFDeEIsVUFEd0IsRUFEekQ7O0lBSUEsSUFBYyxxREFBZDtBQUFBLGVBQUE7O1dBRUEsVUFBQSxHQUFhLEtBQUssQ0FBQyxJQUFOLENBQVcsS0FBSyxDQUFDLEdBQU4sQ0FBVSxVQUFWLENBQVgsRUFBa0MsS0FBSyxDQUFDLElBQU4sQ0FBVyxVQUFYLENBQUEsR0FBeUIsR0FBekIsR0FBK0IsQ0FBRSxDQUFBLEdBQUEsQ0FBSSxDQUFDLEdBQXhFO0FBMUJSOztBQTRCVCxNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwMDAwMDAwXG4gICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgIDAwMCAgICAgMDAwMDAwMDAwICAwMDAwMDAwICAgIDAwMCAgMDAwMCAgMDAwMDAwMCAgICAgIDAwMCAgIFxuICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgXG4gICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgICAwMDAgICBcbiMjI1xuXG57IF8sIGFyZ3MsIGtsb2csIGtvbG9yLCBzbGFzaCB9ID0gcmVxdWlyZSAna3hrJ1xuXG5hcmdEaXIgPSByZXF1aXJlICcuL2FyZ2RpcidcbmNvbmZpZyA9IHJlcXVpcmUgJy4vY29uZmlnJ1xucHJldHR5ID0gcmVxdWlyZSAnLi9wcmV0dHknXG5cbnN3YXBMYXN0RGlyID0gKHBhdGgsIGZyb20sIHRvKSAtPlxuICAgIFxuICAgIGxhc3RJbmRleCA9IHBhdGgubGFzdEluZGV4T2YgXCIvI3tmcm9tfS9cIlxuICAgIGlmIGxhc3RJbmRleCA+PSAwXG4gICAgICAgIHBhdGggPSBwYXRoWy4ubGFzdEluZGV4XSArIHRvICsgcGF0aFtsYXN0SW5kZXgrKFwiLyN7ZnJvbX1cIikubGVuZ3RoLi5dXG4gICAgcGF0aFxuXG50YXJnZXQgPSAoc291cmNlRmlsZSwgb3B0KSAtPlxuICAgIFxuICAgIGV4dCA9IHNsYXNoLmV4dCBzb3VyY2VGaWxlXG4gICAgbyA9IGNvbmZpZy5vYmogc291cmNlRmlsZSwgb3B0XG5cbiAgICBpZiBvW2V4dF0/LmZpbHRlcj9cbiAgICAgICAgbWF0Y2hlcyA9IGZhbHNlXG4gICAgICAgIGZvciByIGluIG9bZXh0XS5maWx0ZXJcbiAgICAgICAgICAgIGlmIG5ldyBSZWdFeHAocikudGVzdChzb3VyY2VGaWxlKVxuICAgICAgICAgICAgICAgIG1hdGNoZXMgPSB0cnVlXG4gICAgICAgIGlmIG5vdCBtYXRjaGVzXG4gICAgICAgICAgICBrbG9nIHByZXR0eS5maWxlUGF0aCBzbGFzaC5yZWxhdGl2ZShzb3VyY2VGaWxlLCBhcmdEaXIoKSksIGtvbG9yLmJsdWUgaWYgYXJncy5kZWJ1Z1xuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICB0YXJnZXRGaWxlID0gXy5jbG9uZSBzb3VyY2VGaWxlXG5cbiAgICBpZiBvW2V4dF0/LnJlcGxhY2U/XG4gICAgICAgIGZvciBrLHYgb2Ygb1tleHRdLnJlcGxhY2VcbiAgICAgICAgICAgIHRhcmdldEZpbGUgPSB0YXJnZXRGaWxlLnJlcGxhY2UgaywgdlxuICAgICAgICAgICAgXG4gICAgaWYgb1tleHRdPy5vdXQ/XG4gICAgICAgIHRhcmdldEZpbGUgPSBzd2FwTGFzdERpciB0YXJnZXRGaWxlLCBleHQsIG9bZXh0XT8ub3V0XG4gICAgICAgIGxvZyAna29ucmFkIG91dCcgc291cmNlRmlsZSwgdGFyZ2V0RmlsZVxuXG4gICAgcmV0dXJuIGlmIG5vdCBvW2V4dF0/LmV4dD9cblxuICAgIHRhcmdldEZpbGUgPSBzbGFzaC5qb2luIHNsYXNoLmRpcih0YXJnZXRGaWxlKSwgc2xhc2guYmFzZSh0YXJnZXRGaWxlKSArICcuJyArIG9bZXh0XS5leHRcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gdGFyZ2V0XG4iXX0=
//# sourceURL=../coffee/target.coffee