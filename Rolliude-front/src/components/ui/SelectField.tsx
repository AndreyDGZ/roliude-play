import { ReactElement, SelectHTMLAttributes } from 'react';
import styles from './SelectField.module.css';

export function SelectField(props: SelectHTMLAttributes<HTMLSelectElement>): ReactElement {
  return <select className={styles.field} {...props} />;
}
