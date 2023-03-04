import { ReactNode } from 'react';

import './Card.css';

type Props = {
  className?: string;
  style?: object;
  children?: ReactNode;
};

const Card: React.FC<Props> = ({ className, style, children }) => {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Card;
