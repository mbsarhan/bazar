// src/frontend/components/dashboard/Favorites.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import AdCard from './AdCard'; // adjust path if different
import '../../styles/Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get('/favorites');
        // assuming your index endpoint returns: { data: [ { ...adFields } ] }
        const ads = res.data.data || res.data;
        setFavorites(ads);
      } catch (e) {
        console.error('Error loading favorites', e);
        setError('حدث خطأ أثناء تحميل المفضلة');
        if (e.response && e.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const adIdList = favorites.map(ad => ad.id);
  const returnPath = '/dashboard/favorites';

  if (isLoading) {
    return (
      <div className="favorites-container">
        <h2>المفضلة</h2>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-container">
        <h2>المفضلة</h2>
        <p className="favorites-error">{error}</p>
      </div>
    );
  }

  if (!favorites.length) {
    return (
      <div className="favorites-container">
        <h2>المفضلة</h2>
        <p className="favorites-empty">لا توجد إعلانات في قائمة المفضلة حالياً.</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h2>المفضلة</h2>
      <div className="favorites-grid">
        {favorites.map(ad => (
          <AdCard
            key={ad.id}
            ad={ad}
            isPublic={true}          // no edit/delete buttons in dashboard favorites
            adIdList={adIdList}
            returnPath={returnPath}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;