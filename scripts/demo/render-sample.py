#!/usr/bin/env python3
"""데모에 쓰는 샘플 영상을 실제로 렌더한다 (PIL 프레임 → ffmpeg).

왜 따로 만드나: framenote 는 "렌더된 영상을 고치는" 도구라, 시연에도 진짜로 틀린 영상과
진짜로 다시 렌더한 영상이 있어야 한다. --caption-y 만 바꾸면 자막 위치가 달라진다.
"""
import argparse
import math
import subprocess

from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1280, 720
FPS = 30
TOTAL_FRAMES = 150
FONT_PATH = "/System/Library/Fonts/AppleSDGothicNeo.ttc"
BOLD_FACE_INDEX = 6
TITLE = "오늘 만든 제품 소개"
CAPTION = "오늘 출시한 기능을 한 줄로 소개합니다"
CAPTION_FROM_FRAME = 20
CAPTION_TO_FRAME = 140


def background() -> Image.Image:
    image = Image.new("RGB", (WIDTH, HEIGHT))
    pixels = image.load()
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        for x in range(WIDTH):
            mix = (x / WIDTH + ratio) / 2
            pixels[x, y] = (
                int(255 - 40 * mix),
                int(236 - 30 * mix),
                int(214 + 20 * mix),
            )
    return image


def render(caption_y: int, out: str) -> None:
    title_font = ImageFont.truetype(FONT_PATH, 76, index=BOLD_FACE_INDEX)
    caption_font = ImageFont.truetype(FONT_PATH, 40, index=BOLD_FACE_INDEX)
    base = background()
    encoder = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{WIDTH}x{HEIGHT}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-g", str(FPS), "-movflags", "+faststart", out],
        stdin=subprocess.PIPE,
    )
    for frame in range(TOTAL_FRAMES):
        image = base.copy()
        draw = ImageDraw.Draw(image)
        phase = frame / TOTAL_FRAMES * math.tau
        center_x = WIDTH / 2 + math.cos(phase) * 360
        center_y = 250 + math.sin(phase * 2) * 60
        draw.ellipse([center_x - 90, center_y - 90, center_x + 90, center_y + 90], fill=(244, 148, 122))
        draw.text((WIDTH / 2, 300), TITLE, font=title_font, fill=(55, 50, 47), anchor="mm")
        if CAPTION_FROM_FRAME <= frame <= CAPTION_TO_FRAME:
            box = draw.textbbox((WIDTH / 2, caption_y), CAPTION, font=caption_font, anchor="mm")
            draw.rounded_rectangle([box[0] - 26, box[1] - 18, box[2] + 26, box[3] + 18], 14, fill=(55, 50, 47))
            draw.text((WIDTH / 2, caption_y), CAPTION, font=caption_font, fill=(255, 255, 255), anchor="mm")
        encoder.stdin.write(image.tobytes())
    encoder.stdin.close()
    if encoder.wait() != 0:
        raise SystemExit("ffmpeg 인코딩 실패")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--caption-y", type=int, required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    render(args.caption_y, args.out)
