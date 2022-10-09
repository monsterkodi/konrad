// koffee 1.20.0

/*
0000000    000   000  000  000      0000000    
000   000  000   000  000  000      000   000  
0000000    000   000  000  000      000   000  
000   000  000   000  000  000      000   000  
0000000     0000000   000  0000000  0000000
 */
var appDir, args, bindir, childp, config, d, dir, err, exec, exeext, exepth, fs, i, j, karg, kerror, kolor, len, len1, os, pkg, pkgdir, pkgpth, prune, ref, ref1, ref2, ref3, slash;

ref = require('kxk'), args = ref.args, childp = ref.childp, fs = ref.fs, karg = ref.karg, kerror = ref.kerror, kolor = ref.kolor, os = ref.os, slash = ref.slash;

args = karg("\nbuild\n    compile  . ? compile sources        . = true\n    npminst  . ? run npm install        . = false\n    pnpm     . ? run pnpm install       . = true\n    builder  . ? electron-builder       . = true\n    install  . ? move to /Applications  . = true\n    prune    . ? prune package          . = false . -P\n    start    . ? run executable         . = true\n    verbose                             . = true");

config = require('../js/config');

exec = function(msg, cmd, opt) {
    if (opt == null) {
        opt = {
            shell: true,
            encoding: 'utf8'
        };
    }
    if (args.verbose) {
        console.log(kolor.y5(msg));
    }
    return childp.execSync(cmd, opt);
};

