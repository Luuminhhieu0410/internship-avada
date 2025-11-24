import { Context, Next } from "koa";

export const errorHandler = () => {
  return async (ctx: Context, next: Next) => {
    try {
      await next();
    } catch (err: any) {
      console.log("Caught error:", err.message);
      ctx.status = err.status || 500;
      ctx.body = {
        success: false,
        message: err.message || "Internal Server Error",
      };
    }
  };
};
