###
00000000   00000000  000   000  0000000    00000000  00000000 
000   000  000       0000  000  000   000  000       000   000
0000000    0000000   000 0 000  000   000  0000000   0000000  
000   000  000       000  0000  000   000  000       000   000
000   000  00000000  000   000  0000000    00000000  000   000
###

{ colors } = require 'kxk'

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
            when 'punct comment' 'punct'
                colors.gray.dim
            when 'function' 'function call' 'string single' 'string double' 'dir text' 'property'
                colors.green.bold
            when 'punct function call' 'punct string single' 'punct string double' 'punct dir'
                colors.green.dim
            when 'obj' 'class' 'git file'
                colors.yellow.bold
            when 'punct git' 'git ext'
                colors.yellow.dim
            when 'number' 'keyword' 'url domain'
                colors.blue.bold
            when 'require' 'punct property'
                colors.green.dim
            when 'punct semver' 'url protocol' 'punct url'
                colors.magenta
            when 'semver' 'dir url tld' 'punct url tld'
                colors.magenta.bold
            else
                colors.white.bold
            
        plain  += rng.match
        result += cfunc rng.match
    
    result

module.exports = render
