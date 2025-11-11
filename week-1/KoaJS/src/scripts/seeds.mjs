// seed-products.js
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
const generateProducts = (count = 100) => {
  const products = [];

  for (let i = 0; i < count; i++) {
    products.push({
      id: i + 1,
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price({ min: 1, max: 100 })),
      description: faker.commerce.productDescription(),
      product: faker.commerce.department(),
      color: faker.color.human(),
      createdAt: faker.date.past().toISOString(),
      image: faker.image.urlPicsumPhotos()
    });
  }

  return products;
};


const products = generateProducts();

// console.log(path.resolve());
// console.log(path.join(path.resolve(),"/src/database/products.json"));

fs.writeFileSync(path.join(path.resolve(),"/src/database/products.json"), JSON.stringify(products,null,2), 'utf-8');
console.log('import thanh cong');
