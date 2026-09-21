import { ButtonHTMLAttributes, ReactElement } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ children, variant = 'primary', ...buttonProps }: ButtonProps): ReactElement {
  const className = `${styles.button} ${styles[variant]}`;

  return (
    <button className={className} {...buttonProps}>
      {children}
    </button>
  );
}
