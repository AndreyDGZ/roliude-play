export const colors = {
  backgroundBase: 'var(--color-page-bg)',
  backgroundElevated: 'var(--color-surface)',
  borderMuted: 'var(--color-border-muted)',
  brandPrimary: 'var(--color-action-primary-bg)',
  googleBlue: '#4285F4',
  statusSuccess: 'var(--color-success-text)',
  statusWarning: 'var(--brand-yellow)',
  textMuted: 'var(--color-text-muted)',
  textPrimary: 'var(--color-text-primary)'
} as const;

export const radii = {
  medium: 'var(--radius-medium)',
  small: 'var(--radius-small)'
} as const;

export const space = {
  large: 'var(--space-5)',
  small: 'var(--space-2)',
  medium: 'var(--space-3)'
} as const;

export const layout = {
  formMaxWidth: 'var(--layout-form-max)',
  authMaxWidth: 'var(--layout-auth-max)'
} as const;

export const typography = {
  strongWeight: 700
} as const;
