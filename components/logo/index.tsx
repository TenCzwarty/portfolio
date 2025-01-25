export const Logo = () => {
  return (
    <div className="rounded-full">
      <svg
        className="spin"
        width="50"
        height="50"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
      >
        <g fill="none" stroke="var(--color-primary-900)" strokeWidth="10">
          <circle cx="100" cy="100" r="90" fill="var(--color-neutral-100)" />
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
