import { createContext, useState, useEffect, useContext } from 'react';
import api, { setAuthToken } from '../utils/api';

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

        // Backend response format: success(res, { accessToken, user })
        // So response.data.data contains { accessToken, user }
        const data = response.data.data;
        console.log("CheckAuth response data:", data);

        if (data && data.user) {
          setUser(data.user);

          const accessToken = data.accessToken || response.data.accessToken;

          if (accessToken) {
            console.log("Setting access token from checkAuth");
            setAuthToken(accessToken);
          } else {
            console.log("No access token in checkAuth response");
          }
        }

      } catch (error) {
        console.log("Not authenticated via refresh token", error);
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

      // Backend response format: success(res, { accessToken, user })
      // So response.data.data contains { accessToken, user }
      const data = response.data.data;
      console.log("Login response data:", data);

      if (data && data.user) {
        setUser(data.user);

        // Check for accessToken in different possible locations just in case
        const accessToken = data.accessToken || response.data.accessToken || (data.user && data.user.accessToken);

        if (accessToken) {
          console.log("Setting access token from login");
          setAuthToken(accessToken);
        } else {
          console.error("CRITICAL: No access token found in login response!", data);
          // Fallback: Check if we have one in localStorage from a previous session
          // But actually we should probably fail here or warn
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
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      setAuthToken(null);
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
