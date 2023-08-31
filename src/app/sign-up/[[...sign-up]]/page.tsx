'use client';

import React from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { APIResponseError, parseError } from '@/utils/errors';
import { ErrorMessage } from '@/app/components/ErrorMessage';
import { Button } from '@/app/components/Button';
import { Input } from '@/app/components/Input';
import { Validations } from '@/utils/formValidations';
import { SignUpCode } from '@/app/components/SignUpCode';
import { useRouter } from 'next/navigation';

interface SignUpInputs {
  name: string;
  username: string;
  company: string;
  emailAddress: string;
  cpf: string;
  phone: string;
  password: string;
  clerkError?: string;
}

enum SignUpFormSteps {
  FORM,
  CODE,
}

export default function SignUpForm() {
  const router = useRouter();
  const { isLoaded, setActive, signUp } = useSignUp();
  const [isLoading, setIsLoading] = React.useState(false);

  const [formStep, setFormStep] = React.useState(SignUpFormSteps.FORM);
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
    watch,
    clearErrors,
  } = useForm<SignUpInputs>();

  if (!isLoaded) {
    return null;
  }

  const onSubmit: SubmitHandler<SignUpInputs> = async ({
    emailAddress,
    password,
    name,
    phone,
    cpf,
    company,
    username,
  }) => {
    try {
      setIsLoading(true);
      const [firstName, lastName] = name.split(/\s+/);
      const signUpAttempt = await signUp.create({
        emailAddress,
        password,
        lastName,
        firstName,
        username,
        unsafeMetadata: {
          cpf,
          company,
          phone,
        },
      });
      await signUpAttempt.prepareEmailAddressVerification();
      setFormStep(SignUpFormSteps.CODE);
    } catch (err) {
      setError('clerkError', {
        type: 'manual',
        message: parseError(err as APIResponseError),
      });
    } finally {
      setIsLoading(false);
    }
  };

  /** Clerk API related errors on change. */
  watch(() => errors.clerkError && clearErrors('clerkError'));

  const signUpComplete = async (createdSessionId: string) => {
    /** Couldn't the signup be updated and have the createdSessionId ? */
    await setActive({
      session: createdSessionId,
      beforeEmit: () => router.push('/'),
    });
  };

  return (
    <div>
      <h1>Sign up</h1>
      {formStep === SignUpFormSteps.FORM && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <Input
              {...register('name', Validations.name)}
              label="Nome completo"
              errorText={errors.name?.message}
            />
            <Input
              {...register('username', Validations.username)}
              label="Username"
              errorText={errors.username?.message}
            />
            <Input
              label="Email"
              type="email"
              {...register('emailAddress', Validations.emailAddress)}
              errorText={errors.emailAddress?.message}
            />
            <Input
              label="CPF"
              {...register('cpf', Validations.cpf)}
              errorText={errors.cpf?.message}
            />
            <Input
              {...register('password', Validations.password)}
              label="Criar senha"
              type="password"
              errorText={errors.password?.message}
            />
          </div>
          {errors.clerkError?.message && (
            <div>
              <ErrorMessage message={errors.clerkError.message} />
            </div>
          )}
          <div>
            <Button isLoading={isLoading}>Create account</Button>
          </div>
        </form>
      )}
      {formStep === SignUpFormSteps.CODE && (
        <SignUpCode
          emailAddress={getValues('emailAddress')}
          onDone={signUpComplete}
        />
      )}
    </div>
  );
}
