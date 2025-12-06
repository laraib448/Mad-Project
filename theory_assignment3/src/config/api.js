import axios from 'axios';

const API_KEY = '915ae4b23amshd96aa879cd34683p10d744jsnc72c3cdc0913';
const API_HOST = 'calendarific.p.rapidapi.com';

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: 'https://calendarific.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': API_HOST,
  },
  timeout: 10000, // 10 second timeout
});

// Mock data for fallback
const mockHolidays = [
  {
    name: "New Year's Day",
    description: "Celebrates the beginning of the Gregorian calendar year.",
    date: { 
      iso: "2024-01-01", 
      datetime: { 
        year: 2024, 
        month: 1, 
        day: 1 
      } 
    }
  },
  {
    name: "Martin Luther King Jr. Day",
    description: "Honors Martin Luther King Jr., Civil Rights leader.",
    date: { 
      iso: "2024-01-15", 
      datetime: { 
        year: 2024, 
        month: 1, 
        day: 15 
      } 
    }
  },
  {
    name: "Valentine's Day",
    description: "Celebrated as a significant cultural, and commercial celebration of romance.",
    date: { 
      iso: "2024-02-14", 
      datetime: { 
        year: 2024, 
        month: 2, 
        day: 14 
      } 
    }
  },
  {
    name: "Independence Day",
    description: "Celebrates the adoption of the Declaration of Independence.",
    date: { 
      iso: "2024-07-04", 
      datetime: { 
        year: 2024, 
        month: 7, 
        day: 4 
      } 
    }
  },
  {
    name: "Christmas Day",
    description: "Celebrates the birth of Jesus Christ.",
    date: { 
      iso: "2024-12-25", 
      datetime: { 
        year: 2024, 
        month: 12, 
        day: 25 
      } 
    }
  }
];

export const getHolidays = async (country = 'US', year = 2024) => {
  console.log(`Fetching holidays for ${country} in ${year}`);
  
  try {
    const response = await api.get('/v1/holidays', {
      params: {
        country: country,
        year: year,
        type: 'national',
      },
    });
    
    console.log('API Response:', response.data);
    
    if (response.data && response.data.response && response.data.response.holidays) {
      return response.data.response.holidays;
    } else {
      console.warn('Unexpected API response format:', response.data);
      return mockHolidays;
    }
  } catch (error) {
    console.error('Error fetching holidays:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    
    // Return mock data for the requested year
    return mockHolidays.map(holiday => ({
      ...holiday,
      date: {
        ...holiday.date,
        iso: holiday.date.iso.replace('2024', year),
        datetime: {
          ...holiday.date.datetime,
          year: parseInt(year)
        }
      }
    }));
  }
};

export default api;