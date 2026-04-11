import React from 'react';

import { Drawer } from '@mui/material';

import BrandDetailsView from 'src/sections/brands/views/details-view';

function BrandModalPage() {
  return (
    <Drawer open>
      <BrandDetailsView />
    </Drawer>
  );
}

export default BrandModalPage;
