import React, { memo } from 'react';
import crossMarkSvg from '../assets/cross-mark.svg';

interface CrossMarkProps {
  className?: string;
  style?: React.CSSProperties;
}

const CrossMark: React.FC<CrossMarkProps> = ({ className, style }) => {
  return (
    <img
      src={crossMarkSvg}
      className={className}
      style={style}
      alt="cross mark"
    />
  );
};

export default memo(CrossMark);