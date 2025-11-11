import Koa from 'koa';
import router from './src/routes/product.route';
import {koaBody} from 'koa-body'
// app.mjs


const app = new Koa();

app.use(koaBody())
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server running on port 3000');
});