'use client';

import type { IProductItem } from 'src/types/product';
// import type { ICheckoutItem } from 'src/types/checkout';

import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Box, alpha, Rating, TextField, Autocomplete } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';
import { fCurrency, fShortenNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  product: IProductItem;
  //   items?: ICheckoutItem[];
  disableActions?: boolean;
  onGotoStep?: (step: number) => void;
  //   onAddCart?: (cartItem: ICheckoutItem) => void;
};

export function DetailsSummary({
  //   items,
  product,
  //   onAddCart,
  onGotoStep,
  disableActions,
  ...other
}: Props) {
  const [currentVariant, setCurrentVariant] = useState<IProductItem['variants'][0] | null>(null);
  const router = useRouter();
  const { i18n, t } = useTranslate();
  const {
    _id,
    nameAr,
    nameEn,
    descriptionAr,
    descriptionEn,
    status,
    gender,
    brand,
    category,
    createdAt,
    updatedAt,
    // sizes,
    // price,
    // coverUrl,
    // colors,
    // newLabel,
    // available,
    // priceSale,
    // saleLabel,
    // totalRatings,
    // totalReviews,
    // inventoryType,
    // subDescription,
  } = product;

  // const existProduct = !!items?.length && items.map((item) => item.id).includes(id);

  // const isMaxQuantity =
  //   !!items?.length &&
  //   items.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  // const defaultValues = {
  //   id,
  //   name,
  //   coverUrl,
  //   available,
  //   price,
  //   colors: colors[0],
  //   size: sizes[4],
  //   quantity: available < 1 ? 0 : 1,
  // };

  // const methods = useForm({ defaultValues });

  // const { reset, watch, control, setValue, handleSubmit } = methods;

  // const values = watch();

  // useEffect(() => {
  //   if (product) {
  //     reset(defaultValues);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [product]);

  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     if (!existProduct) {
  //       onAddCart?.({ ...data, colors: [values.colors], subtotal: data.price * data.quantity });
  //     }
  //     onGotoStep?.(0);
  //     router.push(paths.product.checkout);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  // const handleAddCart = useCallback(() => {
  //   try {
  //     onAddCart?.({ ...values, colors: [values.colors], subtotal: values.price * values.quantity });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [onAddCart, values]);

  const renderPrice = (
    <Box sx={{ typography: 'h5' }}>
      {/* {currentVariant?.price && (
        <Box
          component="span"
          sx={{ color: 'text.disabled', textDecoration: 'line-through', mr: 0.5 }}
        >
          {fCurrency(currentVariant.price/100)}
        </Box>
      )} */}

      {fCurrency((currentVariant?.price || 0) / 100, { currency: 'EGP' })}
    </Box>
  );

  // const renderShare = (
  //   <Stack direction="row" spacing={3} justifyContent="center">
  //     <Link
  //       variant="subtitle2"
  //       sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
  //     >
  //       <Iconify icon="mingcute:add-line" width={16} sx={{ mr: 1 }} />
  //       Compare
  //     </Link>

  //     <Link
  //       variant="subtitle2"
  //       sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
  //     >
  //       <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
  //       Favorite
  //     </Link>

  //     <Link
  //       variant="subtitle2"
  //       sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
  //     >
  //       <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
  //       Share
  //     </Link>
  //   </Stack>
  // );

  // const renderColorOptions = (
  //   <Stack direction="row">
  //     <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //       Color
  //     </Typography>

  //     <Controller
  //       name="colors"
  //       control={control}
  //       render={({ field }) => (
  //         <ColorPicker
  //           colors={colors}
  //           selected={field.value}
  //           onSelectColor={(color) => field.onChange(color as string)}
  //           limit={4}
  //         />
  //       )}
  //     />
  //   </Stack>
  // );

  const renderSizeOptions = (
    <Stack direction="row" alignItems={{ md: 'center' }}>
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        {t('PRODUCTS.SIZE')}
      </Typography>
      <Autocomplete
        disableClearable
        options={product?.variants ?? []}
        getOptionLabel={(option) => t('common.SIZE_ML', { size: option.sizeMl })}
        getOptionKey={(option) => option?._id}
        renderInput={(params) => <TextField {...params} label={t('PRODUCTS.SIZE')} sx={{}} />}
        sx={{ minWidth: 150 }}
        value={currentVariant!}
        onChange={(event, newValue) => {
          setCurrentVariant(newValue);
        }}
        renderOption={(props, option) => (
          <Box {...(props as any)} key={option._id}>
            {t('common.SIZE_ML', { size: option.sizeMl })}
          </Box>
        )}
      />
    </Stack>
  );

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        {t('PRODUCTS.AVAILABLE_QUANTITY')}
      </Typography>

      <Stack spacing={1}>
        <Typography sx={{ textAlign: 'right' }}>{currentVariant?.stock ?? '--'}</Typography>
      </Stack>
    </Stack>
  );
  const renderDates = (
    <>
      <Stack direction="row">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {t('PRODUCTS.CREATED_AT')}
        </Typography>

        <Stack spacing={1}>
          <Typography sx={{ textAlign: 'right', color: 'text.secondary' }}>
            {fDate(createdAt)}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {t('PRODUCTS.UPDATED_AT')}
        </Typography>

        <Stack spacing={1}>
          <Typography sx={{ textAlign: 'right', color: 'text.secondary' }}>
            {fDate(updatedAt)}
          </Typography>
        </Stack>
      </Stack>
    </>
  );

  const renderBrand = (
    <Stack direction="row" alignItems="center">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        {t('PRODUCTS.BRAND')}
      </Typography>

      <Stack spacing={1} direction="row" alignItems="center">
        {brand?.imageUrl && (
          <Box
            component="img"
            src={brand.imageUrl}
            alt={brand.nameAr}
            sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
          />
        )}
        <Typography sx={{ textAlign: 'right' }}>
          {i18n.language === 'ar' ? brand?.nameAr : (brand?.nameEn ?? '--')}
        </Typography>
      </Stack>
    </Stack>
  );
  const renderCategory = (
    <Stack direction="row" alignItems="center">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        {t('PRODUCTS.CATEGORY')}
      </Typography>

      <Stack spacing={1} direction="row" alignItems="center">
        {category?.imageUrl && (
          <Box
            component="img"
            src={category.imageUrl}
            alt={category.nameAr}
            sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
          />
        )}
        <Typography sx={{ textAlign: 'right' }}>
          {i18n.language === 'ar' ? category?.nameAr : (category?.nameEn ?? '--')}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {i18n.language === 'ar' ? descriptionAr : descriptionEn}
    </Typography>
  );

  const renderRating = (
    <Stack direction="row" alignItems="center" sx={{ color: 'text.disabled', typography: 'body2' }}>
      <Rating
        size="small"
        value={product?.reviews.avgRating}
        precision={0.1}
        readOnly
        sx={{ mr: 1 }}
      />
      {t('PRODUCTS.REVIEWS', { count: fShortenNumber(product?.reviews.count) })}
    </Stack>
  );

  const renderStatus = (
    <Label
      variant="soft"
      color={status === 'ACTIVE' ? 'success' : 'error'}
      sx={{ textTransform: 'capitalize' }}
    >
      {t(`common.${status}`)}
    </Label>
  );

  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        p: 0.5,
        px: 1,
        borderRadius: 1,
        typography: 'overline',
        bgcolor: (theme) =>
          (currentVariant?.stockStatus === 'OUT_OF_STOCK' && '#be123c') ||
          (currentVariant?.stockStatus === 'LOW_STOCK' && alpha(theme.palette.warning.main, 0.6)) ||
          'oklch(50.8% 0.118 165.612)',
        color: (theme) =>
          (currentVariant?.stockStatus === 'OUT_OF_STOCK' && 'white') ||
          (currentVariant?.stockStatus === 'LOW_STOCK' &&
            alpha(theme.palette.warning.contrastText, 1.2)) ||
          'white',
      }}
    >
      {t(`common.${currentVariant?.stockStatus}`)}
    </Box>
  );

  const renderGender = (
    <Box
      sx={{
        px: 1,
        borderRadius: 1,
        py: 0.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.75,
        bgcolor: (theme) =>
          (gender === 'MALE' && alpha(theme.palette.info.main, 0.16)) ||
          (gender === 'FEMALE' && alpha(theme.palette.error.main, 0.16)) ||
          alpha(theme.palette.warning.main, 0.16),
        color: (theme) =>
          (gender === 'MALE' && theme.palette.info.main) ||
          (gender === 'FEMALE' && theme.palette.error.main) ||
          (theme.palette.mode === 'light'
            ? theme.palette.warning.dark
            : theme.palette.warning.main),
      }}
    >
      <Iconify
        icon={
          (gender === 'MALE' && 'mdi:gender-male') ||
          (gender === 'FEMALE' && 'ph:gender-female-bold') ||
          'bi:gender-ambiguous'
        }
        width={16}
      />
      <Typography sx={{ fontSize: 12, textTransform: 'capitalize', fontWeight: 700 }}>
        {t(`common.${gender.toLowerCase()}`)}
      </Typography>
    </Box>
  );

  useEffect(() => {
    if (product) {
      setCurrentVariant(product?.variants?.[0] || null);
    }
  }, [product]);

  return (
    // <Form methods={methods} onSubmit={onSubmit}>
    <Stack spacing={3} sx={{ pt: 3 }} {...other}>
      <Stack spacing={2} alignItems="flex-start">
        {/* {renderLabels} */}

        <Stack direction="row" alignItems="center" spacing={1}>
          {renderInventoryType}
          {renderGender}
          {renderStatus}
        </Stack>

        <Typography variant="h5">{i18n.language === 'ar' ? nameAr : nameEn}</Typography>

        {renderRating}

        {renderPrice}

        {renderSubDescription}
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* {renderColorOptions} */}

      {renderSizeOptions}
      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderQuantity}

      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderBrand}

      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderCategory}

      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderDates}

      {/* {renderActions} */}

      {/* {renderShare} */}
    </Stack>
    // </Form>
  );
}
