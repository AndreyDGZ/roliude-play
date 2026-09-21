import { InputHTMLAttributes, ReactElement } from 'react';
import styles from './TextField.module.css';

export function TextField(props: InputHTMLAttributes<HTMLInputElement>): ReactElement {
  return <input className={styles.field} {...props} />;
}
