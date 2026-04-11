'use client';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import { Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { AnimateLogo2 } from 'src/components/animate';
import { Form, RHFTextField } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { signInWithPassword } from 'src/auth/context/jwt';

import { FormHead } from '../../components/form-head';

// ----------------------------------------------------------------------

export type SignInSchemaType = {
  email: string;
  password: string;
};

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const password = useBoolean();
  const { checkUserSession } = useAuthContext();
  const { t } = useTranslate('auth');

  const SignInSchema = useMemo(
    () =>
      zod.object({
        email: zod
          .string()
          .min(1, { message: t('email_required') })
          .email({ message: t('email_invalid') }),
        password: zod
          .string()
          .min(1, { message: t('password_required') })
          .min(6, { message: t('password_min_length') }),
      }),
    [t]
  );

  const defaultValues = { email: 'takie.eldeen1998@gmail.com', password: '12345678' };

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
      await signInWithPassword(data);
      checkUserSession?.();
      // router.push(paths.dashboard.root);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.message || error?.error?.message || 'Something went wrong';
      toast.error(t(errorMessage));
    }
  });

  const renderLogo = <AnimateLogo2 sx={{ mb: 3, mx: 'auto' }} />;

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Stack spacing={1}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {t('email_address')}
        </Typography>
        <RHFTextField name="email" placeholder={t('email_address')} />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {t('password')}
        </Typography>
        <RHFTextField
          name="password"
          placeholder={t('password')}
          type={password.value ? 'text' : 'password'}
          InputProps={{
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
          href={paths.auth.jwt.signIn}
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
      {renderLogo}

      <FormHead
        title={t('sign_in_title')}
        description={
          <>
            {`${t('dont_have_account')} `}
            <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
              {t('get_started')}
            </Link>
          </>
        }
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      {/* <FormDivider />

      <FormSocials
        signInWithGoogle={() => {}}
        singInWithGithub={() => {}}
        signInWithTwitter={() => {}}
      /> */}
    </>
  );
}
