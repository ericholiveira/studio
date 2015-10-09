#!/bin/bash
tagDate=`date +'%d %b %Y %H:%M:%S'`
echo "### $1 - $tagDate" > LASTCHANGES_CHANGELOG.md
formatLog=$'* [commit](http://github.com/ericholiveira/studio/commit/%H) %s\n %b'
gitLogsResult=`git log "$2"... --pretty=format:"$formatLog" --no-merges | grep -v "release 0." >> LASTCHANGES_CHANGELOG.md`
mv CHANGELOG.md _TEMPCHANGELOG.md
cat *CHANGELOG.md > CHANGELOG.md
rm -f _TEMPCHANGELOG.md
git commit CHANGELOG.md  -m "release $1 CHANGELOG.md"
git commit LASTCHANGES_CHANGELOG.md  -m "Setting version to $nextTag LASTCHANGES_CHANGELOG.md"
