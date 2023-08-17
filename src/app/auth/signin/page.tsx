'use client';
import { signIn } from 'next-auth/react';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  email: string;
  password: string;
};

export default function SignIn() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) =>
    await signIn('credentials', {
      email: data.email,
      password: data.password,
    });

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <h1>Login</h1>
          <input
            type="email"
            placeholder="email@email.com"
            {...register('email')}
          />
          <input
            type="password"
            placeholder="******"
            {...register('password')}
          />
          <input type="submit" />
        </form>
      </div>
    </>
  );
}
