'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLocalStorage } from '../../utils/localStorage';
import LoadingSpinner from '../common/LoadingSpinner';

const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        const token = getLocalStorage('token');
        if (!token) {
          router.push('/login');
        } else {
          setIsAuthenticated(true);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        setIsLoading(false);
      };

      checkAuth();
    }, [router]);

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth; 