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
                
                if cfg[ext]?.map in ['inline', 'file']
                    toSource       = slash.relative sourceFile, targetFile
                    splitIndex     = toSource.lastIndexOf('./') + 2
                    sourceRoot     = toSource.slice 0, splitIndex - 4
                    relativeSource = toSource.substr splitIndex
                    mapcfg =
                        filename:      sourceFile
                        sourceMap:     true
                        generatedFile: slash.basename targetFile
                        sourceRoot:    sourceRoot
                        sourceFiles:   [relativeSource]

                switch cfg[ext]?.map
                    when 'inline'
                        mapcfg.inlineMap = true
                        jsMap = coffee.compile sourceText, mapcfg
                        jsMap.js
                    when 'file'
                        jsMap = coffee.compile sourceText, mapcfg
                        srcMap = jsMap.v3SourceMap
                        mapFile = "#{targetFile}.map"
                        atomic mapFile, srcMap, (err) ->
                            if err then error "can't write sourceMap for #{targetFile}: #{err}"
                        jsMap.js + "\n//# sourceMappingURL=#{slash.basename mapFile}\n"
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
        konradError 'compile error', e
        return null
        
    compiled
    
module.exports = compile


