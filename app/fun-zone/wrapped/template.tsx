/** remounts on every navigation, so each page fades in */
export default function FunZoneWrappedTemplate({ children }: TChildren) {
  return <div className="wrapped-page-enter">{children}</div>;
}
