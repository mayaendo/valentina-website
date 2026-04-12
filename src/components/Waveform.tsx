export function Waveform() {
  return (
    <div className="hero__wave" aria-hidden="true">
      <svg
        viewBox="0 0 120 120"
        className="waveform-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.5"
          y="0.5"
          width="119"
          height="119"
          fill="none"
          stroke="#0D0D0D"
          strokeWidth="1"
        />
        <path
          d="M 12 60 Q 22 44 32 60 T 52 60 T 72 60 T 92 60 T 108 60"
          fill="none"
          stroke="#0D0D0D"
          strokeWidth="1"
          vectorEffect="nonScalingStroke"
        />
        <path
          d="M 12 60 Q 22 76 32 60 T 52 60 T 72 60 T 92 60 T 108 60"
          fill="none"
          stroke="#0D0D0D"
          strokeWidth="1"
          vectorEffect="nonScalingStroke"
        />
      </svg>
    </div>
  );
}
