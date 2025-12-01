import App from 'koa';
import webhookRouter from '../routes/webhooks'


const api = new App();

api.use(webhookRouter.allowedMethods());
api.use(webhookRouter.routes());

export default api;
