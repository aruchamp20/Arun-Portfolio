#!/usr/bin/env bash
# Re-encode Google Flow exports for scroll scrubbing and copy them into public/media.
#
#   scripts/optimize-media.sh <folder with video-1..6.* and image-1..4.*>
#
# Videos: H.264, keyframe on every frame (-g 1, no B-frames) so any currentTime
# seek decodes exactly one frame; 1920x1080, 60 fps, yuv420p, faststart.
# Images: 1920x1080 WebP at quality 82.
set -euo pipefail
src="${1:?source folder}"
out="$(cd "$(dirname "$0")/.." && pwd)/public/media"
mkdir -p "$out"
for n in 1 2 3 4 5 6; do
  f=$(ls "$src"/video-$n.* 2>/dev/null | head -1 || true)
  [ -z "$f" ] && { echo "skip video-$n (not found)"; continue; }
  echo "video-$n <- $f"
  ffmpeg -loglevel error -y -i "$f" -an \
    -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=60,format=yuv420p" \
    -c:v libx264 -profile:v high -preset slow -crf 20 -g 1 -keyint_min 1 -bf 0 -sc_threshold 0 \
    -movflags +faststart "$out/video-$n.mp4"
done
for n in 1 2 3 4; do
  f=$(ls "$src"/image-$n.* 2>/dev/null | head -1 || true)
  [ -z "$f" ] && { echo "skip image-$n (not found)"; continue; }
  echo "image-$n <- $f"
  ffmpeg -loglevel error -y -i "$f" -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" -c:v libwebp -quality 82 "$out/image-$n.webp"
done
ls -la "$out"
