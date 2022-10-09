// monsterkodi/kode 0.243.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var app, args, childp, createWindow, electron, highlight, klog, kolor, konrad, konradSend, konradUdp, konradVersion, kstr, kxk, p, pkg, post, prefs, quit, setRootDir, slash, startKonrad, udp

kxk = require('kxk')
app = kxk.app
args = kxk.args
childp = kxk.childp
klog = kxk.klog
kolor = kxk.kolor
kstr = kxk.kstr
noon = kxk.noon
post = kxk.post
prefs = kxk.prefs
slash = kxk.slash
udp = kxk.udp

pkg = require('../package.json')
electron = require('electron')
app = new app({dir:__dirname,pkg:pkg,shortcut:'CmdOrCtrl+F2',index:'index.html',icon:'../img/app.ico',tray:'../img/menu@2x.png',about:'../img/about.png',onQuit:function ()
{
    return quit()
},width:400,height:400,minWidth:300,minHeight:200,args:`show      open window on startup  true
prefs     show preferences        false`})
konrad = null
konradVersion = null
konradUdp = new udp({port:9559})

konradSend = function (msg, ...args)
{
    var s

    s = [msg + ':'].concat(args).join(' ')
    return konradUdp.send(s)
}
if (args.verbose)
{
    klog(kolor.white(kolor.bold(`\n${pkg.name}`,kolor.gray(`v${pkg.version}\n`))))
    klog(kolor.yellow(kolor.bold('process')))
    p = {cwd:process.cwd()}
    klog(noon.stringify(p,{colors:true}))
    klog(kolor.yellow.bold('args'))
    klog(noon.stringify(args,{colors:true}))
    klog('')
}
if (args.prefs)
{
    klog(kolor.yellow(kolor.bold('prefs')))
    klog(kolor.green(kolor.bold(prefs.store.file)))
    if (slash.fileExists(prefs.store.file))
    {
        klog(noon.stringify(noon.load(prefs.store.file),{colors:true}))
    }
}
post.on('Restart konrad',function ()
{
    return startKonrad(prefs.get('rootDir'))
})

startKonrad = function (rootDir)
{
    var path, treekill

    prefs.set('rootDir',rootDir)
    if ((konrad != null))
    {
        console.log('killing konrad',konrad.pid)
        treekill = require('tree-kill')
        treekill(konrad.pid)
    }
    path = slash.resolve(`${__dirname}/../js/konrad.js`)
    if (!(_k_.in('/usr/local/bin',process.env.PATH.split(':'))))
    {
        process.env.PATH = process.env.PATH + ':/usr/local/bin'
    }
    if (!(_k_.in('/opt/homebrew/bin',process.env.PATH.split(':'))))
    {
        process.env.PATH = process.env.PATH + ':/opt/homebrew/bin'
    }
    konrad = childp.spawn('node',['--trace-warnings',path,'-w','-v'],{cwd:rootDir,shell:true,env:process.env,detached:false})
    konrad.on('exit',function (code, signal)
    {
        console.log('konrad.on exit',code,signal)
        return konradSend('exit')
    })
    konrad.on('close',function (code, signal)
    {
        post.toWins('konradExit',`konrad exit code: ${code}`)
        return konradSend('exit')
    })
    konrad.stderr.on('data',function (data)
    {
        var s, _105_19_

        s = kstr.stripAnsi(data.toString())
        konradSend('error',s)
        if (((app != null ? app.win : undefined) != null))
        {
            return post.toWins('konradError',`konrad error: ${s}`,kstr.ansi2html(data.toString()))
        }
        else
        {
            return createWindow('konradError',`konrad error: ${s}`,kstr.ansi2html(data.toString()))
        }
    })
    return konrad.stdout.on('data',function (data)
    {
        var s, _118_23_

        s = kstr.stripAnsi(data.toString())
        if (_k_.in(' 👁 ',s))
        {
            konradVersion = s.split('👁  ')[1]
            post.toWins('konradVersion',konradVersion)
            return konradSend('version',konradVersion)
        }
        else if ((app.win != null))
        {
            if (_k_.in(' 😡 ',s))
            {
                post.toWins('konradError',s,kstr.ansi2html(data.toString()))
                konradSend('error',s)
                app.win.show()
                return app.win.focus()
            }
            else
            {
                post.toWins('konradOutput',s,kstr.ansi2html(data.toString()))
                return konradSend('output',s)
            }
        }
        else
        {
            if (_k_.in(' 😡 ',s))
            {
                konradSend('error',s)
                return createWindow('konradError',s,kstr.ansi2html(data.toString()))
            }
            else
            {
                konradSend('output',s)
                return highlight()
            }
        }
    })
}

createWindow = function (msg, s, h)
{
    return app.createWindow(function (w)
    {
        return post.toWin(w.id,msg,s,h)
    })
}

quit = function ()
{
    var treekill

    if ((konrad != null))
    {
        klog('killing konrad',(konrad != null ? konrad.pid : undefined))
        treekill = require('tree-kill')
        treekill(konrad.pid,function ()
        {
            return app.exitApp()
        })
        konrad = null
        return 'delay'
    }
}
post.on('Restart',function ()
{
    var treekill

    klog('on Restart',konrad.pid)
    treekill = require('tree-kill')
    return treekill(konrad.pid,function ()
    {
        klog('spawn',process.argv[0],process.argv.slice(1))
        childp.spawn(process.argv[0],process.argv.slice(1),{cwd:process.cwd(),encoding:'utf8',detached:true,shell:true,windowsHide:true})
        return process.exit(0)
    })
})

setRootDir = function ()
{
    var opts

    opts = {title:'Open',properties:['openDirectory']}
    return electron.dialog.showOpenDialog(opts).then((function (result)
    {
        if (!result.canceled && !_k_.empty(result.filePaths))
        {
            return startKonrad(result.filePaths[0])
        }
    }).bind(this))
}
post.on('setRootDir',setRootDir)
post.on('appReady',function ()
{
    var rootDir

    if (rootDir = prefs.get('rootDir'))
    {
        return startKonrad(rootDir)
    }
    else
    {
        return setRootDir()
    }
})
post.on('winReady',function (wID)
{
    if (konradVersion)
    {
        return post.toWin(wID,'konradVersion',konradVersion)
    }
})

highlight = function ()
{
    var unhighlight, _220_26_, _228_33_

    if (!(app.tray != null))
    {
        return
    }
    if (slash.win())
    {
        app.tray.setImage(slash.resolve(slash.join(__dirname,'../img/menu.png')))
        unhighlight = function ()
        {
            return app.tray.setImage(slash.resolve(slash.join(__dirname,'../img/menu@2x.png')))
        }
        return setTimeout(unhighlight,1000)
    }
    else
    {
        ;(typeof app.tray.setHighlightMode === "function" ? app.tray.setHighlightMode('always') : undefined)
        unhighlight = function ()
        {
            var _229_50_

            return (typeof app.tray.setHighlightMode === "function" ? app.tray.setHighlightMode('never') : undefined)
        }
        return setTimeout(unhighlight,1000)
    }
}
post.on('highlight',highlight)