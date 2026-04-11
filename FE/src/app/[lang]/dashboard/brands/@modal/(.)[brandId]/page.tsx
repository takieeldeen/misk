import React from 'react';

import DetailsDrawer from 'src/components/details-drawer/details-drawer';

import BrandDetailsView from 'src/sections/brands/views/details-view';

function BrandModalPage() {
  return (
    <DetailsDrawer backLink="/dashboard/brands" open>
      <BrandDetailsView />
    </DetailsDrawer>
  );
}

export default BrandModalPage;
