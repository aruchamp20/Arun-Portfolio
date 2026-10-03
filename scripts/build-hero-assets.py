#!/usr/bin/env python3
"""
build-hero-assets.py — turn an intro video (and/or a photo) into the hero assets.

Video mode (requires ffmpeg + numpy):
    python scripts/build-hero-assets.py --video intro.mp4 [--crop W:H:X:Y] [--seconds 10]

  1. Crops tightly around the person (auto-detected from the whitened background,
     or pass --crop explicitly), scales to 768 px wide.
  2. Whitens the off-white backdrop: colorlevels rimax/gimax/bimax = 0.98.
  3. Makes the loop seamless: takes the first N seconds, cross-fades the last 0.5 s
     of picture into the first 0.5 s (ffmpeg xfade) and does the same cross-fade on
     the audio sample-accurately in numpy (ffmpeg acrossfade can drop audio).
     The clip is never stretched or retimed, so lips stay in sync.
  4. Exports public/hero/hero.mp4 (H.264, CRF 24, slow, AAC 96k, faststart) and
     public/hero/hero.webm (VP9 CRF 36, Opus 80k).
  5. Exports public/portrait-bust.webp (480×600) from the clearest frame and
     public/og.jpg (1200×630).

Photo mode (requires Pillow + numpy; rembg optional but recommended):
    python scripts/build-hero-assets.py --photo me.jpg

  Produces public/hero/hero-still.webp (768×960, white background), the same
  portrait-bust.webp and og.jpg. Used when no intro video exists yet.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
HERO_DIR = PUBLIC / "hero"
XFADE = 0.5  # seconds of overlap used for the seamless loop


def run(cmd: list[str]) -> None:
    print("$", " ".join(str(c) for c in cmd))
    subprocess.run(cmd, check=True)


def probe(path: Path) -> dict:
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(path)]
    )
    return json.loads(out)


# --------------------------------------------------------------------------- video


def detect_person_crop(src: Path, width: int, height: int) -> str:
    """Estimate a tight crop around the person from a few whitened frames."""
    with tempfile.TemporaryDirectory() as td:
        raw = Path(td) / "frame.rgb"
        n = 8
        run(
            [
                "ffmpeg", "-v", "error", "-y", "-i", str(src),
                "-vf", f"fps=1/{max(1, int(float(probe(src)['format']['duration']) // n))},"
                       "colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,scale=320:-1",
                "-frames:v", str(n), "-f", "rawvideo", "-pix_fmt", "rgb24", str(raw),
            ]
        )
        data = np.fromfile(raw, dtype=np.uint8)
    sh = round(height * 320 / width)
    frames = data[: (data.size // (sh * 320 * 3)) * sh * 320 * 3].reshape(-1, sh, 320, 3)
    dark = (frames.astype(int).sum(axis=3) < 3 * 235).mean(axis=0) > 0.5  # pixels that are not background
    ys, xs = np.where(dark)
    if xs.size == 0:
        raise SystemExit("Could not detect the person. Pass --crop W:H:X:Y explicitly.")
    scale = width / 320
    x0, x1 = int(xs.min() * scale), int(xs.max() * scale)
    y0, y1 = int(ys.min() * scale), int(ys.max() * scale)
    pad = int(0.08 * (x1 - x0))
    x0, x1 = max(0, x0 - pad), min(width, x1 + pad)
    y0 = max(0, y0 - pad)
    y1 = height  # keep feet / bottom edge
    w, h = x1 - x0, y1 - y0
    # force a 768:960 (4:5) frame around the person, centred horizontally
    target_w = int(h * 768 / 960)
    if target_w > w:
        cx = (x0 + x1) // 2
        x0 = max(0, cx - target_w // 2)
        w = min(target_w, width - x0)
    else:
        h = int(w * 960 / 768)
        y0 = max(0, y1 - h)
    # snap to an exact 768:960 ratio with even dimensions
    h = min(h, height - y0)
    w = min(int(h * 768 / 960), width - x0)
    h = int(w * 960 / 768)
    w -= w % 2
    h -= h % 2
    y0 = max(0, y1 - h)
    return f"{w}:{h}:{x0}:{y0}"


def build_video(src: Path, crop: str | None, seconds: float) -> Path:
    HERO_DIR.mkdir(parents=True, exist_ok=True)
    info = probe(src)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    a = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
    width, height = int(v["width"]), int(v["height"])
    crop = crop or detect_person_crop(src, width, height)
    print("crop:", crop)
    duration = min(seconds, float(info["format"]["duration"]))
    if duration <= XFADE * 2:
        raise SystemExit("Clip too short for a cross-fade loop.")

    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        base = td / "base.mp4"
        # 1-2: crop, scale, whiten; trim to the first N seconds (no retiming)
        run(
            [
                "ffmpeg", "-v", "error", "-y", "-i", str(src), "-t", f"{duration}",
                "-vf", f"crop={crop},scale=768:-2,colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,format=yuv420p",
                "-an", "-c:v", "libx264", "-crf", "16", "-preset", "fast", str(base),
            ]
        )
        # 3a: picture cross-fade — body (0 .. D-0.5) then xfade the tail into the head
        looped = td / "looped.mp4"
        run(
            [
                "ffmpeg", "-v", "error", "-y", "-i", str(base), "-i", str(base),
                "-filter_complex",
                f"[0:v]trim=start={XFADE},setpts=PTS-STARTPTS[body];"
                f"[1:v]trim=0:{XFADE},setpts=PTS-STARTPTS[head];"
                f"[body][head]xfade=transition=fade:duration={XFADE}:offset={duration - 2 * XFADE}[v]",
                "-map", "[v]", "-c:v", "libx264", "-crf", "16", "-preset", "fast", str(looped),
            ]
        )
        # 3b: audio cross-fade, sample-accurately, in numpy
        wav_out = None
        if a is not None:
            sr = 48000
            pcm = td / "audio.f32"
            run(
                [
                    "ffmpeg", "-v", "error", "-y", "-i", str(src), "-t", f"{duration}",
                    "-vn", "-ac", "1", "-ar", str(sr), "-f", "f32le", str(pcm),
                ]
            )
            s = np.fromfile(pcm, dtype=np.float32)
            n = int(XFADE * sr)
            head, body, tail = s[:n], s[n : len(s) - n], s[len(s) - n :]
            ramp = np.linspace(0.0, 1.0, n, dtype=np.float32)
            joined = np.concatenate([body, tail * (1 - ramp) + head * ramp])
            wav_out = td / "loop.f32"
            joined.astype(np.float32).tofile(wav_out)

        common = ["-movflags", "+faststart"]
        audio_in = ["-f", "f32le", "-ar", "48000", "-ac", "1", "-i", str(wav_out)] if wav_out else []
        run(
            [
                "ffmpeg", "-v", "error", "-y", "-i", str(looped), *audio_in,
                "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p",
                *(["-c:a", "aac", "-b:a", "96k"] if wav_out else ["-an"]), "-shortest", *common,
                str(HERO_DIR / "hero.mp4"),
            ]
        )
        run(
            [
                "ffmpeg", "-v", "error", "-y", "-i", str(looped), *audio_in,
                "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-pix_fmt", "yuv420p",
                *(["-c:a", "libopus", "-b:a", "80k"] if wav_out else ["-an"]), "-shortest",
                str(HERO_DIR / "hero.webm"),
            ]
        )
        # 5: clearest frame → portrait + OG (sharpest of the first second)
        still = td / "still.png"
        run(
            [
                "ffmpeg", "-v", "error", "-y", "-i", str(HERO_DIR / "hero.mp4"),
                "-vf", "thumbnail=30", "-frames:v", "1", str(still),
            ]
        )
        from PIL import Image

        img = Image.open(still).convert("RGBA")
        save_stills(img, bust_box=None)
    return HERO_DIR / "hero.mp4"


# --------------------------------------------------------------------------- photo


def cutout(photo: Path):
    """Return an RGBA image of the person on a transparent background."""
    from PIL import Image

    img = Image.open(photo).convert("RGB")
    try:
        from rembg import new_session, remove  # type: ignore

        print("rembg: removing background")
        return remove(img, session=new_session("isnet-general-use"))
    except Exception as exc:  # noqa: BLE001
        print("rembg unavailable (", exc, ") — falling back to colour levels")
        arr = np.asarray(img).astype(np.float32) / 255.0
        arr = np.clip(arr / 0.98, 0, 1)
        out = Image.fromarray((arr * 255).astype(np.uint8)).convert("RGBA")
        return out


def on_white(rgba):
    from PIL import Image

    bg = Image.new("RGB", rgba.size, (255, 255, 255))
    if rgba.mode == "RGBA":
        bg.paste(rgba, mask=rgba.split()[3])
    else:
        bg.paste(rgba)
    return bg


def save_stills(rgba, bust_box: tuple[int, int, int, int] | None) -> None:
    """Portrait bust (480×600, head-to-shirt) and OG image (1200×630)."""
    from PIL import Image, ImageOps

    PUBLIC.mkdir(exist_ok=True)
    alpha = np.asarray(rgba.split()[3]) if rgba.mode == "RGBA" else None
    if bust_box is None:
        if alpha is not None:
            ys, xs = np.where(alpha > 40)
            x0, x1, y0 = xs.min(), xs.max(), ys.min()
        else:
            x0, x1, y0 = 0, rgba.width, 0
        cx = (x0 + x1) // 2
        # head-to-shirt: start a little above the hair, 4:5 box roughly 60% of the person width
        h = int((x1 - x0) * 1.15)
        w = int(h * 480 / 600)
        bust_box = (cx - w // 2, max(0, y0 - int(0.06 * h)), cx + w // 2, max(0, y0 - int(0.06 * h)) + h)
    bust = on_white(rgba).crop(bust_box).resize((480, 600), Image.LANCZOS)
    bust.save(PUBLIC / "portrait-bust.webp", "WEBP", quality=88, method=6)
    print("wrote", PUBLIC / "portrait-bust.webp")

    og = Image.new("RGB", (1200, 630), (244, 242, 238))
    person = on_white(rgba)
    ph = 630
    pw = int(person.width * ph / person.height)
    person = person.resize((pw, ph), Image.LANCZOS)
    # multiply the person onto paper so the white bleeds into the background
    paper = Image.new("RGB", person.size, (244, 242, 238))
    from PIL import ImageChops

    person = ImageChops.multiply(person, paper)
    og.paste(person, (1200 - pw - 40, 0))
    og = ImageOps.exif_transpose(og)
    og.save(PUBLIC / "og.jpg", "JPEG", quality=86, optimize=True)
    print("wrote", PUBLIC / "og.jpg")


def build_photo(photo: Path) -> None:
    from PIL import Image

    HERO_DIR.mkdir(parents=True, exist_ok=True)
    rgba = cutout(photo)
    alpha = np.asarray(rgba.split()[3])
    ys, xs = np.where(alpha > 40)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), rgba.height
    # 768:960 frame, person centred horizontally, bottom-aligned
    h = y1 - max(0, y0 - int(0.12 * (y1 - y0)))
    w = int(h * 768 / 960)
    cx = (x0 + x1) // 2
    box = (cx - w // 2, y1 - h, cx + w // 2, y1)
    canvas = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    canvas.paste(rgba, (-box[0], -box[1]), mask=rgba.split()[3])
    hero = canvas.convert("RGB").resize((768, 960), Image.LANCZOS)
    hero.save(HERO_DIR / "hero-still.webp", "WEBP", quality=90, method=6)
    print("wrote", HERO_DIR / "hero-still.webp")
    save_stills(rgba, None)


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--video", type=Path, help="intro video (mp4/mov)")
    p.add_argument("--photo", type=Path, help="front-facing photo (optional, used for the ID card and as a hero still)")
    p.add_argument("--crop", help="ffmpeg crop W:H:X:Y (skips auto-detection)")
    p.add_argument("--seconds", type=float, default=10.0, help="length of the loop (default 10)")
    p.add_argument("--out", type=Path, help="output root (default: the project root; assets go to <out>/public/…)")
    args = p.parse_args()
    if args.out:
        global PUBLIC, HERO_DIR
        PUBLIC = args.out.resolve() / "public"
        HERO_DIR = PUBLIC / "hero"
    # resolve inputs before we chdir into the project root
    args.video = args.video.resolve() if args.video else None
    args.photo = args.photo.resolve() if args.photo else None
    if not args.video and not args.photo:
        p.error("pass --video and/or --photo")
    os.chdir(ROOT)
    if args.video:
        if not shutil.which("ffmpeg"):
            sys.exit("ffmpeg is required for --video")
        build_video(args.video, args.crop, args.seconds)
    if args.photo:
        build_photo(args.photo)


if __name__ == "__main__":
    main()
