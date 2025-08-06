// frontend/src/pages/StorePage.jsx
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

function StorePage() {
  const { merchantId } = useParams();
  const currentMerchantId = merchantId || 'store1';

  useEffect(() => {
    axios.get(`http://localhost:3001/api/shop/${currentMerchantId}`)
      .then(res => console.log('後端回應:', res.data))
      .catch(err => console.error('錯誤:', err));
  }, [currentMerchantId]);

  return (
    <div>
      <h1>目前店家：{currentMerchantId}</h1>
    </div>
  );
}

export default StorePage;