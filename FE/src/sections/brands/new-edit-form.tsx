'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import Drawer from '@mui/material/Drawer';
import { Box, Stack, Button, Typography, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { useTranslate } from 'src/locales';
import { useCreateBrand } from 'src/actions/brand';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, RHFTextField } from 'src/components/hook-form';
import { RHFUpload } from 'src/components/hook-form/rhf-upload';

export default function NewEditForm() {
  const openForm = useBoolean();
  const { t } = useTranslate();
  const mdUp = useResponsive('up', 'md');

  const NewBrandSchema = zod.object({
    nameAr: zod
      .string()
      .min(1, { message: t('common.please_enter', { field: t('brands.name_ar') }) }),
    nameEn: zod
      .string()
      .min(1, { message: t('common.please_enter', { field: t('brands.name_en') }) }),
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
    nameAr: '',
    nameEn: '',
    imageUrl: null,
  };

  const methods = useForm({
    resolver: zodResolver(NewBrandSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const createBrand = useCreateBrand();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createBrand.mutateAsync(data);
      openForm.onFalse();
      methods.reset();
      toast.success(t('brands.create_success'));
    } catch (error) {
      console.error(error);
      toast.error(t('brands.create_error'));
    }
  });

  return (
    <>
      <Button
        onClick={openForm.onTrue}
        variant="contained"
        color="primary"
        startIcon={<Iconify icon="mingcute:add-line" />}
      >
        {t('brands.new_brand')}
      </Button>

      <Drawer
        open={openForm.value}
        onClose={openForm.onFalse}
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
            <Typography variant="h5">{t('brands.new_brand')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('brands.new_brand_description')}
            </Typography>
          </Stack>
          <IconButton
            sx={{ borderRadius: 0, p: 1, height: 40, width: 40 }}
            onClick={openForm.onFalse}
          >
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
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{t('brands.name_ar')}</Typography>
              <RHFTextField autoFocus name="nameAr" placeholder={t('brands.name_ar')} />
            </Stack>
            <Stack spacing={1}>
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{t('brands.name_en')}</Typography>
              <RHFTextField name="nameEn" placeholder={t('brands.name_en')} />
            </Stack>
            <Stack spacing={1}>
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{t('brands.image')}</Typography>
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
              {t('common.create') || 'Create'}
            </LoadingButton>
          </Box>
        </Form>
      </Drawer>
    </>
  );
}
