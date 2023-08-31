'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

function MyApp() {
  const { getToken } = useAuth();

  const init = async () => {
    const token = await getToken({ template: 'jwt' });
    console.log(token);
  };

  useEffect(() => {
    init();
  }, []);

  return <></>;
}

export default MyApp;
