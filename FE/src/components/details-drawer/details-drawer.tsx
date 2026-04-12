'use client';

import type { ReactNode } from 'react';
import type { DrawerProps } from '@mui/material';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';

import { Drawer } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

export interface DetailsDrawerProps extends DrawerProps {
  backLink: string;
  children: ReactNode;
}

function DetailsDrawer({ backLink, children, ...props }: DetailsDrawerProps) {
  const [open, setOpen] = useState<boolean>(props.open || false);
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const onClose = useCallback(
    (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
      props.onClose?.(event, reason);
      setOpen(false);

      setTimeout(() => {
        router.back();
      }, 200);
    },
    [props, router]
  );
  useEffect(() => {
    setOpen(props.open || false);
  }, [props.open]);
  return (
    <Drawer
      {...props}
      open={open}
      onClose={onClose}
      keepMounted
      PaperProps={{
        sx: {
          width: mdUp ? '80%' : 1,
        },
      }}
    >
      {children}
    </Drawer>
  );
}

export default DetailsDrawer;
