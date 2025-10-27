import { API_PATHS } from '@/utils/apiPaths';
import axiosInstance from '@/utils/axiosInstance';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() =>{
    if(user) return;
    const accessToken = localStorage.getItem('token');
    if(!accessToken){
        setLoading(false);
        return;
    }
    const fetchUser = async () => {
        try {
            const response  = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
            setUser(response.data);
        } catch (error) {
            console.log('User not authenticated :', error);
            clearUser();
            // Redirect to SignUp if token is invalid or user not found
            if ([401, 404].includes(error?.response?.status)) {
              navigate("/signin");
            }
        }finally{
            setLoading(false);
        }
    }
    fetchUser();
    console.log('Token being sent');
  },[navigate]);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    setLoading(false);
  };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('token');
        navigate('/signin');
    };

    return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
        {!loading && children}
    </UserContext.Provider>
  );
}

export default UserProvider;