rm -rf ./flaskAILAB/templates
rm -rf ./flaskAILAB/static

mkdir flaskAILAB/templates
cp -rT ./build ./flaskAILAB/templates/build
cp -rT ./build/static ./flaskAILAB/static
