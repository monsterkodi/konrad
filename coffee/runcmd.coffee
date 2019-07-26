###
00000000   000   000  000   000   0000000  00     00  0000000  
000   000  000   000  0000  000  000       000   000  000   000
0000000    000   000  000 0 000  000       000000000  000   000
000   000  000   000  000  0000  000       000 0 000  000   000
000   000   0000000   000   000   0000000  000   000  0000000  
###

{ args, slash, childp, os, klog, _ } = require 'kxk'

pretty      = require './pretty'
konradError = require './error'

runcmd = (cmd, cmdargs, cwd) ->
    
    try
        cmdpath = slash.resolve slash.join __dirname, '..' 'bin' cmd
        
        if slash.win()
            command = "bash #{cmdpath} #{cmdargs}"
        else
            command = "#{cmdpath} #{cmdargs}"
            
        if args.verbose
            klog "🔧 " cmd.gray.reset, pretty.filePath(cmdpath), cmdargs.green

        commandargs = ''
        if process.argv.length > 3
            commandargs = ' ' + process.argv.slice(3).join ' '
            
        childp.execSync command + commandargs,
            cwd:      cwd
            encoding: 'utf8'
            stdio:    'inherit'
            shell:    true
          
    catch err
        konradError "command error" "command '#{cmd}' (#{command}) #{'failed!'}" err
        return false
    true

module.exports = runcmd
