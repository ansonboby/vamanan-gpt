import { registerRoot, Composition } from "remotion";
import { Demo } from "./Demo";
import { fps } from "./tokens";
import { T } from "./script";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: frauncesFamily } = loadFraunces();
const { fontFamily: interFamily } = loadInter();

export const FRAUNCES = frauncesFamily;
export const INTER = interFamily;

registerRoot(() => (
  <Composition
    id="Demo"
    component={Demo}
    durationInFrames={T.total}
    fps={fps}
    width={1920}
    height={1080}
  />
));
