formatLog=$'* [commit](http://github.com/ericholiveira/studio/commit/%H) %s @[%aN](http://github.com/%an)\n %b'
gitLogsResult=`git log --pretty=format:"$formatLog" --all  --no-merges | grep -v "release 0." >> CHANGELOG.md`
