###
 0000000   0000000   00     00  00000000   000  000      00000000  
000       000   000  000   000  000   000  000  000      000       
000       000   000  000000000  00000000   000  000      0000000   
000       000   000  000 0 000  000        000  000      000       
 0000000   0000000   000   000  000        000  0000000  00000000  
###

{ noon, slash, klog, fs, _ } = require 'kxk'

koffee = require 'koffee'
konradError = require './error'

compile = (sourceText, ext, sourceFile, targetFile, cfg) ->

    try
        compiled = switch ext
            
            when 'coffee'

                if cfg[ext]?.map
                    mapcfg =
                        source:        sourceFile
                        bare:          true
                        sourceMap:     true
                        inlineMap:     true
                        sourceRoot:    '.'
                        filename:      slash.relative sourceFile, slash.dir targetFile
                        feature: header: true
                        generatedFile: slash.file targetFile
                        
                    jsMap = koffee.compile sourceText, mapcfg
                    jsMap.js
                else
                    koffee.compile sourceText, bare:true, source:sourceFile

            when 'styl'
                stylus = require 'stylus'
                stylus sourceText
                    .render()
                    
            when 'pug'
                pug    = require 'pug'
                pug.render sourceText, pretty: true
                
            when 'json'
                
                noon.stringify JSON.parse(sourceText), ext: '.'+cfg[ext].ext, indent: '  ', maxalign: 16
                
            when 'noon'
                
                noon.stringify noon.parse(sourceText), ext: '.'+cfg[ext].ext, indent: '  '
            else
                throw "don't know how to build files with extname .#{ext.bold}!".yellow

    catch e
        
        konradError 'compile error', e.message, sourceFile
        return null
        
    compiled
    
module.exports = compile


