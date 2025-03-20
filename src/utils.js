const getApiResponseResult = async (city) => {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`
  );
  if (!response.ok) {
    console.error('data not found..');
  }
  const locationData = await response.json();

  const locationDataList = locationData.results?.map((value) => value);

  return locationDataList;
};

export { getApiResponseResult };
