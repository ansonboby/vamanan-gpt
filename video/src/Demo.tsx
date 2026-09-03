import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { C } from "./tokens";
import { T } from "./script";
import { IntroScene } from "./scenes/Intro";
import { ChatScene } from "./scenes/Chat";
import { PookalamScene } from "./scenes/PookalamScene";
import { StoryScene } from "./scenes/StoryScene";
import { QuizScene } from "./scenes/QuizScene";
import { LanguageScene } from "./scenes/LanguageScene";
import { MontageScene } from "./scenes/MontageScene";
import { EndScene } from "./scenes/EndScene";

/** Fades a scene in/out around its local timeline (used inside a Sequence). */
function Faded({
  dur,
  fade = 8,
  children,
}: {
  dur: number;
  fade?: number;
  children: React.ReactNode;
}) {
  const frame = useCurrentFrame(); // local: Sequence offsets it
  const opacity = interpolate(frame, [0, fade, dur - fade, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
}

export const Demo = () => {
  return (
    <AbsoluteFill style={{ background: C.background }}>
      <Sequence from={T.intro.start} durationInFrames={T.intro.dur}>
        <Faded dur={T.intro.dur}>
          <IntroScene />
        </Faded>
      </Sequence>
      <Sequence from={T.chat.start} durationInFrames={T.chat.dur}>
        <Faded dur={T.chat.dur}>
          <ChatScene />
        </Faded>
      </Sequence>
      <Sequence from={T.pookalam.start} durationInFrames={T.pookalam.dur}>
        <Faded dur={T.pookalam.dur}>
          <PookalamScene />
        </Faded>
      </Sequence>
      <Sequence from={T.story.start} durationInFrames={T.story.dur}>
        <Faded dur={T.story.dur}>
          <StoryScene />
        </Faded>
      </Sequence>
      <Sequence from={T.quiz.start} durationInFrames={T.quiz.dur}>
        <Faded dur={T.quiz.dur}>
          <QuizScene />
        </Faded>
      </Sequence>
      <Sequence from={T.language.start} durationInFrames={T.language.dur}>
        <Faded dur={T.language.dur}>
          <LanguageScene />
        </Faded>
      </Sequence>
      <Sequence from={T.montage.start} durationInFrames={T.montage.dur}>
        <Faded dur={T.montage.dur}>
          <MontageScene />
        </Faded>
      </Sequence>
      <Sequence from={T.end.start} durationInFrames={T.end.dur}>
        <Faded dur={T.end.dur}>
          <EndScene />
        </Faded>
      </Sequence>
    </AbsoluteFill>
  );
};
