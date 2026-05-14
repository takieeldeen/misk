import type { TextFieldProps } from '@mui/material/TextField';

import { m, AnimatePresence } from 'framer-motion';
import { Controller, useFormContext } from 'react-hook-form';

import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------
type Props = TextFieldProps & {
  name: string;
  disabled?: boolean;
  maxLength?: number;
  showMaxLength?: boolean;
  hideError?: boolean;
};

export default function RHFTextField({
  name,
  helperText,
  type,
  disabled,
  maxLength,
  showMaxLength,
  hideError = false,
  sx,
  ...other
}: Props) {
  const { control } = useFormContext();
  const theme = useTheme();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          autoComplete={disabled ? 'new-password' : 'on'}
          disabled={disabled}
          {...field}
          fullWidth
          type={type}
          value={
            // eslint-disable-next-line no-nested-ternary
            // disabled ? '' : type === 'number' && field.value === 0 ? '' : field.value
            field.value
          }
          onKeyDown={(e) =>
            ['e', 'E', '+', 'ArrowUp', 'ArrowDown'].includes(e.key) &&
            type === 'number' &&
            e.preventDefault()
          }
          onChange={(event) => {
            const trimmedText = maxLength
              ? event?.target?.value?.substring(0, maxLength + 1)
              : event?.target?.value;
            if (disabled) return;
            field.onChange(trimmedText);
            // if (type === 'number') {
            //   field.onChange(Number(event.target.value));
            // } else {
            //   field.onChange(event.target.value);
            // }
          }}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          error={!hideError && !!error}
          helperText={
            <AnimatePresence mode="wait">
              {error && !hideError ? (
                <m.span
                  key="error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'inline-block' }}
                >
                  {error.message}
                </m.span>
              ) : (
                <m.span
                  key="helper"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'inline-block' }}
                >
                  {'\u00a0'}
                </m.span>
              )}
            </AnimatePresence>
          }
          FormHelperTextProps={{
            sx: {
              minHeight: '18px',
              display: 'flex',
              alignItems: 'center',
            },
          }}
          sx={{
            cursor: disabled ? 'default ' : 'text',

            input: {
              cursor: disabled ? 'default' : 'text',
              height: '48px',
              padding: '0 12px',
              '&::placeholder': {
                fontSize: '14px',
              },
            },
            textarea: {
              cursor: disabled ? 'default' : 'text',
              '&::placeholder': {
                fontSize: '14px',
              },
            },
            // '& .MuiInputBase-input': {
            //   height: '480px',
            // },

            '& .MuiInputBase-root': {
              cursor: disabled ? 'default' : 'text',
            },
            // '& .MuiInputBase-multiline': {
            //   bgcolor: disabled ? theme.palette.mahd.inputDisabledBackground : 'default', // Allow height to adjust for multiline
            // },
            // '& .MuiOutlinedInput-root': {
            //   color: disabled ? '#637381' : 'default',
            //   caretColor: disabled ? 'transparent' : 'default',
            //   '&:hover .MuiOutlinedInput-notchedOutline': {
            //     borderColor: disabled ? theme.palette.mahd.inputDisabledBackground : '#6CC0FF',
            //   },

            //   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            //     borderColor: disabled ? theme.palette.mahd.inputDisabledBackground : '#6CC0FF', // Change only if not disabled
            //   },
            //   '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            //     borderColor: disabled
            //       ? theme.palette.mahd.inputDisabledBackground
            //       : theme.palette.grey[400], // Keep the default border color when disabled
            //   },
            //   '& .MuiInputBase-input.Mui-disabled': {
            //     opacity: 1,
            //     backgroundColor: theme.palette.mahd.inputDisabledBackground, // Customize the text color for disabled input
            //   },
            //   '& .MuiInputBase-input:-webkit-autofill': {
            //     border: 'none',
            //     '-webkit-box-shadow': `0 0 0 1000px ${theme.palette.mahd.popupBackground} inset`, // Set the autofill background color to red
            //     '-webkit-text-fill-color': theme.palette.text.primary, // Keep the text color black
            //   },
            // },
            ...(sx ?? {}),
          }}
          {...other}
        />
      )}
    />
  );
}
