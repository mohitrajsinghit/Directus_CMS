import axios from 'axios';

// Use the exact URL of your Directus instance
const DIRECTUS_URL = 'http://localhost:8055';

// Create an axios instance for Directus
const directusAPI = axios.create({
  baseURL: DIRECTUS_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token if available
const token = localStorage.getItem('directus_token');
if (token) {
  directusAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const fetchMenuSections = async () => {
  try {
    const response = await directusAPI.get('/items/menu_sections');
    console.log('Menu sections response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching menu sections:', error);
    return [];
  }
};

export const fetchMenuItems = async (sectionId) => {
  try {
    const response = await directusAPI.get('/items/menu_items', {
      params: {
        filter: { section_id: { _eq: sectionId } }
      }
    });
    console.log('Menu items response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

export const login = async (email, password) => {
  try {
    const response = await directusAPI.post('/auth/login', {
      email,
      password
    });
    
    const token = response.data.data.access_token;
    localStorage.setItem('directus_token', token);
    directusAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('directus_token');
  delete directusAPI.defaults.headers.common['Authorization'];
};

export default directusAPI;
