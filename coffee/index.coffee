###
000  000   000  0000000    00000000  000   000  
000  0000  000  000   000  000        000 000   
000  000 0 000  000   000  0000000     00000    
000  000  0000  000   000  000        000 000   
000  000   000  0000000    00000000  000   000  
###

if not module.parent?.filename? or module.parent.filename.endsWith('default_app.asar\\main.js') or module.parent.filename.endsWith('default_app.asar/main.js')
    require './main'
else
    require './konrad'
    