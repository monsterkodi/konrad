// monsterkodi/kode 0.190.0

var _k_

var klog, kolor, konradError, kstr, pretty, title

klog = require('kxk').klog
kolor = require('kxk').kolor
kstr = require('kxk').kstr
title = require('kxk').title

pretty = require('./pretty')

konradError = function (title, msg, srcFile)
{
    var msgsplit, stripped

    if (title === 'compile error' || 'command error')
    {
        klog(pretty.time(),`😡  ${msg}`)
    }
    else
    {
        msgsplit = msg.split('\n')
        stripped = msgsplit.map(function (s)
        {
            return kstr.stripAnsi(s)
        })
        klog(`${kolor.bold(kolor.yellow(title))} ${kolor.r5(stripped)}`)
    }
    return false
}
module.exports = konradError