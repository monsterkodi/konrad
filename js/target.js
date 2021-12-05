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
    }
    if (((ref7 = o[ext]) != null ? ref7.ext : void 0) == null) {
        return;
    }
    return targetFile = slash.join(slash.dir(targetFile), slash.base(targetFile) + '.' + o[ext].ext);
};

module.exports = target;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0LmpzIiwic291cmNlUm9vdCI6Ii4uL2NvZmZlZSIsInNvdXJjZXMiOlsidGFyZ2V0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRQSxNQUFrQyxPQUFBLENBQVEsS0FBUixDQUFsQyxFQUFFLFNBQUYsRUFBSyxlQUFMLEVBQVcsZUFBWCxFQUFpQixpQkFBakIsRUFBd0I7O0FBRXhCLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUVULFdBQUEsR0FBYyxTQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsRUFBYjtBQUVWLFFBQUE7SUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLFdBQUwsQ0FBaUIsR0FBQSxHQUFJLElBQUosR0FBUyxHQUExQjtJQUNaLElBQUcsU0FBQSxJQUFhLENBQWhCO1FBQ0ksSUFBQSxHQUFPLElBQUssZ0NBQUwsR0FBb0IsRUFBcEIsR0FBeUIsSUFBSyx3Q0FEekM7O1dBRUE7QUFMVTs7QUFPZCxNQUFBLEdBQVMsU0FBQyxVQUFELEVBQWEsR0FBYjtBQUVMLFFBQUE7SUFBQSxHQUFBLEdBQU0sS0FBSyxDQUFDLEdBQU4sQ0FBVSxVQUFWO0lBQ04sQ0FBQSxHQUFJLE1BQU0sQ0FBQyxHQUFQLENBQVcsVUFBWCxFQUF1QixHQUF2QjtJQUVKLElBQUcsd0RBQUg7UUFDSSxPQUFBLEdBQVU7QUFDVjtBQUFBLGFBQUEsc0NBQUE7O1lBQ0ksSUFBRyxJQUFJLE1BQUosQ0FBVyxDQUFYLENBQWEsQ0FBQyxJQUFkLENBQW1CLFVBQW5CLENBQUg7Z0JBQ0ksT0FBQSxHQUFVLEtBRGQ7O0FBREo7UUFHQSxJQUFHLENBQUksT0FBUDtZQUNJLElBQXlFLElBQUksQ0FBQyxLQUE5RTtnQkFBQSxJQUFBLENBQUssTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmLEVBQTJCLE1BQUEsQ0FBQSxDQUEzQixDQUFoQixFQUFzRCxLQUFLLENBQUMsSUFBNUQsQ0FBTCxFQUFBOztBQUNBLG1CQUZKO1NBTEo7O0lBU0EsVUFBQSxHQUFhLENBQUMsQ0FBQyxLQUFGLENBQVEsVUFBUjtJQUViLElBQUcseURBQUg7QUFDSTtBQUFBLGFBQUEsU0FBQTs7WUFDSSxVQUFBLEdBQWEsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEI7QUFEakIsU0FESjs7SUFJQSxJQUFHLHFEQUFIO1FBQ0ksVUFBQSxHQUFhLFdBQUEsQ0FBWSxVQUFaLEVBQXdCLEdBQXhCLGdDQUFtQyxDQUFFLFlBQXJDLEVBRGpCOztJQUdBLElBQWMscURBQWQ7QUFBQSxlQUFBOztXQUVBLFVBQUEsR0FBYSxLQUFLLENBQUMsSUFBTixDQUFXLEtBQUssQ0FBQyxHQUFOLENBQVUsVUFBVixDQUFYLEVBQWtDLEtBQUssQ0FBQyxJQUFOLENBQVcsVUFBWCxDQUFBLEdBQXlCLEdBQXpCLEdBQStCLENBQUUsQ0FBQSxHQUFBLENBQUksQ0FBQyxHQUF4RTtBQXpCUjs7QUEyQlQsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbjAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAwMFxuICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAwMDAgICAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgICAwMDAgIDAwMDAgIDAwMDAwMDAgICAgICAwMDAgICBcbiAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAgMDAwICAgXG4jIyNcblxueyBfLCBhcmdzLCBrbG9nLCBrb2xvciwgc2xhc2ggfSA9IHJlcXVpcmUgJ2t4aydcblxuYXJnRGlyID0gcmVxdWlyZSAnLi9hcmdkaXInXG5jb25maWcgPSByZXF1aXJlICcuL2NvbmZpZydcbnByZXR0eSA9IHJlcXVpcmUgJy4vcHJldHR5J1xuXG5zd2FwTGFzdERpciA9IChwYXRoLCBmcm9tLCB0bykgLT5cbiAgICBcbiAgICBsYXN0SW5kZXggPSBwYXRoLmxhc3RJbmRleE9mIFwiLyN7ZnJvbX0vXCJcbiAgICBpZiBsYXN0SW5kZXggPj0gMFxuICAgICAgICBwYXRoID0gcGF0aFsuLmxhc3RJbmRleF0gKyB0byArIHBhdGhbbGFzdEluZGV4KyhcIi8je2Zyb219XCIpLmxlbmd0aC4uXVxuICAgIHBhdGhcblxudGFyZ2V0ID0gKHNvdXJjZUZpbGUsIG9wdCkgLT5cbiAgICBcbiAgICBleHQgPSBzbGFzaC5leHQgc291cmNlRmlsZVxuICAgIG8gPSBjb25maWcub2JqIHNvdXJjZUZpbGUsIG9wdFxuXG4gICAgaWYgb1tleHRdPy5maWx0ZXI/XG4gICAgICAgIG1hdGNoZXMgPSBmYWxzZVxuICAgICAgICBmb3IgciBpbiBvW2V4dF0uZmlsdGVyXG4gICAgICAgICAgICBpZiBuZXcgUmVnRXhwKHIpLnRlc3Qoc291cmNlRmlsZSlcbiAgICAgICAgICAgICAgICBtYXRjaGVzID0gdHJ1ZVxuICAgICAgICBpZiBub3QgbWF0Y2hlc1xuICAgICAgICAgICAga2xvZyBwcmV0dHkuZmlsZVBhdGggc2xhc2gucmVsYXRpdmUoc291cmNlRmlsZSwgYXJnRGlyKCkpLCBrb2xvci5ibHVlIGlmIGFyZ3MuZGVidWdcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgdGFyZ2V0RmlsZSA9IF8uY2xvbmUgc291cmNlRmlsZVxuXG4gICAgaWYgb1tleHRdPy5yZXBsYWNlP1xuICAgICAgICBmb3Igayx2IG9mIG9bZXh0XS5yZXBsYWNlXG4gICAgICAgICAgICB0YXJnZXRGaWxlID0gdGFyZ2V0RmlsZS5yZXBsYWNlIGssIHZcbiAgICAgICAgICAgIFxuICAgIGlmIG9bZXh0XT8ub3V0P1xuICAgICAgICB0YXJnZXRGaWxlID0gc3dhcExhc3REaXIgdGFyZ2V0RmlsZSwgZXh0LCBvW2V4dF0/Lm91dFxuXG4gICAgcmV0dXJuIGlmIG5vdCBvW2V4dF0/LmV4dD9cblxuICAgIHRhcmdldEZpbGUgPSBzbGFzaC5qb2luIHNsYXNoLmRpcih0YXJnZXRGaWxlKSwgc2xhc2guYmFzZSh0YXJnZXRGaWxlKSArICcuJyArIG9bZXh0XS5leHRcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gdGFyZ2V0XG4iXX0=
//# sourceURL=../coffee/target.coffee