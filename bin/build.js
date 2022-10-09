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
        exec('builder', (slash.resolve('./node_modules/.bin/electron-builder')) + " --dir --config.asar=false");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiYnVpbGQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLE1BQXVELE9BQUEsQ0FBUSxLQUFSLENBQXZELEVBQUUsZUFBRixFQUFRLG1CQUFSLEVBQWdCLFdBQWhCLEVBQW9CLGVBQXBCLEVBQTBCLG1CQUExQixFQUFrQyxpQkFBbEMsRUFBeUMsV0FBekMsRUFBNkM7O0FBRTdDLElBQUEsR0FBTyxJQUFBLENBQUssZ2FBQUw7O0FBYVAsTUFBQSxHQUFTLE9BQUEsQ0FBUSxjQUFSOztBQUVULElBQUEsR0FBTyxTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWDs7UUFBVyxNQUFJO1lBQUMsS0FBQSxFQUFNLElBQVA7WUFBWSxRQUFBLEVBQVMsTUFBckI7OztJQUVsQixJQUFHLElBQUksQ0FBQyxPQUFSO1FBQWMsT0FBQSxDQUFPLEdBQVAsQ0FBVyxLQUFLLENBQUMsRUFBTixDQUFTLEdBQVQsQ0FBWCxFQUFkOztXQUNBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCO0FBSEc7O0FBS1A7SUFDSSxNQUFBLEdBQVMsS0FBSyxDQUFDLEdBQU4sQ0FBVSxPQUFPLENBQUMsR0FBUixDQUFBLENBQVY7SUFDVCxNQUFBLEdBQVMsS0FBSyxDQUFDLElBQU4sQ0FBVyxNQUFYLEVBQW1CLGNBQW5CO0lBQ1QsR0FBQSxHQUFTLE9BQUEsQ0FBUSxNQUFSO0lBQ1QsSUFBRyxLQUFLLENBQUMsR0FBTixDQUFBLENBQUg7UUFDSSxNQUFBLEdBQVMscUJBRGI7S0FBQSxNQUFBO1FBR0ksTUFBQSxHQUFTLFdBQUEsR0FBVyxDQUFDLEVBQUUsQ0FBQyxJQUFILENBQUEsQ0FBRCxDQUFYLEdBQXNCLElBSG5DOztJQUtBLE1BQUE7QUFBUyxnQkFBTyxFQUFFLENBQUMsUUFBSCxDQUFBLENBQVA7QUFBQSxpQkFDQSxPQURBO3VCQUNjO0FB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QVMsR0FBVCxDQUFYLEVBQWQ7O29CQUNBLEVBQUUsQ0FBQyxVQUFILENBQWMsR0FBZCxFQUZKO2lCQUFBLE1BQUE7b0JBSUcsT0FBQSxDQUFDLEdBQUQsQ0FBSyxrQkFBTCxFQUF3QixHQUF4QixFQUpIOztBQUZKLGFBREo7U0FSSjs7SUFnQkEsSUFBRyxJQUFJLENBQUMsS0FBUjtRQUNJLElBQUcsSUFBSSxDQUFDLE9BQVI7WUFBYyxPQUFBLENBQU8sR0FBUCxDQUFXLEtBQUssQ0FBQyxFQUFOLENBQVMsWUFBVCxDQUFYLEVBQW1DLEtBQUssQ0FBQyxFQUFOLENBQVMsS0FBSyxDQUFDLEtBQU4sQ0FBWSxNQUFaLENBQVQsQ0FBbkMsRUFBZDs7UUFDQSxJQUFHLEVBQUUsQ0FBQyxRQUFILENBQUEsQ0FBQSxLQUFpQixPQUFwQjtZQUNJLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBYixFQUFxQjtnQkFBQSxRQUFBLEVBQVMsTUFBVDtnQkFBZ0IsUUFBQSxFQUFTLElBQXpCO2FBQXJCLEVBREo7U0FBQSxNQUFBO1lBR0ksTUFBTSxDQUFDLEtBQVAsQ0FBYSxNQUFiLEVBQW9CLENBQUMsTUFBRCxDQUFwQixFQUE4QjtnQkFBQSxRQUFBLEVBQVMsTUFBVDtnQkFBZ0IsS0FBQSxFQUFNLElBQXRCO2dCQUEyQixRQUFBLEVBQVMsSUFBcEM7Z0JBQXlDLEtBQUEsRUFBTSxTQUEvQzthQUE5QixFQUhKO1NBRko7O0lBTUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxDQUFiLEVBeEVKO0NBQUEsYUFBQTtJQTBFTTtJQUNILE9BQUEsQ0FBQyxLQUFELENBQU8sTUFBQSxDQUFPLEdBQVAsQ0FBUDtJQUNDLE9BQU8sQ0FBQyxJQUFSLENBQWEsQ0FBYixFQTVFSiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwMDAwMCAgICAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgMDAwMDAwMCAgICBcbjAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgXG4wMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIFxuMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwICBcbjAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgICAgXG4jIyNcblxueyBhcmdzLCBjaGlsZHAsIGZzLCBrYXJnLCBrZXJyb3IsIGtvbG9yLCBvcywgc2xhc2ggfSA9IHJlcXVpcmUgJ2t4aydcblxuYXJncyA9IGthcmcgXCJcIlwiXG5cbmJ1aWxkXG4gICAgY29tcGlsZSAgLiA/IGNvbXBpbGUgc291cmNlcyAgICAgICAgLiA9IHRydWVcbiAgICBucG1pbnN0ICAuID8gcnVuIG5wbSBpbnN0YWxsICAgICAgICAuID0gZmFsc2VcbiAgICBwbnBtICAgICAuID8gcnVuIHBucG0gaW5zdGFsbCAgICAgICAuID0gdHJ1ZVxuICAgIGJ1aWxkZXIgIC4gPyBlbGVjdHJvbi1idWlsZGVyICAgICAgIC4gPSB0cnVlXG4gICAgaW5zdGFsbCAgLiA/IG1vdmUgdG8gL0FwcGxpY2F0aW9ucyAgLiA9IHRydWVcbiAgICBwcnVuZSAgICAuID8gcHJ1bmUgcGFja2FnZSAgICAgICAgICAuID0gZmFsc2UgLiAtUFxuICAgIHN0YXJ0ICAgIC4gPyBydW4gZXhlY3V0YWJsZSAgICAgICAgIC4gPSB0cnVlXG4gICAgdmVyYm9zZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLiA9IHRydWVcblwiXCJcIlxuXG5jb25maWcgPSByZXF1aXJlICcuLi9qcy9jb25maWcnXG5cbmV4ZWMgPSAobXNnLCBjbWQsIG9wdD17c2hlbGw6dHJ1ZSBlbmNvZGluZzondXRmOCd9KSAtPlxuICAgIFxuICAgIGlmIGFyZ3MudmVyYm9zZSB0aGVuIGxvZyBrb2xvci55NSBtc2dcbiAgICBjaGlsZHAuZXhlY1N5bmMgY21kLCBvcHRcblxudHJ5ICAgIFxuICAgIHBrZ2RpciA9IHNsYXNoLnBrZyBwcm9jZXNzLmN3ZCgpXG4gICAgcGtncHRoID0gc2xhc2guam9pbiBwa2dkaXIsICdwYWNrYWdlLmpzb24nXG4gICAgcGtnICAgID0gcmVxdWlyZSBwa2dwdGhcbiAgICBpZiBzbGFzaC53aW4oKVxuICAgICAgICBiaW5kaXIgPSBcImRpc3Qvd2luLXVucGFja2VkL1wiXG4gICAgZWxzZVxuICAgICAgICBiaW5kaXIgPSBcImRpc3QvbWFjLSN7b3MuYXJjaCgpfS9cIlxuICAgIFxuICAgIGV4ZWV4dCA9IHN3aXRjaCBvcy5wbGF0Zm9ybSgpXG4gICAgICAgIHdoZW4gJ3dpbjMyJyAgdGhlbiAnLmV4ZSdcbiAgICAgICAgd2hlbiAnZGFyd2luJyB0aGVuICcuYXBwJ1xuICAgICAgICBlbHNlICcnICMgbGludXg/XG4gICAgZXhlcHRoID0gc2xhc2gucmVzb2x2ZSBzbGFzaC5qb2luIGJpbmRpciwgXCIje3BrZy5uYW1lfSN7ZXhlZXh0fVwiXG4gICAgXG4gICAgaWYgYXJncy52ZXJib3NlIHRoZW4gbG9nIGtvbG9yLnkzKCdjd2QgICAgICAnKSwga29sb3IudzIgc2xhc2gudGlsZGUgcGtnZGlyXG4gICAgcHJvY2Vzcy5jaGRpciBwa2dkaXJcblxuICAgIGlmIHNsYXNoLmRpckV4aXN0cyBiaW5kaXJcbiAgICAgICAgdHJ5XG4gICAgICAgICAgICBpZiBvcy5wbGF0Zm9ybSgpID09ICd3aW4zMidcbiAgICAgICAgICAgICAgICBpZiBleGVjICdxdWl0JyBcInRhc2traWxsIC9mIC9pbSAje3NsYXNoLmZpbGUgZXhlcHRofSAvdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRwLmV4ZWNTeW5jICdzbGVlcCAyJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNoaWxkcC5leGVjU3luYyBcImtpbGxhbGwgI3twa2cubmFtZX1cIlxuICAgICAgICBjYXRjaCBlcnJcbiAgICAgICAgICAgIGtlcnJvciBcImtpbGwgZmFpbGVkOiAje2Vycn1cIlxuICAgICAgICBpZiBhcmdzLnZlcmJvc2UgdGhlbiBsb2cga29sb3IueTQoJ3JlbW92ZSAgICcpLCBrb2xvci5iNiBiaW5kaXJcbiAgICAgICAgZnMucmVtb3ZlU3luYyBiaW5kaXJcbiAgICBcbiAgICBpZiBhcmdzLmNvbXBpbGUgdGhlbiBleGVjICdjb21waWxlJyAnbm9kZSAtLXRyYWNlLXdhcm5pbmdzICcgKyBzbGFzaC5qb2luIF9fZGlybmFtZSwgJ2tvbnJhZCdcbiAgICBpZiBhcmdzLm5wbWluc3QgdGhlbiBleGVjICducG1pbnN0JyAnbnBtIGluc3RhbGwnXG4gICAgaWYgYXJncy5wbnBtICAgIHRoZW4gZXhlYyAncG5wbSAtaScgJ3BucG0gaW5zdGFsbCdcbiAgICBpZiBhcmdzLmJ1aWxkZXIgdGhlbiBleGVjICdidWlsZGVyJyBcIiN7c2xhc2gucmVzb2x2ZSgnLi9ub2RlX21vZHVsZXMvLmJpbi9lbGVjdHJvbi1idWlsZGVyJyl9IC0tZGlyIC0tY29uZmlnLmFzYXI9ZmFsc2VcIlxuICAgIGlmIGFyZ3MuaW5zdGFsbCBhbmQgbm90IHNsYXNoLndpbigpXG4gICAgICAgIGxvZyBrb2xvci55NSAnaW5zdGFsbCdcbiAgICAgICAgYXBwRGlyID0gXCIvQXBwbGljYXRpb25zLyN7c2xhc2guZmlsZSBleGVwdGh9XCJcbiAgICAgICAgaWYgc2xhc2guZGlyRXhpc3RzIGFwcERpclxuICAgICAgICAgICAgZnMucmVtb3ZlU3luYyBhcHBEaXJcbiAgICAgICAgZnMubW92ZVN5bmMgZXhlcHRoLCBhcHBEaXJcbiAgICAgICAgZnMucmVtb3ZlU3luYyBzbGFzaC5yZXNvbHZlICdkaXN0J1xuICAgICAgICBleGVwdGggPSBhcHBEaXJcbiAgICAgICAgZnMucmVtb3ZlU3luYyBzbGFzaC5qb2luIGV4ZXB0aCwgJ0NvbnRlbnRzL1Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzJ1xuICAgICAgICBwcm9jZXNzLmNoZGlyIHNsYXNoLmpvaW4gZXhlcHRoLCAnQ29udGVudHMvUmVzb3VyY2VzL2FwcC8nXG4gICAgICAgIGNoaWxkcC5leGVjU3luYyAncG5wbSBpJ1xuICAgIGlmIGFyZ3MuaW5zdGFsbCBhbmQgc2xhc2gud2luKClcbiAgICAgICAgbG9nIGtvbG9yLnk1ICdpbnN0YWxsJ1xuICAgICAgICBmcy5yZW1vdmVTeW5jIHNsYXNoLmpvaW4gc2xhc2guZGlyKGV4ZXB0aCksICdyZXNvdXJjZXMvYXBwL25vZGVfbW9kdWxlcydcbiAgICAgICAgcHJvY2Vzcy5jaGRpciBzbGFzaC5qb2luIHNsYXNoLmRpcihleGVwdGgpLCAncmVzb3VyY2VzL2FwcC8nXG4gICAgICAgIGNoaWxkcC5leGVjU3luYyAncG5wbSBpJ1xuICAgIGlmIGFyZ3MucHJ1bmVcbiAgICAgICAgaWYgYXJncy52ZXJib3NlIHRoZW4gbG9nIGtvbG9yLnk0KCdwcnVuZScpXG4gICAgICAgIGZvciBkIGluIFsnaW5ubycgJ3g2NCddXG4gICAgICAgICAgICBkaXIgPSBzbGFzaC5qb2luIGJpbmRpciwgJ3Jlc291cmNlcycgJ2FwcCcgZCAjIG5lZWRzIHRvIGNoYW5nZSBvbiBtYWNcbiAgICAgICAgICAgIGlmIHNsYXNoLmRpckV4aXN0cyBkaXJcbiAgICAgICAgICAgICAgICBpZiBhcmdzLnZlcmJvc2UgdGhlbiBsb2cga29sb3IucjUgZGlyXG4gICAgICAgICAgICAgICAgZnMucmVtb3ZlU3luYyBkaXJcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIHBydW5lID0gY29uZmlnLm9iaihwa2dwdGgpPy5idWlsZD8ucHJ1bmVcbiAgICAgICAgICAgIGZvciBkIGluIHBydW5lICAgICAgICBcbiAgICAgICAgICAgICAgICBkaXIgPSBzbGFzaC5qb2luIGJpbmRpciwgJ3Jlc291cmNlcycgJ2FwcCcgZCAjIG5lZWRzIHRvIGNoYW5nZSBvbiBtYWNcbiAgICAgICAgICAgICAgICBpZiBzbGFzaC5kaXJFeGlzdHMgZGlyXG4gICAgICAgICAgICAgICAgICAgIGlmIGFyZ3MudmVyYm9zZSB0aGVuIGxvZyBrb2xvci5yNSBkaXJcbiAgICAgICAgICAgICAgICAgICAgZnMucmVtb3ZlU3luYyBkaXJcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGxvZyAnbm8gcGF0aCB0byBwcnVuZScgZGlyXG4gICAgaWYgYXJncy5zdGFydFxuICAgICAgICBpZiBhcmdzLnZlcmJvc2UgdGhlbiBsb2cga29sb3IueTMoJ3N0YXJ0ICAgICAnKSwga29sb3IudzIgc2xhc2gudGlsZGUgZXhlcHRoXG4gICAgICAgIGlmIG9zLnBsYXRmb3JtKCkgPT0gJ3dpbjMyJ1xuICAgICAgICAgICAgY2hpbGRwLnNwYXduIGV4ZXB0aCwgZW5jb2Rpbmc6J3V0ZjgnIGRldGFjaGVkOnRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY2hpbGRwLnNwYXduIFwib3BlblwiIFtleGVwdGhdLCBlbmNvZGluZzondXRmOCcgc2hlbGw6dHJ1ZSBkZXRhY2hlZDp0cnVlIHN0ZGlvOidpbmhlcml0J1xuICAgIHByb2Nlc3MuZXhpdCAwXG4gICAgICAgIFxuY2F0Y2ggZXJyXG4gICAgZXJyb3IgU3RyaW5nIGVyclxuICAgIHByb2Nlc3MuZXhpdCAxXG4gICAgICAgICJdfQ==
//# sourceURL=build.coffee