
#   0000000     0000000   000   000  000   000  000       0000000    0000000   0000000  
#   000   000  000   000  000 0 000  0000  000  000      000   000  000   000  000   000
#   000   000  000   000  000000000  000 0 000  000      000   000  000000000  000   000
#   000   000  000   000  000   000  000  0000  000      000   000  000   000  000   000
#   0000000     0000000   00     00  000   000  0000000   0000000   000   000  0000000  

fs       = require 'fs-extra'
download = require 'download'
path     = require 'path'
mount    = require 'dmg'
cp       = require 'child_process'
exec     = cp.exec
log      = console.log
pkg      = require '../package.json' 

version  = pkg.version
product  = pkg.productName
app      = "/Applications/#{product}.app"
dmg      = "#{__dirname}/#{product}-#{version}.dmg"

open = () ->
    log "open #{app}"
    args = process.argv.slice(2).join " "
    exec "open -a #{app} " + args

unpack = () ->
    log "mounting #{dmg} ..."
    mount.mount dmg, (err, dmgPath) ->
        if err
            log err 
        else
            src = path.join dmgPath, "#{product}.app"
            log "copy #{src} to #{app}"
            fs.copy src, app, (err) =>
                if err?
                    log err 
                else
                    log "unmounting #{dmgPath} ..."
                    mount.unmount dmgPath, (err) => 
                        if err?
                            log err 
                        else                            
                            open()

if not fs.existsSync app
    log 'app not found ...'
    if not fs.existsSync dmg        
        src = "https://github.com/monsterkodi/#{product}/releases/download/v#{version}/#{product}-#{version}.dmg"
        log "downloading from github (this might take a while) ..."
        log src
        download(src, __dirname).then () => 
            unpack()
    else
        unpack()
else
    open()
    