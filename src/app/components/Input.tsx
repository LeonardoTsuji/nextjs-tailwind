import React from 'react';
import { ErrorMessage } from './ErrorMessage';

const Input = React.forwardRef<
  HTMLInputElement,
  {
    label: string;
    errorText?: string;
    onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
    autoFocus?: boolean;
    type?: string;
    badge?: React.ReactNode | string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(
  (
    {
      autoFocus = true,
      type = 'text',
      badge,
      label,
      errorText,
      onPaste,
      ...rest
    },
    ref,
  ) => {
    return (
      <>
        {label && (
          <label>
            <div>
              {label}
              <div>
                {badge && <div>{badge}</div>}
                <input
                  autoFocus={autoFocus}
                  onPaste={onPaste}
                  ref={ref}
                  type={type}
                  {...rest}
                />
              </div>
              {<ErrorMessage message={errorText || ''} />}
            </div>
          </label>
        )}
      </>
    );
  },
);

Input.displayName = 'Input';

export { Input };
