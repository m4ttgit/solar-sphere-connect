import axios from 'axios';

const GEOCODING_API_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

export const geocodeAddress = async (address: string): Promise<GeocodingResult> => {
  try {
    const response = await axios.get(GEOCODING_API_BASE_URL, {
      params: {
        address: address,
        key: API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Geocoding failed: ${response.data.status}`);
    }

    const result = response.data.results[0];
    const location = result.geometry.location;

    return {
      lat: location.lat,
      lng: location.lng,
      formattedAddress: result.formatted_address
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
};