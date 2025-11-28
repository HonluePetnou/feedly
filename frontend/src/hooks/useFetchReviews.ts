import { useState, useEffect } from 'react';

export const useFetchReviews = (appId: string) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!appId) return;
    // Fetch reviews logic
    setLoading(false);
  }, [appId]);

  return { reviews, loading, error };
};
