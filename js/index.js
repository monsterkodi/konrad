// Generated by CoffeeScript 2.2.2
(function() {
  /*
  000  000   000  0000000    00000000  000   000  
  000  0000  000  000   000  000        000 000   
  000  000 0 000  000   000  0000000     00000    
  000  000  0000  000   000  000        000 000   
  000  000   000  0000000    00000000  000   000  
  */
  var ref, ref1;

  console.log((ref = module.parent) != null ? ref.filename : void 0);

  if ((((ref1 = module.parent) != null ? ref1.filename : void 0) == null) || module.parent.filename.endsWith('default_app.asar\\main.js') || module.parent.filename.endsWith('default_app.asar/main.js')) {
    console.log('main');
    require('./main');
  } else {
    require('./konrad');
  }

}).call(this);
