# Quality And Security

Rules are mandatory:

- no `any`, `as any`, `@ts-ignore` or `@ts-expect-error`;
- no comments in touched code files;
- no one-letter variables except trivial loop indexes;
- no unused imports, unused variables, dead code or `console.log`;
- no secrets in source code;
- no sensitive values in logs;
- external input must be validated;
- UI must use Design System tokens.
