import axios from 'axios'

export default axios.create({
  baseURL: "https://api.covidlens.com",
  responseType: "json"
})
