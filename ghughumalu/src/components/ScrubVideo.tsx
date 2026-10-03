"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { asset } from "@/lib/paths";
import { useExperience } from "./Experience";

type Props = {
  src: string;
  poster: string;
  alt: string;
  /** the element whose scroll range maps to the video timeline */
  trigger: RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
  /** seconds of catch-up smoothing between scroll and frame */
  scrub?: number;
  /** hero only: load immediately instead of when near the viewport */
  priority?: boolean;
  fit?: "cover" | "contain";
  className?: string;
  onProgress?: (p: number) => void;
};

/**
 * A video whose currentTime is mapped to scroll progress.
 *
 * - The file is attached only when the element is within ~1 viewport, and
 *   the hero video is the only one that preloads up front.
 * - Seeks happen on GSAP's ticker (one shared requestAnimationFrame), never
 *   while a previous seek is still pending, and only when the target frame
 *   actually changed. Off-screen videos are paused and not ticked.
 * - Under reduced motion the poster image is shown instead.
 * - If the file is missing the poster stays, so the layout never breaks.
 */
export default function ScrubVideo({
  src,
  poster,
  alt,
  trigger,
  start = "top top",
  end = "bottom bottom",
  scrub = 0.5,
  priority = false,
  fit = "cover",
  className = "",
  onProgress,
}: Props) {
  const { reduce } = useExperience();
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [noPoster, setNoPoster] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const v = video.current;
    const t = trigger.current;
    if (!v || !t) return;

    let attached = false;
    let active = false;
    let duration = 0;
    const state = { p: 0 };

    const attach = () => {
      if (attached) return;
      attached = true;
      v.preload = "auto";
      v.src = asset(src);
      v.load();
    };
    if (priority) attach();

    v.addEventListener("loadedmetadata", () => {
      duration = v.duration || 0;
    });
    v.addEventListener("error", () => setFailed(true));

    const io = new IntersectionObserver(
      ([e]) => {
        active = e.isIntersecting;
        if (active) attach();
        else v.pause();
      },
      { rootMargin: "110% 0px 110% 0px" },
    );
    io.observe(v);

    const st = ScrollTrigger.create({
      trigger: t,
      start,
      end,
      scrub,
      onUpdate: (self) => {
        state.p = self.progress;
        onProgress?.(self.progress);
      },
    });

    const tick = () => {
      if (!active || !duration || v.seeking || v.readyState < 1) return;
      const target = state.p * Math.max(0, duration - 0.04);
      if (Math.abs(v.currentTime - target) > 1 / 90) v.currentTime = target;
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, src, start, end, scrub, priority]);

  const posterUrl = asset(poster);

  return (
    <div className={`frame sv ${className}`} data-fit={fit}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {noPoster ? <div className="ph">{alt}</div> : <img src={posterUrl} alt={alt} className="sv-poster" loading={priority ? "eager" : "lazy"} decoding="async" onError={() => setNoPoster(true)} />}
      {!reduce && !failed && (
        <video
          ref={video}
          muted
          playsInline
          preload="none"
          poster={posterUrl}
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          className="sv-video"
        />
      )}
      <style>{`
        .sv{width:100%;height:100%;background:var(--canvas)}
        .sv .sv-poster,.sv .sv-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}
        .sv[data-fit="contain"] .sv-poster,.sv[data-fit="contain"] .sv-video{object-fit:contain}
        .sv .sv-video{will-change:contents}
      `}</style>
    </div>
  );
}
