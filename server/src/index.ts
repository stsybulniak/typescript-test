import App from './app';
import { isTest } from './utils';

const { PORT = 5000 } = process.env;
const app = new App(Number(PORT));

if (!isTest) {
  app.listen();
}

export default app;
