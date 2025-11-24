import Koa from "koa";
import { errorHandler } from "./middleware/errorHandler";
import taskRouter from "./routes/task.route";
import koaBody from "koa-body";

const app = new Koa();
app.use(errorHandler());

app.use(koaBody());
app.use(taskRouter.routes());
export default app;
