###
 0000000   00000000    0000000   0000000    000  00000000 
000   000  000   000  000        000   000  000  000   000
000000000  0000000    000  0000  000   000  000  0000000  
000   000  000   000  000   000  000   000  000  000   000
000   000  000   000   0000000   0000000    000  000   000
###

{ slash } = require 'kxk'

args = require './args'

argDir = ->
    
    if args.arguments[0]
        d = slash.resolve args.arguments[0]
        if slash.dirExists d
            return d
        d = slash.dir d # ???
        if slash.dirExists d
            return d
    slash.resolve '.'

module.exports = argDir
