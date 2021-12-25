// monsterkodi/kode 0.223.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return (l != null ? typeof l.length === 'number' ? l : [] : [])}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, valid: undefined}

var argDir, args, childp, doFetch, doStatus, gitFetch, gitStatus, kerror, klog, klor, kxk, pretty, render, slash, _

kxk = require('kxk')
_ = kxk._
args = kxk.args
childp = kxk.childp
kerror = kxk.kerror
klog = kxk.klog
klor = kxk.klor
slash = kxk.slash

klor.kolor.globalize()
render = require('./render')
argDir = require('./argdir')
pretty = require('./pretty')

gitStatus = function (sourceFile)
{
    var git, gitDir

    gitDir = slash.dir(sourceFile)
    git = require('simple-git')(gitDir)
    return doStatus(git,gitDir,sourceFile)
}

gitFetch = function (sourceFile)
{
    var git, gitDir

    gitDir = slash.dir(sourceFile)
    git = require('simple-git')(gitDir)
    return doFetch(git,gitDir,sourceFile)
}

doFetch = function (git, gitDir, sourceFile)
{
    return git.fetch(function (err, status)
    {
        if (err)
        {
            return kerror(`git fetch kerror ${err}`)
        }
        return doStatus(git,gitDir,sourceFile)
    })
}

doStatus = function (git, gitDir, sourceFile)
{
    return git.status(function (err, status)
    {
        var a, aheadBehind, arglist, b, c, change, changes, d, diff, f, fileLists, filtered, gitFile, gitPath, k, l, lame, ls, m, prfx, relPath, res, rgs, split, start, v, _83_35_

        if (err)
        {
            return kerror(`git status error ${err}`)
        }
        changes = []
        fileLists = _.omitBy(status,function (v, k)
        {
            return _.isEmpty(v)
        })
        for (k in fileLists)
        {
            v = fileLists[k]
            l = {not_added:w2,conflicted:y1,modified:g1,created:m1,deleted:r1}
            m = {not_added:w5,conflicted:y4,modified:g4,created:m4,deleted:r4}
            b = {not_added:W1,conflicted:Y5,modified:G1,created:M4,deleted:R5}
            if (_k_.in(k,_.keys(m)))
            {
                var list = ((_83_35_=status[k]) != null ? _83_35_ : [])
                for (var _83_22_ = 0; _83_22_ < list.length; _83_22_++)
                {
                    f = list[_83_22_]
                    d = argDir()
                    arglist = _.filter(args.arguments,function (a)
                    {
                        return !(_k_.in(a,['fetch']))
                    })
                    if (arglist.length)
                    {
                        filtered = true
                        var list1 = _k_.list(arglist)
                        for (var _89_30_ = 0; _89_30_ < list1.length; _89_30_++)
                        {
                            a = list1[_89_30_]
                            if (slash.join(gitDir,f).indexOf(slash.resolve(a)) === 0)
                            {
                                filtered = false
                                break
                            }
                        }
                        if (filtered)
                        {
                            if (args.debug)
                            {
                                klog('filtered',slash.resolve(a),f,slash.join(gitDir,f))
                            }
                            continue
                        }
                    }
                    prfx = b[k]("  ")
                    prfx += reset('  ')
                    gitFile = slash.join(gitDir,f)
                    relPath = slash.relative(gitFile,'.')
                    lame = _k_.in(slash.ext(gitFile),['js','json'])
                    change = prfx + pretty.filePath(relPath,(lame && l[k] || m[k]))
                    if (_k_.in(k,['modified','created']) && args.diff)
                    {
                        if (lame)
                        {
                            continue
                        }
                        res = childp.execSync(`git diff -U0 --ignore-space-at-eol ${gitFile}`,{encoding:'utf8',cwd:gitDir})
                        diff = ""
                        c = w2('●')
                        start = 0
                        var list2 = _k_.list(res.split(/\r?\n/))
                        for (var _120_30_ = 0; _120_30_ < list2.length; _120_30_++)
                        {
                            l = list2[_120_30_]
                            ls = klor.kolor.strip(l)
                            if (_k_.in(ls.substr(0,4),['+++ ','--- ']))
                            {
                            }
                            else if (ls[0] === '@')
                            {
                                split = ls.split('@@')
                                split = split[1].split(' +')
                                split = split[1].split(',')
                                start = parseInt(split[0])
                                diff += ("\n" + c)
                                c = w2('●')
                            }
                            else if (ls[0] === '+')
                            {
                                diff += "\n "
                                start++
                                rgs = klor.ranges(ls.substr(1),slash.ext(f))
                                if (!_k_.empty(rgs))
                                {
                                    diff += render(rgs)
                                }
                                else
                                {
                                    diff += w8(ls.substr(1))
                                }
                            }
                            else if (ls[0] === '-')
                            {
                                diff += "\n " + w3(ls.substr(1))
                            }
                        }
                        if (diff.length)
                        {
                            change += diff + "\n" + w2('●')
                        }
                    }
                    changes.push(change)
                }
            }
        }
        relPath = slash.relative(gitDir,'.')
        if (relPath === '')
        {
            relPath = '.'
        }
        gitPath = pretty.filePath(relPath,w8)
        aheadBehind = function ()
        {
            var st

            if (status.ahead || status.behind)
            {
                st = ''
                if (status.ahead)
                {
                    st += w3(`▲ ${status.ahead}`)
                }
                if (status.behind)
                {
                    st += r5(`▼ ${status.behind}`)
                }
                return st = _.padEnd(st,4)
            }
            else
            {
                return ''
            }
        }
        console.log(B5('    ' + gitPath + ' ') + ' ' + aheadBehind())
        var list3 = _k_.list(changes)
        for (var _160_14_ = 0; _160_14_ < list3.length; _160_14_++)
        {
            c = list3[_160_14_]
            console.log(c)
        }
    })
}
module.exports = {gitStatus:gitStatus,gitFetch:gitFetch}