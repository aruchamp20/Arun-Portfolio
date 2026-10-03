import { existsSync } from "node:fs";
import { join } from "node:path";
import App from "@/components/App";

/** The hero plays public/hero/hero.mp4 when the pipeline has produced it; otherwise it shows the still. */
const hasVideo = existsSync(join(process.cwd(), "public", "hero", "hero.mp4"));

export default function Page() {
  return <App hasVideo={hasVideo} />;
}
