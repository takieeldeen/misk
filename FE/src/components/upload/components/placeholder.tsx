import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useTranslate } from 'src/locales';
import { UploadIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function UploadPlaceholder({ sx, ...other }: BoxProps) {
  const { t } = useTranslate();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      sx={sx}
      {...other}
    >
      <UploadIllustration hideBackground sx={{ width: 200 }} />

      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Box sx={{ typography: 'h6' }}>{t('upload.drop_or_select')}</Box>
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          {t('upload.drop_description')}
        </Box>
      </Stack>
    </Box>
  );
}
