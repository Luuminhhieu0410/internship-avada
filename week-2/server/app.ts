import Koa from "koa";
import koaBody from "koa-body";
import router from "./routes";
import cors from '@koa/cors'
const app = new Koa();
const port = 4000;
app.use(cors());
app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
