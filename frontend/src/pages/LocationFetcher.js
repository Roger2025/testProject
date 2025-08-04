import React, { useEffect, useState } from "react";

const LocationFetcher = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("瀏覽器不支援定位功能");
    }
  }, []);

  return (
    <div>
      <h2>📍 使用者目前位置</h2>
      {location ? (
        <p>緯度：{location.latitude}, 經度：{location.longitude}</p>
      ) : error ? (
        <p>錯誤：{error}</p>
      ) : (
        <p>正在取得位置...</p>
      )}
    </div>
  );
};

export default LocationFetcher;