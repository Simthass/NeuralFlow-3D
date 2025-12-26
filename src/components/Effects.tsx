import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function Effects() {
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      {/* Bloom for the glowing neurons */}
      {/* @ts-ignore */}
      <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.4} />

      {/* Subtle chromatic aberration for holographic look */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL} // Use NORMAL blend mode
        offset={[0.002, 0.002]} // Correct type: [x, y] vector
      />

      {/* Film grain for realism */}
      <Noise opacity={0.05} />

      {/* Vignette to focus center */}
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
