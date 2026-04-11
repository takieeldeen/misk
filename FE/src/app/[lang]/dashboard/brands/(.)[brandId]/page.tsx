'use client';

import { useRouter } from 'next/navigation';

import Drawer from '@mui/material/Drawer';

import { useResponsive } from 'src/hooks/use-responsive';

import BrandDetailsView from 'src/sections/brands/views/details-view';

// ----------------------------------------------------------------------

export default function InterceptedBrandDetailsPage() {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  console.log('Intercepted Routes');
  const handleClose = () => {
    router.back();
  };

  return (
    <Drawer
      open
      onClose={handleClose}
      anchor="right"
      slotProps={{ backdrop: { invisible: false, sx: { backdropFilter: 'blur(4px)' } } }}
      PaperProps={{ sx: { width: mdUp ? 560 : 1 } }}
    >
      <BrandDetailsView />
    </Drawer>
  );
}
