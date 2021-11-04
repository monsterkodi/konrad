###
00000000   000   000  000   000   0000000  00     00  0000000  
000   000  000   000  0000  000  000       000   000  000   000
0000000    000   000  000 0 000  000       000000000  000   000
000   000  000   000  000  0000  000       000 0 000  000   000
000   000   0000000   000   000   0000000  000   000  0000000  
###

{ args, childp, klog, kolor, slash, valid } = require 'kxk'

pretty      = require './pretty'
konradError = require './error'

runcmd = (cmd, cmdargs, cwd) ->
    
    try
        if cmd == 'test'
            if valid(cmdargs) and 0 < cmdargs.indexOf('.coffee')
                cmdpath = 'mocha -c --require koffee/js/register '
            else
                cmdpath = 'npm run test'
        else
            cmdpath = slash.resolve slash.join __dirname, '..' 'bin' cmd
        
        if slash.win()
            command = "bash #{cmdpath} #{cmdargs}"
        else
            command = "#{cmdpath} #{cmdargs}"
                        
        if args.verbose
            klog "🔧 " kolor.gray(cmd), pretty.filePath(command)
                
        result = childp.execSync command,
            cwd:      cwd
            encoding: 'utf8'
            stdio:    'inherit'
            shell:    true
            
        # klog 'result' result
          
    catch err
        konradError "command error" "command '#{cmd}' (#{command}) #{'failed!'}" err
        return false
    true

module.exports = runcmd
