import { app } from './app';
import { env } from '../config/env';

app.listen(env.PORT, () => {
  const localUrl = ['http:', '', `localhost:${env.PORT}`].join('/');
  process.stdout.write(`Backend running on ${localUrl}\n`);
});
