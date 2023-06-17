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


for dir in *; do
  if [ -d "$dir" ]; then
    (
      echo "$dir is started"
      cd "$dir" &&
      if [ ! -d "node_modules" ]; then
        npm install &>/dev/null
        echo "install"
      fi &&
      # BROWSER 오픈 안하기, 퍼블릭 URL homepage 옵션등으로 바뀌는 경우가 있어서 환경변수로 설정
      BROWSER=none PUBLIC_URL="http://localhost:3000" pm2 start --name "$dir" npm -- start &>/dev/null &&
      cd /Users/yeonuk/Documents/project/selection-task-e2e-test &&
      # ci-build-id는 고유해야 함
      npx cypress-cloud run --record --key YQJ3Oi7b8OPMosL6 --ci-build-id "$dir-11th-ver1.0" &>/dev/null
    ) && (
      pm2 delete "$dir" &>/dev/null &&
      echo "$dir is passed" >> result/success.txt
      echo "$dir is passed"
    ) || (
    # TODO: timeout으로 실패한 test들이 success로 인식 됨
      pm2 delete "$dir" &>/dev/null &&
      echo "$dir is failed" >> result/failed.txt
      echo "$dir is failed"
    )
  else
    (
      echo "$dir is not exist" >> result/failed.txt
      echo "$dir is not exist"
    )
  fi
done
