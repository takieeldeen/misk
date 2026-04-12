import type { ICategoryItem } from 'src/types/category';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback, type MouseEventHandler } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button, { type ButtonProps } from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { useTranslate } from 'src/locales';
import { useCreateCategory, useUpdateCategory } from 'src/actions/category';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewEditFormSchemaType = zod.infer<typeof NewEditFormSchema>;

export const NewEditFormSchema = zod.object({
  nameAr: zod.string().min(1, { message: 'Arabic Name is required' }),
  nameEn: zod.string().min(1, { message: 'English Name is required' }),
  imageUrl: zod.any().optional(),
});

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  currentCategory?: ICategoryItem;
};

export default function NewEditForm({
  open: isOpened,
  onOpen,
  onClose,
  currentCategory,
  ...other
}: Props) {
  const { t } = useTranslate();
  const openForm = useBoolean();
  const upMd = useResponsive('up', 'md');

  const isControlled = isOpened !== undefined;
  const isOpen = isControlled ? isOpened : openForm.value;

  const defaultValues = useMemo(
    () => ({
      nameAr: currentCategory?.nameAr || '',
      nameEn: currentCategory?.nameEn || '',
      imageUrl: currentCategory?.imageUrl || null,
    }),
    [currentCategory]
  );

  const methods = useForm<NewEditFormSchemaType>({
    resolver: zodResolver(NewEditFormSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, currentCategory, reset, defaultValues]);

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
      toast.error(currentCategory ? (t('categories.update_error') || 'Failed to update') : t('categories.create_error'));
    }
  });

  return (
    <>
      {!isControlled && (
        <Button {...other} onClick={handleOpen}>
          {other.children}
        </Button>
      )}

      <Drawer
        open={isOpen}
        onClose={handleClose}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: { xs: 1, md: 480 } } }}
      >
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 2, borderBottom: (theme) => `solid 1px ${theme.palette.divider}` }}
          >
            <Typography variant="h6">
              {currentCategory ? t('categories.edit_category') : t('categories.new_category')}
            </Typography>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ display: { xs: 'none', md: 'inline-flex' } }}
            >
              {currentCategory ? t('common.update') || 'Update' : t('common.create') || 'Create'}
            </LoadingButton>
            <Iconify
              icon="mingcute:close-line"
              onClick={handleClose}
              sx={{ display: { md: 'none' }, cursor: 'pointer' }}
            />
          </Stack>

          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {currentCategory
                ? t('categories.edit_category_desc')
                : t('categories.new_category_description')}
            </Typography>

            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
            >
              <Field.Text
                name="nameEn"
                label={t('categories.name_en')}
                placeholder={t('common.please_enter', { field: t('categories.name_en') })}
              />
              <Field.Text
                name="nameAr"
                label={t('categories.name_ar')}
                placeholder={t('common.please_enter', { field: t('categories.name_ar') })}
              />
            </Box>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">{t('categories.upload_logo')}</Typography>
              <Field.Upload name="imageUrl" />
            </Stack>

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
          </Stack>
        </Form>
      </Drawer>
    </>
  );
}