try {
    pkgdir = slash.pkg(process.cwd());
    pkgpth = slash.join(pkgdir, 'package.json');
    pkg = require(pkgpth);
    if (slash.win()) {
        bindir = "dist/win-unpacked/";
    } else {
        bindir = "dist/mac-" + (os.arch()) + "/";
    }
    exeext = (function() {
        switch (os.platform()) {
            case 'win32':
                return '.exe';
            case 'darwin':
                return '.app';
            default:
                return '';
        }
    })();
    exepth = slash.resolve(slash.join(bindir, "" + pkg.name + exeext));
    if (args.verbose) {
        console.log(kolor.y3('cwd      '), kolor.w2(slash.tilde(pkgdir)));
    }
    process.chdir(pkgdir);
    if (slash.dirExists(bindir)) {
        try {
            if (os.platform() === 'win32') {
                if (exec('quit', "taskkill /f /im " + (slash.file(exepth)) + " /t")) {
                    childp.execSync('sleep 2');
                }
            } else {
                childp.execSync("killall " + pkg.name);
            }
        } catch (error) {
            err = error;
            kerror("kill failed: " + err);
        }
        if (args.verbose) {
            console.log(kolor.y4('remove   '), kolor.b6(bindir));
        }
        fs.removeSync(bindir);
    }
    if (args.compile) {
        exec('compile', 'node --trace-warnings ' + slash.join(__dirname, 'konrad'));
    }
    if (args.npminst) {
        exec('npminst', 'npm install');
    }
    if (args.pnpm) {
        exec('pnpm -i', 'pnpm install');
    }
    if (args.builder) {
        exec('builder', (slash.resolve('./node_modules/.bin/electron-builder')) + " --dir");
    }
    if (args.install && !slash.win()) {
        console.log(kolor.y5('install'));
        appDir = "/Applications/" + (slash.file(exepth));
        if (slash.dirExists(appDir)) {
            fs.removeSync(appDir);
        }
        fs.moveSync(exepth, appDir);
        fs.removeSync(slash.resolve('dist'));
        exepth = appDir;
        fs.removeSync(slash.join(exepth, 'Contents/Resources/app/node_modules'));
        process.chdir(slash.join(exepth, 'Contents/Resources/app/'));
        childp.execSync('pnpm i');
    }
    if (args.install && slash.win()) {
        console.log(kolor.y5('install'));
        fs.removeSync(slash.join(slash.dir(exepth), 'resources/app/node_modules'));
        process.chdir(slash.join(slash.dir(exepth), 'resources/app/'));
        childp.execSync('pnpm i');
    }
    if (args.prune) {
        if (args.verbose) {
            console.log(kolor.y4('prune'));
        }
        ref1 = ['inno', 'x64'];
        for (i = 0, len = ref1.length; i < len; i++) {
            d = ref1[i];
            dir = slash.join(bindir, 'resources', 'app', d);
            if (slash.dirExists(dir)) {
                if (args.verbose) {
                    console.log(kolor.r5(dir));
                }
                fs.removeSync(dir);
            }
        }
        if (prune = (ref2 = config.obj(pkgpth)) != null ? (ref3 = ref2.build) != null ? ref3.prune : void 0 : void 0) {
            for (j = 0, len1 = prune.length; j < len1; j++) {
                d = prune[j];
                dir = slash.join(bindir, 'resources', 'app', d);
                if (slash.dirExists(dir)) {
                    if (args.verbose) {
                        console.log(kolor.r5(dir));
                    }
                    fs.removeSync(dir);
                } else {
                    console.log('no path to prune', dir);
                }
            }
        }
    }
    if (args.start) {
        if (args.verbose) {
            console.log(kolor.y3('start     '), kolor.w2(slash.tilde(exepth)));
        }
        if (os.platform() === 'win32') {
            childp.spawn(exepth, {
                encoding: 'utf8',
                detached: true
            });
        } else {
            childp.spawn("open", [exepth], {
                encoding: 'utf8',
                shell: true,
                detached: true,
                stdio: 'inherit'
            });
        }
    }
    process.exit(0);
} catch (error) {
    err = error;
    console.error(String(err));
    process.exit(1);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiYnVpbGQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLE1BQXVELE9BQUEsQ0FBUSxLQUFSLENBQXZELEVBQUUsZUFBRixFQUFRLG1CQUFSLEVBQWdCLFdBQWhCLEVBQW9CLGVBQXBCLEVBQTBCLG1CQUExQixFQUFrQyxpQkFBbEMsRUFBeUMsV0FBekMsRUFBNkM7O0FBRTdDLElBQUEsR0FBTyxJQUFBLENBQUssZ2FBQUw7O0FBYVAsTUFBQSxHQUFTLE9BQUEsQ0FBUSxjQUFSOztBQUVULElBQUEsR0FBTyxTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWDs7UUFBVyxNQUFJO1lBQUMsS0FBQSxFQUFNLElBQVA7WUFBWSxRQUFBLEVBQVMsTUFBckI7OztJQUVsQixJQUFHLElBQUksQ0FBQyxPQUFSO1FBQWMsT0FBQSxDQUFPLEdBQVAsQ0FBVyxLQUFLLENBQUMsRUFBTixDQUFTLEdBQVQsQ0FBWCxFQUFkOztXQUNBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCO0FBSEc7O0FBS1A7SUFDSSxNQUFBLEdBQVMsS0FBSyxDQUFDLEdBQU4sQ0FBVSxPQUFPLENBQUMsR0FBUixDQUFBLENBQVY7SUFDVCxNQUFBLEdBQVMsS0FBSyxDQUFDLElBQU4sQ0FBVyxNQUFYLEVBQW1CLGNBQW5CO0lBQ1QsR0FBQSxHQUFTLE9BQUEsQ0FBUSxNQUFSO0lBQ1QsSUFBRyxLQUFLLENBQUMsR0FBTixDQUFBLENBQUg7UUFDSSxNQUFBLEdBQVMscUJBRGI7S0FBQSxNQUFBO1FBR0ksTUFBQSxHQUFTLFdBQUEsR0FBVyxDQUFDLEVBQUUsQ0FBQyxJQUFILENBQUEsQ0FBRCxDQUFYLEdBQXNCLElBSG5DOztJQUtBLE1BQUE7QUFBUyxnQkFBTyxFQUFFLENBQUMsUUFBSCxDQUFBLENBQVA7QUFBQSxpQkFDQSxPQURBO3VCQUNjO0FB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UyxHQUFULENBQVgsRUFBZDs7b0JBQ0EsRUFBRSxDQUFDLFVBQUgsQ0FBYyxHQUFkLEVBRko7aUJBQUEsTUFBQTtvQkFJRyxPQUFBLENBQUMsR0FBRCxDQUFLLGtCQUFMLEVBQXdCLEdBQXhCLEVBSkg7O0FBRkosYUFESjtTQVJKOztJQWdCQSxJQUFHLElBQUksQ0FBQyxLQUFSO1FBQ0ksSUFBRyxJQUFJLENBQUMsT0FBUjtZQUFjLE9BQUEsQ0FBTyxHQUFQLENBQVcsS0FBSyxDQUFDLEVBQU4sQ0FBUyxZQUFULENBQVgsRUFBbUMsS0FBSyxDQUFDLEVBQU4sQ0FBUyxLQUFLLENBQUMsS0FBTixDQUFZLE1BQVosQ0FBVCxDQUFuQyxFQUFkOztRQUNBLElBQUcsRUFBRSxDQUFDLFFBQUgsQ0FBQSxDQUFBLEtBQWlCLE9BQXBCO1lBQ0ksTUFBTSxDQUFDLEtBQVAsQ0FBYSxNQUFiLEVBQXFCO2dCQUFBLFFBQUEsRUFBUyxNQUFUO2dCQUFnQixRQUFBLEVBQVMsSUFBekI7YUFBckIsRUFESjtTQUFBLE1BQUE7WUFHSSxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQWIsRUFBb0IsQ0FBQyxNQUFELENBQXBCLEVBQThCO2dCQUFBLFFBQUEsRUFBUyxNQUFUO2dCQUFnQixLQUFBLEVBQU0sSUFBdEI7Z0JBQTJCLFFBQUEsRUFBUyxJQUFwQztnQkFBeUMsS0FBQSxFQUFNLFNBQS9DO2FBQTlCLEVBSEo7U0FGSjs7SUFNQSxPQUFPLENBQUMsSUFBUixDQUFhLENBQWIsRUF4RUo7Q0FBQSxhQUFBO0lBMEVNO0lBQ0gsT0FBQSxDQUFDLEtBQUQsQ0FBTyxNQUFBLENBQU8sR0FBUCxDQUFQO0lBQ0MsT0FBTyxDQUFDLElBQVIsQ0FBYSxDQUFiLEVBNUVKIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4wMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgICAwMDAwMDAwICAgIFxuMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwICBcbjAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgXG4wMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIFxuMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMCAgICBcbiMjI1xuXG57IGFyZ3MsIGNoaWxkcCwgZnMsIGthcmcsIGtlcnJvciwga29sb3IsIG9zLCBzbGFzaCB9ID0gcmVxdWlyZSAna3hrJ1xuXG5hcmdzID0ga2FyZyBcIlwiXCJcblxuYnVpbGRcbiAgICBjb21waWxlICAuID8gY29tcGlsZSBzb3VyY2VzICAgICAgICAuID0gdHJ1ZVxuICAgIG5wbWluc3QgIC4gPyBydW4gbnBtIGluc3RhbGwgICAgICAgIC4gPSBmYWxzZVxuICAgIHBucG0gICAgIC4gPyBydW4gcG5wbSBpbnN0YWxsICAgICAgIC4gPSB0cnVlXG4gICAgYnVpbGRlciAgLiA/IGVsZWN0cm9uLWJ1aWxkZXIgICAgICAgLiA9IHRydWVcbiAgICBpbnN0YWxsICAuID8gbW92ZSB0byAvQXBwbGljYXRpb25zICAuID0gdHJ1ZVxuICAgIHBydW5lICAgIC4gPyBwcnVuZSBwYWNrYWdlICAgICAgICAgIC4gPSBmYWxzZSAuIC1QXG4gICAgc3RhcnQgICAgLiA/IHJ1biBleGVjdXRhYmxlICAgICAgICAgLiA9IHRydWVcbiAgICB2ZXJib3NlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuID0gdHJ1ZVxuXCJcIlwiXG5cbmNvbmZpZyA9IHJlcXVpcmUgJy4uL2pzL2NvbmZpZydcblxuZXhlYyA9IChtc2csIGNtZCwgb3B0PXtzaGVsbDp0cnVlIGVuY29kaW5nOid1dGY4J30pIC0+XG4gICAgXG4gICAgaWYgYXJncy52ZXJib3NlIHRoZW4gbG9nIGtvbG9yLnk1IG1zZ1xuICAgIGNoaWxkcC5leGVjU3luYyBjbWQsIG9wdFxuXG50cnkgICAgXG4gICAgcGtnZGlyID0gc2xhc2gucGtnIHByb2Nlc3MuY3dkKClcbiAgICBwa2dwdGggPSBzbGFzaC5qb2luIHBrZ2RpciwgJ3BhY2thZ2UuanNvbidcbiAgICBwa2cgICAgPSByZXF1aXJlIHBrZ3B0aFxuICAgIGlmIHNsYXNoLndpbigpXG4gICAgICAgIGJpbmRpciA9IFwiZGlzdC93aW4tdW5wYWNrZWQvXCJcbiAgICBlbHNlXG4gICAgICAgIGJpbmRpciA9IFwiZGlzdC9tYWMtI3tvcy5hcmNoKCl9L1wiXG4gICAgXG4gICAgZXhlZXh0ID0gc3dpdGNoIG9zLnBsYXRmb3JtKClcbiAgICAgICAgd2hlbiAnd2luMzInICB0aGVuICcuZXhlJ1xuICAgICAgICB3aGVuICdkYXJ3aW4nIHRoZW4gJy5hcHAnXG4gICAgICAgIGVsc2UgJycgIyBsaW51eD9cbiAgICBleGVwdGggPSBzbGFzaC5yZXNvbHZlIHNsYXNoLmpvaW4gYmluZGlyLCBcIiN7cGtnLm5hbWV9I3tleGVleHR9XCJcbiAgICBcbiAgICBpZiBhcmdzLnZlcmJvc2UgdGhlbiBsb2cga29sb3IueTMoJ2N3ZCAgICAgICcpLCBrb2xvci53MiBzbGFzaC50aWxkZSBwa2dkaXJcbiAgICBwcm9jZXNzLmNoZGlyIHBrZ2RpclxuXG4gICAgaWYgc2xhc2guZGlyRXhpc3RzIGJpbmRpclxuICAgICAgICB0cnlcbiAgICAgICAgICAgIGlmIG9zLnBsYXRmb3JtKCkgPT0gJ3dpbjMyJ1xuICAgICAgICAgICAgICAgIGlmIGV4ZWMgJ3F1aXQnIFwidGFza2tpbGwgL2YgL2ltICN7c2xhc2guZmlsZSBleGVwdGh9IC90XCJcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZHAuZXhlY1N5bmMgJ3NsZWVwIDInXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY2hpbGRwLmV4ZWNTeW5jIFwia2lsbGFsbCAje3BrZy5uYW1lfVwiXG4gICAgICAgIGNhdGNoIGVyclxuICAgICAgICAgICAga2Vycm9yIFwia2lsbCBmYWlsZWQ6ICN7ZXJyfVwiXG4gICAgICAgIGlmIGFyZ3MudmVyYm9zZSB0aGVuIGxvZyBrb2xvci55NCgncmVtb3ZlICAgJyksIGtvbG9yLmI2IGJpbmRpclxuICAgICAgICBmcy5yZW1vdmVTeW5jIGJpbmRpclxuICAgIFxuICAgIGlmIGFyZ3MuY29tcGlsZSB0aGVuIGV4ZWMgJ2NvbXBpbGUnICdub2RlIC0tdHJhY2Utd2FybmluZ3MgJyArIHNsYXNoLmpvaW4gX19kaXJuYW1lLCAna29ucmFkJ1xuICAgIGlmIGFyZ3MubnBtaW5zdCB0aGVuIGV4ZWMgJ25wbWluc3QnICducG0gaW5zdGFsbCdcbiAgICBpZiBhcmdzLnBucG0gICAgdGhlbiBleGVjICdwbnBtIC1pJyAncG5wbSBpbnN0YWxsJ1xuICAgIGlmIGFyZ3MuYnVpbGRlciB0aGVuIGV4ZWMgJ2J1aWxkZXInIFwiI3tzbGFzaC5yZXNvbHZlKCcuL25vZGVfbW9kdWxlcy8uYmluL2VsZWN0cm9uLWJ1aWxkZXInKX0gLS1kaXJcIlxuICAgIGlmIGFyZ3MuaW5zdGFsbCBhbmQgbm90IHNsYXNoLndpbigpXG4gICAgICAgIGxvZyBrb2xvci55NSAnaW5zdGFsbCdcbiAgICAgICAgYXBwRGlyID0gXCIvQXBwbGljYXRpb25zLyN7c2xhc2guZmlsZSBleGVwdGh9XCJcbiAgICAgICAgaWYgc2xhc2guZGlyRXhpc3RzIGFwcERpclxuICAgICAgICAgICAgZnMucmVtb3ZlU3luYyBhcHBEaXJcbiAgICAgICAgZnMubW92ZVN5bmMgZXhlcHRoLCBhcHBEaXJcbiAgICAgICAgZnMucmVtb3ZlU3luYyBzbGFzaC5yZXNvbHZlICdkaXN0J1xuICAgICAgICBleGVwdGggPSBhcHBEaXJcbiAgICAgICAgZnMucmVtb3ZlU3luYyBzbGFzaC5qb2luIGV4ZXB0aCwgJ0NvbnRlbnRzL1Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzJ1xuICAgICAgICBwcm9jZXNzLmNoZGlyIHNsYXNoLmpvaW4gZXhlcHRoLCAnQ29udGVudHMvUmVzb3VyY2VzL2FwcC8nXG4gICAgICAgIGNoaWxkcC5leGVjU3luYyAncG5wbSBpJ1xuICAgIGlmIGFyZ3MuaW5zdGFsbCBhbmQgc2xhc2gud2luKClcbiAgICAgICAgbG9nIGtvbG9yLnk1ICdpbnN0YWxsJ1xuICAgICAgICBmcy5yZW1vdmVTeW5jIHNsYXNoLmpvaW4gc2xhc2guZGlyKGV4ZXB0aCksICdyZXNvdXJjZXMvYXBwL25vZGVfbW9kdWxlcydcbiAgICAgICAgcHJvY2Vzcy5jaGRpciBzbGFzaC5qb2luIHNsYXNoLmRpcihleGVwdGgpLCAncmVzb3VyY2VzL2FwcC8nXG4gICAgICAgIGNoaWxkcC5leGVjU3luYyAncG5wbSBpJ1xuICAgIGlmIGFyZ3MucHJ1bmVcbiAgICAgICAgaWYgYXJncy52ZXJib3NlIHRoZW4gbG9nIGtvbG9yLnk0KCdwcnVuZScpXG4gICAgICAgIGZvciBkIGluIFsnaW5ubycgJ3g2NCddXG4gICAgICAgICAgICBkaXIgPSBzbGFzaC5qb2luIGJpbmRpciwgJ3Jlc291cmNlcycgJ2FwcCcgZCAjIG5lZWRzIHRvIGNoYW5nZSBvbiBtYWNcbiAgICAgICAgICAgIGlmIHNsYXNoLmRpckV4aXN0cyBkaXJcbiAgICAgICAgICAgICAgICBpZiBhcmdzLnZlcmJvc2UgdGhlbiBsb2cga29sb3IucjUgZGlyXG4gICAgICAgICAgICAgICAgZnMucmVtb3ZlU3luYyBkaXJcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIHBydW5lID0gY29uZmlnLm9iaihwa2dwdGgpPy5idWlsZD8ucHJ1bmVcbiAgICAgICAgICAgIGZvciBkIGluIHBydW5lICAgICAgICBcbiAgICAgICAgICAgICAgICBkaXIgPSBzbGFzaC5qb2luIGJpbmRpciwgJ3Jlc291cmNlcycgJ2FwcCcgZCAjIG5lZWRzIHRvIGNoYW5nZSBvbiBtYWNcbiAgICAgICAgICAgICAgICBpZiBzbGFzaC5kaXJFeGlzdHMgZGlyXG4gICAgICAgICAgICAgICAgICAgIGlmIGFyZ3MudmVyYm9zZSB0aGVuIGxvZyBrb2xvci5yNSBkaXJcbiAgICAgICAgICAgICAgICAgICAgZnMucmVtb3ZlU3luYyBkaXJcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGxvZyAnbm8gcGF0aCB0byBwcnVuZScgZGlyXG4gICAgaWYgYXJncy5zdGFydFxuICAgICAgICBpZiBhcmdzLnZlcmJvc2UgdGhlbiBsb2cga29sb3IueTMoJ3N0YXJ0ICAgICAnKSwga29sb3IudzIgc2xhc2gudGlsZGUgZXhlcHRoXG4gICAgICAgIGlmIG9zLnBsYXRmb3JtKCkgPT0gJ3dpbjMyJ1xuICAgICAgICAgICAgY2hpbGRwLnNwYXduIGV4ZXB0aCwgZW5jb2Rpbmc6J3V0ZjgnIGRldGFjaGVkOnRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY2hpbGRwLnNwYXduIFwib3BlblwiIFtleGVwdGhdLCBlbmNvZGluZzondXRmOCcgc2hlbGw6dHJ1ZSBkZXRhY2hlZDp0cnVlIHN0ZGlvOidpbmhlcml0J1xuICAgIHByb2Nlc3MuZXhpdCAwXG4gICAgICAgIFxuY2F0Y2ggZXJyXG4gICAgZXJyb3IgU3RyaW5nIGVyclxuICAgIHByb2Nlc3MuZXhpdCAxXG4gICAgICAgICJdfQ==
//# sourceURL=build.coffee