import Router from "koa-router";
import {
  getAllProduct,
  paginationProduct,
  getProductById,
  createProduct,
  updateProductByProductId,
  deleteProductById,
} from "../repository/product.repository";
import { ProductInputMiddleware } from "../middleware/product.middleware";
import { Product } from "../types/product";

const router = new Router({
  prefix: "/api",
});

// GET /api/products?page=1&limit=16&sort=desc
router.get("/products", async (ctx) => {
  try {
    const { limit = "16", page = "1", sort = "desc" } = ctx.query;
    const data = await paginationProduct(
      Number(limit),
      Number(page),
      sort.toString()
    );
    if (data) {
      ctx.body = { success: true, ...data };
    } else {
      ctx.status = 404;
      ctx.body = { success: false, message: "No products found" };
    }
  } catch (e: any) {
    ctx.status = 500;
    ctx.body = { success: false, error: e.message };
  }
});

// GET /api/product/:id
router.get("/product/:id", async (ctx) => {
  try {
    const id = Number(ctx.params.id);
    const fields : any = (ctx.query.fields as string | undefined)?.split(",");

    const product = await getProductById(id, fields);

    if (!product) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: "Product not found",
      };
      return;
    }

    ctx.body = {
      success: true,
      data: product,
    };
  } catch (e: any) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
});

// POST /api/products
router.post("/products", ProductInputMiddleware, async (ctx) => {
  const product = ctx.state.product;
  const created = await createProduct(product);
  ctx.status = 201;
  ctx.body = { success: true, data: created };
});

// PUT /api/product/:id
router.put("/product/:id", async (ctx) => {
  const id = Number(ctx.params.id);
  const updatedData: any = ctx.request.body;
  const updated = await updateProductByProductId(id, updatedData);
  if (updated) {
    ctx.body = { success: true, data: updated };
  } else {
    ctx.status = 404;
    ctx.body = { success: false, message: "Product not found" };
  }
});

// DELETE /api/product/:id
router.delete("/product/:id", async (ctx) => {
  const id = Number(ctx.params.id);
  const deleted = await deleteProductById(id);
  if (deleted) {
    ctx.body = { success: true, message: "Product deleted successfully" };
  } else {
    ctx.status = 404;
    ctx.body = { success: false, message: "Product not found" };
  }
});

export default router;
