#!/usr/bin/env python3
"""brand/mark.png 하나에서 파비콘·앱 아이콘·머리 로고·공유 카드를 만든다.

그림을 바꾸면 이것만 다시 돌린다 — 크기마다 손으로 뽑으면 한 장이 옛 그림으로 남는다.
"""
import base64
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
CREAM = (243, 238, 230)
INK = (55, 50, 47)
SUBTLE = (96, 90, 87)
FONT_PATH = "/System/Library/Fonts/AppleSDGothicNeo.ttc"
BOLD_FACE_INDEX = 6
REGULAR_FACE_INDEX = 2
OG_SIZE = (1200, 630)

mark = Image.open(ROOT / "brand/mark.png").convert("RGBA")

# 탭·머리 로고는 바탕 없이 — 16px 시험에서 이쪽이 가장 또렷했다 (shots/logo-small-test.png)
mark.save(ROOT / "app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
mark.resize((192, 192), Image.LANCZOS).save(ROOT / "app/icon.png")

# iOS 는 투명을 검게 칠하므로 앱 아이콘만 꽉 찬 면 위에 얹는다
APPLE_SIZE = 180
APPLE_MARK = 148
apple = Image.new("RGBA", (APPLE_SIZE, APPLE_SIZE), CREAM + (255,))
inner = mark.resize((APPLE_MARK, APPLE_MARK), Image.LANCZOS)
apple.alpha_composite(inner, ((APPLE_SIZE - APPLE_MARK) // 2, (APPLE_SIZE - APPLE_MARK) // 2))
apple.convert("RGB").save(ROOT / "app/apple-icon.png")

# 벡터로 못 옮기는 클레이 그림이라 작은 WebP 를 SVG 안에 넣는다 — 요청 하나로 어디서나 같은 그림
webp = base64.b64encode((ROOT / "brand/mark-128.webp").read_bytes()).decode()
svg = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="64" height="64">'
    f'<image width="512" height="512" href="data:image/webp;base64,{webp}"/></svg>\n'
)
(ROOT / "public/logo.svg").write_text(svg)
(ROOT / "public/icon.svg").write_text(svg)

# 공유 카드 — 이름은 그림이 아니라 글자로
card = Image.new("RGBA", OG_SIZE, CREAM + (255,))
big = mark.resize((340, 340), Image.LANCZOS)
card.alpha_composite(big, (84, 145))
draw = ImageDraw.Draw(card)
draw.text((480, 190), "framenote", font=ImageFont.truetype(FONT_PATH, 92, index=BOLD_FACE_INDEX), fill=INK)
body = ImageFont.truetype(FONT_PATH, 42, index=REGULAR_FACE_INDEX)
draw.text((484, 318), "영상에 프레임 단위로 메모를 남기면", font=body, fill=SUBTLE)
draw.text((484, 376), "코딩 에이전트가 바로 받는다", font=body, fill=SUBTLE)
card.convert("RGB").save(ROOT / "public/og.png", optimize=True)
