export default function WeatherPrepPage() {
  fetch(
    `api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=kr`,
  );
  return <div></div>;
}
