#!/usr/bin/env coffee

{ slash, karg, noon, colors, fs } = require 'kxk'

semver = require 'semver'
args   = karg """

bump
    semver     . ? semver or increment type . *
    increment  . ? increment type: major, minor or . = patch
"""

if args.semver? and not semver.valid args.semver
    if args.semver in ['major', 'minor', 'patch']
        args.increment = args.semver
        delete args.semver
    else
        console.log "not a semver version: #{args.semver.yellow}".red
        process.exit 1

file         = slash.join process.cwd(), 'package.json'
pack         = require file
oldversion   = pack.version
oldversion   = "0.0.0" if not semver.valid oldversion
pack.version = args.semver ? semver.inc oldversion, args.increment
console.log slash.basename(slash.dirname file).green, oldversion.gray, '►'.gray.dim, pack.version.bold.red

# write package.json
fs.writeFileSync file, JSON.stringify(pack, null, '  '), encoding: 'utf8'

# write package.noon if it exists
noonFile = slash.join process.cwd(), 'package.noon'
if fs.existsSync noonFile
    noon.save noonFile, pack, 
        indent:   '  '
        maxalign: 16
    
