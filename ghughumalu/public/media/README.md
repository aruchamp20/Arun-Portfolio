# Media

Drop the Google Flow renders in this folder with exactly these names. Nothing else needs to change.

| File | What it is | Used in |
|---|---|---|
| `video-1.mp4` | Exploded royal thali, slow forward dolly | Hero (scrubbed) |
| `video-2.mp4` | Exploded samosa, locked macro | Anatomy (scrubbed, labels) |
| `video-3.mp4` | Spice cloud, static camera | Pantry background (scrubbed) |
| `video-4.mp4` | Ingredient assembly, slow dolly | Craft timeline (scrubbed) |
| `video-5.mp4` | Chutney ribbons, static macro | Signature chutneys (scrubbed) |
| `video-6.mp4` | Dining table reveal, overhead descent | The room (scrubbed) |
| `image-1.webp` | Hero poster, exploded thali | Hero poster, Story, Open Graph |
| `image-2.webp` | Exploded samosa still | Anatomy poster, gallery |
| `image-3.webp` | Floating spice composition | Pantry poster, Craft inset, gallery |
| `image-4.webp` | Editorial dining scene | Craft poster, The room poster, gallery |

## Make the videos scrub well

Scroll-scrubbing seeks `currentTime` on every frame. A normal encode has a keyframe every 2 to 10 seconds, so each seek decodes dozens of frames and the film stutters. Re-encode every render with a keyframe on every frame and no B-frames:

```bash
../scripts/optimize-media.sh path/to/flow-exports
```

That script writes `video-N.mp4` (H.264, all intra, 1920x1080, 60 fps, faststart) and `image-N.webp` from the source files. It needs ffmpeg.

## Flow prompts

Every video: 10 s, 16:9, 60 fps, locked or very slow dolly, linear motion, soft daylight, warm off-white (#FAFAF8) seamless cyclorama, editorial grade, no text, no logos, no people, no flares.

1. **Hero.** A handcrafted Indian royal thali, centred. Every component (rice, dal, paneer, butter naan, pickles, papad, vegetables, raita, dessert, small bowls, coriander, steam, spice dust) separates upward slowly and hangs in mid air, keeping its orientation. Very slow forward dolly, no rotation. Apple commercial meets Michelin editorial.
2. **Samosa.** A golden fried samosa, centred, macro. The shell separates into floating layers; potato, peas, coriander, chilli, cumin, mustard seed, herbs, spice powder and crumbs suspend and rotate a few degrees. Locked macro lens, tiny push in. Visible flaky layers and steam.
3. **Spices.** Turmeric, red chilli, black pepper, star anise, cardamom, cloves, cinnamon, coriander seed, cumin arranged beautifully, then lifting gently into a suspended cloud with floating powder. Static camera. Premium cookbook editorial.
4. **Assembly.** Tomatoes, onion, garlic, ginger, green chilli, coriander, paneer, cream, butter and whole spices float into perfect alignment without touching, like an exploded engineering drawing. Slow forward dolly.
5. **Chutney.** A ceramic bowl on an off-white surface. Mint chutney and tamarind chutney pour through the air without touching the bowl, stretching into ribbons with floating droplets, then freeze. Static macro.
6. **Table.** A handcrafted wooden table. Bowls, plates, cutlery, napkins, flowers, steam, herbs and linen assemble themselves in suspension into a finished luxury dining composition. Very slow overhead descent.

Images (16:9, same lighting and background, no text): the fully exploded thali in perfect symmetry; the exploded samosa macro; spices in a geometric floating composition; a dining table with a thali surrounded by floating ingredients.
