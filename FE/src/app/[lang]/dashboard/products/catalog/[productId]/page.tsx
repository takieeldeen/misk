import React from 'react';

function ProductDetailsPage({ params }: { params: { productId: string } }) {
  return <div>{params.productId}</div>;
}

export default ProductDetailsPage;
