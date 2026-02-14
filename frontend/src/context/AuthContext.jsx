import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Uygulama başladığında kullanıcı oturumunu kontrol et
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Refresh endpoint'i cookie'deki refresh token'ı kullanır
        // ve yeni bir access token + user bilgisi döner
        const response = await api.post('/auth/refresh');

        if (response.data.data && response.data.data.user) {
          setUser(response.data.data.user);
          if (response.data.data.accessToken) {
            api.setAuthToken(response.data.data.accessToken);
          }
        }

      } catch (error) {
        console.log("Not authenticated via refresh token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      // Backend cookie set ettiği için burada token saklamaya gerek yok
      // Ancak user bilgisini state'e kaydedelim
      // response.data yapısı backend'e göre değişebilir
      // Backend success fonksiyonunda datayı nasıl dönüyor kontrol ettik: { message, data: { user, accessToken } }

      // Backend login controller'a bakınca: success(res, { user: user, accessToken }, 200);
      // Yani response.data.data.user olacak.

      if (response.data.data && response.data.data.user) {
        setUser(response.data.data.user);
        if (response.data.data.accessToken) {
          api.setAuthToken(response.data.data.accessToken);
        }
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      await api.post('/auth/register', { username, email, password });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
