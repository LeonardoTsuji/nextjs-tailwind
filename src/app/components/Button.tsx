import React from 'react';
import { Spinner } from './Spinner';

const Button = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    isLoading?: boolean;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, isLoading = false, ...rest }, ref) => {
  return (
    <button type="submit" {...rest} ref={ref} disabled={isLoading}>
      {isLoading ? <Spinner /> : children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
