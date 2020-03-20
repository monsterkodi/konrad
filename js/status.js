// koffee 1.12.0

/*
 0000000  000000000   0000000   000000000  000   000   0000000
000          000     000   000     000     000   000  000     
0000000      000     000000000     000     000   000  0000000 
     000     000     000   000     000     000   000       000
0000000      000     000   000     000      0000000   0000000
 */
var _, argDir, args, childp, colors, doFetch, doStatus, gitFetch, gitStatus, kerror, klog, klor, pretty, ref, render, slash, valid,
    indexOf = [].indexOf;

ref = require('kxk'), childp = ref.childp, colors = ref.colors, slash = ref.slash, valid = ref.valid, klor = ref.klor, args = ref.args, kerror = ref.kerror, klog = ref.klog, _ = ref._;

klor.kolor.globalize();

render = require('./render');

argDir = require('./argdir');

pretty = require('./pretty');

gitStatus = function(sourceFile) {
    var git, gitDir;
    gitDir = slash.dir(sourceFile);
    git = require('simple-git')(gitDir);
    return doStatus(git, gitDir, sourceFile);
};

gitFetch = function(sourceFile) {
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
        var a, aheadBehind, arglist, b, c, change, changes, d, diff, f, fileLists, filtered, gitFile, gitPath, i, j, k, l, lame, len, len1, len2, len3, ls, m, n, o, prfx, ref1, ref2, ref3, ref4, ref5, relPath, res, results, rgs, split, start, v;
        if (err) {
            return kerror("git status error " + err);
        }
        changes = [];
        fileLists = _.omitBy(status, function(v, k) {
            return _.isEmpty(v);
        });
        for (k in fileLists) {
            v = fileLists[k];
            l = {
                not_added: w2,
                conflicted: y1,
                modified: g1,
                created: m1,
                deleted: r1
            };
            m = {
                not_added: w5,
                conflicted: y4,
                modified: g4,
                created: m4,
                deleted: r4
            };
            b = {
                not_added: W1,
                conflicted: Y5,
                modified: G1,
                created: M4,
                deleted: R5
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
                    prfx = b[k]("  ");
                    prfx += reset('  ');
                    gitFile = slash.join(gitDir, f);
                    relPath = slash.relative(gitFile, '.');
                    lame = (ref3 = slash.ext(gitFile)) === 'js' || ref3 === 'json';
                    change = prfx + pretty.filePath(relPath, lame && l[k] || m[k]);
                    if ((k === 'modified' || k === 'created') && args.diff) {
                        if (lame) {
                            continue;
                        }
                        res = childp.execSync("git diff -U0 --ignore-space-at-eol " + gitFile, {
                            encoding: 'utf8',
                            cwd: gitDir
                        });
                        diff = "";
                        c = klor.kolor.w1('●');
                        start = 0;
                        ref4 = res.split(/\r?\n/);
                        for (n = 0, len2 = ref4.length; n < len2; n++) {
                            l = ref4[n];
                            ls = klor.kolor.strip(l);
                            if ((ref5 = ls.substr(0, 4)) === '+++ ' || ref5 === '--- ') {

                            } else if (ls[0] === '@') {
                                split = ls.split('@@');
                                split = split[1].split(' +');
                                split = split[1].split(',');
                                start = parseInt(split[0]);
                                diff += "\n" + c;
                                c = klor.kolor.w1('●');
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
                            change += diff + "\n" + klor.kolor.w1('●');
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
    gitStatus: gitStatus,
    gitFetch: gitFetch
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlUm9vdCI6Ii4uL2NvZmZlZSIsInNvdXJjZXMiOlsic3RhdHVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQSw4SEFBQTtJQUFBOztBQVFBLE1BQWdFLE9BQUEsQ0FBUSxLQUFSLENBQWhFLEVBQUUsbUJBQUYsRUFBVSxtQkFBVixFQUFrQixpQkFBbEIsRUFBeUIsaUJBQXpCLEVBQWdDLGVBQWhDLEVBQXNDLGVBQXRDLEVBQTRDLG1CQUE1QyxFQUFvRCxlQUFwRCxFQUEwRDs7QUFFMUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFYLENBQUE7O0FBQ0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBRVQsU0FBQSxHQUFZLFNBQUMsVUFBRDtBQUVSLFFBQUE7SUFBQSxNQUFBLEdBQVMsS0FBSyxDQUFDLEdBQU4sQ0FBVSxVQUFWO0lBQ1QsR0FBQSxHQUFNLE9BQUEsQ0FBUSxZQUFSLENBQUEsQ0FBc0IsTUFBdEI7V0FDTixRQUFBLENBQVMsR0FBVCxFQUFjLE1BQWQsRUFBc0IsVUFBdEI7QUFKUTs7QUFNWixRQUFBLEdBQVcsU0FBQyxVQUFEO0FBRVAsUUFBQTtJQUFBLE1BQUEsR0FBUyxLQUFLLENBQUMsR0FBTixDQUFVLFVBQVY7SUFDVCxHQUFBLEdBQU0sT0FBQSxDQUFRLFlBQVIsQ0FBQSxDQUFzQixNQUF0QjtXQUNOLE9BQUEsQ0FBUSxHQUFSLEVBQWEsTUFBYixFQUFxQixVQUFyQjtBQUpPOztBQVlYLE9BQUEsR0FBVSxTQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsVUFBZDtXQUVOLEdBQUcsQ0FBQyxLQUFKLENBQVUsU0FBQyxHQUFELEVBQUssTUFBTDtRQUVOLElBQUcsR0FBSDtBQUFZLG1CQUFPLE1BQUEsQ0FBTyxtQkFBQSxHQUFvQixHQUEzQixFQUFuQjs7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LFFBRHhDOzt1QkFFQSxFQUFBLEdBQUssQ0FBQyxDQUFDLE1BQUYsQ0FBUyxFQUFULEVBQWEsQ0FBYixFQU5UO2FBQUEsTUFBQTt1QkFRSSxHQVJKOztRQURVO1FBV2QsT0FBQSxDQUFBLEdBQUEsQ0FBSSxDQUFDLE1BQUEsR0FBUyxPQUFULEdBQW1CLEdBQXBCLENBQXdCLENBQUMsTUFBekIsR0FBa0MsR0FBbEMsR0FBd0MsV0FBQSxDQUFBLENBQTVDO0FBQ0E7YUFBQSwyQ0FBQTs7eUJBQ0csT0FBQSxDQUFDLEdBQUQsQ0FBSyxDQUFMO0FBREg7O0lBOUdPLENBQVg7QUFGTzs7QUFtSFgsTUFBTSxDQUFDLE9BQVAsR0FDSTtJQUFBLFNBQUEsRUFBVSxTQUFWO0lBQ0EsUUFBQSxFQUFTLFFBRFQiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbiAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwXG4wMDAgICAgICAgICAgMDAwICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAgIFxuMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCBcbiAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgICAgICAgMDAwXG4wMDAwMDAwICAgICAgMDAwICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgIDAwMDAwMDAgICAwMDAwMDAwIFxuIyMjXG5cbnsgY2hpbGRwLCBjb2xvcnMsIHNsYXNoLCB2YWxpZCwga2xvciwgYXJncywga2Vycm9yLCBrbG9nLCBfIH0gPSByZXF1aXJlICdreGsnXG5cbmtsb3Iua29sb3IuZ2xvYmFsaXplKClcbnJlbmRlciA9IHJlcXVpcmUgJy4vcmVuZGVyJ1xuYXJnRGlyID0gcmVxdWlyZSAnLi9hcmdkaXInXG5wcmV0dHkgPSByZXF1aXJlICcuL3ByZXR0eSdcblxuZ2l0U3RhdHVzID0gKHNvdXJjZUZpbGUpIC0+XG5cbiAgICBnaXREaXIgPSBzbGFzaC5kaXIgc291cmNlRmlsZVxuICAgIGdpdCA9IHJlcXVpcmUoJ3NpbXBsZS1naXQnKSBnaXREaXJcbiAgICBkb1N0YXR1cyBnaXQsIGdpdERpciwgc291cmNlRmlsZVxuICAgIFxuZ2l0RmV0Y2ggPSAoc291cmNlRmlsZSkgLT5cblxuICAgIGdpdERpciA9IHNsYXNoLmRpciBzb3VyY2VGaWxlXG4gICAgZ2l0ID0gcmVxdWlyZSgnc2ltcGxlLWdpdCcpIGdpdERpclxuICAgIGRvRmV0Y2ggZ2l0LCBnaXREaXIsIHNvdXJjZUZpbGVcbiAgICBcbiMgMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIFxuIyAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgXG4jIDAwMDAwMCAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwMDAwMDAwICBcbiMgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIFxuIyAwMDAgICAgICAgMDAwMDAwMDAgICAgIDAwMCAgICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgXG5cbmRvRmV0Y2ggPSAoZ2l0LCBnaXREaXIsIHNvdXJjZUZpbGUpIC0+XG4gICAgXG4gICAgZ2l0LmZldGNoIChlcnIsc3RhdHVzKSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgZXJyIHRoZW4gcmV0dXJuIGtlcnJvciBcImdpdCBmZXRjaCBrZXJyb3IgI3tlcnJ9XCJcbiAgICAgICAgZG9TdGF0dXMgZ2l0LCBnaXREaXIsIHNvdXJjZUZpbGVcbiAgICAgICAgXG4jICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICBcbiMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIFxuIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgXG4jICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgICAgICAgMDAwICBcbiMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgIFxuXG5kb1N0YXR1cyA9IChnaXQsIGdpdERpciwgc291cmNlRmlsZSkgLT5cbiAgICAgXG4gICAgZ2l0LnN0YXR1cyAoZXJyLHN0YXR1cykgLT5cblxuICAgICAgICBpZiBlcnIgdGhlbiByZXR1cm4ga2Vycm9yIFwiZ2l0IHN0YXR1cyBlcnJvciAje2Vycn1cIlxuXG4gICAgICAgIGNoYW5nZXMgPSBbXVxuXG4gICAgICAgIGZpbGVMaXN0cyA9IF8ub21pdEJ5IHN0YXR1cywgKHYsaykgLT4gXy5pc0VtcHR5IHZcblxuICAgICAgICBmb3Igayx2IG9mIGZpbGVMaXN0c1xuXG4gICAgICAgICAgICBsID1cbiAgICAgICAgICAgICAgICBub3RfYWRkZWQ6ICB3MlxuICAgICAgICAgICAgICAgIGNvbmZsaWN0ZWQ6IHkxXG4gICAgICAgICAgICAgICAgbW9kaWZpZWQ6ICAgZzFcbiAgICAgICAgICAgICAgICBjcmVhdGVkOiAgICBtMVxuICAgICAgICAgICAgICAgIGRlbGV0ZWQ6ICAgIHIxXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG0gPVxuICAgICAgICAgICAgICAgIG5vdF9hZGRlZDogIHc1XG4gICAgICAgICAgICAgICAgY29uZmxpY3RlZDogeTRcbiAgICAgICAgICAgICAgICBtb2RpZmllZDogICBnNFxuICAgICAgICAgICAgICAgIGNyZWF0ZWQ6ICAgIG00XG4gICAgICAgICAgICAgICAgZGVsZXRlZDogICAgcjRcblxuICAgICAgICAgICAgYiA9XG4gICAgICAgICAgICAgICAgbm90X2FkZGVkOiAgVzFcbiAgICAgICAgICAgICAgICBjb25mbGljdGVkOiBZNVxuICAgICAgICAgICAgICAgIG1vZGlmaWVkOiAgIEcxXG4gICAgICAgICAgICAgICAgY3JlYXRlZDogICAgTTRcbiAgICAgICAgICAgICAgICBkZWxldGVkOiAgICBSNVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgayBpbiBfLmtleXMgbVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZvciBmIGluIHN0YXR1c1trXSA/IFtdXG4gICAgICAgICAgICAgICAgICAgIGQgPSBhcmdEaXIoKVxuXG4gICAgICAgICAgICAgICAgICAgIGFyZ2xpc3QgPSBfLmZpbHRlciBhcmdzLmFyZ3VtZW50cywgKGEpIC0+IGEgbm90IGluIFsnZmV0Y2gnXVxuICAgICAgICAgICAgICAgICAgICBpZiBhcmdsaXN0Lmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgYSBpbiBhcmdsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgc2xhc2guam9pbihnaXREaXIsIGYpLmluZGV4T2Yoc2xhc2gucmVzb2x2ZSBhKSA9PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGZpbHRlcmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2xvZyAnZmlsdGVyZWQnIHNsYXNoLnJlc29sdmUoYSksIGYsIHNsYXNoLmpvaW4oZ2l0RGlyLCBmKSBpZiBhcmdzLmRlYnVnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWVcblxuICAgICAgICAgICAgICAgICAgICBwcmZ4ICAgID0gYltrXSBcIiAgXCJcbiAgICAgICAgICAgICAgICAgICAgcHJmeCAgICs9IHJlc2V0ICcgICdcbiAgICAgICAgICAgICAgICAgICAgZ2l0RmlsZSA9IHNsYXNoLmpvaW4gZ2l0RGlyLCBmXG4gICAgICAgICAgICAgICAgICAgIHJlbFBhdGggPSBzbGFzaC5yZWxhdGl2ZSBnaXRGaWxlLCAnLidcbiAgICAgICAgICAgICAgICAgICAgbGFtZSAgICA9IHNsYXNoLmV4dChnaXRGaWxlKSBpbiBbJ2pzJyAnanNvbiddXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZSAgPSBwcmZ4ICsgcHJldHR5LmZpbGVQYXRoKHJlbFBhdGgsIChsYW1lIGFuZCBsW2tdIG9yIG1ba10pKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwMDAwICAgIDAwMDAwMCAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIGsgaW4gWydtb2RpZmllZCcgJ2NyZWF0ZWQnXSBhbmQgYXJncy5kaWZmXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIGlmIGxhbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gY2hpbGRwLmV4ZWNTeW5jIFwiZ2l0IGRpZmYgLVUwIC0taWdub3JlLXNwYWNlLWF0LWVvbCAje2dpdEZpbGV9XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5jb2Rpbmc6ICd1dGY4J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN3ZDogZ2l0RGlyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmID0gXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9IGtsb3Iua29sb3IudzEgJ+KXjydcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIGwgaW4gcmVzLnNwbGl0IC9cXHI/XFxuL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxzID0ga2xvci5rb2xvci5zdHJpcCBsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgbHMuc3Vic3RyKDAsNCkgaW4gWycrKysgJyAnLS0tICddIHRoZW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIGxzWzBdID09ICdAJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGxpdCA9IGxzLnNwbGl0ICdAQCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BsaXQgPSBzcGxpdFsxXS5zcGxpdCAnICsnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwbGl0ID0gc3BsaXRbMV0uc3BsaXQgJywnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gcGFyc2VJbnQgc3BsaXRbMF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiArPSAoXCJcXG5cIitjKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjID0ga2xvci5rb2xvci53MSAn4pePJyAjLmJsdWUuZGltXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBsc1swXSA9PSAnKydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiArPSBcIlxcbiBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJncyA9IGtsb3IucmFuZ2VzIGxzLnN1YnN0cigxKSwgc2xhc2guZXh0IGZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgdmFsaWQgcmdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmICs9IHJlbmRlciByZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiArPSBscy5zdWJzdHIoMSkud2hpdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIGxzWzBdID09ICctJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmICs9IFwiXFxuIFwiICsgKGxzLnN1YnN0cigxKSkuZ3JheS5ib2xkLmRpbVxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlICs9IGRpZmYrXCJcXG5cIitrbG9yLmtvbG9yLncxICfil48nIGlmIGRpZmYubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoIGNoYW5nZVxuXG4gICAgICAgIHJlbFBhdGggPSBzbGFzaC5yZWxhdGl2ZSBnaXREaXIsICcuJ1xuICAgICAgICByZWxQYXRoID0gJy4nIGlmIHJlbFBhdGggPT0gJydcbiAgICAgICAgZ2l0UGF0aCA9IHByZXR0eS5maWxlUGF0aCByZWxQYXRoLCBjb2xvcnMud2hpdGVcblxuICAgICAgICBhaGVhZEJlaGluZCA9ICgpIC0+XG4gICAgICAgICAgICBpZiBzdGF0dXMuYWhlYWQgb3Igc3RhdHVzLmJlaGluZFxuICAgICAgICAgICAgICAgIHN0ID0gJydcbiAgICAgICAgICAgICAgICBpZiBzdGF0dXMuYWhlYWRcbiAgICAgICAgICAgICAgICAgICAgc3QgKz0gXCLilrIgI3tzdGF0dXMuYWhlYWR9XCIuZ3JheS5ib2xkLmJnQmxhY2tcbiAgICAgICAgICAgICAgICBpZiBzdGF0dXMuYmVoaW5kXG4gICAgICAgICAgICAgICAgICAgIHN0ICs9IFwi4pa8ICN7c3RhdHVzLmJlaGluZH1cIi5yZWQuYm9sZC5iZ0JsYWNrXG4gICAgICAgICAgICAgICAgc3QgPSBfLnBhZEVuZCBzdCwgNFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICcnXG5cbiAgICAgICAgbG9nICgnICAgICcgKyBnaXRQYXRoICsgJyAnKS5iZ0JsdWUgKyAnICcgKyBhaGVhZEJlaGluZCgpXG4gICAgICAgIGZvciBjIGluIGNoYW5nZXNcbiAgICAgICAgICAgIGxvZyBjXG5cbm1vZHVsZS5leHBvcnRzID0gXG4gICAgZ2l0U3RhdHVzOmdpdFN0YXR1c1xuICAgIGdpdEZldGNoOmdpdEZldGNoXG4iXX0=
//# sourceURL=../coffee/status.coffee