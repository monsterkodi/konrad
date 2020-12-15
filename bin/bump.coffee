###
0000000    000   000  00     00  00000000   
000   000  000   000  000   000  000   000  
0000000    000   000  000000000  00000000   
000   000  000   000  000 0 000  000        
0000000     0000000   000   000  000        
###

{ args, fs, karg, kolor, noon, slash } = require 'kxk'

semver = require 'semver'
args   = karg """

bump
    semver     . ? semver or increment type . *
    increment  . ? increment type: major, minor or patch . = minor
"""

if args.semver? and not semver.valid args.semver
    if args.semver in ['major' 'minor' 'patch']
        args.increment = args.semver
        delete args.semver
    else
        log "not a semver version: #{args.semver.yellow}".red
        process.exit 1

file         = slash.join process.cwd(), 'package.json'
pack         = require file
oldversion   = pack.version
oldversion   = "0.0.0" if not semver.valid oldversion
pack.version = args.semver ? semver.inc oldversion, args.increment
log kolor.green(slash.basename(slash.dir file)), kolor.gray(oldversion), kolor.dim(kolor.gray('►')), kolor.red(kolor.bold(pack.version))

# write package.json
fs.writeFileSync file, JSON.stringify(pack, null, '  '), encoding: 'utf8'

# write package.noon if it exists
noonFile = slash.join process.cwd(), 'package.noon'
if fs.existsSync noonFile
    noon.save noonFile, pack, 
        indent:   '  '
        maxalign: 16
    
