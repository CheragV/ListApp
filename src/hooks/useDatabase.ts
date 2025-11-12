import { useEffect, useState } from 'react';
import { database } from '../database/db';

export const useDatabase = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        await database.init();
        setIsReady(true);
      } catch (err) {
        setError(err as Error);
      }
    };

    initDB();
  }, []);

  return { isReady, error };
};
