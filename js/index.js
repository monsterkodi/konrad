// koffee 0.52.0

/*
000  000   000  0000000    00000000  000   000  
000  0000  000  000   000  000        000 000   
000  000 0 000  000   000  0000000     00000    
000  000  0000  000   000  000        000 000   
000  000   000  0000000    00000000  000   000
 */

(function() {
    var ref;

    if ((((ref = module.parent) != null ? ref.filename : void 0) == null) || module.parent.filename.endsWith('default_app.asar\\main.js') || module.parent.filename.endsWith('default_app.asar/main.js')) {
        require('./main');
    } else {
        require('./konrad');
    }

}).call(this);
