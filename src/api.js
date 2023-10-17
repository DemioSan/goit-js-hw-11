import axios from 'axios';

const API_KEY = '40069190-73f08e8403c307c87b63f7284';

export async function fetchImages(query, pageNum) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: pageNum,
        per_page: 40,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}
