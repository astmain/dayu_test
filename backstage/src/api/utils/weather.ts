import request from '@/axios'

export interface WeatherParams {
  city: string | number
  key: string
  extensions: string
  output: string
}
export interface WeatherResponse {
  forecasts: {
    casts: {
      daytemp: string
      dayweather: string
      nighttemp: string
      daywind: string
      daypower: string
    }[]
  }[]
}

export const getWeatherApi = (params: Partial<WeatherParams>) => {
  const key = 'ec501cff6661bfc6baeeeafeb5f42573'
  const extensions = 'all'
  const output = 'JSON'
  return request.get<WeatherResponse>({
    url: 'weather/v3/weather/weatherInfo',
    params: {
      key,
      extensions,
      output,
      ...params
    }
  })
}

export const getLocationApi = () => {
  return request.get({
    url: 'weather/v3/ip',
    params: {
      key: 'ec501cff6661bfc6baeeeafeb5f42573'
    }
  })
}
