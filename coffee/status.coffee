###
 0000000  000000000   0000000   000000000  000   000   0000000
000          000     000   000     000     000   000  000     
0000000      000     000000000     000     000   000  0000000 
     000     000     000   000     000     000   000       000
0000000      000     000   000     000      0000000   0000000 
###

{ args, slash, childp, colors, error, _ } = require 'kxk'

log    = console.log
argDir = require './argdir'
pretty = require './pretty'

gitStatus = (sourceFile) ->

    gitDir = slash.dir sourceFile
    git = require('simple-git') gitDir
    doFetch git, gitDir, sourceFile
    
doFetch = (git, gitDir, sourceFile) ->
    
    git.fetch (err,status) ->
        
        if err then return error "git fetch error #{err}"
        doStatus git, gitDir, sourceFile
        
doStatus = (git, gitDir, sourceFile) ->
        
    git.status (err,status) ->

        if err then return error "git status error #{err}"

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
                            log 'filtered', slash.resolve(a), f, slash.join(gitDir, f) if args.debug
                            continue

                    prfx    = "    "
                    prfx    = m[k] "█   "
                    gitFile = slash.join gitDir, f
                    relPath = slash.relative gitFile, '.'
                    lame    = slash.extname(gitFile) == '.js' or slash.basename(gitFile) == 'package.json'
                    change  = prfx + pretty.filePath(relPath, (lame and m[k].dim or m[k]))
                    if k in ['modified', 'created'] and args.diff
                        continue if lame
                        res = childp.execSync "git diff -U0 --ignore-space-at-eol #{gitFile}",
                            encoding: 'utf8'
                            cwd: gitDir
                        diff = ""
                        c = '▼'.bold.blue
                        for l in res.split /\r?\n/
                            ls = colors.strip(l)
                            if (ls[0] in ['+', '-', '@']) and (ls.substr(0,4) not in ['+++ ', '--- '])
                                if ls[0] == '+'
                                    diff += "\n " + (ls.substr(1)).white
                                else if ls[0] == '-'
                                    diff += "\n " + (ls.substr(1)).gray.bold.dim
                                else
                                    diff += ("\n"+c)
                                    c = '●'.blue.dim
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

        log ('    ' + gitPath + ' ').bgBlue + ' ' + aheadBehind()
        for c in changes
            log c

module.exports = 
    gitStatus:gitStatus
