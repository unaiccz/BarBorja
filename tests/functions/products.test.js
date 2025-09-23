import { jest } from '@jest/globals';

import {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct
} from '../../src/functions/products.js';

jest.setTimeout(30000);

describe('Products Functions Integration Tests', () => {
  const uniqueSuffix = () => `${Date.now()}_${Math.floor(Math.random() * 100000)}`;

  const makeProductData = () => ({
    name: `Test Product ${uniqueSuffix()}`,
    description: 'A test product description',
    price: 19.99,
    stock: 10,
    type: 'test-type',
    ingredients: ['water', 'sugar'],
    allergens: ['nuts']
  });

  test('testGetProductsSuccess', async () => {
    const p = makeProductData();
    const created = await createProduct(
      p.name,
      p.description,
      p.price,
      p.stock,
      p.type,
      p.ingredients,
      p.allergens
    );

    expect(created).not.toBeNull();
    expect(created.id).toBeDefined();

    const all = await getProducts();
    expect(Array.isArray(all)).toBe(true);
    expect(all.some(item => item.id === created.id)).toBe(true);

    await deleteProduct(created.id);
  });

  test('testGetProductByIdSuccess', async () => {
    const p = makeProductData();
    const created = await createProduct(
      p.name,
      p.description,
      p.price,
      p.stock,
      p.type,
      p.ingredients,
      p.allergens
    );

    expect(created).not.toBeNull();
    expect(created.id).toBeDefined();

    const fetched = await getProductById(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched.id).toBe(created.id);
    expect(fetched.name).toBe(p.name);

    await deleteProduct(created.id);
  });

  test('testCreateProductSuccess', async () => {
    const p = makeProductData();
    const created = await createProduct(
      p.name,
      p.description,
      p.price,
      p.stock,
      p.type,
      p.ingredients,
      p.allergens
    );

    expect(created).not.toBeNull();
    expect(created.id).toBeDefined();
    expect(created.name).toBe(p.name);
    expect(created.price).toBe(p.price);
    expect(created.stock).toBe(p.stock);

    await deleteProduct(created.id);
  });

  test('testGetProductsWithDatabaseError', async () => {
    const originalEnv = {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
    };

    process.env.SUPABASE_URL = 'http://127.0.0.1:1';
    process.env.SUPABASE_ANON_KEY = 'invalid-key';

    jest.resetModules();

    const badModule = await import('../../src/functions/products.js');
    const result = await badModule.getProducts();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([]);

    process.env.SUPABASE_URL = originalEnv.SUPABASE_URL;
    process.env.SUPABASE_ANON_KEY = originalEnv.SUPABASE_ANON_KEY;
  });

  test('testGetProductByIdNotFound', async () => {
    // Use an unlikely ID. If UUID is used, this invalid format should trigger an error as well.
    const invalidId = -1;
    const result = await getProductById(invalidId);
    expect(result).toBeNull();
  });

  test('testCreateProductWithDatabaseError', async () => {
    // Attempt to violate a likely NOT NULL constraint on "name"
    const result = await createProduct(
      null,
      'desc',
      10.5,
      1,
      'type',
      ['ing'],
      ['all']
    );
    expect(result).toBeNull();
  });
});