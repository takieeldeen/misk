import type { CardProps } from '@mui/material/Card';
import type { TableHeadCustomProps } from 'src/components/table';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { useTranslate } from 'src/locales';

import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  headLabel: TableHeadCustomProps['headLabel'];
  // tableData: {
  //   id: string;
  //   name: string;
  //   rank: string;
  //   email: string;
  //   category: string;
  //   avatarUrl: string;
  //   countryCode: string;
  //   totalAmount: number;
  // }[];
  tableData: {
    _id: string;
    nameAr: string;
    nameEn: string;
    sold: number;
    imageUrl: string;
  }[];
};

export function TopSellingProducts({
  title,
  subheader,
  tableData = [],
  headLabel,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar sx={{ minHeight: 422 }}>
        <Table sx={{ minWidth: 640 }}>
          <TableHeadCustom headLabel={headLabel} />

          <TableBody>{tableData?.map((row) => <RowItem key={row._id} row={row} />)}</TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type RowItemProps = {
  row: Props['tableData'][number];
};

function RowItem({ row }: RowItemProps) {
  const { i18n } = useTranslate();
  const theme = useTheme();
  return (
    <TableRow>
      <TableCell>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar
            variant="rounded"
            alt={i18n.language === 'ar' ? row.nameAr : row.nameEn}
            src={row.imageUrl}
            sx={{
              width: 48,
              height: 48,
              flexShrink: 0,
              backgroundColor: theme.palette.background.paper,
            }}
          />
        </Box>
      </TableCell>

      <TableCell>{i18n.language === 'ar' ? row.nameAr : row.nameEn}</TableCell>
      <TableCell>{row.sold}</TableCell>
    </TableRow>
  );
}
