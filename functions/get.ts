import { API_BASE_URL, isCaching } from '@/lib/config';

export async function getWebsite() {
  const res = await fetch(`${API_BASE_URL}/website`, {
    cache: isCaching ? 'default' : 'no-cache'
  });
  if (res.ok) {
    const json = await res.json();
    return json;
  }
}
export async function getHotels() {
  const res = await fetch(`${API_BASE_URL}/hotels`, {
    cache: isCaching ? 'default' : 'no-cache'
  });
  if (res.ok) {
    const json = await res.json();
    return json;
  }
}

export async function getRooms() {
  const res = await fetch(`${API_BASE_URL}/rooms`, {
    cache: isCaching ? 'default' : 'no-cache'
  });
  if (res.ok) {
    const json = await res.json();
    return json;
  }
}

export async function getRoomsWithHotelId(id: string) {
  const res = await fetch(`${API_BASE_URL}/hotels/name/${id}/rooms`, {
    cache: isCaching ? 'default' : 'no-cache'
  });
  if (res.ok) {
    const json = await res.json();
    return json;
  }
}

export async function getHotelWithId(id: string) {
  const res = await fetch(`${API_BASE_URL}/hotels/id/${id}`, {
    cache: isCaching ? 'default' : 'no-cache'
  });
  if (res.ok) {
    const json = await res.json();
    return json;
  }
}

export async function getHotelsWithName(name: string) {
  const res = await fetch(`${API_BASE_URL}/hotels/name/${name}`, {
    cache: isCaching ? 'default' : 'no-cache'
  });
  if (res.ok) {
    const json = await res.json();
    return json;
  }
}

export async function getRoomById(id: string) {
  const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
    cache: isCaching ? 'default' : 'no-cache'
  });
  if (res.ok) {
    const json = await res.json();
    return json;
  }
}

export async function getRoomTypes() {
  const res = await fetch(`${API_BASE_URL}/rooms/type`, {
    cache: isCaching ? 'default' : 'no-cache'
  });
  if (res.ok) {
    const json = await res.json();
    return json;
  }
}

export async function getWeather(lat: number, lon: number) {
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${lat},${lon}`;
  try {
    const response = await fetch(url, {
      method: 'GET'
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
}
