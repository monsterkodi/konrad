###
 0000000   0000000   00     00  00000000   000  000      00000000  
000       000   000  000   000  000   000  000  000      000       
000       000   000  000000000  00000000   000  000      0000000   
000       000   000  000 0 000  000        000  000      000       
 0000000   0000000   000   000  000        000  0000000  00000000  
###

{ klog, noon, slash } = require 'kxk'

koffee = require 'koffee'
pretty = require './pretty'
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
                        filename:      slash.relative sourceFile, slash.dir targetFile
                        generatedFile: targetFile
                        metalog:       'klog'
                        feature: header: true
                        
                    jsMap = koffee.compile sourceText, mapcfg
                    jsMap.js
                else
                    koffee.compile sourceText, bare:true, source:sourceFile, metalog:'klog'

            when 'styl'
                stylus = require 'stylus'
                stylus sourceText
                    .render()
                    
            when 'pug'
                pug    = require 'pug'
                pug.render sourceText, pretty: true
                
            when 'json'
                
                noon.stringify JSON.parse(sourceText), ext: '.'+cfg[ext].ext, indent:'  ' maxalign: 16
                
            when 'noon'
                
                noon.stringify noon.parse(sourceText), ext: '.'+cfg[ext].ext, indent: '  '
            else
                throw "don't know how to build files with extname .#{ext.bold}!".yellow

    catch e
        pos = e.location? and ':'+(e.location.first_line+1)+':'+e.location.first_column or ''
        klog pretty.time(), "🔺  #{pretty.filePath slash.tilde sourceFile}#{pos}"
        konradError 'compile error' e.message, sourceFile
        return null
        
    compiled
    
module.exports = compile


