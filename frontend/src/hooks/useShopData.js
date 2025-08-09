// src/hooks/useShopData.js
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { parseShopData } from '../utils/parseShopData';

export function useShopData(initialParams = {}) {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [empty, setEmpty] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const fetchShops = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { search, category, page, limit } = filters;
      const params = {
        ...(search && { search }),
        ...(category && { category }),
        page,
        limit,
      };

      const res = await axios.get('http://localhost:3001/api/home/shop/', { params });
      const shopList = parseShopData(res.data);

      setShops(shopList);
      setEmpty(shopList.length === 0);
    } catch (err) {
      setError(err);
      setShops([]);
      setEmpty(true);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  return {
    shops,
    loading,
    error,
    empty,
    filters,
    setFilters,
    refetch: fetchShops,
  };
}