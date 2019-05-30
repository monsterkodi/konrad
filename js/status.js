// koffee 0.56.0

/*
 0000000  000000000   0000000   000000000  000   000   0000000
000          000     000   000     000     000   000  000     
0000000      000     000000000     000     000   000  0000000 
     000     000     000   000     000     000   000       000
0000000      000     000   000     000      0000000   0000000
 */

(function() {
    var _, argDir, args, childp, colors, doFetch, doStatus, gitStatus, kerror, klog, klor, pretty, ref, render, slash, valid,
        indexOf = [].indexOf;

    ref = require('kxk'), colors = ref.colors, childp = ref.childp, slash = ref.slash, valid = ref.valid, args = ref.args, kerror = ref.kerror, klog = ref.klog, _ = ref._;

    klor = require('klor');

    render = require('./render');

    argDir = require('./argdir');

    pretty = require('./pretty');

    gitStatus = function(sourceFile) {
        var git, gitDir;
        gitDir = slash.dir(sourceFile);
        git = require('simple-git')(gitDir);
        return doFetch(git, gitDir, sourceFile);
    };

    doFetch = function(git, gitDir, sourceFile) {
        return git.fetch(function(err, status) {
            if (err) {
                return kerror("git fetch kerror " + err);
            }
            return doStatus(git, gitDir, sourceFile);
        });
    };

    doStatus = function(git, gitDir, sourceFile) {
        return git.status(function(err, status) {
            var a, aheadBehind, arglist, c, change, changes, d, diff, f, fileLists, filtered, gitFile, gitPath, i, j, k, l, lame, len, len1, len2, len3, ls, m, n, o, prfx, ref1, ref2, ref3, ref4, relPath, res, results, rgs, split, start, v;
            if (err) {
                return kerror("git status error " + err);
            }
            changes = [];
            fileLists = _.omitBy(status, function(v, k) {
                return _.isEmpty(v);
            });
            for (k in fileLists) {
                v = fileLists[k];
                m = {
                    not_added: colors.gray,
                    conflicted: colors.yellow,
                    modified: colors.green,
                    created: colors.magenta,
                    deleted: colors.red
                };
                if (indexOf.call(_.keys(m), k) >= 0) {
                    ref2 = (ref1 = status[k]) != null ? ref1 : [];
                    for (i = 0, len = ref2.length; i < len; i++) {
                        f = ref2[i];
                        d = argDir();
                        arglist = _.filter(args["arguments"], function(a) {
                            return a !== 'fetch';
                        });
                        if (arglist.length) {
                            filtered = true;
                            for (j = 0, len1 = arglist.length; j < len1; j++) {
                                a = arglist[j];
                                if (slash.join(gitDir, f).indexOf(slash.resolve(a)) === 0) {
                                    filtered = false;
                                    break;
                                }
                            }
                            if (filtered) {
                                if (args.debug) {
                                    klog('filtered', slash.resolve(a), f, slash.join(gitDir, f));
                                }
                                continue;
                            }
                        }
                        prfx = "    ";
                        prfx = m[k]("█   ");
                        gitFile = slash.join(gitDir, f);
                        relPath = slash.relative(gitFile, '.');
                        lame = slash.extname(gitFile) === '.js' || slash.basename(gitFile) === 'package.json';
                        change = prfx + pretty.filePath(relPath, lame && m[k].dim || m[k]);
                        if ((k === 'modified' || k === 'created') && args.diff) {
                            if (lame) {
                                continue;
                            }
                            res = childp.execSync("git diff -U0 --ignore-space-at-eol " + gitFile, {
                                encoding: 'utf8',
                                cwd: gitDir
                            });
                            diff = "";
                            c = '▼'.bold.blue;
                            start = 0;
                            ref3 = res.split(/\r?\n/);
                            for (n = 0, len2 = ref3.length; n < len2; n++) {
                                l = ref3[n];
                                ls = colors.strip(l);
                                if ((ref4 = ls.substr(0, 4)) === '+++ ' || ref4 === '--- ') {

                                } else if (ls[0] === '@') {
                                    split = ls.split('@@');
                                    split = split[1].split(' +');
                                    split = split[1].split(',');
                                    start = parseInt(split[0]);
                                    diff += "\n" + c;
                                    c = '●'.blue.dim;
                                } else if (ls[0] === '+') {
                                    diff += "\n ";
                                    start++;
                                    rgs = klor.ranges(ls.substr(1), slash.ext(f));
                                    if (valid(rgs)) {
                                        diff += render(rgs);
                                    } else {
                                        diff += ls.substr(1).white;
                                    }
                                } else if (ls[0] === '-') {
                                    diff += "\n " + (ls.substr(1)).gray.bold.dim;
                                }
                            }
                            if (diff.length) {
                                change += diff + "\n" + "▲".blue.dim;
                            }
                        }
                        changes.push(change);
                    }
                }
            }
            relPath = slash.relative(gitDir, '.');
            if (relPath === '') {
                relPath = '.';
            }
            gitPath = pretty.filePath(relPath, colors.white);
            aheadBehind = function() {
                var st;
                if (status.ahead || status.behind) {
                    st = '';
                    if (status.ahead) {
                        st += ("▲ " + status.ahead).gray.bold.bgBlack;
                    }
                    if (status.behind) {
                        st += ("▼ " + status.behind).red.bold.bgBlack;
                    }
                    return st = _.padEnd(st, 4);
                } else {
                    return '';
                }
            };
            console.log(('    ' + gitPath + ' ').bgBlue + ' ' + aheadBehind());
            results = [];
            for (o = 0, len3 = changes.length; o < len3; o++) {
                c = changes[o];
                results.push(console.log(c));
            }
            return results;
        });
    };

    module.exports = {
        gitStatus: gitStatus
    };

}).call(this);
