import React from "react";

type Props = {
  style?: React.CSSProperties;
};

const WaveFormIcon = ({ style }: Props) => {
  return (
    <svg
      viewBox="-28 4 100 20"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <style>
        {`@keyframes pulse {

            0%,
            100% {
                transform: scaleY(1);
            }

            50% {
                transform: scaleY(2);
            }
        }

        rect {
            fill: white;
            animation: pulse 0.5s ease-in-out infinite;
        }

        rect:nth-child(1) {
            animation-delay: 0.0s;
        }

        rect:nth-child(2) {
            animation-delay: 0.1s;
        }

        rect:nth-child(3) {
            animation-delay: 0.2s;
        }

        rect:nth-child(4) {
            animation-delay: 0.3s;
        }

        rect:nth-child(5) {
            animation-delay: 0.4s;
        }

        rect:nth-child(6) {
            animation-delay: 0.5s;
        }

        rect:nth-child(7) {
            animation-delay: 0.6s;
        }

        rect:nth-child(8) {
            animation-delay: 0.7s;
        }

        rect:nth-child(9) {
            animation-delay: 0.8s;
        }

        rect:nth-child(10) {
            animation-delay: 0.9s;
        }

        rect:nth-child(11) {
            animation-delay: 0.0s;
        }

        rect:nth-child(12) {
            animation-delay: 0.1s;
        }

        rect:nth-child(13) {
            animation-delay: 0.2s;
        }

        rect:nth-child(14) {
            animation-delay: 0.3s;
        }

        rect:nth-child(15) {
            animation-delay: 0.4s;
        }`}
      </style>
      <rect x="0" y="2.0" width="1" height="14.0" />
      <rect x="3" y="5.0" width="1" height="10.0" />
      <rect x="6" y="6.666666666666666" width="1" height="6.666666666666667" />
      <rect x="9" y="7.5" width="1" height="5.0" />
      <rect x="12" y="8.0" width="1" height="4.0" />
      <rect x="15" y="2.0" width="1" height="14.0" />
      <rect x="18" y="5.0" width="1" height="10.0" />
      <rect x="21" y="6.666666666666666" width="1" height="6.666666666666667" />
      <rect x="24" y="7.5" width="1" height="5.0" />
      <rect x="27" y="8.0" width="1" height="4.0" />
      <rect x="30" y="2.0" width="1" height="14.0" />
      <rect x="33" y="5.0" width="1" height="10.0" />
      <rect x="36" y="6.666666666666666" width="1" height="6.666666666666667" />
      <rect x="39" y="7.5" width="1" height="5.0" />
      <rect x="42" y="8.0" width="1" height="4.0" />
    </svg>
  );
};

export default WaveFormIcon;
