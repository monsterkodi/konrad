// koffee 1.3.0

/*
00000000   000   000  000   000   0000000  00     00  0000000  
000   000  000   000  0000  000  000       000   000  000   000
0000000    000   000  000 0 000  000       000000000  000   000
000   000  000   000  000  0000  000       000 0 000  000   000
000   000   0000000   000   000   0000000  000   000  0000000
 */

(function() {
    var _, args, childp, klog, konradError, os, pretty, ref, runcmd, slash;

    ref = require('kxk'), args = ref.args, slash = ref.slash, childp = ref.childp, os = ref.os, klog = ref.klog, _ = ref._;

    pretty = require('./pretty');

    konradError = require('./error');

    runcmd = function(cmd, cmdargs, cwd) {
        var cmdpath, command, commandargs, err;
        try {
            cmdpath = slash.resolve(slash.join(__dirname, '..', 'bin', cmd));
            if (slash.win()) {
                command = "bash " + cmdpath + " " + cmdargs;
            } else {
                command = cmdpath + " " + cmdargs;
            }
            if (args.verbose) {
                klog("🔧 ", cmd.gray.reset, pretty.filePath(cmdpath), cmdargs.green);
            }
            commandargs = '';
            if (process.argv.length > 3 && cmd === 'make') {
                commandargs = ' ' + process.argv.slice(3).join(' ');
                klog("make command", process.argv, command + commandargs);
            }
            childp.execSync(command + commandargs, {
                cwd: cwd,
                encoding: 'utf8',
                stdio: 'inherit',
                shell: true
            });
        } catch (error) {
            err = error;
            konradError("command error", "command '" + cmd + "' (" + command + ") " + 'failed!', err);
            return false;
        }
        return true;
    };

    module.exports = runcmd;

}).call(this);
