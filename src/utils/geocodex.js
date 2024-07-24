export const getCityCoordinates = async (cityName) => {
  console.log(`Fetching coordinates for: ${cityName}`);
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
        cityName
      )}&country=France&format=json`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response Data:", data);

    if (data.length > 0) {
      const { lat, lon } = data[0];
      return { lat, lon };
    } else {
      throw new Error("City not found");
    }
  } catch (error) {
    console.error(`Erreur pour ${cityName}: ${error.message}`);
    throw error;
  }
};
