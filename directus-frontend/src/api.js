import axios from 'axios';

const API_URL = 'http://localhost:8055/items';
// const API_URL = '/api/items';

export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};
