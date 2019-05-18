###
 0000000  000000000   0000000   000000000  000   000   0000000
000          000     000   000     000     000   000  000     
0000000      000     000000000     000     000   000  0000000 
     000     000     000   000     000     000   000       000
0000000      000     000   000     000      0000000   0000000 
###

{ colors, childp, slash, valid, args, kerror, klog, _ } = require 'kxk'

klor   = require 'klor'
render = require './render'
argDir = require './argdir'
pretty = require './pretty'

gitStatus = (sourceFile) ->

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
            
            m =
                not_added:  colors.gray
                conflicted: colors.yellow
                modified:   colors.green
                created:    colors.magenta
                deleted:    colors.red

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
                            klog 'filtered', slash.resolve(a), f, slash.join(gitDir, f) if args.debug
                            continue

                    prfx    = "    "
                    prfx    = m[k] "█   "
                    gitFile = slash.join gitDir, f
                    relPath = slash.relative gitFile, '.'
                    lame    = slash.extname(gitFile) == '.js' or slash.basename(gitFile) == 'package.json'
                    change  = prfx + pretty.filePath(relPath, (lame and m[k].dim or m[k]))
                    
                    # 0000000    000  00000000  00000000  
                    # 000   000  000  000       000       
                    # 000   000  000  000000    000000    
                    # 000   000  000  000       000       
                    # 0000000    000  000       000       
                    
                    if k in ['modified', 'created'] and args.diff
                        
                        continue if lame
                        
                        res = childp.execSync "git diff -U0 --ignore-space-at-eol #{gitFile}",
                            encoding: 'utf8'
                            cwd: gitDir
                        diff = ""
                        c = '▼'.bold.blue
                        start = 0
                        for l in res.split /\r?\n/
                            ls = colors.strip(l)
                            if ls.substr(0,4) in ['+++ ', '--- '] then
                            else if ls[0] == '@'
                                split = ls.split '@@'
                                split = split[1].split ' +'
                                split = split[1].split ','
                                start = parseInt split[0]
                                diff += ("\n"+c)
                                c = '●'.blue.dim
                            else if ls[0] == '+'
                                diff += "\n "
                                # diff += "[0;7m#{slash.join(gitDir, f)}:#{start}[0m"
                                start++
                                rgs = klor.ranges ls.substr(1), slash.ext f
                                if valid rgs
                                    diff += render rgs
                                else
                                    diff += ls.substr(1).white
                            else if ls[0] == '-'
                                diff += "\n " + (ls.substr(1)).gray.bold.dim
                        change += diff+"\n"+"▲".blue.dim if diff.length
                        
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

        klog ('    ' + gitPath + ' ').bgBlue + ' ' + aheadBehind()
        for c in changes
            klog c

module.exports = 
    gitStatus:gitStatus
