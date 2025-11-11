import Application, { ParameterizedContext } from "koa";
import * as yup from "yup";
export async function ProductInputMiddleware(
  ctx: ParameterizedContext,
  next: Application.Next
) {
  try {
    const postData = ctx.request.body;
    console.log('data' ,postData);
    const schema = yup.object({
      id: yup.number().positive().integer().required(),
      name: yup.string().required(),
      price: yup.number().positive().required(),
      description: yup.string().required(),
      product: yup.string().required(),
      color: yup.string().required(),
      createdAt: yup.string().required(),
      image: yup
        .string()
        .url()
        .required(),
    });

    await schema.validate(postData);
    ctx.state.product = postData;
    await next();
  } catch (e: any) {
    console.log(e);
    ctx.status = 400;
    ctx.body = {
      success: false,
      errors: e.errors,
      errorName: e.name,
    };
  }
}
