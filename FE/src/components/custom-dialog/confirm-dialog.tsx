import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { alpha } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import type { ConfirmDialogProps } from './types';

// ----------------------------------------------------------------------

export function ConfirmDialog({
  open,
  title,
  action,
  content,
  icon,
  cancelLabel,
  onClose,
  ...other
}: ConfirmDialogProps) {
  const { t } = useTranslate();
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={onClose}
      {...other}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(4px)',
            backgroundColor: (theme) => alpha(theme.palette.grey[900], 0.2),
          },
        },
      }}
    >
      {icon && <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4, pb: 2 }}>{icon}</Box>}

      <DialogTitle sx={{ pb: 2, pt: icon ? 0 : undefined, textAlign: icon ? 'center' : 'left' }}>
        {title}
      </DialogTitle>

      {content && (
        <DialogContent
          sx={{
            typography: 'body2',
            height: 'fit-content',
            overflow: 'hidden',
            textAlign: icon ? 'center' : 'left',
          }}
        >
          {' '}
          {content}{' '}
        </DialogContent>
      )}

      <DialogActions>
        {action}

        <Button variant="outlined" color="inherit" onClick={onClose}>
          {cancelLabel || t('common.CANCEL')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
