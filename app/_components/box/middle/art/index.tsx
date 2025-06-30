import { path as pathCloud } from "./path-cloud";
import { path as pathEye } from "./path-eye";
import type { TSVGArtVariant } from "./types";

export const getPath = (variant: TSVGArtVariant) =>
  ({ eye: pathEye, cloud: pathCloud })[variant];
