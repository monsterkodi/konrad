###
 0000000   00000000    0000000    0000000
000   000  000   000  000        000     
000000000  0000000    000  0000  0000000 
000   000  000   000  000   000       000
000   000  000   000   0000000   0000000 
###

{ karg, log, _ } = require 'kxk'

pkg = require '../package.json'

module.exports = karg """

konrad
    arguments  . ? see arguments                   . **
    bump       . ? bump package.* version          . = false
    commit     . ? add, commit and push            . = false
    publish    . ? bump, commit & publish to npm   . = false
    update     . ? update npm packages             . = false
    test       . ? run tests                       . = false
    watch      . ? watch directory for changes     . = false
    run        . ? build dirty or missing targets  . = false
    rebuild    . ? rebuild all targets             . = false . - R
    info       . ? show build status               . = false
    status     . ? show git status                 . = false
    diff       . ? show git diff                   . = false
    verbose    . ? log more                        . = false
    quiet      . ? log nothing                     . = false
    debug      . ? log debug                       . = false . - D
    logtime    . ? log with time                   . = true

arguments
    watch        directory to watch         #{'.'.magenta}
    info         directory to inspect       #{'.'.magenta}
    status       files or directory         #{'.'.magenta}
    diff         files or directory         #{'.'.magenta}
    run          directory to build         #{'.'.magenta}
    rebuild      directory to rebuild       #{'.'.magenta}
    bump         semver version             #{'minor'.magenta}
    commit       commit message
    publish      commit message

version  #{pkg.version}
"""
