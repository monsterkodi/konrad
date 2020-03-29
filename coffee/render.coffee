###
00000000   00000000  000   000  0000000    00000000  00000000 
000   000  000       0000  000  000   000  000       000   000
0000000    0000000   000 0 000  000   000  0000000   0000000  
000   000  000       000  0000  000   000  000       000   000
000   000  00000000  000   000  0000000    00000000  000   000
###

{ kolor } = require 'kxk'

render = (rgs) ->

    result = ''
    plain  = ''
    
    for index in [0...rgs.length]
        rng = rgs[index]
        while plain.length < rng.start
            plain  += ' '
            result += ' '

        cfunc = switch rng.clss
            when 'text'
                (s) -> kolor.white kolor.dim s
            when 'comment'
                (s) -> kolor.gray kolor.bold s
            when 'punct comment' 'punct'
                (s) -> kolor.gray kolor.dim s
            when 'function' 'function call' 'string single' 'string double' 'dir text' 'property'
                (s) -> kolor.green kolor.bold s
            when 'punct function call' 'punct string single' 'punct string double' 'punct dir'
                (s) -> kolor.green kolor.dim s
            when 'obj' 'class' 'git file'
                (s) -> kolor.yellow kolor.bold s
            when 'punct git' 'git ext'
                (s) -> kolor.yellow kolor.dim s
            when 'number' 'keyword' 'url domain'
                (s) -> kolor.blue kolor.bold s
            when 'require' 'punct property'
                (s) -> kolor.green kolor.dim s
            when 'punct semver' 'url protocol' 'punct url'
                (s) -> kolor.magenta s
            when 'semver' 'dir url tld' 'punct url tld'
                (s) -> kolor.magenta kolor.bold s
            else
                (s) -> kolor.white kolor.bold s
            
        plain  += rng.match
        result += cfunc rng.match
    
    result

module.exports = render
