formatLog=$'* [commit](http://github.com/ericholiveira/studio/commit/%H) %s \n %b'
gitLogsResult=`git log --pretty=format:"$formatLog" --all  --no-merges | grep -v "release 0." >> CHANGELOG.md`
