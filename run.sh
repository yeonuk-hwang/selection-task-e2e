#!/bin/bash

# 모든 디렉토리 순회
# for d in *; do
#   if [ -d "$d" ]; then
#   fi
# done

# 범위 지정해서 순회
# for ((d=191; d<=272; d++)); do
#   dir=$(printf "%03d" "$d")
#   if [ -d "$dir" ]; then
#   fi
# done

# 파일 안에 한줄씩 디렉토리 이름 넣어놓고 순회
# for dir in $(cat list.txt); do

# 숫자 리스트 순회
# for ((dir=118; dir<=158; dir++)); do

# for dir in *; do

for dir in *; do
	if [ -d "$dir" ]; then
		(
			echo "$dir is started"
			cd "$dir" &&
				# rm -rf node_modules/ &&
				# (npm install &>/dev/null || yarn install) &&
				# echo "install" &&
				# BROWSER 오픈 안하기, 퍼블릭 URL homepage 옵션등으로 바뀌는 경우가 있어서 환경변수로 설정
				BROWSER=none PUBLIC_URL="http://localhost:3000" pm2 start --name "$dir" npm -- start &>/dev/null &&
				cd /Users/yeonuk/Documents/project/selection-task-e2e-test &&
				# ci-build-id는 고유해야 함
				npx cypress-cloud run --record --key "<key>" --ci-build-id "$dir-ver-1.0.2"
			# npx cypress run 2>&1 | grep -v "CoreText note:" &&
		) && (
			pm2 delete "$dir" &&
				echo "$dir is passed" >>result/success.txt
			echo "$dir is passed" >>result/result.txt
			echo "$dir is passed"
		) || (
			# TODO: timeout으로 실패한 test들이 success로 인식 됨
			pm2 delete "$dir" &&
				echo "$dir is failed" >>result/failed.txt
			echo "$dir is failed" >>result/result.txt
			echo "$dir is failed"
		)
	else
		(
			echo "$dir is not exist" >>result/failed.txt
			echo "$dir is not exist" >>result/result.txt
			echo "$dir is not exist"
		)
	fi
done
