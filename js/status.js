// koffee 0.30.0

/*
 0000000  000000000   0000000   000000000  000   000   0000000
000          000     000   000     000     000   000  000     
0000000      000     000000000     000     000   000  0000000 
     000     000     000   000     000     000   000       000
0000000      000     000   000     000      0000000   0000000
 */
var _, argDir, args, childp, colors, doFetch, doStatus, error, gitStatus, klor, log, pretty, ref, render, slash, valid,
    indexOf = [].indexOf;

ref = require('kxk'), colors = ref.colors, childp = ref.childp, slash = ref.slash, valid = ref.valid, args = ref.args, error = ref.error, log = ref.log, _ = ref._;

log = console.log;

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
            return console.error("git fetch error " + err);
        }
        return doStatus(git, gitDir, sourceFile);
    });
};

doStatus = function(git, gitDir, sourceFile) {
    return git.status(function(err, status) {
        var a, aheadBehind, arglist, c, change, changes, d, diff, f, fileLists, filtered, gitFile, gitPath, i, j, k, l, lame, len, len1, len2, len3, ls, m, n, o, prfx, ref1, ref2, ref3, ref4, relPath, res, results, rgs, split, start, v;
        if (err) {
            return console.error("git status error " + err);
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
                                console.log('filtered', slash.resolve(a), f, slash.join(gitDir, f));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQSxrSEFBQTtJQUFBOztBQVFBLE1BQXdELE9BQUEsQ0FBUSxLQUFSLENBQXhELEVBQUUsbUJBQUYsRUFBVSxtQkFBVixFQUFrQixpQkFBbEIsRUFBeUIsaUJBQXpCLEVBQWdDLGVBQWhDLEVBQXNDLGlCQUF0QyxFQUE2QyxhQUE3QyxFQUFrRDs7QUFFbEQsR0FBQSxHQUFTLE9BQU8sQ0FBQzs7QUFDakIsSUFBQSxHQUFTLE9BQUEsQ0FBUSxNQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUVULFNBQUEsR0FBWSxTQUFDLFVBQUQ7QUFFUixRQUFBO0lBQUEsTUFBQSxHQUFTLEtBQUssQ0FBQyxHQUFOLENBQVUsVUFBVjtJQUNULEdBQUEsR0FBTSxPQUFBLENBQVEsWUFBUixDQUFBLENBQXNCLE1BQXRCO1dBQ04sT0FBQSxDQUFRLEdBQVIsRUFBYSxNQUFiLEVBQXFCLFVBQXJCO0FBSlE7O0FBWVosT0FBQSxHQUFVLFNBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxVQUFkO1dBRU4sR0FBRyxDQUFDLEtBQUosQ0FBVSxTQUFDLEdBQUQsRUFBSyxNQUFMO1FBRU4sSUFBRyxHQUFIO0FBQVksbUJBQUssT0FBQSxDQUFFLEtBQUYsQ0FBUSxrQkFBQSxHQUFtQixHQUEzQixFQUFqQjs7ZUFDQSxRQUFBLENBQVMsR0FBVCxFQUFjLE1BQWQsRUFBc0IsVUFBdEI7SUFITSxDQUFWO0FBRk07O0FBYVYsUUFBQSxHQUFXLFNBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxVQUFkO1dBRVAsR0FBRyxDQUFDLE1BQUosQ0FBVyxTQUFDLEdBQUQsRUFBSyxNQUFMO0FBRVAsWUFBQTtRQUFBLElBQUcsR0FB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MDAwMDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMFxuMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgICBcbjAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMDAwMDAgXG4gICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAgIDAwMFxuMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgICAwMDAwMDAwICAgMDAwMDAwMCBcbiMjI1xuXG57IGNvbG9ycywgY2hpbGRwLCBzbGFzaCwgdmFsaWQsIGFyZ3MsIGVycm9yLCBsb2csIF8gfSA9IHJlcXVpcmUgJ2t4aydcblxubG9nICAgID0gY29uc29sZS5sb2dcbmtsb3IgICA9IHJlcXVpcmUgJ2tsb3InXG5yZW5kZXIgPSByZXF1aXJlICcuL3JlbmRlcidcbmFyZ0RpciA9IHJlcXVpcmUgJy4vYXJnZGlyJ1xucHJldHR5ID0gcmVxdWlyZSAnLi9wcmV0dHknXG5cbmdpdFN0YXR1cyA9IChzb3VyY2VGaWxlKSAtPlxuXG4gICAgZ2l0RGlyID0gc2xhc2guZGlyIHNvdXJjZUZpbGVcbiAgICBnaXQgPSByZXF1aXJlKCdzaW1wbGUtZ2l0JykgZ2l0RGlyXG4gICAgZG9GZXRjaCBnaXQsIGdpdERpciwgc291cmNlRmlsZVxuICAgIFxuIyAwMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgXG4jIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwICBcbiMgMDAwMDAwICAgIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAwMDAwMDAgIFxuIyAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgXG4jIDAwMCAgICAgICAwMDAwMDAwMCAgICAgMDAwICAgICAgMDAwMDAwMCAgMDAwICAgMDAwICBcblxuZG9GZXRjaCA9IChnaXQsIGdpdERpciwgc291cmNlRmlsZSkgLT5cbiAgICBcbiAgICBnaXQuZmV0Y2ggKGVycixzdGF0dXMpIC0+XG4gICAgICAgIFxuICAgICAgICBpZiBlcnIgdGhlbiByZXR1cm4gZXJyb3IgXCJnaXQgZmV0Y2ggZXJyb3IgI3tlcnJ9XCJcbiAgICAgICAgZG9TdGF0dXMgZ2l0LCBnaXREaXIsIHNvdXJjZUZpbGVcbiAgICAgICAgXG4jICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICBcbiMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIFxuIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgXG4jICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgICAgICAgMDAwICBcbiMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgIFxuXG5kb1N0YXR1cyA9IChnaXQsIGdpdERpciwgc291cmNlRmlsZSkgLT5cbiAgICAgICAgXG4gICAgZ2l0LnN0YXR1cyAoZXJyLHN0YXR1cykgLT5cblxuICAgICAgICBpZiBlcnIgdGhlbiByZXR1cm4gZXJyb3IgXCJnaXQgc3RhdHVzIGVycm9yICN7ZXJyfVwiXG5cbiAgICAgICAgY2hhbmdlcyA9IFtdXG5cbiAgICAgICAgZmlsZUxpc3RzID0gXy5vbWl0Qnkgc3RhdHVzLCAodixrKSAtPiBfLmlzRW1wdHkgdlxuXG4gICAgICAgIGZvciBrLHYgb2YgZmlsZUxpc3RzXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG0gPVxuICAgICAgICAgICAgICAgIG5vdF9hZGRlZDogIGNvbG9ycy5ncmF5XG4gICAgICAgICAgICAgICAgY29uZmxpY3RlZDogY29sb3JzLnllbGxvd1xuICAgICAgICAgICAgICAgIG1vZGlmaWVkOiAgIGNvbG9ycy5ncmVlblxuICAgICAgICAgICAgICAgIGNyZWF0ZWQ6ICAgIGNvbG9ycy5tYWdlbnRhXG4gICAgICAgICAgICAgICAgZGVsZXRlZDogICAgY29sb3JzLnJlZFxuXG4gICAgICAgICAgICBpZiBrIGluIF8ua2V5cyBtXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yIGYgaW4gc3RhdHVzW2tdID8gW11cbiAgICAgICAgICAgICAgICAgICAgZCA9IGFyZ0RpcigpXG5cbiAgICAgICAgICAgICAgICAgICAgYXJnbGlzdCA9IF8uZmlsdGVyIGFyZ3MuYXJndW1lbnRzLCAoYSkgLT4gYSBub3QgaW4gWydmZXRjaCddXG4gICAgICAgICAgICAgICAgICAgIGlmIGFyZ2xpc3QubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciBhIGluIGFyZ2xpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBzbGFzaC5qb2luKGdpdERpciwgZikuaW5kZXhPZihzbGFzaC5yZXNvbHZlIGEpID09IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQgPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgZmlsdGVyZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2cgJ2ZpbHRlcmVkJywgc2xhc2gucmVzb2x2ZShhKSwgZiwgc2xhc2guam9pbihnaXREaXIsIGYpIGlmIGFyZ3MuZGVidWdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgICAgICAgICAgICAgIHByZnggICAgPSBcIiAgICBcIlxuICAgICAgICAgICAgICAgICAgICBwcmZ4ICAgID0gbVtrXSBcIuKWiCAgIFwiXG4gICAgICAgICAgICAgICAgICAgIGdpdEZpbGUgPSBzbGFzaC5qb2luIGdpdERpciwgZlxuICAgICAgICAgICAgICAgICAgICByZWxQYXRoID0gc2xhc2gucmVsYXRpdmUgZ2l0RmlsZSwgJy4nXG4gICAgICAgICAgICAgICAgICAgIGxhbWUgICAgPSBzbGFzaC5leHRuYW1lKGdpdEZpbGUpID09ICcuanMnIG9yIHNsYXNoLmJhc2VuYW1lKGdpdEZpbGUpID09ICdwYWNrYWdlLmpzb24nXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZSAgPSBwcmZ4ICsgcHJldHR5LmZpbGVQYXRoKHJlbFBhdGgsIChsYW1lIGFuZCBtW2tdLmRpbSBvciBtW2tdKSlcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCAgXG4gICAgICAgICAgICAgICAgICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICMgMDAwICAgMDAwICAwMDAgIDAwMDAwMCAgICAwMDAwMDAgICAgXG4gICAgICAgICAgICAgICAgICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiBrIGluIFsnbW9kaWZpZWQnLCAnY3JlYXRlZCddIGFuZCBhcmdzLmRpZmZcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWUgaWYgbGFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgPSBjaGlsZHAuZXhlY1N5bmMgXCJnaXQgZGlmZiAtVTAgLS1pZ25vcmUtc3BhY2UtYXQtZW9sICN7Z2l0RmlsZX1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmNvZGluZzogJ3V0ZjgnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3dkOiBnaXREaXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmYgPSBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjID0gJ+KWvCcuYm9sZC5ibHVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciBsIGluIHJlcy5zcGxpdCAvXFxyP1xcbi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBscyA9IGNvbG9ycy5zdHJpcChsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIGxzLnN1YnN0cigwLDQpIGluIFsnKysrICcsICctLS0gJ10gdGhlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgbHNbMF0gPT0gJ0AnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwbGl0ID0gbHMuc3BsaXQgJ0BAJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGxpdCA9IHNwbGl0WzFdLnNwbGl0ICcgKydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BsaXQgPSBzcGxpdFsxXS5zcGxpdCAnLCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBwYXJzZUludCBzcGxpdFswXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmICs9IChcIlxcblwiK2MpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMgPSAn4pePJy5ibHVlLmRpbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgbHNbMF0gPT0gJysnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZmYgKz0gXCJcXG4gXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBkaWZmICs9IFwiXHUwMDFiWzA7N20je3NsYXNoLmpvaW4oZ2l0RGlyLCBmKX06I3tzdGFydH1cdTAwMWJbMG1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJncyA9IGtsb3IucmFuZ2VzIGxzLnN1YnN0cigxKSwgc2xhc2guZXh0IGZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgdmFsaWQgcmdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmICs9IHJlbmRlciByZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiArPSBscy5zdWJzdHIoMSkud2hpdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIGxzWzBdID09ICctJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmICs9IFwiXFxuIFwiICsgKGxzLnN1YnN0cigxKSkuZ3JheS5ib2xkLmRpbVxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlICs9IGRpZmYrXCJcXG5cIitcIuKWslwiLmJsdWUuZGltIGlmIGRpZmYubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoIGNoYW5nZVxuXG4gICAgICAgIHJlbFBhdGggPSBzbGFzaC5yZWxhdGl2ZSBnaXREaXIsICcuJ1xuICAgICAgICByZWxQYXRoID0gJy4nIGlmIHJlbFBhdGggPT0gJydcbiAgICAgICAgZ2l0UGF0aCA9IHByZXR0eS5maWxlUGF0aCByZWxQYXRoLCBjb2xvcnMud2hpdGVcblxuICAgICAgICBhaGVhZEJlaGluZCA9ICgpIC0+XG4gICAgICAgICAgICBpZiBzdGF0dXMuYWhlYWQgb3Igc3RhdHVzLmJlaGluZFxuICAgICAgICAgICAgICAgIHN0ID0gJydcbiAgICAgICAgICAgICAgICBpZiBzdGF0dXMuYWhlYWRcbiAgICAgICAgICAgICAgICAgICAgc3QgKz0gXCLilrIgI3tzdGF0dXMuYWhlYWR9XCIuZ3JheS5ib2xkLmJnQmxhY2tcbiAgICAgICAgICAgICAgICBpZiBzdGF0dXMuYmVoaW5kXG4gICAgICAgICAgICAgICAgICAgIHN0ICs9IFwi4pa8ICN7c3RhdHVzLmJlaGluZH1cIi5yZWQuYm9sZC5iZ0JsYWNrXG4gICAgICAgICAgICAgICAgc3QgPSBfLnBhZEVuZCBzdCwgNFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICcnXG5cbiAgICAgICAgbG9nICgnICAgICcgKyBnaXRQYXRoICsgJyAnKS5iZ0JsdWUgKyAnICcgKyBhaGVhZEJlaGluZCgpXG4gICAgICAgIGZvciBjIGluIGNoYW5nZXNcbiAgICAgICAgICAgIGxvZyBjXG5cbm1vZHVsZS5leHBvcnRzID0gXG4gICAgZ2l0U3RhdHVzOmdpdFN0YXR1c1xuIl19
//# sourceURL=../coffee/status.coffee