#!/usr/bin/env bash
cd `dirname $0`/..

coffee -o js -c coffee/*.coffee
