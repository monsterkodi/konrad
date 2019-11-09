// koffee 1.4.0

/*
00000000   000   000  000   000   0000000  00     00  0000000  
000   000  000   000  0000  000  000       000   000  000   000
0000000    000   000  000 0 000  000       000000000  000   000
000   000  000   000  000  0000  000       000 0 000  000   000
000   000   0000000   000   000   0000000  000   000  0000000
 */
var args, childp, klog, konradError, pretty, ref, runcmd, slash;

ref = require('kxk'), childp = ref.childp, slash = ref.slash, args = ref.args, klog = ref.klog;

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuY21kLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRQSxNQUFnQyxPQUFBLENBQVEsS0FBUixDQUFoQyxFQUFFLG1CQUFGLEVBQVUsaUJBQVYsRUFBaUIsZUFBakIsRUFBdUI7O0FBRXZCLE1BQUEsR0FBYyxPQUFBLENBQVEsVUFBUjs7QUFDZCxXQUFBLEdBQWMsT0FBQSxDQUFRLFNBQVI7O0FBRWQsTUFBQSxHQUFTLFNBQUMsR0FBRCxFQUFNLE9BQU4sRUFBZSxHQUFmO0FBRUwsUUFBQTtBQUFBO1FBQ0ksT0FBQSxHQUFVLEtBQUssQ0FBQyxPQUFOLENBQWMsS0FBSyxDQUFDLElBQU4sQ0FBVyxTQUFYLEVBQXNCLElBQXRCLEVBQTJCLEtBQTNCLEVBQWlDLEdBQWpDLENBQWQ7UUFFVixJQUFHLEtBQUssQ0FBQyxHQUFOLENBQUEsQ0FBSDtZQUNJLE9BQUEsR0FBVSxPQUFBLEdBQVEsT0FBUixHQUFnQixHQUFoQixHQUFtQixRQURqQztTQUFBLE1BQUE7WUFHSSxPQUFBLEdBQWEsT0FBRCxHQUFTLEdBQVQsR0FBWSxRQUg1Qjs7UUFLQSxJQUFHLElBQUksQ0FBQyxPQUFSO1lBQ0ksSUFBQSxDQUFLLEtBQUwsRUFBVyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQXBCLEVBQTJCLE1BQU0sQ0FBQyxRQUFQLENBQWdCLE9BQWhCLENBQTNCLEVBQXFELE9BQU8sQ0FBQyxLQUE3RCxFQURKOztRQUdBLFdBQUEsR0FBYztRQUNkLElBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFiLEdBQXNCLENBQXRCLElBQTRCLEdBQUEsS0FBTyxNQUF0QztZQUNJLFdBQUEsR0FBYyxHQUFBLEdBQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFiLENBQW1CLENBQW5CLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsR0FBM0I7WUFDcEIsSUFBQSxDQUFLLGNBQUwsRUFBb0IsT0FBTyxDQUFDLElBQTVCLEVBQWtDLE9BQUEsR0FBVSxXQUE1QyxFQUZKOztRQUlBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLE9BQUEsR0FBVSxXQUExQixFQUNJO1lBQUEsR0FBQSxFQUFVLEdBQVY7WUFDQSxRQUFBLEVBQVUsTUFEVjtZQUVBLEtBQUEsRUFBVSxTQUZWO1lBR0EsS0FBQSxFQUFVLElBSFY7U0FESixFQWhCSjtLQUFBLGFBQUE7UUFzQk07UUFDRixXQUFBLENBQVksZUFBWixFQUE0QixXQUFBLEdBQVksR0FBWixHQUFnQixLQUFoQixHQUFxQixPQUFyQixHQUE2QixJQUE3QixHQUFpQyxTQUE3RCxFQUF5RSxHQUF6RTtBQUNBLGVBQU8sTUF4Qlg7O1dBeUJBO0FBM0JLOztBQTZCVCxNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgIDAwICAgICAwMCAgMDAwMDAwMCAgXG4wMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcbjAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgICAgICAwMDAwMDAwMDAgIDAwMCAgIDAwMFxuMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgICAgIDAwMCAwIDAwMCAgMDAwICAgMDAwXG4wMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICBcbiMjI1xuXG57IGNoaWxkcCwgc2xhc2gsIGFyZ3MsIGtsb2cgfSA9IHJlcXVpcmUgJ2t4aydcblxucHJldHR5ICAgICAgPSByZXF1aXJlICcuL3ByZXR0eSdcbmtvbnJhZEVycm9yID0gcmVxdWlyZSAnLi9lcnJvcidcblxucnVuY21kID0gKGNtZCwgY21kYXJncywgY3dkKSAtPlxuICAgIFxuICAgIHRyeVxuICAgICAgICBjbWRwYXRoID0gc2xhc2gucmVzb2x2ZSBzbGFzaC5qb2luIF9fZGlybmFtZSwgJy4uJyAnYmluJyBjbWRcbiAgICAgICAgXG4gICAgICAgIGlmIHNsYXNoLndpbigpXG4gICAgICAgICAgICBjb21tYW5kID0gXCJiYXNoICN7Y21kcGF0aH0gI3tjbWRhcmdzfVwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNvbW1hbmQgPSBcIiN7Y21kcGF0aH0gI3tjbWRhcmdzfVwiXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgYXJncy52ZXJib3NlXG4gICAgICAgICAgICBrbG9nIFwi8J+UpyBcIiBjbWQuZ3JheS5yZXNldCwgcHJldHR5LmZpbGVQYXRoKGNtZHBhdGgpLCBjbWRhcmdzLmdyZWVuXG5cbiAgICAgICAgY29tbWFuZGFyZ3MgPSAnJ1xuICAgICAgICBpZiBwcm9jZXNzLmFyZ3YubGVuZ3RoID4gMyBhbmQgY21kID09ICdtYWtlJ1xuICAgICAgICAgICAgY29tbWFuZGFyZ3MgPSAnICcgKyBwcm9jZXNzLmFyZ3Yuc2xpY2UoMykuam9pbiAnICdcbiAgICAgICAgICAgIGtsb2cgXCJtYWtlIGNvbW1hbmRcIiBwcm9jZXNzLmFyZ3YsIGNvbW1hbmQgKyBjb21tYW5kYXJnc1xuICAgICAgICAgICAgXG4gICAgICAgIGNoaWxkcC5leGVjU3luYyBjb21tYW5kICsgY29tbWFuZGFyZ3MsXG4gICAgICAgICAgICBjd2Q6wqAgICAgIGN3ZFxuICAgICAgICAgICAgZW5jb2Rpbmc6wqAndXRmOCdcbiAgICAgICAgICAgIHN0ZGlvOsKgICAgJ2luaGVyaXQnXG4gICAgICAgICAgICBzaGVsbDogICAgdHJ1ZVxuICAgICAgICAgIFxuICAgIGNhdGNoIGVyclxuICAgICAgICBrb25yYWRFcnJvciBcImNvbW1hbmQgZXJyb3JcIiBcImNvbW1hbmQgJyN7Y21kfScgKCN7Y29tbWFuZH0pICN7J2ZhaWxlZCEnfVwiIGVyclxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gcnVuY21kXG4iXX0=
//# sourceURL=../coffee/runcmd.coffee