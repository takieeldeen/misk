'use client';

import type { MouseEventHandler } from 'react';
import type { ButtonProps } from '@mui/material';
import type { ICategoryItem } from 'src/types/category';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import Drawer from '@mui/material/Drawer';
import { Box, Stack, Button, Typography, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { useTranslate } from 'src/locales';
import { useCreateCategory, useUpdateCategory } from 'src/actions/category';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, RHFTextField } from 'src/components/hook-form';
import { RHFUpload } from 'src/components/hook-form/rhf-upload';

export interface NewEditProps extends ButtonProps {
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  currentCategory?: ICategoryItem;
}

export default function NewEditForm({
  open,
  onClose,
  onOpen,
  currentCategory,
  ...other
}: NewEditProps) {
  const openForm = useBoolean();
  const { t } = useTranslate();
  const mdUp = useResponsive('up', 'md');

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : openForm.value;

  const NewCategorySchema = zod.object({
    nameAr: zod
      .string()
      .min(1, { message: t('common.please_enter', { field: t('categories.name_ar') }) }),
    nameEn: zod
      .string()
      .min(1, { message: t('common.please_enter', { field: t('categories.name_en') }) }),
    imageUrl: zod
      .any()
      .optional()
      .refine(
        (file) =>
          !file ||
          typeof file === 'string' ||
          (file instanceof File && file.size <= 5 * 1024 * 1024),
        { message: t('upload.invalid_size', { size: '5MB' }) }
      ),
  });

  const defaultValues = {
    nameAr: currentCategory?.nameAr ?? '',
    nameEn: currentCategory?.nameEn ?? '',
    imageUrl: currentCategory?.imageUrl ?? null,
  };

  const methods = useForm({
    resolver: zodResolver(NewCategorySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentCategory]);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const handleClose = useCallback(() => {
    if (!isControlled) {
      openForm.onFalse();
    }
    onClose?.();
  }, [isControlled, openForm, onClose]);

  const handleOpen: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      if (!isControlled) {
        openForm.onTrue();
      }
      onOpen?.();
      other.onClick?.(e);
    },
    [isControlled, openForm, onOpen, other]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentCategory) {
        await updateCategory.mutateAsync({ id: currentCategory._id, data });
        handleClose();
        toast.success(t('categories.update_success') || 'Updated successfully');
      } else {
        await createCategory.mutateAsync(data);
        handleClose();
        reset();
        toast.success(t('categories.create_success'));
      }
    } catch (error) {
      console.error(error);
      toast.error(
        currentCategory
          ? t('categories.update_error') || 'Failed to update'
          : t('categories.create_error')
      );
    }
  });

  return (
    <>
      {!isControlled && <Button onClick={handleOpen} {...other} />}

      <Drawer
        open={isOpen}
        onClose={handleClose}
        anchor="left"
        slotProps={{ backdrop: { invisible: false, sx: { backdropFilter: 'blur(4px)' } } }}
        PaperProps={{ sx: { width: mdUp ? 440 : 1 } }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'divider',
            borderColor: 'divider',
          }}
        >
          <Stack direction="column" sx={{ p: 1 }}>
            <Typography variant="h5">{t('categories.new_category')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('categories.new_category_description')}
            </Typography>
          </Stack>
          <IconButton sx={{ borderRadius: 0, p: 1, height: 40, width: 40 }} onClick={handleClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>

        <Form
          methods={methods}
          onSubmit={onSubmit}
          formProps={{
            style: {
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            },
          }}
        >
          <Stack spacing={2} sx={{ py: 3, px: 1, flex: 1, overflowY: 'auto' }}>
            <Stack spacing={1}>
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                {t('categories.name_ar')}
              </Typography>
              <RHFTextField autoFocus name="nameAr" placeholder={t('categories.name_ar')} />
            </Stack>
            <Stack spacing={1}>
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                {t('categories.name_en')}
              </Typography>
              <RHFTextField name="nameEn" placeholder={t('categories.name_en')} />
            </Stack>
            <Stack spacing={1}>
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                {t('categories.image')}
              </Typography>
              <RHFUpload
                name="imageUrl"
                maxFiles={1}
                accept={{ 'image/*': [] }}
                maxSize={1024 * 1024 * 5}
                onDelete={() => {
                  methods.setValue('imageUrl', null);
                }}
              />
            </Stack>
          </Stack>
          <Box sx={{ p: 1 }}>
            <LoadingButton
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              color="primary"
              loading={isSubmitting}
            >
              {currentCategory ? t('common.update') || 'Update' : t('common.create') || 'Create'}
            </LoadingButton>
          </Box>
        </Form>
      </Drawer>
    </>
  );
}
