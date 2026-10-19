export function LandingIcon({ name, size = 24, className = "", ...props }) {
  const paths = {
    cap: (
      <>
        <path d="m2 8 10-5 10 5-10 5L2 8Z" fill="currentColor" stroke="none" />
        <path d="M5 11v6c4 3 10 3 14 0v-6M3 10v8" />
      </>
    ),
    building: (
      <>
        <path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-5h6v5M9 9h.01M15 9h.01M9 12h.01M15 12h.01M12 4V1l4 1-4 1" />
      </>
    ),
    chart: (
      <>
        <path
          d="M4 21v-7h3v7M11 21V9h3v12M18 21V3h3v18"
          fill="currentColor"
          stroke="none"
        />
      </>
    ),
    target: (
      <>
        <circle cx="11" cy="13" r="8" />
        <circle cx="11" cy="13" r="4" />
        <path d="m11 13 10-10m-4 0h4v4" />
      </>
    ),
    code: (
      <>
        <rect x="3" y="3" width="18" height="14" rx="2" />
        <path d="m9 7-3 3 3 3m6-6 3 3-3 3M1 21h22M10 17v4m4-4v4" />
      </>
    ),
    data: (
      <>
        <path d="M2 21v-7h3v7M8 21V7h3v14" fill="currentColor" stroke="none" />
        <ellipse cx="18" cy="9" rx="4" ry="2" />
        <path d="M14 9v10c0 3 8 3 8 0V9m-8 5c0 3 8 3 8 0" />
      </>
    ),
    shield: (
      <>
        <path
          d="m12 2 8 3v6c0 6-8 11-8 11S4 17 4 11V5l8-3Z"
          fill="currentColor"
          fillOpacity=".16"
        />
        <rect x="8" y="10" width="8" height="7" rx="1" />
        <path d="M10 10V8a2 2 0 0 1 4 0v2m-2 3v2" />
      </>
    ),
    bulb: (
      <>
        <path
          d="M8 16a7 7 0 1 1 8 0l-1 3H9l-1-3Z"
          fill="#ffd04a"
          stroke="#edab10"
        />
        <path d="M9 22h6M12 1v-1M2 5l-2-1m22 1 2-1M1 12H0m24 0h-1M12 9v9" />
      </>
    ),
    palette: (
      <>
        <path
          d="M12 2a10 10 0 1 0 0 20h2c3 0 3-4 1-5s-1-4 2-4h3c5-6-2-11-8-11Z"
          fill="#ffc7b1"
          stroke="#ed8866"
        />
        <circle cx="7" cy="8" r="1" fill="#ff715b" />
        <circle cx="12" cy="6" r="1" fill="#ffb635" />
        <circle cx="17" cy="8" r="1" fill="#c878e8" />
        <path d="m13 22 9-13" stroke="#5985df" strokeWidth="3" />
      </>
    ),
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    search: (
      <>
        <circle cx="10" cy="10" r="7" />
        <path d="m16 16 5 5" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 0 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    chevron: <path d="m9 5 7 7-7 7" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}
