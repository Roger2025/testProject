//src/hooks/useMerchantAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { login as loginAction, logout as logoutAction, setError, setLoading } from '../features/merchant/auth/merchantAuthSlice';


export const useMerchantAuth = () => {
  const dispatch = useDispatch();
  const { merchant, isAuthenticated, loading, error } = useSelector((state) => state.merchantAuth);

  const login = async ({ email, password }) => {
    try {
      dispatch(setError("")); //清空錯誤訊息
      dispatch(setLoading(false));
      dispatch({ type: 'merchantAuth/loading' }); // 可加這段或用 extraReducers 控制
      // 模擬驗證或發 request
      if (email === 'test@merchant.com' && password === '123456') {
        dispatch(loginAction({ email })); // 寫入 Redux
      } else {
        // throw new Error('登入失敗，請確認帳密');
        dispatch(setError("帳號或密碼錯誤"));
      }
    } catch (err) {
      dispatch({ type: 'merchantAuth/error', payload: err.message });
      return { success: false, message: err.message };
    }
  };

  const logout = () => dispatch(logoutAction());

  return {
    merchant,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
  };
};

export default useMerchantAuth;