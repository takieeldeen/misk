import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { useTranslate } from 'src/locales';

import { Scrollbar } from 'src/components/scrollbar';
// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: {
    _id: string;
    nameAr: string;
    nameEn: string;
    imageUrl: string;
    stock: number;
  }[];
};

export function StockAlert({ title, subheader, list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar sx={{ minHeight: 384 }}>
        <Box
          sx={{
            p: 3,
            gap: 3,
            minWidth: 360,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {list.map((item) => (
            <Item key={item._id} item={item} />
          ))}
        </Box>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = BoxProps & {
  item: Props['list'][number];
};

function Item({ item, sx, ...other }: ItemProps) {
  const { t, i18n } = useTranslate();
  const theme = useTheme();
  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    >
      <Avatar
        variant="rounded"
        alt={i18n.language === 'ar' ? item.nameAr : item.nameEn}
        src={item.imageUrl}
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          backgroundColor: theme.palette.background.paper,
        }}
      />

      <Box
        sx={{ gap: 0.5, minWidth: 0, display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
      >
        <Link noWrap sx={{ color: 'text.primary', typography: 'subtitle2' }}>
          {i18n.language === 'ar' ? item.nameAr : item.nameEn}
        </Link>

        <Box sx={{ gap: 0.5, display: 'flex', typography: 'body2', color: 'text.secondary' }}>
          {!!item.stock && <Box component="span">{item.stock}</Box>}
        </Box>
      </Box>
      <Stack direction="row" alignItems="center" spacing={0.75}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor:
              item.stock === 0 ? 'error.main' : item.stock < 10 ? 'warning.main' : 'success.main',
          }}
        />
        <Box
          component="span"
          sx={{
            typography: 'caption',
            color: 'text.secondary',
            fontWeight: 'fontWeightMedium',
            whiteSpace: 'nowrap',
          }}
        >
          {item.stock === 0
            ? t('insights.stock_out')
            : item.stock < 10
              ? t('insights.stock_low')
              : t('insights.stock_in')}
        </Box>
      </Stack>
    </Box>
  );
}
