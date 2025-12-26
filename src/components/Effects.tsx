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
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.4} />

      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL} // Use NORMAL blend mode
        offset={[0.002, 0.002]} // Correct type: [x, y] vector
      />

      <Noise opacity={0.05} />

      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
