import { useSignUp } from '@clerk/nextjs';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { APIResponseError, parseError } from '../../utils/errors';
import { Validations } from '../../utils/formValidations';
import { VerifyCodeNotice } from './VerifyCodeNotice';
import { Button } from './Button';
import { Input } from './Input';

export function SignUpCode({
  emailAddress,
  onDone,
}: {
  emailAddress: string;
  onDone: (sessionId: string) => void;
}) {
  const { isLoaded, signUp } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<{ code: string }>();

  if (!isLoaded) {
    return null;
  }

  const verifySignUpCode: SubmitHandler<{ code: string }> = async function ({
    code,
  }) {
    try {
      setIsLoading(true);
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        onDone(signUpAttempt.createdSessionId!);
      }
    } catch (err) {
      setError('code', {
        type: 'manual',
        message: parseError(err as APIResponseError),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendSignUpCode = async function () {
    await signUp.prepareEmailAddressVerification();
  };

  return (
    <form onSubmit={handleSubmit(verifySignUpCode)}>
      <VerifyCodeNotice
        onResendClick={resendSignUpCode}
        emailAddress={emailAddress}
      />
      <Input
        label="Code"
        {...register('code', Validations.oneTimeCode)}
        errorText={errors.code?.message}
        autoFocus
      />
      <div>
        <Button isLoading={isLoading}>Verify</Button>
      </div>
    </form>
  );
}
