// koffee 0.45.0

/*
00000000   00000000   00000000  000000000  000000000  000   000
000   000  000   000  000          000        000      000 000
00000000   0000000    0000000      000        000       00000
000        000   000  000          000        000        000
000        000   000  00000000     000        000        000
 */
var _, args, colors, os, pretty, ref, slash, valid;

ref = require('kxk'), args = ref.args, valid = ref.valid, colors = ref.colors, slash = ref.slash, os = ref.os, _ = ref._;

pretty = {};

pretty.path = function(p, c) {
    if (c == null) {
        c = colors.yellow;
    }
    return p.split('/').map(function(n) {
        return c(n);
    }).join(c('/').dim);
};

pretty.ext = function(e, c) {
    if (c == null) {
        c = colors.yellow;
    }
    if (e.length) {
        return c('.').dim + c(e.substr(1));
    } else {
        return '';
    }
};

pretty.file = function(f, c) {
    if (c == null) {
        c = colors.yellow;
    }
    return "" + (c(slash.base(f)).bold) + (pretty.ext(slash.extname(f), c));
};

pretty.filePath = function(p, c) {
    if (c == null) {
        c = colors.yellow;
    }
    p = p.replace(os.homedir(), "~");
    if (valid(slash.dir(p))) {
        return "" + (pretty.path(slash.dir(p), c)) + (pretty.path('/', c)) + (pretty.file(slash.basename(p), c));
    } else {
        return "" + (pretty.file(slash.basename(p), c));
    }
};

pretty.time = function() {
    var d;
    if (args.logtime) {
        d = new Date();
        return ["" + (_.padStart(String(d.getHours()), 2, '0').gray) + ':'.dim.gray, "" + (_.padStart(String(d.getMinutes()), 2, '0').gray) + ':'.dim.gray, "" + (_.padStart(String(d.getSeconds()), 2, '0').gray)].join('');
    } else {
        return '';
    }
};

