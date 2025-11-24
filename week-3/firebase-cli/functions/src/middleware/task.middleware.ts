import { Context, Next } from "koa";

export async function validateInputTask(ctx: Context, next: Next) {
  const body: any = ctx.request.body;
  if (!body.title) {
    ctx.throw(400, "Thiếu trường title");
  }
  await next();
}
