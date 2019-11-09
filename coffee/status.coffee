###
 0000000  000000000   0000000   000000000  000   000   0000000
000          000     000   000     000     000   000  000     
0000000      000     000000000     000     000   000  0000000 
     000     000     000   000     000     000   000       000
0000000      000     000   000     000      0000000   0000000 
###

{ childp, colors, slash, valid, klor, args, kerror, klog, _ } = require 'kxk'

klor.kolor.globalize()
render = require './render'
argDir = require './argdir'
pretty = require './pretty'

gitStatus = (sourceFile) ->

    gitDir = slash.dir sourceFile
    git = require('simple-git') gitDir
    doStatus git, gitDir, sourceFile
    
gitFetch = (sourceFile) ->

    gitDir = slash.dir sourceFile
    git = require('simple-git') gitDir
    doFetch git, gitDir, sourceFile
    
# 00000000  00000000  000000000   0000000  000   000  
# 000       000          000     000       000   000  
# 000000    0000000      000     000       000000000  
# 000       000          000     000       000   000  
# 000       00000000     000      0000000  000   000  

doFetch = (git, gitDir, sourceFile) ->
    
    git.fetch (err,status) ->
        
        if err then return kerror "git fetch kerror #{err}"
        doStatus git, gitDir, sourceFile
        
#  0000000  000000000   0000000   000000000  000   000   0000000  
# 000          000     000   000     000     000   000  000       
# 0000000      000     000000000     000     000   000  0000000   
#      000     000     000   000     000     000   000       000  
# 0000000      000     000   000     000      0000000   0000000   

doStatus = (git, gitDir, sourceFile) ->
     
    git.status (err,status) ->

        if err then return kerror "git status error #{err}"

        changes = []

        fileLists = _.omitBy status, (v,k) -> _.isEmpty v

        for k,v of fileLists

            l =
                not_added:  w2
                conflicted: y1
                modified:   g1
                created:    m1
                deleted:    r1
            
            m =
                not_added:  w5
                conflicted: y4
                modified:   g4
                created:    m4
                deleted:    r4

            b =
                not_added:  W1
                conflicted: Y5
                modified:   G1
                created:    M4
                deleted:    R5
                
            if k in _.keys m
                
                for f in status[k] ? []
                    d = argDir()

                    arglist = _.filter args.arguments, (a) -> a not in ['fetch']
                    if arglist.length
                        filtered = true
                        for a in arglist
                            if slash.join(gitDir, f).indexOf(slash.resolve a) == 0
                                filtered = false
                                break
                        if filtered
                            klog 'filtered' slash.resolve(a), f, slash.join(gitDir, f) if args.debug
                            continue

                    prfx    = b[k] "  "
                    prfx   += reset '  '
                    gitFile = slash.join gitDir, f
                    relPath = slash.relative gitFile, '.'
                    lame    = slash.ext(gitFile) in ['js' 'json']
                    change  = prfx + pretty.filePath(relPath, (lame and l[k] or m[k]))
                    
                    # 0000000    000  00000000  00000000  
                    # 000   000  000  000       000       
                    # 000   000  000  000000    000000    
                    # 000   000  000  000       000       
                    # 0000000    000  000       000       
                    
                    if k in ['modified' 'created'] and args.diff
                        
                        continue if lame
                        
                        res = childp.execSync "git diff -U0 --ignore-space-at-eol #{gitFile}",
                            encoding: 'utf8'
                            cwd: gitDir
                        diff = ""
                        c = klor.kolor.w1 '●'
                        start = 0
                        for l in res.split /\r?\n/
                            ls = klor.kolor.strip l
                            if ls.substr(0,4) in ['+++ ' '--- '] then
                            else if ls[0] == '@'
                                split = ls.split '@@'
                                split = split[1].split ' +'
                                split = split[1].split ','
                                start = parseInt split[0]
                                diff += ("\n"+c)
                                c = klor.kolor.w1 '●' #.blue.dim
                            else if ls[0] == '+'
                                diff += "\n "
                                start++
                                rgs = klor.ranges ls.substr(1), slash.ext f
                                if valid rgs
                                    diff += render rgs
                                else
                                    diff += ls.substr(1).white
                            else if ls[0] == '-'
                                diff += "\n " + (ls.substr(1)).gray.bold.dim
                        change += diff+"\n"+klor.kolor.w1 '●' if diff.length
                        
                    changes.push change

        relPath = slash.relative gitDir, '.'
        relPath = '.' if relPath == ''
        gitPath = pretty.filePath relPath, colors.white

        aheadBehind = () ->
            if status.ahead or status.behind
                st = ''
                if status.ahead
                    st += "▲ #{status.ahead}".gray.bold.bgBlack
                if status.behind
                    st += "▼ #{status.behind}".red.bold.bgBlack
                st = _.padEnd st, 4
            else
                ''

        log ('    ' + gitPath + ' ').bgBlue + ' ' + aheadBehind()
        for c in changes
            log c

module.exports = 
    gitStatus:gitStatus
    gitFetch:gitFetch
