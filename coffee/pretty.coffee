###
00000000   00000000   00000000  000000000  000000000  000   000
000   000  000   000  000          000        000      000 000
00000000   0000000    0000000      000        000       00000
000        000   000  000          000        000        000
000        000   000  00000000     000        000        000
###

{ _, args, kolor, os, slash, valid } = require 'kxk'

pretty = {}

pretty.path = (p, c=kolor.yellow) ->
    
    p.split('/').map((n) -> c(n)).join c('/').dim

pretty.ext = (e, c=kolor.yellow) ->
    
    if e.length then c('.').dim + c(e.substr 1) else ''
    
pretty.file = (f, c=kolor.yellow) ->
    
    "#{c(slash.base(f)).bold}#{pretty.ext slash.extname(f), c}"
    
pretty.filePath = (p, c=kolor.yellow) ->
    
    p = p.replace os.homedir(), "~"
    if valid slash.dir p 
        "#{pretty.path slash.dir(p), c}#{pretty.path '/', c}#{pretty.file slash.basename(p), c}"
    else
        "#{pretty.file slash.basename(p), c}"

pretty.time = ->
    
    if args.logtime
        d = new Date()
        ["#{kolor.gray _.padStart(String(d.getHours()),   2, '0')}#{kolor.dim kolor.gray ':'}"
         "#{kolor.gray _.padStart(String(d.getMinutes()), 2, '0')}#{kolor.dim kolor.gray ':'}"
         "#{kolor.gray _.padStart(String(d.getSeconds()), 2, '0')}"].join('')
    else
        ''
        
module.exports = pretty
