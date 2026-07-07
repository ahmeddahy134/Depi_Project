import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchProducts, fetchCategories } from '../services/api';
import { products as fallbackProducts, categories as fallbackCategories } from '../data/products';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

// Arabic category name -> URL slug, matching the original GlowCare demo data.
// Falls back to a generated slug for any category the backend adds later.
const KNOWN_SLUGS = {
  'سيروم': 'serums',
  'كريمات': 'creams',
  'غسول ومنظفات': 'cleansers',
  'تونر وماء الورد': 'toners',
  'واقي شمس': 'sunscreen',
  'مقشرات': 'exfoliators',
  'اقنعة وماسكات': 'masks',
};

function slugify(name, id) {
  return KNOWN_SLUGS[name] || `category-${id}`;
}

function mapCategory(cat) {
  return {
    id: cat.id,
    name: cat.name,
    slug: slugify(cat.name, cat.id),
    description: cat.description || '',
  };
}

function mapProduct(p, categoriesById) {
  const category = categoriesById[p.category_id];
  return {
    id: p.id,
    name: p.name,
    category: category?.name || p.brand || '',
    slug: category?.slug || 'uncategorized',
    price: p.price,
    image: p.image,
    description: p.description || '',
    ingredients: [],
    features: [
      p.badge,
      p.is_featured ? 'الاكثر مبيعا' : null,
    ].filter(Boolean),
    rating: p.rating,
    reviewCount: p.review_count,
  };
}

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(fallbackProducts);
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [usingLiveData, setUsingLiveData] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [rawCategories, rawProducts] = await Promise.all([
          fetchCategories(),
          fetchProducts({ perPage: 100 }),
        ]);

        if (cancelled) return;

        if (rawProducts.length > 0) {
          const mappedCategories = rawCategories.map(mapCategory);
          const categoriesById = Object.fromEntries(mappedCategories.map((c) => [c.id, c]));
          const mappedProducts = rawProducts.map((p) => mapProduct(p, categoriesById));

          setCategories(mappedCategories);
          setProducts(mappedProducts);
          setUsingLiveData(true);
        }
        // If the backend has no products yet (not seeded), silently keep
        // the bundled demo data so the storefront still looks complete.
      } catch (err) {
        // Backend unreachable / not running yet: keep demo data as fallback.
        console.warn('Falling back to demo product data:', err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <ProductsContext.Provider value={{ products, categories, loading, usingLiveData }}>
      {children}
    </ProductsContext.Provider>
  );
};
