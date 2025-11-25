import App from 'koa';
import webhookRouter from '../routes/webhooks'


const api = new App();
api.proxy = true;


api.use(webhookRouter.allowedMethods());
api.use(webhookRouter.routes());

export default api;
