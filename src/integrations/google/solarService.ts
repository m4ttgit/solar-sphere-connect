import axios from 'axios';

const SOLAR_API_BASE_URL = 'https://solar.googleapis.com/v1/buildingInsights:findClosest';
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Will be set in .env

export interface SolarData {
  center: {
    latitude: number;
    longitude: number;
  };
  imageryDate: {
    year: number;
    month: number;
    day: number;
  };
  imageryProcessedDate: {
    year: number;
    month: number;
    day: number;
  };
  solarPotential: {
    maxArrayPanelsCount: number;
    panelCapacityWatts: number;
    panelHeightMeters: number;
    panelWidthMeters: number;
    panelLifetimeYears: number;
    expectedLifetimeProduction: number;
    roofSegmentStats: {
      azimuthDegrees: number;
      panelsCount: number;
      yearlyEnergyDcKwh: number;
      segmentCenter: {
        latitude: number;
        longitude: number;
      };
    }[];
  };
}

export const getSolarData = async (lat: number, lng: number): Promise<SolarData> => {
  try {
    const response = await axios.get(SOLAR_API_BASE_URL, {
      params: {
        location: {
          latitude: lat,
          longitude: lng
        },
        requiredQuality: 'HIGH',
        key: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching solar data:', error);
    throw error;
  }
};
