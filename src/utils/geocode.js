// utils/geocode.js
import axios from 'axios';

export const getCityCoordinates = async (cityName) => {
  try {
    const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(cityName)}&limit=1`);
    const data = response.data;

    // Assurez-vous que la réponse contient des résultats
    if (data.features && data.features.length > 0) {
      const { coordinates } = data.features[0].geometry;
      const [lon, lat] = coordinates;
      return { lat, lon };
    } else {
      throw new Error('City not found');
    }
  } catch (error) {
    console.error('Error fetching city coordinates:', error);
    throw error;
  }
};
