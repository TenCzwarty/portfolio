const color1 = "var(--color-accent-500)";
const color2 = "var(--color-accent-900)";
const color3 = "var(--color-primary-800)";
const color4 = "var(--color-primary-900)";

export const ICONS_MOON_PHASES = [
  <svg
    key="Full Moon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    strokeWidth="1"
  >
    <desc>Full Moon</desc>
    <path fill={color2} d="M0 18a18 18 0 1 0 36 0 18 18 0 1 0 -36 0"></path>
    <g fill={color1}>
      <path d="M7 8.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"></path>
      <path d="M17 17a3 3 0 1 0 6 0 3 3 0 1 0 -6 0"></path>
      <path d="M21 28.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"></path>
      <path d="M20 5a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
      <path d="M2 18a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
      <path d="M29 9a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
      <path d="M14 31a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
      <path d="M30 19a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
      <path d="M8 23a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
    </g>
  </svg>,
  <svg
    key="Waxing Gibbous Moon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    strokeWidth="1"
  >
    <desc>Waxing Gibbous Moon</desc>
    <path
      fill={color2}
      d="M36 18c0 9.941 -8.059 18 -18 18 -0.294 0 -0.58 -0.029 -0.87 -0.043C11.239 33.393 7 26.332 7 18 7 9.669 11.239 2.607 17.13 0.044 17.42 0.03 17.706 0 18 0c9.941 0 18 8.059 18 18z"
    ></path>
    <path
      fill={color4}
      d="M7 18C7 9.669 11.239 2.607 17.13 0.044 7.596 0.501 0 8.353 0 18c0 9.646 7.594 17.498 17.128 17.956C11.238 33.391 7 26.331 7 18z"
    ></path>
    <path fill={color1} d="M22 8.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"></path>
    <path fill={color1} d="M13 16a3 3 0 1 0 6 0 3 3 0 1 0 -6 0"></path>
    <path
      fill={color1}
      d="M11 27.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"
    ></path>
    <path fill={color1} d="M13 6a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
    <path fill={color1} d="M32 18a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color3} d="M5 9a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color1} d="M20 31a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color3} d="M2 19a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
    <path fill={color1} d="M24 23a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
  </svg>,
  <svg
    key="First Quarter Moon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    strokeWidth="1"
  >
    <desc>First Quarter Moon</desc>
    <path
      fill={color2}
      d="M18 0v36c9.941 0 18 -8.059 18 -18S27.941 0 18 0z"
    ></path>
    <path
      fill={color4}
      d="M0 18c0 9.941 8.059 18 18 18V0C8.059 0 0 8.059 0 18z"
    ></path>
    <path fill={color1} d="M22 8.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"></path>
    <path fill={color3} d="M9 16a3 3 0 1 0 6 0 3 3 0 1 0 -6 0"></path>
    <path
      fill={color3}
      d="M10 27.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"
    ></path>
    <path fill={color3} d="M13 6a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
    <path fill={color1} d="M32 18a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color3} d="M5 9a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color1} d="M20 31a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color3} d="M2 19a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
    <path fill={color1} d="M24 23a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
  </svg>,
  <svg
    key="Waxing Crescent Moon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    strokeWidth="1"
  >
    <desc>Waxing Crescent Moon</desc>
    <path fill={color2} d="M0 18a18 18 0 1 0 36 0 18 18 0 1 0 -36 0"></path>
    <path
      fill={color4}
      d="M0 18c0 9.941 8.059 18 18 18 0.295 0 0.58 -0.029 0.87 -0.043C24.761 33.393 29 26.332 29 18 29 9.669 24.761 2.607 18.87 0.044 18.58 0.03 18.295 0 18 0 8.059 0 0 8.059 0 18z"
    ></path>
    <path fill={color3} d="M7 8.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"></path>
    <path fill={color3} d="M17 16a3 3 0 1 0 6 0 3 3 0 1 0 -6 0"></path>
    <path
      fill={color3}
      d="M18 27.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"
    ></path>
    <path fill={color3} d="M19 6a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
    <path fill={color3} d="M2 18a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color1} d="M29 9a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color3} d="M14 31a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color1} d="M30 19a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
    <path fill={color3} d="M8 23a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
  </svg>,
  <svg
    key="New Moon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    strokeWidth="1"
  >
    <desc>New Moon</desc>
    <path fill={color4} d="M0 18a18 18 0 1 0 36 0 18 18 0 1 0 -36 0"></path>
    <g fill={color3}>
      <path d="M7 8.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"></path>
      <path d="M17 16a3 3 0 1 0 6 0 3 3 0 1 0 -6 0"></path>
      <path d="M18 27.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"></path>
      <path d="M19 6a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
      <path d="M2 18a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
      <path d="M29 9a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
      <path d="M14 31a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
      <path d="M30 19a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
      <path d="M8 23a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
    </g>
  </svg>,
  <svg
    key="Waning Crescent Moon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    strokeWidth="1"
  >
    <desc>Waning Crescent Moon</desc>
    <path fill={color2} d="M0 18a18 18 0 1 0 36 0 18 18 0 1 0 -36 0"></path>
    <path
      fill={color4}
      d="M36 18c0 9.941 -8.059 18 -18 18 -0.294 0 -0.58 -0.029 -0.87 -0.043C11.239 33.393 7 26.332 7 18 7 9.669 11.239 2.607 17.13 0.044 17.42 0.03 17.706 0 18 0c9.941 0 18 8.059 18 18z"
    ></path>
    <path fill={color3} d="M22 8.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"></path>
    <path fill={color3} d="M13 16a3 3 0 1 0 6 0 3 3 0 1 0 -6 0"></path>
    <path
      fill={color3}
      d="M11 27.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"
    ></path>
    <path fill={color3} d="M13 6a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
    <path fill={color3} d="M32 18a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color1} d="M5 9a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color3} d="M20 31a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color1} d="M2 19a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
    <path fill={color3} d="M24 23a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
  </svg>,
  <svg
    key="Last Quarter Moon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    strokeWidth="1"
  >
    <desc>Last Quarter Moon</desc>
    <path
      fill={color2}
      d="M18 0v36C8.059 36 0 27.941 0 18S8.059 0 18 0z"
    ></path>
    <path
      fill={color4}
      d="M36 18c0 9.941 -8.059 18 -18 18V0c9.941 0 18 8.059 18 18z"
    ></path>
    <path fill={color1} d="M7 8.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"></path>
    <path fill={color3} d="M21 16a3 3 0 1 0 6 0 3 3 0 1 0 -6 0"></path>
    <path
      fill={color3}
      d="M19 27.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"
    ></path>
    <path fill={color3} d="M19 6a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
    <path fill={color1} d="M2 18a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color3} d="M29 9a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color1} d="M14 31a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color3} d="M30 19a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
    <path fill={color1} d="M8 23a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
  </svg>,
  <svg
    key="Waning Gibbous Moon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    strokeWidth="1"
  >
    <desc>Waning Gibbous Moon</desc>
    <path
      fill={color2}
      d="M0 18c0 9.941 8.059 18 18 18 0.295 0 0.58 -0.029 0.87 -0.043C24.761 33.393 29 26.332 29 18 29 9.669 24.761 2.607 18.87 0.044 18.58 0.03 18.295 0 18 0 8.059 0 0 8.059 0 18z"
    ></path>
    <path
      fill={color4}
      d="M29 18C29 9.669 24.761 2.607 18.87 0.044 28.404 0.501 36 8.353 36 18c0 9.646 -7.594 17.498 -17.128 17.956C24.762 33.391 29 26.331 29 18z"
    ></path>
    <path fill={color1} d="M7 8.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"></path>
    <path fill={color1} d="M17 16a3 3 0 1 0 6 0 3 3 0 1 0 -6 0"></path>
    <path
      fill={color1}
      d="M18 27.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0"
    ></path>
    <path fill={color1} d="M19 6a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
    <path fill={color1} d="M2 18a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color3} d="M29 9a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color1} d="M14 31a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"></path>
    <path fill={color3} d="M30 19a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
    <path fill={color1} d="M8 23a2 2 0 1 0 4 0 2 2 0 1 0 -4 0"></path>
  </svg>,
];
