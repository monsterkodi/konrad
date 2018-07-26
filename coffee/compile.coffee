###
 0000000   0000000   00     00  00000000   000  000      00000000  
000       000   000  000   000  000   000  000  000      000       
000       000   000  000000000  00000000   000  000      0000000   
000       000   000  000 0 000  000        000  000      000       
 0000000   0000000   000   000  000        000  0000000  00000000  
###

{ atomic, noon, slash, error, log, fs, _ } = require 'kxk'

konradError = require './error'

compile = (sourceText, ext, sourceFile, targetFile, cfg) ->
    
    try
        compiled = switch ext
            
            when 'coffee'
                
                coffee = require 'coffeescript'
                
                if cfg[ext]?.map
                    mapcfg =
                        sourceMap:     true
                        inlineMap:     true
                        sourceRoot:    '.'
                        filename:      slash.relative sourceFile, slash.dir targetFile
                        generatedFile: slash.file targetFile
                        
                    jsMap = coffee.compile sourceText, mapcfg
                    jsMap.js
                else
                    coffee.compile sourceText

            when 'styl'
                
                stylus = require 'stylus'
                stylus sourceText
                    .set 'filename', sourceFile
                    .set 'paths', [slash.dir sourceFile]
                    .render()
                    
            when 'pug'
                
                pug = require 'pug'
                pug.render sourceText, pretty: true
                
            when 'json'
                
                noon.stringify JSON.parse(sourceText), ext: '.'+cfg[ext].ext, indent: '  ', maxalign: 16
                
            when 'noon'
                
                noon.stringify noon.parse(sourceText), ext: '.'+cfg[ext].ext, indent: '  '
            else
                throw "don't know how to build files with extname .#{ext.bold}!".yellow

    catch e
        konradError 'compile error', e, sourceFile
        return null
        
    compiled
    
module.exports = compile


