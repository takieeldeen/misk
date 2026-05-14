import { m, AnimatePresence } from 'framer-motion';
import { Controller, useFormContext } from 'react-hook-form';

import { Editor } from '../editor';

import type { EditorProps } from '../editor';

// ----------------------------------------------------------------------

type Props = EditorProps & {
  name: string;
};

export function RHFEditor({ name, helperText, ...other }: Props) {
  const {
    control,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Editor
          {...field}
          error={!!error}
          helperText={
            <div style={{ minHeight: '18px', display: 'flex', alignItems: 'center' }}>
              <AnimatePresence mode="wait">
                {error ? (
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
                  <m.span key="helper" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {helperText || '\u00a0'}
                  </m.span>
                )}
              </AnimatePresence>
            </div>
          }
          resetValue={isSubmitSuccessful}
          {...other}
        />
      )}
    />
  );
}
