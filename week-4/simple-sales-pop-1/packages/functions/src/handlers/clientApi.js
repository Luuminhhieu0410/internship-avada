import App from 'koa';
import router from '../routes/clientApi';
import cors from '@koa/cors';

const app = new App();
// app.proxy = true;
app.use(cors());

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
