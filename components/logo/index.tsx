export const Logo = () => {
  return (
    <div className="rounded-full text-slate-800">
      <svg
        className="spin"
        width="50"
        height="50"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" stroke="#0f172a" strokeWidth="10">
          <circle cx="100" cy="100" r="90" fill="#fff" />
          <path
            d="M 99.395,168.899 39.45,65.33 161.164,66.36 99.394,168.9 Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};
