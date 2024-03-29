// monsterkodi/kode 0.257.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var args, childp, kolor, konradError, pretty, runcmd, slash

args = require('kxk').args
childp = require('kxk').childp
kolor = require('kxk').kolor
slash = require('kxk').slash

pretty = require('./pretty')
konradError = require('./error')

runcmd = function (cmd, cmdargs, cwd)
{
    var cmdpath, command, pkg, result, _22_35_

    try
    {
        if (cmd === 'test')
        {
            if (!_k_.empty((cmdargs)) && 0 < cmdargs.indexOf('.coffee'))
            {
                cmdpath = 'mocha -c --require koffee/js/register '
            }
            else
            {
                pkg = require(slash.join(cwd,'package.json'))
                if (!(pkg != null ? (_22_35_=pkg.scripts) != null ? _22_35_.test : undefined : undefined))
                {
                    console.log('no test script')
                    return true
                }
                else
                {
                    cmdpath = 'npm run test'
                }
            }
        }
        else
        {
            cmdpath = slash.resolve(slash.join(__dirname,'..','bin',cmd))
        }
        if (slash.win())
        {
            command = `bash ${cmdpath} ${cmdargs}`
        }
        else
        {
            command = `${cmdpath} ${cmdargs}`
        }
        if (args.verbose)
        {
            console.log(" 🔧 ",kolor.gray(cmd),pretty.filePath(command))
        }
        result = childp.execSync(command,{cwd:cwd,encoding:'utf8',stdio:'inherit',shell:true})
    }
    catch (err)
    {
        konradError("command error",`command '${cmd}' (${command}) ${'failed!'}`,err)
        return false
    }
    return true
}
module.exports = runcmd