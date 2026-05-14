import React from 'react';

import { NotFoundView } from 'src/sections/error';

type ErrorGuardProps = {
  children: React.ReactNode;
  error: any;
};

function ErrorGuard({ children, error }: ErrorGuardProps) {
  const notFound = error?.error?.statusCode === 404;
  console.log(error?.error?.statusCode);
  if (notFound) return <NotFoundView />;
  return children;
}

export default ErrorGuard;
