// koffee 1.14.0

/*
 0000000  000000000   0000000   000000000  000   000   0000000
000          000     000   000     000     000   000  000     
0000000      000     000000000     000     000   000  0000000 
     000     000     000   000     000     000   000       000
0000000      000     000   000     000      0000000   0000000
 */
var _, argDir, args, childp, doFetch, doStatus, gitFetch, gitStatus, kerror, klog, klor, pretty, ref, render, slash, valid,
    indexOf = [].indexOf;

ref = require('kxk'), _ = ref._, args = ref.args, childp = ref.childp, kerror = ref.kerror, klog = ref.klog, klor = ref.klor, slash = ref.slash, valid = ref.valid;

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
                        c = w1('●');
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
                                c = w1('●');
                            } else if (ls[0] === '+') {
                                diff += "\n ";
                                start++;
                                rgs = klor.ranges(ls.substr(1), slash.ext(f));
                                if (valid(rgs)) {
                                    diff += render(rgs);
                                } else {
                                    diff += w8(ls.substr(1));
                                }
                            } else if (ls[0] === '-') {
                                diff += "\n " + w3(ls.substr(1));
                            }
                        }
                        if (diff.length) {
                            change += diff + "\n" + w1('●');
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
        gitPath = pretty.filePath(relPath, w8);
        aheadBehind = function() {
            var st;
            if (status.ahead || status.behind) {
                st = '';
                if (status.ahead) {
                    st += w3("▲ " + status.ahead);
                }
                if (status.behind) {
                    st += r5("▼ " + status.behind);
                }
                return st = _.padEnd(st, 4);
            } else {
                return '';
            }
        };
        console.log(B5('    ' + gitPath + ' ') + ' ' + aheadBehind());
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlUm9vdCI6Ii4uL2NvZmZlZSIsInNvdXJjZXMiOlsic3RhdHVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQSxzSEFBQTtJQUFBOztBQVFBLE1BQXdELE9BQUEsQ0FBUSxLQUFSLENBQXhELEVBQUUsU0FBRixFQUFLLGVBQUwsRUFBVyxtQkFBWCxFQUFtQixtQkFBbkIsRUFBMkIsZUFBM0IsRUFBaUMsZUFBakMsRUFBdUMsaUJBQXZDLEVBQThDOztBQUU5QyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVgsQ0FBQTs7QUFDQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFFVCxTQUFBLEdBQVksU0FBQyxVQUFEO0FBRVIsUUFBQTtJQUFBLE1BQUEsR0FBUyxLQUFLLENBQUMsR0FBTixDQUFVLFVBQVY7SUFDVCxHQUFBLEdBQU0sT0FBQSxDQUFRLFlBQVIsQ0FBQSxDQUFzQixNQUF0QjtXQUNOLFFBQUEsQ0FBUyxHQUFULEVBQWMsTUFBZCxFQUFzQixVQUF0QjtBQUpROztBQU1aLFFBQUEsR0FBVyxTQUFDLFVBQUQ7QUFFUCxRQUFBO0lBQUEsTUFBQSxHQUFTLEtBQUssQ0FBQyxHQUFOLENBQVUsVUFBVjtJQUNULEdBQUEsR0FBTSxPQUFBLENBQVEsWUFBUixDQUFBLENBQXNCLE1BQXRCO1dBQ04sT0FBQSxDQUFRLEdBQVIsRUFBYSxNQUFiLEVBQXFCLFVBQXJCO0FBSk87O0FBWVgsT0FBQSxHQUFVLFNBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxVQUFkO1dBRU4sR0FBRyxDQUFDLEtBQUosQ0FBVSxTQUFDLEdBQUQsRUFBSyxNQUFMO1FBRU4sSUFBRyxHQUFIO0FBQVksbUJBQU8sTUFBQSxDQUFPLG1CQUFBLEdBQW9CLEdBQTNCLEVBQW5COztlQUNBLFFBQUEsQ0FBUyxH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QixHQUE3QixHQUFtQyxXQUFBLENBQUEsQ0FBdkM7QUFDQTthQUFBLDJDQUFBOzt5QkFDRyxPQUFBLENBQUMsR0FBRCxDQUFLLENBQUw7QUFESDs7SUE5R08sQ0FBWDtBQUZPOztBQW1IWCxNQUFNLENBQUMsT0FBUCxHQUNJO0lBQUEsU0FBQSxFQUFVLFNBQVY7SUFDQSxRQUFBLEVBQVMsUUFEVCIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIDAwMDAwMDAgIDAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDBcbjAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgICAgXG4wMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAwMDAwIFxuICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgICAwMDBcbjAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgXG4jIyNcblxueyBfLCBhcmdzLCBjaGlsZHAsIGtlcnJvciwga2xvZywga2xvciwgc2xhc2gsIHZhbGlkIH0gPSByZXF1aXJlICdreGsnXG5cbmtsb3Iua29sb3IuZ2xvYmFsaXplKClcbnJlbmRlciA9IHJlcXVpcmUgJy4vcmVuZGVyJ1xuYXJnRGlyID0gcmVxdWlyZSAnLi9hcmdkaXInXG5wcmV0dHkgPSByZXF1aXJlICcuL3ByZXR0eSdcblxuZ2l0U3RhdHVzID0gKHNvdXJjZUZpbGUpIC0+XG5cbiAgICBnaXREaXIgPSBzbGFzaC5kaXIgc291cmNlRmlsZVxuICAgIGdpdCA9IHJlcXVpcmUoJ3NpbXBsZS1naXQnKSBnaXREaXJcbiAgICBkb1N0YXR1cyBnaXQsIGdpdERpciwgc291cmNlRmlsZVxuICAgIFxuZ2l0RmV0Y2ggPSAoc291cmNlRmlsZSkgLT5cblxuICAgIGdpdERpciA9IHNsYXNoLmRpciBzb3VyY2VGaWxlXG4gICAgZ2l0ID0gcmVxdWlyZSgnc2ltcGxlLWdpdCcpIGdpdERpclxuICAgIGRvRmV0Y2ggZ2l0LCBnaXREaXIsIHNvdXJjZUZpbGVcbiAgICBcbiMgMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIFxuIyAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgXG4jIDAwMDAwMCAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwMDAwMDAwICBcbiMgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIFxuIyAwMDAgICAgICAgMDAwMDAwMDAgICAgIDAwMCAgICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgXG5cbmRvRmV0Y2ggPSAoZ2l0LCBnaXREaXIsIHNvdXJjZUZpbGUpIC0+XG4gICAgXG4gICAgZ2l0LmZldGNoIChlcnIsc3RhdHVzKSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgZXJyIHRoZW4gcmV0dXJuIGtlcnJvciBcImdpdCBmZXRjaCBrZXJyb3IgI3tlcnJ9XCJcbiAgICAgICAgZG9TdGF0dXMgZ2l0LCBnaXREaXIsIHNvdXJjZUZpbGVcbiAgICAgICAgXG4jICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICBcbiMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIFxuIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgXG4jICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgICAgICAgMDAwICBcbiMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgIFxuXG5kb1N0YXR1cyA9IChnaXQsIGdpdERpciwgc291cmNlRmlsZSkgLT5cbiAgICAgXG4gICAgZ2l0LnN0YXR1cyAoZXJyLHN0YXR1cykgLT5cblxuICAgICAgICBpZiBlcnIgdGhlbiByZXR1cm4ga2Vycm9yIFwiZ2l0IHN0YXR1cyBlcnJvciAje2Vycn1cIlxuXG4gICAgICAgIGNoYW5nZXMgPSBbXVxuXG4gICAgICAgIGZpbGVMaXN0cyA9IF8ub21pdEJ5IHN0YXR1cywgKHYsaykgLT4gXy5pc0VtcHR5IHZcblxuICAgICAgICBmb3Igayx2IG9mIGZpbGVMaXN0c1xuXG4gICAgICAgICAgICBsID1cbiAgICAgICAgICAgICAgICBub3RfYWRkZWQ6ICB3MlxuICAgICAgICAgICAgICAgIGNvbmZsaWN0ZWQ6IHkxXG4gICAgICAgICAgICAgICAgbW9kaWZpZWQ6ICAgZzFcbiAgICAgICAgICAgICAgICBjcmVhdGVkOiAgICBtMVxuICAgICAgICAgICAgICAgIGRlbGV0ZWQ6ICAgIHIxXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG0gPVxuICAgICAgICAgICAgICAgIG5vdF9hZGRlZDogIHc1XG4gICAgICAgICAgICAgICAgY29uZmxpY3RlZDogeTRcbiAgICAgICAgICAgICAgICBtb2RpZmllZDogICBnNFxuICAgICAgICAgICAgICAgIGNyZWF0ZWQ6ICAgIG00XG4gICAgICAgICAgICAgICAgZGVsZXRlZDogICAgcjRcblxuICAgICAgICAgICAgYiA9XG4gICAgICAgICAgICAgICAgbm90X2FkZGVkOiAgVzFcbiAgICAgICAgICAgICAgICBjb25mbGljdGVkOiBZNVxuICAgICAgICAgICAgICAgIG1vZGlmaWVkOiAgIEcxXG4gICAgICAgICAgICAgICAgY3JlYXRlZDogICAgTTRcbiAgICAgICAgICAgICAgICBkZWxldGVkOiAgICBSNVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgayBpbiBfLmtleXMgbVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZvciBmIGluIHN0YXR1c1trXSA/IFtdXG4gICAgICAgICAgICAgICAgICAgIGQgPSBhcmdEaXIoKVxuXG4gICAgICAgICAgICAgICAgICAgIGFyZ2xpc3QgPSBfLmZpbHRlciBhcmdzLmFyZ3VtZW50cywgKGEpIC0+IGEgbm90IGluIFsnZmV0Y2gnXVxuICAgICAgICAgICAgICAgICAgICBpZiBhcmdsaXN0Lmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgYSBpbiBhcmdsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgc2xhc2guam9pbihnaXREaXIsIGYpLmluZGV4T2Yoc2xhc2gucmVzb2x2ZSBhKSA9PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGZpbHRlcmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2xvZyAnZmlsdGVyZWQnIHNsYXNoLnJlc29sdmUoYSksIGYsIHNsYXNoLmpvaW4oZ2l0RGlyLCBmKSBpZiBhcmdzLmRlYnVnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWVcblxuICAgICAgICAgICAgICAgICAgICBwcmZ4ICAgID0gYltrXSBcIiAgXCJcbiAgICAgICAgICAgICAgICAgICAgcHJmeCAgICs9IHJlc2V0ICcgICdcbiAgICAgICAgICAgICAgICAgICAgZ2l0RmlsZSA9IHNsYXNoLmpvaW4gZ2l0RGlyLCBmXG4gICAgICAgICAgICAgICAgICAgIHJlbFBhdGggPSBzbGFzaC5yZWxhdGl2ZSBnaXRGaWxlLCAnLidcbiAgICAgICAgICAgICAgICAgICAgbGFtZSAgICA9IHNsYXNoLmV4dChnaXRGaWxlKSBpbiBbJ2pzJyAnanNvbiddXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZSAgPSBwcmZ4ICsgcHJldHR5LmZpbGVQYXRoKHJlbFBhdGgsIChsYW1lIGFuZCBsW2tdIG9yIG1ba10pKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwMDAwICAgIDAwMDAwMCAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIGsgaW4gWydtb2RpZmllZCcgJ2NyZWF0ZWQnXSBhbmQgYXJncy5kaWZmXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIGlmIGxhbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gY2hpbGRwLmV4ZWNTeW5jIFwiZ2l0IGRpZmYgLVUwIC0taWdub3JlLXNwYWNlLWF0LWVvbCAje2dpdEZpbGV9XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5jb2Rpbmc6ICd1dGY4J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN3ZDogZ2l0RGlyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmID0gXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9IHcxICfil48nXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciBsIGluIHJlcy5zcGxpdCAvXFxyP1xcbi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBscyA9IGtsb3Iua29sb3Iuc3RyaXAgbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIGxzLnN1YnN0cigwLDQpIGluIFsnKysrICcgJy0tLSAnXSB0aGVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBsc1swXSA9PSAnQCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BsaXQgPSBscy5zcGxpdCAnQEAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwbGl0ID0gc3BsaXRbMV0uc3BsaXQgJyArJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGxpdCA9IHNwbGl0WzFdLnNwbGl0ICcsJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IHBhcnNlSW50IHNwbGl0WzBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZmYgKz0gKFwiXFxuXCIrYylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyA9IHcxICfil48nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBsc1swXSA9PSAnKydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiArPSBcIlxcbiBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJncyA9IGtsb3IucmFuZ2VzIGxzLnN1YnN0cigxKSwgc2xhc2guZXh0IGZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgdmFsaWQgcmdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmICs9IHJlbmRlciByZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiArPSB3OCBscy5zdWJzdHIoMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIGxzWzBdID09ICctJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmICs9IFwiXFxuIFwiICsgdzMgbHMuc3Vic3RyKDEpXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2UgKz0gZGlmZitcIlxcblwiK3cxICfil48nIGlmIGRpZmYubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoIGNoYW5nZVxuXG4gICAgICAgIHJlbFBhdGggPSBzbGFzaC5yZWxhdGl2ZSBnaXREaXIsICcuJ1xuICAgICAgICByZWxQYXRoID0gJy4nIGlmIHJlbFBhdGggPT0gJydcbiAgICAgICAgZ2l0UGF0aCA9IHByZXR0eS5maWxlUGF0aCByZWxQYXRoLCB3OFxuXG4gICAgICAgIGFoZWFkQmVoaW5kID0gKCkgLT5cbiAgICAgICAgICAgIGlmIHN0YXR1cy5haGVhZCBvciBzdGF0dXMuYmVoaW5kXG4gICAgICAgICAgICAgICAgc3QgPSAnJ1xuICAgICAgICAgICAgICAgIGlmIHN0YXR1cy5haGVhZFxuICAgICAgICAgICAgICAgICAgICBzdCArPSB3MyBcIuKWsiAje3N0YXR1cy5haGVhZH1cIlxuICAgICAgICAgICAgICAgIGlmIHN0YXR1cy5iZWhpbmRcbiAgICAgICAgICAgICAgICAgICAgc3QgKz0gcjUgXCLilrwgI3tzdGF0dXMuYmVoaW5kfVwiXG4gICAgICAgICAgICAgICAgc3QgPSBfLnBhZEVuZCBzdCwgNFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICcnXG5cbiAgICAgICAgbG9nIEI1KCcgICAgJyArIGdpdFBhdGggKyAnICcpICsgJyAnICsgYWhlYWRCZWhpbmQoKVxuICAgICAgICBmb3IgYyBpbiBjaGFuZ2VzXG4gICAgICAgICAgICBsb2cgY1xuXG5tb2R1bGUuZXhwb3J0cyA9IFxuICAgIGdpdFN0YXR1czpnaXRTdGF0dXNcbiAgICBnaXRGZXRjaDpnaXRGZXRjaFxuIl19
//# sourceURL=../coffee/status.coffee