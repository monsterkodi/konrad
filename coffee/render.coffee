###
00000000   00000000  000   000  0000000    00000000  00000000 
000   000  000       0000  000  000   000  000       000   000
0000000    0000000   000 0 000  000   000  0000000   0000000  
000   000  000       000  0000  000   000  000       000   000
000   000  00000000  000   000  0000000    00000000  000   000
###

{ colors, log } = require 'kxk'

render = (rgs) ->

    result = ''
    plain  = ''
    
    for index in [0...rgs.length]
        rng = rgs[index]
        while plain.length < rng.start
            plain  += ' '
            result += ' '

        cfunc = switch rng.value
            when 'text'
                colors.white.dim
            when 'comment'
                colors.gray.bold
            when 'comment punctuation', 'punctuation'
                colors.gray.dim
            when 'function', 'function call', 'string single', 'string double', 'dir text', 'property'
                colors.green.bold
            when 'function call punctuation', 'string single punctuation', 'string double punctuation', 'dir punctuation'
                colors.green.dim
            when 'obj', 'class', 'git file'
                colors.yellow.bold
            when 'git punctuation', 'git ext'
                colors.yellow.dim
            when 'number', 'keyword', 'url domain'
                colors.blue.bold
            when 'require', 'property punctuation'
                colors.green.dim
            when 'semver punctuation', 'url protocol', 'url punctuation'
                colors.magenta
            when 'semver', 'dir url tld', 'url tld punctuation'
                colors.magenta.bold
            else
                # log 'rng.value', rng.value
                colors.white.bold
            
        plain  += rng.match
        result += cfunc rng.match
    
    result

module.exports = render
