'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import { Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Form, RHFTextField } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { signInWithPassword } from '../../context/jwt';

// ----------------------------------------------------------------------

export type SignInSchemaType = {
  email: string;
  password: string;
};

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();

  const { t } = useTranslate('auth');

  const { checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const defaultValues = {
    email: 'demo@minimals.cc',
    password: '@demo1',
  };

  const SignInSchema = zod.object({
    email: zod
      .string()
      .min(1, { message: t('email_required') })
      .email({ message: t('email_invalid') }),
    password: zod
      .string()
      .min(1, { message: t('password_required') })
      .min(6, { message: t('password_min_length') }),
  });

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Stack spacing={1}>
        <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{t('email_address')}</Typography>
        <RHFTextField name="email" />
      </Stack>
      <Stack spacing={1}>
        <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{t('password')}</Typography>
        <RHFTextField
          name="password"
          InputProps={{
            type: password.value ? 'text' : 'password',
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Link
          component={RouterLink}
          href="#"
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          {t('forgot_password')}
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={t('signing_in')}
      >
        {t('sign_in')}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title={t('sign_in_title')}
        description={
          <>
            {`${t('dont_have_account')} `}
            <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
              {t('get_started')}
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {/* {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>} */}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
