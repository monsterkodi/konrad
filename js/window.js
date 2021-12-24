// monsterkodi/kode 0.211.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var $, elem, fadeOverlay, koSend, onError, onFile, onMessage, onTask, openFile, post, showOverlay, slash, taskDiv, tasks, title, udp, w, win, _

$ = require('kxk').$
_ = require('kxk')._
elem = require('kxk').elem
post = require('kxk').post
slash = require('kxk').slash
title = require('kxk').title
udp = require('kxk').udp
win = require('kxk').win

w = new win({dir:__dirname,pkg:require('../package.json'),menu:'../kode/menu.noon',icon:'../img/menu@2x.png'})
koSend = null

openFile = function (f)
{
    if (!koSend)
    {
        koSend = new udp({port:9779})
    }
    return koSend.send(slash.resolve(f))
}
tasks = {}

showOverlay = function ()
{
    var img, overlay, _39_17_

    img = slash.fileUrl(slash.join(__dirname,'..','img','about.png'))
    ;($('#overlay') != null ? $('#overlay').remove() : undefined)
    overlay = elem({id:'overlay'})
    overlay.appendChild(elem('img',{class:'info',src:img}))
    overlay.addEventListener('click',function (event)
    {
        return event.target.remove()
    })
    return $('main').appendChild(overlay)
}

fadeOverlay = function ()
{
    showOverlay()
    return $('#overlay').classList.add('fade-in')
}
post.on('konradExit',function (s)
{})
post.on('konradError',function (s, html)
{
    return onError(s,html)
})
post.on('konradOutput',function (s, html)
{
    if (_k_.in(' 😡 ',s))
    {
        onError(s,html)
    }
    if (_k_.in(' 🔺 ',s))
    {
        return onFile(s,html)
    }
    else if (_k_.in(' 👍 ',s))
    {
        return onTask(s,html)
    }
    else if (_k_.in(' 🔧 ',s))
    {
        return onMessage(s,html)
    }
})
post.on('konradVersion',function (s)
{
    var split

    split = s.trim().split(/\s+/)
    title = ['path']
    if (process.argv[0].endsWith('Electron Helper') || process.argv[0].endsWith('electron.exe'))
    {
        title = ['version','path']
    }
    return window.titlebar.setTitle({title:title,pkg:{version:split[0],path:slash.tilde(split[2])}})
})
post.on('clearLog',function ()
{
    $('main').innerHTML = ''
    tasks = {}
    return showOverlay()
})

taskDiv = function (opt)
{
    var div, fil, main, tim, _1_9_, _108_30_, _109_33_

    main = $('main')
    if (_.isEmpty(tasks))
    {
        main.innerHTML = ''
    }
    ;(tasks[opt.key] != null ? tasks[opt.key].remove() : undefined)
    div = document.createElement('div')
    tim = document.createElement('span')
    fil = document.createElement('span')
    div.classList.add('task')
    tim.classList.add('time')
    tim.innerHTML = opt.time
    fil.classList.add((opt.file != null) && 'file' || 'message')
    fil.innerHTML = ((_109_33_=opt.fileHtml) != null ? _109_33_ : ` ${opt.icon} ${((_1_9_=opt.file) != null ? _1_9_ : opt.message)}`)
    fil.onclick = function ()
    {
        var _110_50_

        if ((opt.file != null))
        {
            return openFile(opt.file)
        }
    }
    div.appendChild(tim)
    div.appendChild(fil)
    tasks[opt.key] = div
    main.appendChild(div)
    return div
}

onTask = function (s)
{
    var div, source, sourceTarget, target, time

    post.toMain('highlight')
    var _130_25_ = s.split(' 👍 ') ; time = _130_25_[0]    ; sourceTarget = _130_25_[1]

    var _131_21_ = sourceTarget.split(' ► ') ; source = _131_21_[0]    ; target = _131_21_[1]

    source = slash.tilde(source.trim())
    target = slash.tilde(target.trim())
    div = taskDiv({time:time,file:source,key:source,icon:'👍'})
    div.scrollIntoViewIfNeeded()
    if (slash.dir(target).startsWith(slash.tilde(slash.dir(__filename))))
    {
        if (slash.file(target) === 'window.js' || _k_.in(slash.ext(target),['css','html']))
        {
            post.emit('menuAction','Reload')
        }
        else if (slash.file(target) === 'main.js')
        {
            post.toMain('Restart')
        }
        else
        {
            post.toMain('Restart konrad')
        }
    }
    return fadeOverlay()
}

onMessage = function (s)
{
    var div, msg, time

    var _157_16_ = s.split(' 🔧 ') ; time = _157_16_[0]    ; msg = _157_16_[1]

    return div = taskDiv({time:time,message:msg,key:'msg',icon:'🔧'})
}

onError = function (s, html)
{
    var div, fileHtml, htmls, i, key, lines, msg, pre, task, time, _183_16_

    post.toMain('showWindow')
    post.toMain('highlight')
    for (key in tasks)
    {
        task = tasks[key]
        if (task.icon === '😡')
        {
            task.div.remove()
            delete tasks[key]
        }
    }
    lines = s.split('\n')
    if (html)
    {
        htmls = html.split('\n')
        fileHtml = htmls.shift().split('</span>').slice(5).join('</span>')
    }
    var _182_16_ = lines.shift().split(' 😡 ') ; time = _182_16_[0]    ; msg = _182_16_[1]

    if (((msg != null ? msg.trim : undefined) != null))
    {
        msg = msg.trim()
        if (msg.split(':').length >= 3)
        {
            msg = ''
        }
    }
    div = taskDiv({time:time,icon:'😡',message:msg})
    for (var _189_14_ = i = 0, _189_18_ = lines.length; (_189_14_ <= _189_18_ ? i < lines.length : i > lines.length); (_189_14_ <= _189_18_ ? ++i : --i))
    {
        pre = document.createElement('pre')
        pre.classList.add('error')
        if (htmls[i])
        {
            pre.innerHTML = htmls[i]
        }
        else
        {
            pre.textContent = lines[i]
        }
        div.appendChild(pre)
    }
    return div.scrollIntoViewIfNeeded()
}

onFile = function (s, html)
{
    var div, file, fileHtml, htmls, time

    post.toMain('showWindow')
    post.toMain('highlight')
    if (html)
    {
        htmls = html.split('\n')
        fileHtml = htmls.shift().split('</span>').slice(5).join('</span>')
    }
    var _215_17_ = s.split(' 🔺 ') ; time = _215_17_[0]    ; file = _215_17_[1]

    file = file.trim()
    div = taskDiv({time:time,file:file,key:file.split(':')[0],icon:'🔺',fileHtml:fileHtml})
    return div.scrollIntoViewIfNeeded()
}
post.on('menuAction',function (action)
{
    switch (action)
    {
        case 'Clear':
            return post.emit('clearLog')

        case 'Set Dir...':
            return post.toMain('setRootDir')

    }

})
showOverlay()