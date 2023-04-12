import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import './Button.css';

type Props = {
  onClick?: (value: any) => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
  href?: string;
  size?: 'small' | 'big' | 'enormous';
  inverse?: boolean;
  danger?: boolean;
  to?: string;
  golden?: boolean;
  exact?: any;
  disabled?: boolean;
  children?: ReactNode;
};

const Button: React.FC<Props> = ({
  onClick,
  type,
  href,
  size,
  inverse,
  danger,
  golden,
  to,
  disabled,
  children
}) => {
  if (href) {
    return (
      <a
        className={`button button--${size || 'default'} 
          ${inverse && 'button--inverse'} 
          ${danger && 'button--danger'} 
          ${golden && 'button--golden'}
        `}
        href={href}
      >
        {children}
      </a>
    );
  }
  if (to) {
    return (
      <Link
        to={to}
        className={`button button--${size || 'default'} ${inverse && 'button--inverse'} ${
          danger && 'button--danger'
        } ${golden && 'button--golden'}`}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      className={`button button--${size || 'default'} ${inverse && 'button--inverse'} ${
        danger && 'button--danger'
      } ${golden && 'button--golden'}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
