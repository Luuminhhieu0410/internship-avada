import { getNotification } from "../repositories/notificationRepository";

export async function paginationNotification(ctx) {
    try {
        const { limit, startCursor, endCursor, sortBy } = ctx.request.query;

        const result = await getNotification({
            limit: Number(limit) || 10,
            startCursor: startCursor || null,
            endCursor: endCursor || null,
            sortBy: sortBy || 'desc'
        });

        ctx.body = {
            success: true,
            ...result
        };
    } catch (error) {
        console.error("paginationNotification Error:", error);
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: error.message
        };
    }
}
