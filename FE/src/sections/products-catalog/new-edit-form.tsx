'use client';

import React from 'react';
import { z as zod } from 'zod';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Card,
  Fade,
  Stack,
  Button,
  Accordion,
  Container,
  Typography,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { useTranslate } from 'src/locales';
import { useCreateProduct } from 'src/actions/product';
import { useGetBrandsValueHelp } from 'src/actions/brand';
import { useGetCategoriesValueHelp } from 'src/actions/category';

import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { RHFEditor } from 'src/components/hook-form/rhf-editor';
import { RHFUpload } from 'src/components/hook-form/rhf-upload';
import RHFTextField from 'src/components/hook-form/rhf-text-field';
import RHFAutocomplete from 'src/components/hook-form/rhf-autocomplete';

import { GENDER_OPTIONS, STATUS_OPTIONS } from './constants';

function ProductNewEditForm() {
  const { t, i18n } = useTranslate();
  const mdUp = useResponsive('up', 'md');
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesValueHelp();
  const { data: brands, isLoading: brandsLoading } = useGetBrandsValueHelp();
  const { mutateAsync: createProduct } = useCreateProduct();
  const NewProductSchema = zod.object({
    nameAr: zod
      .string()
      .min(1, { message: t('VALIDATIONS.COMMON.REQUIRED', { field: t('catalog.name_ar') }) }),
    nameEn: zod
      .string()
      .min(1, { message: t('VALIDATIONS.COMMON.REQUIRED', { field: t('catalog.name_en') }) }),
    descriptionAr: zod.string(),
    descriptionEn: zod.string(),
    contentAr: zod.string(),
    contentEn: zod.string(),
    images: zod.array(zod.any()).max(10, {
      message: t('VALIDATIONS.COMMON.MAX_VALUE', { field: t('catalog.images'), value: 10 }),
    }),
    gender: zod.any().refine((val) => !!val, {
      message: t('VALIDATIONS.COMMON.REQUIRED', { field: t('catalog.gender') }),
    }),
    category: zod.any().refine((val) => !!val, {
      message: t('VALIDATIONS.COMMON.REQUIRED', { field: t('catalog.category') }),
    }),
    brand: zod.any().refine((val) => !!val, {
      message: t('VALIDATIONS.COMMON.REQUIRED', { field: t('catalog.brand') }),
    }),
    status: zod.any().refine((val) => !!val, {
      message: t('VALIDATIONS.COMMON.REQUIRED', { field: t('catalog.status') }),
    }),
    variants: zod.array(
      zod.object({
        sizeMl: zod.coerce
          .number()
          .positive({ message: t('VALIDATIONS.COMMON.POSITIVE') })
          .min(1, {
            message: t('VALIDATIONS.COMMON.REQUIRED', { field: t('catalog.size_in_ml') }),
          }),
        price: zod.coerce
          .number()
          .positive({ message: t('VALIDATIONS.COMMON.POSITIVE') })
          .min(1, { message: t('VALIDATIONS.COMMON.REQUIRED', { field: t('catalog.price') }) }),
        stock: zod.coerce
          .number()
          .min(0, {
            message: t('VALIDATIONS.COMMON.MIN_VALUE', { field: t('catalog.stock'), value: 0 }),
          })
          .min(1, { message: t('VALIDATIONS.COMMON.REQUIRED', { field: t('catalog.stock') }) }),
      })
    ),
  });

  const defaultValues = {
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    contentAr: '',
    contentEn: '',
    images: [],
    gender: null,
    category: null,
    brand: null,
    status: null,
    variants: [
      {
        sizeMl: '',
        price: '',
        stock: '',
      },
    ],
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'variants',
  });

  const onValid = async (data: any) => {
    try {
      await createProduct(data);
      toast.success(t('common.create_success'));
    } catch (error) {
      toast.error(t('common.create_error'));
      console.error(error);
    }
  };

  const onInvalid = (errors: any) => {
    console.log('ERRORS', errors);
    toast.error(t('common.create_error'));
  };
  const onSubmit = handleSubmit(onValid, onInvalid);

  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack sx={{ mb: 2 }}>
          <Typography variant="h4">{t('catalog.new_product')}</Typography>
        </Stack>
        <Stack spacing={2}>
          <Card>
            <Accordion defaultExpanded>
              <AccordionSummary
                sx={{ px: 3 }}
                title={t('catalog.basic_info')}
                expandIcon={<Iconify icon="majesticons:chevron-up" />}
              >
                <Stack spacing={0.5}>
                  <Typography variant="h6">{t('catalog.basic_info')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('catalog.basic_info_desc')}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ borderTop: 1, borderColor: 'divider', py: 3 }}>
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                        {t('catalog.name_ar')}
                      </Typography>
                      <RHFTextField
                        name="nameAr"
                        placeholder={t('catalog.name_ar_placeholder')}
                        sx={{
                          '::placeholder': {
                            color: 'red !important',
                          },
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                        {t('catalog.name_en')}
                      </Typography>
                      <RHFTextField name="nameEn" placeholder={t('catalog.name_en_placeholder')} />
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={12}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                        {t('catalog.description_ar')}
                      </Typography>
                      <RHFTextField
                        multiline
                        rows={4}
                        name="descriptionAr"
                        placeholder={t('catalog.description_ar_placeholder')}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={12}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                        {t('catalog.description_en')}
                      </Typography>
                      <RHFTextField
                        multiline
                        rows={4}
                        name="descriptionEn"
                        placeholder={t('catalog.description_en_placeholder')}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={12}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                        {t('catalog.contentAr')}
                      </Typography>
                      <RHFEditor name="contentAr" placeholder={t('catalog.contentAr')} />
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={12}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                        {t('catalog.contentEn')}
                      </Typography>
                      <RHFEditor name="contentEn" placeholder={t('catalog.contentEn')} />
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={12}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                        {t('catalog.images')}
                      </Typography>
                      <RHFUpload
                        name="images"
                        multiple
                        onRemove={(inputFile) => {
                          const newValue = methods
                            .getValues('images')
                            .filter((file: any) => file !== inputFile);
                          methods.setValue('images', newValue, { shouldValidate: true });
                        }}
                        onRemoveAll={() => methods.setValue('images', [], { shouldValidate: true })}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
          <Card>
            <Accordion defaultExpanded>
              <AccordionSummary
                sx={{ px: 3 }}
                title={t('catalog.properties')}
                expandIcon={<Iconify icon="majesticons:chevron-up" />}
              >
                <Stack spacing={0.5}>
                  <Typography variant="h6">{t('catalog.properties')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('catalog.properties_desc')}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ borderTop: 1, borderColor: 'divider', py: 3 }}>
                <Grid container spacing={2}>
                  <Grid xs={12} md={12}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                        {t('catalog.gender')}
                      </Typography>
                      <RHFAutocomplete
                        name="gender"
                        options={GENDER_OPTIONS}
                        getOptionKey={(option) =>
                          typeof option === 'string' ? option : option.value
                        }
                        getOptionLabel={(option) => {
                          if (typeof option === 'object')
                            return i18n.language === 'ar' ? option?.nameAr : option?.nameEn;
                          return option;
                        }}
                        placeholder={t('catalog.gender')}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={12}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                        {t('catalog.category')}
                      </Typography>
                      <RHFAutocomplete
                        name="category"
                        loading={categoriesLoading}
                        options={categories?.content || []}
                        getOptionKey={(option) =>
                          typeof option === 'string' ? option : option._id
                        }
                        getOptionLabel={(option) => {
                          if (typeof option === 'object')
                            return i18n.language === 'ar' ? option?.nameAr : option?.nameEn;
                          return option;
                        }}
                        placeholder={t('catalog.category')}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={12}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                        {t('catalog.brand')}
                      </Typography>
                      <RHFAutocomplete
                        name="brand"
                        loading={brandsLoading}
                        options={brands?.content || []}
                        getOptionKey={(option) =>
                          typeof option === 'string' ? option : option._id
                        }
                        getOptionLabel={(option) => {
                          if (typeof option === 'object')
                            return i18n.language === 'ar' ? option?.nameAr : option?.nameEn;
                          return option;
                        }}
                        placeholder={t('catalog.brand')}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={12}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                        {t('catalog.status')}
                      </Typography>
                      <RHFAutocomplete
                        name="status"
                        options={STATUS_OPTIONS}
                        getOptionKey={(option) =>
                          typeof option === 'string' ? option : option.value
                        }
                        getOptionLabel={(option) => {
                          if (typeof option === 'object')
                            return i18n.language === 'ar' ? option?.nameAr : option?.nameEn;
                          return option;
                        }}
                        placeholder={t('catalog.status')}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
          <Card>
            <Accordion defaultExpanded>
              <AccordionSummary
                sx={{ px: 3 }}
                title={t('catalog.variants')}
                expandIcon={<Iconify icon="majesticons:chevron-up" />}
              >
                <Stack spacing={0.5}>
                  <Typography variant="h6">{t('catalog.variants')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('catalog.variants_desc')}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ borderTop: 1, borderColor: 'divider', py: 3 }}>
                {fields.map((field, index) => (
                  <Stack direction="row" spacing={2} key={field.id}>
                    <Grid container spacing={2} sx={{ flex: 1 }}>
                      <Grid xs={4} md={4}>
                        <Stack spacing={1}>
                          <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                            {t('catalog.size_in_ml')}
                          </Typography>
                          <RHFTextField
                            name={`variants.${index}.sizeMl`}
                            placeholder={t('catalog.size_in_ml')}
                            type="number"
                          />
                        </Stack>
                      </Grid>
                      <Grid xs={4} md={4}>
                        <Stack spacing={1}>
                          <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                            {t('catalog.price')}
                          </Typography>
                          <RHFTextField
                            name={`variants.${index}.price`}
                            placeholder={t('catalog.price')}
                            type="number"
                          />
                        </Stack>
                      </Grid>
                      <Grid xs={4} md={4}>
                        <Stack spacing={1}>
                          <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                            {t('catalog.stock')}
                          </Typography>
                          <RHFTextField
                            name={`variants.${index}.stock`}
                            placeholder={t('catalog.stock')}
                            type="number"
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                    <Stack direction="row" spacing={1} mb={3}>
                      <Button
                        variant="outlined"
                        sx={{
                          height: '48px',
                          aspectRatio: 1,
                          minWidth: 'unset',
                          px: 0,
                          py: 0,
                          alignSelf: 'flex-end',
                        }}
                        title={t('catalog.add_variant')}
                        onClick={() => {
                          append({
                            sizeMl: '',
                            price: '',
                            stock: '',
                          });
                        }}
                      >
                        <Iconify icon="tabler:plus" />
                      </Button>
                      <Fade in={fields.length > 1}>
                        <Button
                          variant="outlined"
                          sx={{
                            height: '48px',
                            aspectRatio: 1,
                            minWidth: 'unset',
                            px: 0,
                            py: 0,
                            alignSelf: 'flex-end',
                            color: 'error.main',
                            borderColor: 'error.main',
                          }}
                          title={t('catalog.remove_variant')}
                          onClick={() => {
                            remove(index);
                          }}
                        >
                          <Iconify icon="tabler:trash" />
                        </Button>
                      </Fade>
                    </Stack>
                  </Stack>
                ))}
              </AccordionDetails>
            </Accordion>
          </Card>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton
              type="submit"
              color="primary"
              size="large"
              variant="contained"
              loading={isSubmitting}
              sx={{ width: mdUp ? 'auto' : '100%' }}
            >
              {t('common.create')}
            </LoadingButton>
          </Stack>
        </Stack>
      </Form>
    </Container>
  );
}

export default ProductNewEditForm;
