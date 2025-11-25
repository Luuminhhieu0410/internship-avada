export async function getTestEndpoint(ctx) {
    ctx.response.status = 200;
    ctx.response.body = { success: true }

}