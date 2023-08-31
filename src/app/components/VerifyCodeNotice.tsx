import React from 'react';
import { Button } from './Button';

export function VerifyCodeNotice({
  emailAddress,
  onResendClick,
}: {
  emailAddress: string;
  onResendClick: () => void;
}): JSX.Element {
  const [resendCodeDisabled, setResendCodeDisabled] = React.useState(false);

  const handleResendClick = async function () {
    try {
      setResendCodeDisabled(true);
      await onResendClick();
    } finally {
      setResendCodeDisabled(false);
    }
  };

  return (
    <div>
      Enter the 6-digit code sent to <br />
      <span>{emailAddress}</span>
      <Button
        type="button"
        disabled={resendCodeDisabled}
        onClick={handleResendClick}
      >
        Resend code
      </Button>
    </div>
  );
}
