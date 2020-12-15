// koffee 1.14.0

/*
000000000   0000000   00000000    0000000   00000000  000000000
   000     000   000  000   000  000        000          000   
   000     000000000  0000000    000  0000  0000000      000   
   000     000   000  000   000  000   000  000          000   
   000     000   000  000   000   0000000   00000000     000
 */
var _, argDir, args, config, klog, kolor, pretty, ref, slash, target;

ref = require('kxk'), _ = ref._, args = ref.args, klog = ref.klog, kolor = ref.kolor, slash = ref.slash;

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
    if (((ref5 = o[ext]) != null ? ref5.ext : void 0) == null) {
        return;
    }
    return targetFile = slash.join(slash.dir(targetFile), slash.base(targetFile) + '.' + o[ext].ext);
};

module.exports = target;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0LmpzIiwic291cmNlUm9vdCI6Ii4uL2NvZmZlZSIsInNvdXJjZXMiOlsidGFyZ2V0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRQSxNQUFrQyxPQUFBLENBQVEsS0FBUixDQUFsQyxFQUFFLFNBQUYsRUFBSyxlQUFMLEVBQVcsZUFBWCxFQUFpQixpQkFBakIsRUFBd0I7O0FBRXhCLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUVULE1BQUEsR0FBUyxTQUFDLFVBQUQsRUFBYSxHQUFiO0FBRUwsUUFBQTtJQUFBLEdBQUEsR0FBTSxLQUFLLENBQUMsR0FBTixDQUFVLFVBQVY7SUFDTixDQUFBLEdBQUksTUFBTSxDQUFDLEdBQVAsQ0FBVyxVQUFYLEVBQXVCLEdBQXZCO0lBRUosSUFBRyx3REFBSDtRQUNJLE9BQUEsR0FBVTtBQUNWO0FBQUEsYUFBQSxzQ0FBQTs7WUFDSSxJQUFHLElBQUksTUFBSixDQUFXLENBQVgsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsVUFBbkIsQ0FBSDtnQkFDSSxPQUFBLEdBQVUsS0FEZDs7QUFESjtRQUdBLElBQUcsQ0FBSSxPQUFQO1lBQ0ksSUFBeUUsSUFBSSxDQUFDLEtBQTlFO2dCQUFBLElBQUEsQ0FBSyxNQUFNLENBQUMsUUFBUCxDQUFnQixLQUFLLENBQUMsUUFBTixDQUFlLFVBQWYsRUFBMkIsTUFBQSxDQUFBLENBQTNCLENBQWhCLEVBQXNELEtBQUssQ0FBQyxJQUE1RCxDQUFMLEVBQUE7O0FBQ0EsbUJBRko7U0FMSjs7SUFTQSxVQUFBLEdBQWEsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxVQUFSO0lBRWIsSUFBRyx5REFBSDtBQUNJO0FBQUEsYUFBQSxTQUFBOztZQUNJLFVBQUEsR0FBYSxVQUFVLENBQUMsT0FBWCxDQUFtQixDQUFuQixFQUFzQixDQUF0QjtBQURqQixTQURKOztJQUlBLElBQWMscURBQWQ7QUFBQSxlQUFBOztXQUVBLFVBQUEsR0FBYSxLQUFLLENBQUMsSUFBTixDQUFXLEtBQUssQ0FBQyxHQUFOLENBQVUsVUFBVixDQUFYLEVBQWtDLEtBQUssQ0FBQyxJQUFOLENBQVcsVUFBWCxDQUFBLEdBQXlCLEdBQXpCLEdBQStCLENBQUUsQ0FBQSxHQUFBLENBQUksQ0FBQyxHQUF4RTtBQXRCUjs7QUF3QlQsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbjAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAwMFxuICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAwMDAgICAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgICAwMDAgIDAwMDAgIDAwMDAwMDAgICAgICAwMDAgICBcbiAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAgMDAwICAgXG4jIyNcblxueyBfLCBhcmdzLCBrbG9nLCBrb2xvciwgc2xhc2ggfSA9IHJlcXVpcmUgJ2t4aydcblxuYXJnRGlyID0gcmVxdWlyZSAnLi9hcmdkaXInXG5jb25maWcgPSByZXF1aXJlICcuL2NvbmZpZydcbnByZXR0eSA9IHJlcXVpcmUgJy4vcHJldHR5J1xuXG50YXJnZXQgPSAoc291cmNlRmlsZSwgb3B0KSAtPlxuICAgIFxuICAgIGV4dCA9IHNsYXNoLmV4dCBzb3VyY2VGaWxlXG4gICAgbyA9IGNvbmZpZy5vYmogc291cmNlRmlsZSwgb3B0XG5cbiAgICBpZiBvW2V4dF0/LmZpbHRlcj9cbiAgICAgICAgbWF0Y2hlcyA9IGZhbHNlXG4gICAgICAgIGZvciByIGluIG9bZXh0XS5maWx0ZXJcbiAgICAgICAgICAgIGlmIG5ldyBSZWdFeHAocikudGVzdChzb3VyY2VGaWxlKVxuICAgICAgICAgICAgICAgIG1hdGNoZXMgPSB0cnVlXG4gICAgICAgIGlmIG5vdCBtYXRjaGVzXG4gICAgICAgICAgICBrbG9nIHByZXR0eS5maWxlUGF0aCBzbGFzaC5yZWxhdGl2ZShzb3VyY2VGaWxlLCBhcmdEaXIoKSksIGtvbG9yLmJsdWUgaWYgYXJncy5kZWJ1Z1xuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICB0YXJnZXRGaWxlID0gXy5jbG9uZSBzb3VyY2VGaWxlXG5cbiAgICBpZiBvW2V4dF0/LnJlcGxhY2U/XG4gICAgICAgIGZvciBrLHYgb2Ygb1tleHRdLnJlcGxhY2VcbiAgICAgICAgICAgIHRhcmdldEZpbGUgPSB0YXJnZXRGaWxlLnJlcGxhY2UgaywgdlxuXG4gICAgcmV0dXJuIGlmIG5vdCBvW2V4dF0/LmV4dD9cblxuICAgIHRhcmdldEZpbGUgPSBzbGFzaC5qb2luIHNsYXNoLmRpcih0YXJnZXRGaWxlKSwgc2xhc2guYmFzZSh0YXJnZXRGaWxlKSArICcuJyArIG9bZXh0XS5leHRcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gdGFyZ2V0XG4iXX0=
//# sourceURL=../coffee/target.coffee