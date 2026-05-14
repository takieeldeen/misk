'use client';

import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { SimpleLayout } from 'src/layouts/simple';
import { PageNotFoundIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';
// ----------------------------------------------------------------------

export function NotFoundView({ title, description }: { title?: string; description?: string }) {
  const { t } = useTranslate();
  return (
    <SimpleLayout content={{ compact: true }}>
      <Container component={MotionContainer}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2, fontFamily: 'inherit' }}>
            {title || t('common.PAGE_NOT_FOUND_TITLE')}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary', fontFamily: 'inherit' }}>
            {description || t('common.PAGE_NOT_FOUND_DESC')}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={RouterLink} href="/" size="large" variant="contained">
          {t('common.BACK_TO_HOME')}
        </Button>
      </Container>
    </SimpleLayout>
  );
}
