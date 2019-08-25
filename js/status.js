// koffee 1.4.0

/*
 0000000  000000000   0000000   000000000  000   000   0000000
000          000     000   000     000     000   000  000     
0000000      000     000000000     000     000   000  0000000 
     000     000     000   000     000     000   000       000
0000000      000     000   000     000      0000000   0000000
 */
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
                            ls = klor.kolor.strip(l);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQSxvSEFBQTtJQUFBOztBQVFBLE1BQTBELE9BQUEsQ0FBUSxLQUFSLENBQTFELEVBQUUsbUJBQUYsRUFBVSxtQkFBVixFQUFrQixpQkFBbEIsRUFBeUIsaUJBQXpCLEVBQWdDLGVBQWhDLEVBQXNDLG1CQUF0QyxFQUE4QyxlQUE5QyxFQUFvRDs7QUFFcEQsSUFBQSxHQUFTLE9BQUEsQ0FBUSxNQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUVULFNBQUEsR0FBWSxTQUFDLFVBQUQ7QUFFUixRQUFBO0lBQUEsTUFBQSxHQUFTLEtBQUssQ0FBQyxHQUFOLENBQVUsVUFBVjtJQUNULEdBQUEsR0FBTSxPQUFBLENBQVEsWUFBUixDQUFBLENBQXNCLE1BQXRCO1dBQ04sT0FBQSxDQUFRLEdBQVIsRUFBYSxNQUFiLEVBQXFCLFVBQXJCO0FBSlE7O0FBWVosT0FBQSxHQUFVLFNBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxVQUFkO1dBRU4sR0FBRyxDQUFDLEtBQUosQ0FBVSxTQUFDLEdBQUQsRUFBSyxNQUFMO1FBRU4sSUFBRyxHQUFIO0FBQVksbUJBQU8sTUFBQSxDQUFPLG1CQUFBLEdBQW9CLEdBQTNCLEVBQW5COztlQUNBLFFBQUEsQ0FBUyxHQUFULEVBQWMsTUFBZCxFQUFzQixVQUF0QjtJQUhNLENBQVY7QUFGTTs7QUFhVixRQUFBLEdBQVcsU0FBQyxHQUFELEVBQU0sTUFBTixFQUFjLFVBQWQ7V0FFUCxHQUFHLENBQUMsTUFBSixDQUFXLFNBQUMsR0FBRCxFQUFLLE1BQUw7QUFFUCxZQUFBO1FBQUEsSUFBRyxHQUFIO0FBQVksbUJBQU8sTUFBQSxDQUFPLG1CQUFBLEdBQW9CLEdB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Rko7O0FBVEo7UUF3RUEsT0FBQSxHQUFVLEtBQUssQ0FBQyxRQUFOLENBQWUsTUFBZixFQUF1QixHQUF2QjtRQUNWLElBQWlCLE9BQUEsS0FBVyxFQUE1QjtZQUFBLE9BQUEsR0FBVSxJQUFWOztRQUNBLE9BQUEsR0FBVSxNQUFNLENBQUMsUUFBUCxDQUFnQixPQUFoQixFQUF5QixNQUFNLENBQUMsS0FBaEM7UUFFVixXQUFBLEdBQWMsU0FBQTtBQUNWLGdCQUFBO1lBQUEsSUFBRyxNQUFNLENBQUMsS0FBUCxJQUFnQixNQUFNLENBQUMsTUFBMUI7Z0JBQ0ksRUFBQSxHQUFLO2dCQUNMLElBQUcsTUFBTSxDQUFDLEtBQVY7b0JBQ0ksRUFBQSxJQUFNLENBQUEsSUFBQSxHQUFLLE1BQU0sQ0FBQyxLQUFaLENBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUR4Qzs7Z0JBRUEsSUFBRyxNQUFNLENBQUMsTUFBVjtvQkFDSSxFQUFBLElBQU0sQ0FBQSxJQUFBLEdBQUssTUFBTSxDQUFDLE1BQVosQ0FBb0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBRHhDOzt1QkFFQSxFQUFBLEdBQUssQ0FBQyxDQUFDLE1BQUYsQ0FBUyxFQUFULEVBQWEsQ0FBYixFQU5UO2FBQUEsTUFBQTt1QkFRSSxHQVJKOztRQURVO1FBV2QsT0FBQSxDQUFBLEdBQUEsQ0FBSSxDQUFDLE1BQUEsR0FBUyxPQUFULEdBQW1CLEdBQXBCLENBQXdCLENBQUMsTUFBekIsR0FBa0MsR0FBbEMsR0FBd0MsV0FBQSxDQUFBLENBQTVDO0FBQ0E7YUFBQSwyQ0FBQTs7eUJBQ0csT0FBQSxDQUFDLEdBQUQsQ0FBSyxDQUFMO0FBREg7O0lBaEdPLENBQVg7QUFGTzs7QUFxR1gsTUFBTSxDQUFDLE9BQVAsR0FDSTtJQUFBLFNBQUEsRUFBVSxTQUFWIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4gMDAwMDAwMCAgMDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMFxuMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgICBcbjAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMDAwMDAgXG4gICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAgIDAwMFxuMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgICAwMDAwMDAwICAgMDAwMDAwMCBcbiMjI1xuXG57IGNvbG9ycywgY2hpbGRwLCBzbGFzaCwgdmFsaWQsIGFyZ3MsIGtlcnJvciwga2xvZywgXyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5rbG9yICAgPSByZXF1aXJlICdrbG9yJ1xucmVuZGVyID0gcmVxdWlyZSAnLi9yZW5kZXInXG5hcmdEaXIgPSByZXF1aXJlICcuL2FyZ2RpcidcbnByZXR0eSA9IHJlcXVpcmUgJy4vcHJldHR5J1xuXG5naXRTdGF0dXMgPSAoc291cmNlRmlsZSkgLT5cblxuICAgIGdpdERpciA9IHNsYXNoLmRpciBzb3VyY2VGaWxlXG4gICAgZ2l0ID0gcmVxdWlyZSgnc2ltcGxlLWdpdCcpIGdpdERpclxuICAgIGRvRmV0Y2ggZ2l0LCBnaXREaXIsIHNvdXJjZUZpbGVcbiAgICBcbiMgMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIFxuIyAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgXG4jIDAwMDAwMCAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwMDAwMDAwICBcbiMgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIFxuIyAwMDAgICAgICAgMDAwMDAwMDAgICAgIDAwMCAgICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgXG5cbmRvRmV0Y2ggPSAoZ2l0LCBnaXREaXIsIHNvdXJjZUZpbGUpIC0+XG4gICAgXG4gICAgZ2l0LmZldGNoIChlcnIsc3RhdHVzKSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgZXJyIHRoZW4gcmV0dXJuIGtlcnJvciBcImdpdCBmZXRjaCBrZXJyb3IgI3tlcnJ9XCJcbiAgICAgICAgZG9TdGF0dXMgZ2l0LCBnaXREaXIsIHNvdXJjZUZpbGVcbiAgICAgICAgXG4jICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICBcbiMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIFxuIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgXG4jICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgICAgICAgMDAwICBcbiMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgIFxuXG5kb1N0YXR1cyA9IChnaXQsIGdpdERpciwgc291cmNlRmlsZSkgLT5cbiAgICAgICAgXG4gICAgZ2l0LnN0YXR1cyAoZXJyLHN0YXR1cykgLT5cblxuICAgICAgICBpZiBlcnIgdGhlbiByZXR1cm4ga2Vycm9yIFwiZ2l0IHN0YXR1cyBlcnJvciAje2Vycn1cIlxuXG4gICAgICAgIGNoYW5nZXMgPSBbXVxuXG4gICAgICAgIGZpbGVMaXN0cyA9IF8ub21pdEJ5IHN0YXR1cywgKHYsaykgLT4gXy5pc0VtcHR5IHZcblxuICAgICAgICBmb3Igayx2IG9mIGZpbGVMaXN0c1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBtID1cbiAgICAgICAgICAgICAgICBub3RfYWRkZWQ6ICBjb2xvcnMuZ3JheVxuICAgICAgICAgICAgICAgIGNvbmZsaWN0ZWQ6IGNvbG9ycy55ZWxsb3dcbiAgICAgICAgICAgICAgICBtb2RpZmllZDogICBjb2xvcnMuZ3JlZW5cbiAgICAgICAgICAgICAgICBjcmVhdGVkOiAgICBjb2xvcnMubWFnZW50YVxuICAgICAgICAgICAgICAgIGRlbGV0ZWQ6ICAgIGNvbG9ycy5yZWRcblxuICAgICAgICAgICAgaWYgayBpbiBfLmtleXMgbVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZvciBmIGluIHN0YXR1c1trXSA/IFtdXG4gICAgICAgICAgICAgICAgICAgIGQgPSBhcmdEaXIoKVxuXG4gICAgICAgICAgICAgICAgICAgIGFyZ2xpc3QgPSBfLmZpbHRlciBhcmdzLmFyZ3VtZW50cywgKGEpIC0+IGEgbm90IGluIFsnZmV0Y2gnXVxuICAgICAgICAgICAgICAgICAgICBpZiBhcmdsaXN0Lmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgYSBpbiBhcmdsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgc2xhc2guam9pbihnaXREaXIsIGYpLmluZGV4T2Yoc2xhc2gucmVzb2x2ZSBhKSA9PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGZpbHRlcmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2xvZyAnZmlsdGVyZWQnLCBzbGFzaC5yZXNvbHZlKGEpLCBmLCBzbGFzaC5qb2luKGdpdERpciwgZikgaWYgYXJncy5kZWJ1Z1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgICAgICAgICAgcHJmeCAgICA9IFwiICAgIFwiXG4gICAgICAgICAgICAgICAgICAgIHByZnggICAgPSBtW2tdIFwi4paIICAgXCJcbiAgICAgICAgICAgICAgICAgICAgZ2l0RmlsZSA9IHNsYXNoLmpvaW4gZ2l0RGlyLCBmXG4gICAgICAgICAgICAgICAgICAgIHJlbFBhdGggPSBzbGFzaC5yZWxhdGl2ZSBnaXRGaWxlLCAnLidcbiAgICAgICAgICAgICAgICAgICAgbGFtZSAgICA9IHNsYXNoLmV4dG5hbWUoZ2l0RmlsZSkgPT0gJy5qcycgb3Igc2xhc2guYmFzZW5hbWUoZ2l0RmlsZSkgPT0gJ3BhY2thZ2UuanNvbidcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlICA9IHByZnggKyBwcmV0dHkuZmlsZVBhdGgocmVsUGF0aCwgKGxhbWUgYW5kIG1ba10uZGltIG9yIG1ba10pKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwMDAwICAgIDAwMDAwMCAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIGsgaW4gWydtb2RpZmllZCcsICdjcmVhdGVkJ10gYW5kIGFyZ3MuZGlmZlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBpZiBsYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9IGNoaWxkcC5leGVjU3luYyBcImdpdCBkaWZmIC1VMCAtLWlnbm9yZS1zcGFjZS1hdC1lb2wgI3tnaXRGaWxlfVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuY29kaW5nOiAndXRmOCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjd2Q6IGdpdERpclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiA9IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSAn4pa8Jy5ib2xkLmJsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIGwgaW4gcmVzLnNwbGl0IC9cXHI/XFxuL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxzID0ga2xvci5rb2xvci5zdHJpcCBsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgbHMuc3Vic3RyKDAsNCkgaW4gWycrKysgJywgJy0tLSAnXSB0aGVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBsc1swXSA9PSAnQCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BsaXQgPSBscy5zcGxpdCAnQEAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwbGl0ID0gc3BsaXRbMV0uc3BsaXQgJyArJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGxpdCA9IHNwbGl0WzFdLnNwbGl0ICcsJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IHBhcnNlSW50IHNwbGl0WzBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZmYgKz0gKFwiXFxuXCIrYylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyA9ICfil48nLmJsdWUuZGltXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBsc1swXSA9PSAnKydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiArPSBcIlxcbiBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJncyA9IGtsb3IucmFuZ2VzIGxzLnN1YnN0cigxKSwgc2xhc2guZXh0IGZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgdmFsaWQgcmdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmICs9IHJlbmRlciByZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiArPSBscy5zdWJzdHIoMSkud2hpdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIGxzWzBdID09ICctJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmICs9IFwiXFxuIFwiICsgKGxzLnN1YnN0cigxKSkuZ3JheS5ib2xkLmRpbVxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlICs9IGRpZmYrXCJcXG5cIitcIuKWslwiLmJsdWUuZGltIGlmIGRpZmYubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoIGNoYW5nZVxuXG4gICAgICAgIHJlbFBhdGggPSBzbGFzaC5yZWxhdGl2ZSBnaXREaXIsICcuJ1xuICAgICAgICByZWxQYXRoID0gJy4nIGlmIHJlbFBhdGggPT0gJydcbiAgICAgICAgZ2l0UGF0aCA9IHByZXR0eS5maWxlUGF0aCByZWxQYXRoLCBjb2xvcnMud2hpdGVcblxuICAgICAgICBhaGVhZEJlaGluZCA9ICgpIC0+XG4gICAgICAgICAgICBpZiBzdGF0dXMuYWhlYWQgb3Igc3RhdHVzLmJlaGluZFxuICAgICAgICAgICAgICAgIHN0ID0gJydcbiAgICAgICAgICAgICAgICBpZiBzdGF0dXMuYWhlYWRcbiAgICAgICAgICAgICAgICAgICAgc3QgKz0gXCLilrIgI3tzdGF0dXMuYWhlYWR9XCIuZ3JheS5ib2xkLmJnQmxhY2tcbiAgICAgICAgICAgICAgICBpZiBzdGF0dXMuYmVoaW5kXG4gICAgICAgICAgICAgICAgICAgIHN0ICs9IFwi4pa8ICN7c3RhdHVzLmJlaGluZH1cIi5yZWQuYm9sZC5iZ0JsYWNrXG4gICAgICAgICAgICAgICAgc3QgPSBfLnBhZEVuZCBzdCwgNFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICcnXG5cbiAgICAgICAgbG9nICgnICAgICcgKyBnaXRQYXRoICsgJyAnKS5iZ0JsdWUgKyAnICcgKyBhaGVhZEJlaGluZCgpXG4gICAgICAgIGZvciBjIGluIGNoYW5nZXNcbiAgICAgICAgICAgIGxvZyBjXG5cbm1vZHVsZS5leHBvcnRzID0gXG4gICAgZ2l0U3RhdHVzOmdpdFN0YXR1c1xuIl19
//# sourceURL=../coffee/status.coffee