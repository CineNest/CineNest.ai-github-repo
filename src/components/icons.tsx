import type { SVGProps } from "react";

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20.5 9.5 15 3H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V11.5a2 2 0 0 0-2-2Z" />
      <path d="m3.5 3 12 12" />
      <path d="m11.5 3 1.5 1.5" />
      <path d="m8.5 3 3 3" />
      <path d="m14.5 3 3 3" />
      <path d="m5.5 3 6 6" />
    </svg>
  );
}
