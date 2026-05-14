import React from 'react';

import ProductNewEditForm from 'src/sections/products-catalog/new-edit-form';

export const generateMetadata = ({ params }: { params: { lang: string } }) => {
  const { lang } = params;
  return {
    title: lang === 'ar' ? 'لوحة التحكم | إضافة منتج' : 'Dashboard | Add Product',
  };
};

function ProductCreationPage() {
  return <ProductNewEditForm />;
}

export default ProductCreationPage;
