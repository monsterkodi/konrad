// monsterkodi/kode 0.245.0

var _k_

var kolor, konradError, kstr, pretty, title

kolor = require('kxk').kolor
kstr = require('kxk').kstr
title = require('kxk').title

pretty = require('./pretty')

konradError = function (title, msg, srcFile)
{
    var msgsplit, stripped

    if (title === 'compile error' || 'command error')
    {
        console.log(pretty.time(),`😡  ${msg}`)
    }
    else
    {
        msgsplit = msg.split('\n')
        stripped = msgsplit.map(function (s)
        {
            return kstr.stripAnsi(s)
        })
        console.log(`${kolor.bold(kolor.yellow(title))} ${kolor.r5(stripped)}`)
    }
    return false
}
module.exports = konradError