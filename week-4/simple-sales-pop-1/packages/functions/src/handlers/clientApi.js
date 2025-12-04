import App from 'koa';
import clientApiRoute from '../routes/clientApi'


const api = new App();

api.use(clientApiRoute.allowedMethods());
api.use(clientApiRoute.routes());
export default api;
