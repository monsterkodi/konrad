// monsterkodi/kode 0.257.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}};_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.B5=_k_.k.B256(_k_.k.B(5));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w8=_k_.k.F256(_k_.k.w(8))

var argDir, args, childp, doFetch, doStatus, gitFetch, gitStatus, kerror, klor, pretty, render, slash, _

_ = require('kxk')._
args = require('kxk').args
childp = require('kxk').childp
kerror = require('kxk').kerror
klor = require('kxk').klor
slash = require('kxk').slash

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
        var a, aheadBehind, arglist, b, c, change, changes, d, diff, f, fileLists, filtered, gitFile, gitPath, k, l, lame, ls, m, prfx, relPath, res, rgs, split, start, v, _82_35_

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
                var list = ((_82_35_=status[k]) != null ? _82_35_ : [])
                for (var _82_22_ = 0; _82_22_ < list.length; _82_22_++)
                {
                    f = list[_82_22_]
                    d = argDir()
                    arglist = _.filter(args.arguments,function (a)
                    {
                        return !(_k_.in(a,['fetch']))
                    })
                    if (arglist.length)
                    {
                        filtered = true
                        var list1 = _k_.list(arglist)
                        for (var _88_30_ = 0; _88_30_ < list1.length; _88_30_++)
                        {
                            a = list1[_88_30_]
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
                                console.log('filtered',slash.resolve(a),f,slash.join(gitDir,f))
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
                        c = _k_.w2('●')
                        start = 0
                        var list2 = _k_.list(res.split(/\r?\n/))
                        for (var _119_30_ = 0; _119_30_ < list2.length; _119_30_++)
                        {
                            l = list2[_119_30_]
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
                                c = _k_.w2('●')
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
                                    diff += _k_.w8(ls.substr(1))
                                }
                            }
                            else if (ls[0] === '-')
                            {
                                diff += "\n " + _k_.w3(ls.substr(1))
                            }
                        }
                        if (diff.length)
                        {
                            change += diff + "\n" + _k_.w2('●')
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
                    st += _k_.w3(`▲ ${status.ahead}`)
                }
                if (status.behind)
                {
                    st += _k_.r5(`▼ ${status.behind}`)
                }
                return st = _.padEnd(st,4)
            }
            else
            {
                return ''
            }
        }
        console.log(_k_.B5('    ' + gitPath + ' ') + ' ' + aheadBehind())
        var list3 = _k_.list(changes)
        for (var _159_14_ = 0; _159_14_ < list3.length; _159_14_++)
        {
            c = list3[_159_14_]
            console.log(c)
        }
    })
}
module.exports = {gitStatus:gitStatus,gitFetch:gitFetch}