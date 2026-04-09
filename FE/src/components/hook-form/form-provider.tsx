import type { UseFormReturn } from 'react-hook-form';

import { FormProvider as RHFForm } from 'react-hook-form';

// ----------------------------------------------------------------------

export type FormProps = {
  onSubmit?: () => void;
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  formProps?: React.ComponentProps<'form'>;
};

export function Form({ children, onSubmit, methods, formProps }: FormProps) {
  return (
    <RHFForm {...methods}>
      <form {...formProps} onSubmit={onSubmit} noValidate autoComplete="off">
        {children}
      </form>
    </RHFForm>
  );
}
