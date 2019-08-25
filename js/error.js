// koffee 1.4.0

/*
00000000  00000000   00000000    0000000   00000000
000       000   000  000   000  000   000  000   000
0000000   0000000    0000000    000   000  0000000
000       000   000  000   000  000   000  000   000
00000000  000   000  000   000   0000000   000   000
 */
var klog, kolor, konradError, kstr, pretty, ref;

ref = require('kxk'), klog = ref.klog, kstr = ref.kstr, kolor = ref.kolor;

pretty = require('./pretty');

konradError = function(title, msg, srcFile) {
    var msgsplit, stripped;
    if (title === 'compile error') {
        klog(pretty.time(), "😡  " + msg);
    } else {
        msgsplit = msg.split('\n');
        stripped = msgsplit.map(function(s) {
            return kstr.stripAnsi(s);
        });
        klog(title.bold.yellow + " " + (kolor.r5(stripped)));
    }
    return false;
};

module.exports = konradError;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLE1BQXdCLE9BQUEsQ0FBUSxLQUFSLENBQXhCLEVBQUUsZUFBRixFQUFRLGVBQVIsRUFBYzs7QUFFZCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBRVQsV0FBQSxHQUFjLFNBQUMsS0FBRCxFQUFRLEdBQVIsRUFBYSxPQUFiO0FBRVYsUUFBQTtJQUFBLElBQUcsS0FBQSxLQUFTLGVBQVo7UUFDSSxJQUFBLENBQUssTUFBTSxDQUFDLElBQVAsQ0FBQSxDQUFMLEVBQW9CLE1BQUEsR0FBTyxHQUEzQixFQURKO0tBQUEsTUFBQTtRQUdJLFFBQUEsR0FBVyxHQUFHLENBQUMsS0FBSixDQUFVLElBQVY7UUFDWCxRQUFBLEdBQVcsUUFBUSxDQUFDLEdBQVQsQ0FBYSxTQUFDLENBQUQ7bUJBQU8sSUFBSSxDQUFDLFNBQUwsQ0FBZSxDQUFmO1FBQVAsQ0FBYjtRQUNYLElBQUEsQ0FBUSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQVosR0FBbUIsR0FBbkIsR0FBcUIsQ0FBQyxLQUFLLENBQUMsRUFBTixDQUFTLFFBQVQsQ0FBRCxDQUE1QixFQUxKOztXQU1BO0FBUlU7O0FBVWQsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbjAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAwMDAgICAwMDAgIDAwMDAwMDBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbjAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiMjI1xuXG57IGtsb2csIGtzdHIsIGtvbG9yIH0gPSByZXF1aXJlICdreGsnXG5cbnByZXR0eSA9IHJlcXVpcmUgJy4vcHJldHR5J1xuXG5rb25yYWRFcnJvciA9ICh0aXRsZSwgbXNnLCBzcmNGaWxlKSAtPlxuICAgIFxuICAgIGlmIHRpdGxlID09ICdjb21waWxlIGVycm9yJ1xuICAgICAgICBrbG9nIHByZXR0eS50aW1lKCksIFwi8J+YoSAgI3ttc2d9XCJcbiAgICBlbHNlXG4gICAgICAgIG1zZ3NwbGl0ID0gbXNnLnNwbGl0ICdcXG4nXG4gICAgICAgIHN0cmlwcGVkID0gbXNnc3BsaXQubWFwIChzKSAtPiBrc3RyLnN0cmlwQW5zaSBzXG4gICAgICAgIGtsb2cgXCIje3RpdGxlLmJvbGQueWVsbG93fSAje2tvbG9yLnI1IHN0cmlwcGVkfVwiXG4gICAgZmFsc2VcbiAgICBcbm1vZHVsZS5leHBvcnRzID0ga29ucmFkRXJyb3JcbiJdfQ==
//# sourceURL=../coffee/error.coffee