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
        }`}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      className={`button button--${size || 'default'} ${inverse && 'button--inverse'} ${
        danger && 'button--danger'
      }`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
