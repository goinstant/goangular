git fetch --tags

LATEST_TAG_HASH=`git rev-list --tags --max-count=1`

# 0 - false
# !0 - true
IS_TAG=`git tag --points-at $TRAVIS_COMMIT | grep -w $TRAVIS_BRANCH | wc -l`
IS_LATEST=`git describe --tags --exact-match $LATEST_TAG_HASH | grep -w $TRAVIS_BRANCH | wc -l`

echo "Latest tag hash: $LATEST_TAG_HASH"
echo "Is tag: $IS_TAG"
echo "Is latest: $IS_LATEST"

export IS_TAG
export IS_LATEST
