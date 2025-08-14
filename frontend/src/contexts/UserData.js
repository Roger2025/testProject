import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("✅ UserProvider useEffect 被執行了");
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/auth/me', {
          withCredentials: true
        });
        //console.log(" 抓到使用者：", res.data.user);  //測試用
        setUser(res.data.user);
      } catch (err) {
        console.error(" 抓取 user 錯誤：", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
