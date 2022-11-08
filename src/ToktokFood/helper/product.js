const reshapeData = products => {
  const productHolder = [];
  if (products && Object.keys(products).length > 0) {
    Object.entries(products).forEach(([key, value]) => {
      const obj = {
        title: key,
        data: value,
      };
      productHolder.push(obj);
    });
  }
  return productHolder;
};

const groupByCategories = (products, routes) => {
  const productHolder = [];
  if (products.length > 0) {
    products.map(product => {
      for (let i = 0; i < routes.length; i++) {
        if (product.catId === routes[i].id) {
          product.categoryName = routes[i].title;
          break;
        } else {
          product.categoryName = 'All Menu';
        }
      }
      productHolder.push(product);
    });
  }

  const uniqueProducts = [...new Set(productHolder)];
  const categorizedProducts = uniqueProducts.reduce((group, product) => {
    const {categoryName} = product;
    group[categoryName] = group[categoryName] ?? [];
    group[categoryName].push(product);
    return group;
  }, {});

  return reshapeData(categorizedProducts);
};

export const filterAvailableProducts = (products, routes) => {
  const productHolder = [];
  if (products.length > 0) {
    const removedFalsyProducts = products.filter(Boolean);
    removedFalsyProducts.map(product => {
      let variantHolder = [];
      const variants = product.variants;
      if (variants.length === 1) {
        if (variants[0].enabled === 2) {
          productHolder.push(product);
        } else if (variants[0].enabled === 1) {
          product.variants = variants;
          productHolder.push(product);
        }
      } else {
        if (variants.length > 0) {
          variants.map(variant => {
            if (variant.enabled === 1 && (variant.stocks > 0 || variant.contSellingIsset > 0)) {
              variantHolder.push(variant);
            }
          });
          if (variantHolder.length) {
            product.variants = variantHolder;
            productHolder.push(product);
          }
        } else {
          productHolder.push(product);
        }
      }
    });
  }

  const categorizedProducts = groupByCategories(productHolder, routes);
  return categorizedProducts;
};
