// koffee 0.56.0

/*
 0000000   00000000    0000000   0000000    000  00000000 
000   000  000   000  000        000   000  000  000   000
000000000  0000000    000  0000  000   000  000  0000000  
000   000  000   000  000   000  000   000  000  000   000
000   000  000   000   0000000   0000000    000  000   000
 */

(function() {
    var argDir, args, ref, slash;

    ref = require('kxk'), args = ref.args, slash = ref.slash;

    argDir = function() {
        var d;
        if (args["arguments"][0]) {
            d = slash.resolve(args["arguments"][0]);
            if (slash.dirExists(d)) {
                return d;
            }
            d = slash.dir(d);
            if (slash.dirExists(d)) {
                return d;
            }
        }
        return slash.resolve('.');
    };

    module.exports = argDir;

}).call(this);
