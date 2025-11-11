import { readFile, writeFile } from "fs";
import path from "path";
import { Product } from "../types/product";

const DB_PATH = path.join(path.resolve(), "src/database/products.json");

// đọc tất cả product
export function getAllProduct(): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    readFile(DB_PATH, "utf-8", (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data.toString()));
    });
  });
}

// ghi lại file
export function saveAllProduct(products: Product[]): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile(DB_PATH, JSON.stringify(products, null, 2), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// phân trang
export async function paginationProduct(limit: number, page: number, sort: string) {
  if (limit < 0 || page < 0) return;
  const offset = (Math.round(page) - 1) * limit;

  try {
    const allProduct = await getAllProduct();
    const sliceProduct = allProduct.slice(offset, offset + limit); 

    const sortProduct =
      sort === "asc"
        ? sliceProduct.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        : sliceProduct.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const totalPages = Math.ceil(allProduct.length / limit);

    return {
      data: sortProduct,
      pagination: {
        totalPages,
        currentPage: page,
        hasNextPage: totalPages > page,
        hasPreviousPage: page > 1,
      },
    };
  } catch (e) {
    console.log(e);
  }
}

// lấy product theo id
export async function getProductById(
  productId: number,
  fields?: string[]
): Promise<Partial<Product> | null> {
  const products = await getAllProduct();
  const product = products.find((p) => p.id === productId);

  if (!product) return null;

  if (!fields || fields.length === 0) return product;

  // Lọc các trường được chọn
  const filtered = Object.keys(product)
    .filter((key) => fields.includes(key))
    .reduce((obj, key) => {
      (obj as any)[key] = (product as any)[key];
      return obj;
    }, {} as Partial<Product>);

  return filtered;
}

// thêm product mới
export async function createProduct(newProduct: Product) {
  const products = await getAllProduct();
  products.push(newProduct);
  await saveAllProduct(products);
  return newProduct;
}

// cập nhật product
export async function updateProductByProductId(productId: number, updatedData: Partial<Product>) {
  const products = await getAllProduct();
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) return null;

  products[index] = { ...products[index], ...updatedData };
  await saveAllProduct(products);
  return products[index];
}

// xóa product
export async function deleteProductById(productId: number) {
  const products = await getAllProduct();
  const newProducts = products.filter((p) => p.id !== productId);
  if (newProducts.length === products.length) return false; 

  await saveAllProduct(newProducts);
  return true;
}
