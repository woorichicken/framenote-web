#!/bin/zsh
# 데모 3편을 찍는다. 한 heavy-run 작업 안에서 서버 띄우기 → 녹화 → 정확한 PID 로 닫기까지 한다.
# 사용: heavy-run -- zsh scripts/demo/record-all.sh <빈 출력 폴더>
set -u
# 상대 경로면 file:// 주소가 깨지므로 처음에 절대 경로로 바꾼다
OUT=${${1:?출력 폴더가 필요합니다}:A}
HERE=${0:A:h}
SCENARIO=$HERE/../demo-scenario.mjs
SOURCE_REPO=$HOME/Downloads/framenote
MAIN_PORT=3977; RULER_PORT=3978
CAPTION_Y_BROKEN=712

mkdir -p "$OUT/work/sample" "$OUT/work/ruler" "$OUT/work/static"
npm install --silent --no-audit --no-fund --prefix "$OUT/work" framenote@0.3.0 || exit 10
FRAMENOTE=$OUT/work/node_modules/framenote/bin/framenote.mjs

python3 "$HERE/render-sample.py" --caption-y $CAPTION_Y_BROKEN --out "$OUT/work/sample/final.mp4" || exit 11
node "$SOURCE_REPO/scripts/make-ruler-video.mjs" --out "$OUT/work/ruler/final.mp4" --frames 300 --width 1280 --height 720 || exit 12
cp "$OUT/work/sample/final.mp4" "$OUT/work/static/final.mp4"

wait_port() { for i in {1..40}; do curl -s -o /dev/null "http://127.0.0.1:$1/api/info" && return 0; sleep 0.25; done; return 1; }

# ① 본편 — 실제 서버 + 통로에 붙은 스크립트
node "$FRAMENOTE" "$OUT/work/sample/final.mp4" --no-open --port $MAIN_PORT > "$OUT/server-main.log" 2>&1 &
SERVER_PID=$!
wait_port $MAIN_PORT || { echo "서버 안 뜸"; kill $SERVER_PID; exit 13; }
# framenote 는 영상에서 위로 올라가 만난 git 최상단에 .framenote 를 둔다. 없으면 영상 폴더다.
STORE_ROOT=$(git -C "$OUT/work/sample" rev-parse --show-toplevel 2>/dev/null || print -r -- "$OUT/work/sample")
node "$HERE/demo-agent.mjs" "$STORE_ROOT" "$OUT/work/sample/final-fixed.mp4" > "$OUT/agent.log" 2>&1 &
AGENT_PID=$!
sleep 1
node "$SCENARIO" main "$OUT/main" "http://127.0.0.1:$MAIN_PORT"; MAIN_EXIT=$?
kill $AGENT_PID $SERVER_PID 2>/dev/null

# ② 프레임 눈금
node "$FRAMENOTE" "$OUT/work/ruler/final.mp4" --no-open --port $RULER_PORT > "$OUT/server-ruler.log" 2>&1 &
SERVER_PID=$!
wait_port $RULER_PORT || { echo "서버 안 뜸"; kill $SERVER_PID; exit 14; }
node "$SCENARIO" ruler "$OUT/ruler" "http://127.0.0.1:$RULER_PORT"; RULER_EXIT=$?
kill $SERVER_PID 2>/dev/null

# ③ 정적 파일 — 서버 없음
node "$FRAMENOTE" "$OUT/work/static/final.mp4" --static > "$OUT/static-export.log" 2>&1; EXPORT_EXIT=$?
node "$SCENARIO" static "$OUT/static" "file://$OUT/work/static/final.framenote.html"; STATIC_EXIT=$?

echo "EXIT main=$MAIN_EXIT ruler=$RULER_EXIT export=$EXPORT_EXIT static=$STATIC_EXIT"
# 마지막 echo 의 0 이 그대로 나가면 빠진 영상을 성공으로 읽는다
(( MAIN_EXIT || RULER_EXIT || EXPORT_EXIT || STATIC_EXIT )) && exit 1
exit 0
