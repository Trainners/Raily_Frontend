export type BrandMarkProps = {
  size?: number;
};

export default function BrandMark({ size = 120 }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="80" height="80" rx="20" fill="var(--accent-base)" />

      <g clipPath="url(#clip0_32_345)">
        <g clipPath="url(#clip1_32_345)">
          <g opacity="0.26">
            <rect x="9.5" y="20.5" width="10" height="10" rx="2.5" fill="white" />
          </g>
          <g opacity="0.26">
            <rect x="22" y="20.5" width="10" height="10" rx="2.5" fill="white" />
          </g>
          <g opacity="0.26">
            <rect x="48" y="20.5" width="10" height="10" rx="2.5" fill="white" />
          </g>
          <g opacity="0.26">
            <rect x="60.5" y="20.5" width="10" height="10" rx="2.5" fill="white" />
          </g>
        </g>

        <g clipPath="url(#clip2_32_345)">
          <rect x="9.5" y="35" width="10" height="10" rx="2.5" fill="white" />
          <g opacity="0.26">
            <rect x="22" y="35" width="10" height="10" rx="2.5" fill="white" />
          </g>
          <g opacity="0.26">
            <rect x="48" y="35" width="10" height="10" rx="2.5" fill="white" />
          </g>
          <g opacity="0.26">
            <rect x="60.5" y="35" width="10" height="10" rx="2.5" fill="white" />
          </g>
        </g>

        <g clipPath="url(#clip3_32_345)">
          <g opacity="0.26">
            <rect x="9.5" y="49.5" width="10" height="10" rx="2.5" fill="white" />
          </g>
          <g opacity="0.26">
            <rect x="22" y="49.5" width="10" height="10" rx="2.5" fill="white" />
          </g>
          <g opacity="0.26">
            <rect x="48" y="49.5" width="10" height="10" rx="2.5" fill="white" />
          </g>
          <g opacity="0.26">
            <rect x="60.5" y="49.5" width="10" height="10" rx="2.5" fill="white" />
          </g>
        </g>
      </g>

      <defs>
        <clipPath id="clip0_32_345">
          <rect width="61" height="39" fill="white" transform="translate(9.5 20.5)" />
        </clipPath>
        <clipPath id="clip1_32_345">
          <rect width="61" height="10" fill="white" transform="translate(9.5 20.5)" />
        </clipPath>
        <clipPath id="clip2_32_345">
          <rect width="61" height="10" fill="white" transform="translate(9.5 35)" />
        </clipPath>
        <clipPath id="clip3_32_345">
          <rect width="61" height="10" fill="white" transform="translate(9.5 49.5)" />
        </clipPath>
      </defs>
    </svg>
  );
}