// koffee 1.4.0

/*
 0000000  000000000   0000000   000000000  000   000   0000000
000          000     000   000     000     000   000  000     
0000000      000     000000000     000     000   000  0000000 
     000     000     000   000     000     000   000       000
0000000      000     000   000     000      0000000   0000000
 */
var _, argDir, args, childp, colors, doFetch, doStatus, gitFetch, gitStatus, kerror, klog, klor, pretty, ref, render, slash, valid,
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
    gitStatus: gitStatus,
    gitFetch: gitFetch
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQSw4SEFBQTtJQUFBOztBQVFBLE1BQTBELE9BQUEsQ0FBUSxLQUFSLENBQTFELEVBQUUsbUJBQUYsRUFBVSxtQkFBVixFQUFrQixpQkFBbEIsRUFBeUIsaUJBQXpCLEVBQWdDLGVBQWhDLEVBQXNDLG1CQUF0QyxFQUE4QyxlQUE5QyxFQUFvRDs7QUFFcEQsSUFBQSxHQUFTLE9BQUEsQ0FBUSxNQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUVULFNBQUEsR0FBWSxTQUFDLFVBQUQ7QUFFUixRQUFBO0lBQUEsTUFBQSxHQUFTLEtBQUssQ0FBQyxHQUFOLENBQVUsVUFBVjtJQUNULEdBQUEsR0FBTSxPQUFBLENBQVEsWUFBUixDQUFBLENBQXNCLE1BQXRCO1dBRU4sUUFBQSxDQUFTLEdBQVQsRUFBYyxNQUFkLEVBQXNCLFVBQXRCO0FBTFE7O0FBT1osUUFBQSxHQUFXLFNBQUMsVUFBRDtBQUVQLFFBQUE7SUFBQSxNQUFBLEdBQVMsS0FBSyxDQUFDLEdBQU4sQ0FBVSxVQUFWO0lBQ1QsR0FBQSxHQUFNLE9BQUEsQ0FBUSxZQUFSLENBQUEsQ0FBc0IsTUFBdEI7V0FDTixPQUFBLENBQVEsR0FBUixFQUFhLE1BQWIsRUFBcUIsVUFBckI7QUFKTzs7QUFZWCxPQUFBLEdBQVUsU0FBQyxHQUFELEVBQU0sTUFBTixFQUFjLFVBQWQ7V0FFTixHQUFHLENBQUMsS0FBSixDQUFVLFNBQUMsR0FBRCxFQUFLLE1BQUw7UUFFTixJQUFHLEdBQUg7QUFBWSxtQkFBTyxNQUFBLENBQU8sbUJBQUEsR0FBb0IsR0FBM0IsRUFBbkI7O2VBQ0EsUUFBQSxDQUFTLEdBQVQsRUFBYyxNQUFkLEVBQXNCLFVB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SDs7SUFoR08sQ0FBWDtBQUZPOztBQXFHWCxNQUFNLENBQUMsT0FBUCxHQUNJO0lBQUEsU0FBQSxFQUFVLFNBQVY7SUFDQSxRQUFBLEVBQVMsUUFEVCIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIDAwMDAwMDAgIDAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDBcbjAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgICAgXG4wMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAwMDAwIFxuICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgICAwMDBcbjAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgXG4jIyNcblxueyBjb2xvcnMsIGNoaWxkcCwgc2xhc2gsIHZhbGlkLCBhcmdzLCBrZXJyb3IsIGtsb2csIF8gfSA9IHJlcXVpcmUgJ2t4aydcblxua2xvciAgID0gcmVxdWlyZSAna2xvcidcbnJlbmRlciA9IHJlcXVpcmUgJy4vcmVuZGVyJ1xuYXJnRGlyID0gcmVxdWlyZSAnLi9hcmdkaXInXG5wcmV0dHkgPSByZXF1aXJlICcuL3ByZXR0eSdcblxuZ2l0U3RhdHVzID0gKHNvdXJjZUZpbGUpIC0+XG5cbiAgICBnaXREaXIgPSBzbGFzaC5kaXIgc291cmNlRmlsZVxuICAgIGdpdCA9IHJlcXVpcmUoJ3NpbXBsZS1naXQnKSBnaXREaXJcbiAgICAjIGRvRmV0Y2ggZ2l0LCBnaXREaXIsIHNvdXJjZUZpbGVcbiAgICBkb1N0YXR1cyBnaXQsIGdpdERpciwgc291cmNlRmlsZVxuICAgIFxuZ2l0RmV0Y2ggPSAoc291cmNlRmlsZSkgLT5cblxuICAgIGdpdERpciA9IHNsYXNoLmRpciBzb3VyY2VGaWxlXG4gICAgZ2l0ID0gcmVxdWlyZSgnc2ltcGxlLWdpdCcpIGdpdERpclxuICAgIGRvRmV0Y2ggZ2l0LCBnaXREaXIsIHNvdXJjZUZpbGVcbiAgICBcbiMgMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIFxuIyAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgXG4jIDAwMDAwMCAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwMDAwMDAwICBcbiMgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIFxuIyAwMDAgICAgICAgMDAwMDAwMDAgICAgIDAwMCAgICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgXG5cbmRvRmV0Y2ggPSAoZ2l0LCBnaXREaXIsIHNvdXJjZUZpbGUpIC0+XG4gICAgXG4gICAgZ2l0LmZldGNoIChlcnIsc3RhdHVzKSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgZXJyIHRoZW4gcmV0dXJuIGtlcnJvciBcImdpdCBmZXRjaCBrZXJyb3IgI3tlcnJ9XCJcbiAgICAgICAgZG9TdGF0dXMgZ2l0LCBnaXREaXIsIHNvdXJjZUZpbGVcbiAgICAgICAgXG4jICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICBcbiMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIFxuIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgXG4jICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgICAgICAgMDAwICBcbiMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgIFxuXG5kb1N0YXR1cyA9IChnaXQsIGdpdERpciwgc291cmNlRmlsZSkgLT5cbiAgICAgXG4gICAgZ2l0LnN0YXR1cyAoZXJyLHN0YXR1cykgLT5cblxuICAgICAgICBpZiBlcnIgdGhlbiByZXR1cm4ga2Vycm9yIFwiZ2l0IHN0YXR1cyBlcnJvciAje2Vycn1cIlxuXG4gICAgICAgIGNoYW5nZXMgPSBbXVxuXG4gICAgICAgIGZpbGVMaXN0cyA9IF8ub21pdEJ5IHN0YXR1cywgKHYsaykgLT4gXy5pc0VtcHR5IHZcblxuICAgICAgICBmb3Igayx2IG9mIGZpbGVMaXN0c1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBtID1cbiAgICAgICAgICAgICAgICBub3RfYWRkZWQ6ICBjb2xvcnMuZ3JheVxuICAgICAgICAgICAgICAgIGNvbmZsaWN0ZWQ6IGNvbG9ycy55ZWxsb3dcbiAgICAgICAgICAgICAgICBtb2RpZmllZDogICBjb2xvcnMuZ3JlZW5cbiAgICAgICAgICAgICAgICBjcmVhdGVkOiAgICBjb2xvcnMubWFnZW50YVxuICAgICAgICAgICAgICAgIGRlbGV0ZWQ6ICAgIGNvbG9ycy5yZWRcblxuICAgICAgICAgICAgaWYgayBpbiBfLmtleXMgbVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZvciBmIGluIHN0YXR1c1trXSA/IFtdXG4gICAgICAgICAgICAgICAgICAgIGQgPSBhcmdEaXIoKVxuXG4gICAgICAgICAgICAgICAgICAgIGFyZ2xpc3QgPSBfLmZpbHRlciBhcmdzLmFyZ3VtZW50cywgKGEpIC0+IGEgbm90IGluIFsnZmV0Y2gnXVxuICAgICAgICAgICAgICAgICAgICBpZiBhcmdsaXN0Lmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgYSBpbiBhcmdsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgc2xhc2guam9pbihnaXREaXIsIGYpLmluZGV4T2Yoc2xhc2gucmVzb2x2ZSBhKSA9PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGZpbHRlcmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2xvZyAnZmlsdGVyZWQnLCBzbGFzaC5yZXNvbHZlKGEpLCBmLCBzbGFzaC5qb2luKGdpdERpciwgZikgaWYgYXJncy5kZWJ1Z1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgICAgICAgICAgcHJmeCAgICA9IFwiICAgIFwiXG4gICAgICAgICAgICAgICAgICAgIHByZnggICAgPSBtW2tdIFwi4paIICAgXCJcbiAgICAgICAgICAgICAgICAgICAgZ2l0RmlsZSA9IHNsYXNoLmpvaW4gZ2l0RGlyLCBmXG4gICAgICAgICAgICAgICAgICAgIHJlbFBhdGggPSBzbGFzaC5yZWxhdGl2ZSBnaXRGaWxlLCAnLidcbiAgICAgICAgICAgICAgICAgICAgbGFtZSAgICA9IHNsYXNoLmV4dG5hbWUoZ2l0RmlsZSkgPT0gJy5qcycgb3Igc2xhc2guYmFzZW5hbWUoZ2l0RmlsZSkgPT0gJ3BhY2thZ2UuanNvbidcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlICA9IHByZnggKyBwcmV0dHkuZmlsZVBhdGgocmVsUGF0aCwgKGxhbWUgYW5kIG1ba10uZGltIG9yIG1ba10pKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwMDAwICAgIDAwMDAwMCAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIGsgaW4gWydtb2RpZmllZCcsICdjcmVhdGVkJ10gYW5kIGFyZ3MuZGlmZlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBpZiBsYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9IGNoaWxkcC5leGVjU3luYyBcImdpdCBkaWZmIC1VMCAtLWlnbm9yZS1zcGFjZS1hdC1lb2wgI3tnaXRGaWxlfVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuY29kaW5nOiAndXRmOCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjd2Q6IGdpdERpclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiA9IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSAn4pa8Jy5ib2xkLmJsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIGwgaW4gcmVzLnNwbGl0IC9cXHI/XFxuL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxzID0ga2xvci5rb2xvci5zdHJpcCBsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgbHMuc3Vic3RyKDAsNCkgaW4gWycrKysgJywgJy0tLSAnXSB0aGVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBsc1swXSA9PSAnQCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BsaXQgPSBscy5zcGxpdCAnQEAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwbGl0ID0gc3BsaXRbMV0uc3BsaXQgJyArJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGxpdCA9IHNwbGl0WzFdLnNwbGl0ICcsJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IHBhcnNlSW50IHNwbGl0WzBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZmYgKz0gKFwiXFxuXCIrYylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyA9ICfil48nLmJsdWUuZGltXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBsc1swXSA9PSAnKydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiArPSBcIlxcbiBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJncyA9IGtsb3IucmFuZ2VzIGxzLnN1YnN0cigxKSwgc2xhc2guZXh0IGZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgdmFsaWQgcmdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmICs9IHJlbmRlciByZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiArPSBscy5zdWJzdHIoMSkud2hpdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIGxzWzBdID09ICctJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmICs9IFwiXFxuIFwiICsgKGxzLnN1YnN0cigxKSkuZ3JheS5ib2xkLmRpbVxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlICs9IGRpZmYrXCJcXG5cIitcIuKWslwiLmJsdWUuZGltIGlmIGRpZmYubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoIGNoYW5nZVxuXG4gICAgICAgIHJlbFBhdGggPSBzbGFzaC5yZWxhdGl2ZSBnaXREaXIsICcuJ1xuICAgICAgICByZWxQYXRoID0gJy4nIGlmIHJlbFBhdGggPT0gJydcbiAgICAgICAgZ2l0UGF0aCA9IHByZXR0eS5maWxlUGF0aCByZWxQYXRoLCBjb2xvcnMud2hpdGVcblxuICAgICAgICBhaGVhZEJlaGluZCA9ICgpIC0+XG4gICAgICAgICAgICBpZiBzdGF0dXMuYWhlYWQgb3Igc3RhdHVzLmJlaGluZFxuICAgICAgICAgICAgICAgIHN0ID0gJydcbiAgICAgICAgICAgICAgICBpZiBzdGF0dXMuYWhlYWRcbiAgICAgICAgICAgICAgICAgICAgc3QgKz0gXCLilrIgI3tzdGF0dXMuYWhlYWR9XCIuZ3JheS5ib2xkLmJnQmxhY2tcbiAgICAgICAgICAgICAgICBpZiBzdGF0dXMuYmVoaW5kXG4gICAgICAgICAgICAgICAgICAgIHN0ICs9IFwi4pa8ICN7c3RhdHVzLmJlaGluZH1cIi5yZWQuYm9sZC5iZ0JsYWNrXG4gICAgICAgICAgICAgICAgc3QgPSBfLnBhZEVuZCBzdCwgNFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICcnXG5cbiAgICAgICAgbG9nICgnICAgICcgKyBnaXRQYXRoICsgJyAnKS5iZ0JsdWUgKyAnICcgKyBhaGVhZEJlaGluZCgpXG4gICAgICAgIGZvciBjIGluIGNoYW5nZXNcbiAgICAgICAgICAgIGxvZyBjXG5cbm1vZHVsZS5leHBvcnRzID0gXG4gICAgZ2l0U3RhdHVzOmdpdFN0YXR1c1xuICAgIGdpdEZldGNoOmdpdEZldGNoXG4iXX0=
//# sourceURL=../coffee/status.coffee