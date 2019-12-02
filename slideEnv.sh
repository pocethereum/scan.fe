#!/bin/sh

devhotpath="http:\/\/scan.ehd.com\/api\/"
prodpath="http:\/\/scan.ehd.com\/api\/"


#获取命令行参数
if [[ $1 = "prod" ]]
then
	echo "切换到正式环境"
	echo "-------替换config.xml--------"
	sed -i "" "s/$devhotpath/$prodpath/g" ./src/assets/js/axios.js
    sed -i "" "s/$devhotpath/$prodpath/g" ./src/store/index.js
else
	echo "切换到测试环境"
	echo "-------替换config.xml--------"
	sed -i "" "s/$prodpath/$devhotpath/g" ./src/assets/js/axios.js
    sed -i "" "s/$prodpath/$devhotpath/g" ./src/store/index.js

fi