module.exports = pretty;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldHR5LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQTs7QUFRQSxNQUF3QyxPQUFBLENBQVEsS0FBUixDQUF4QyxFQUFFLGVBQUYsRUFBUSxpQkFBUixFQUFlLG1CQUFmLEVBQXVCLGlCQUF2QixFQUE4QixXQUE5QixFQUFrQzs7QUFFbEMsTUFBQSxHQUFTOztBQUVULE1BQU0sQ0FBQyxJQUFQLEdBQWMsU0FBQyxDQUFELEVBQUksQ0FBSjs7UUFBSSxJQUFFLE1BQU0sQ0FBQzs7V0FDdkIsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxHQUFSLENBQVksQ0FBQyxHQUFiLENBQWlCLFNBQUMsQ0FBRDtlQUFPLENBQUEsQ0FBRSxDQUFGO0lBQVAsQ0FBakIsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxDQUFBLENBQUUsR0FBRixDQUFNLENBQUMsR0FBMUM7QUFEVTs7QUFHZCxNQUFNLENBQUMsR0FBUCxHQUFhLFNBQUMsQ0FBRCxFQUFJLENBQUo7O1FBQUksSUFBRSxNQUFNLENBQUM7O0lBQ3RCLElBQUcsQ0FBQyxDQUFDLE1BQUw7ZUFBaUIsQ0FBQSxDQUFFLEdBQUYsQ0FBTSxDQUFDLEdBQVAsR0FBYSxDQUFBLENBQUUsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxDQUFULENBQUYsRUFBOUI7S0FBQSxNQUFBO2VBQWlELEdBQWpEOztBQURTOztBQUdiLE1BQU0sQ0FBQyxJQUFQLEdBQWMsU0FBQyxDQUFELEVBQUksQ0FBSjs7UUFBSSxJQUFFLE1BQU0sQ0FBQzs7V0FDdkIsRUFBQSxHQUFFLENBQUMsQ0FBQSxDQUFFLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBWCxDQUFGLENBQWdCLENBQUMsSUFBbEIsQ0FBRixHQUEwQixDQUFDLE1BQU0sQ0FBQyxHQUFQLENBQVcsS0FBSyxDQUFDLE9BQU4sQ0FBYyxDQUFkLENBQVgsRUFBNkIsQ0FBN0IsQ0FBRDtBQURoQjs7QUFHZCxNQUFNLENBQUMsUUFBUCxHQUFrQixTQUFDLENBQUQsRUFBSSxDQUFKOztRQUFJLElBQUUsTUFBTSxDQUFDOztJQUMzQixDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQUYsQ0FBVSxFQUFFLENBQUMsT0FBSCxDQUFBLENBQVYsRUFBd0IsR0FBeEI7SUFDSixJQUFHLEtBQUEsQ0FBTSxLQUFLLENBQUMsR0FBTixDQUFVLENBQVYsQ0FBTixDQUFIO2VBQ0ksRUFBQSxHQUFFLENBQUMsTUFBTSxDQUFDLElBQVAsQ0FBWSxLQUFLLENBQUMsR0FBTixDQUFVLENBQVYsQ0FBWixFQUEwQixDQUExQixDQUFELENBQUYsR0FBZ0MsQ0FBQyxNQUFNLENBQUMsSUFBUCxDQUFZLEdBQVosRUFBaUIsQ0FBakIsQ0FBRCxDQUFoQyxHQUFxRCxDQUFDLE1BQU0sQ0FBQyxJQUFQLENBQVksS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLENBQVosRUFBK0IsQ0FBL0IsQ0FBRCxFQUR6RDtLQUFBLE1BQUE7ZUFHSSxFQUFBLEdBQUUsQ0FBQyxNQUFNLENBQUMsSUFBUCxDQUFZLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBZixDQUFaLEVBQStCLENBQS9CLENBQUQsRUFITjs7QUFGYzs7QUFPbEIsTUFBTSxDQUFDLElBQVAsR0FBYyxTQUFBO0FBRVYsUUFBQTtJQUFBLElBQUcsSUFBSSxDQUFDLE9BQVI7UUFDSSxDQUFBLEdBQUksSUFBSSxJQUFKLENBQUE7ZUFDSixDQUFDLEVBQUEsR0FBRSxDQUFDLENBQUMsQ0FBQyxRQUFGLENBQVcsTUFBQSxDQUFPLENBQUMsQ0FBQyxRQUFGLENBQUEsQ0FBUCxDQUFYLEVBQW1DLENBQW5DLEVBQXNDLEdBQXRDLENBQTBDLENBQUMsSUFBNUMsQ0FBRixHQUFxRCxHQUFHLENBQUMsR0FBRyxDQUFDLElBQTlELEVBQ0MsRUFBQSxHQUFFLENBQUMsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxNQUFBLENBQU8sQ0FBQyxDQUFDLFVBQUYsQ0FBQSxDQUFQLENBQVgsRUFBbUMsQ0FBbkMsRUFBc0MsR0FBdEMsQ0FBMEMsQ0FBQyxJQUE1QyxDQUFGLEdBQXFELEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFEOUQsRUFFQyxFQUFBLEdBQUUsQ0FBQyxDQUFDLENBQUMsUUFBRixDQUFXLE1BQUEsQ0FBTyxDQUFDLENBQUMsVUFBRixDQUFBLENBQVAsQ0FBWCxFQUFtQyxDQUFuQyxFQUFzQyxHQUF0QyxDQUEwQyxDQUFDLElBQTVDLENBRkgsQ0FFc0QsQ0FBQyxJQUZ2RCxDQUU0RCxFQUY1RCxFQUZKO0tBQUEsTUFBQTtlQU1JLEdBTko7O0FBRlU7O0FBVWQsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbjAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMFxuMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgICAgIDAwMCAgICAgIDAwMCAwMDBcbjAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgMDAwICAgICAgICAwMDAgICAgICAgMDAwMDBcbjAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAgICAwMDAgICAgICAgIDAwMFxuMDAwICAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAwICAgICAwMDAgICAgICAgIDAwMCAgICAgICAgMDAwXG4jIyNcblxueyBhcmdzLCB2YWxpZCwgY29sb3JzLCBzbGFzaCwgb3MsIF8gfSA9IHJlcXVpcmUgJ2t4aydcblxucHJldHR5ID0ge31cblxucHJldHR5LnBhdGggPSAocCwgYz1jb2xvcnMueWVsbG93KSAtPlxuICAgIHAuc3BsaXQoJy8nKS5tYXAoKG4pIC0+IGMobikpLmpvaW4gYygnLycpLmRpbVxuXG5wcmV0dHkuZXh0ID0gKGUsIGM9Y29sb3JzLnllbGxvdykgLT5cbiAgICBpZiBlLmxlbmd0aCB0aGVuIGMoJy4nKS5kaW0gKyBjKGUuc3Vic3RyIDEpIGVsc2UgJydcbiAgICBcbnByZXR0eS5maWxlID0gKGYsIGM9Y29sb3JzLnllbGxvdykgLT5cbiAgICBcIiN7YyhzbGFzaC5iYXNlKGYpKS5ib2xkfSN7cHJldHR5LmV4dCBzbGFzaC5leHRuYW1lKGYpLCBjfVwiXG4gICAgXG5wcmV0dHkuZmlsZVBhdGggPSAocCwgYz1jb2xvcnMueWVsbG93KSAtPlxuICAgIHAgPSBwLnJlcGxhY2Ugb3MuaG9tZWRpcigpLCBcIn5cIlxuICAgIGlmIHZhbGlkIHNsYXNoLmRpciBwIFxuICAgICAgICBcIiN7cHJldHR5LnBhdGggc2xhc2guZGlyKHApLCBjfSN7cHJldHR5LnBhdGggJy8nLCBjfSN7cHJldHR5LmZpbGUgc2xhc2guYmFzZW5hbWUocCksIGN9XCJcbiAgICBlbHNlXG4gICAgICAgIFwiI3twcmV0dHkuZmlsZSBzbGFzaC5iYXNlbmFtZShwKSwgY31cIlxuXG5wcmV0dHkudGltZSA9IC0+XG4gICAgXG4gICAgaWYgYXJncy5sb2d0aW1lXG4gICAgICAgIGQgPSBuZXcgRGF0ZSgpXG4gICAgICAgIFtcIiN7Xy5wYWRTdGFydChTdHJpbmcoZC5nZXRIb3VycygpKSwgICAyLCAnMCcpLmdyYXl9I3snOicuZGltLmdyYXl9XCJcbiAgICAgICAgIFwiI3tfLnBhZFN0YXJ0KFN0cmluZyhkLmdldE1pbnV0ZXMoKSksIDIsICcwJykuZ3JheX0jeyc6Jy5kaW0uZ3JheX1cIlxuICAgICAgICAgXCIje18ucGFkU3RhcnQoU3RyaW5nKGQuZ2V0U2Vjb25kcygpKSwgMiwgJzAnKS5ncmF5fVwiXS5qb2luKCcnKVxuICAgIGVsc2VcbiAgICAgICAgJydcbiAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IHByZXR0eVxuIl19
//# sourceURL=../coffee/pretty.coffee