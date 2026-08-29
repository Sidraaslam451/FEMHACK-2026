import { useContext } from 'react';
import { AuthContext } from './authContextInstance.js';

export const useAuth = () => useContext(AuthContext);