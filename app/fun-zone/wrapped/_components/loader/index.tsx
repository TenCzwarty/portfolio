/** a bouncing dot until the music starts */
export const Loader = ({ color }: { color: string }) => (
  <span className="wrapped-loader" style={{ backgroundColor: color }} aria-label="loading" />
);
