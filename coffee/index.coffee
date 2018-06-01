###
000  000   000  0000000    00000000  000   000  
000  0000  000  000   000  000        000 000   
000  000 0 000  000   000  0000000     00000    
000  000  0000  000   000  000        000 000   
000  000   000  0000000    00000000  000   000  
###

console.log module.parent?.filename

if not module.parent?.filename? or module.parent.filename.endsWith('default_app.asar\\main.js') or module.parent.filename.endsWith('default_app.asar/main.js')
    console.log 'main'
    require './main'

else

    require './konrad'