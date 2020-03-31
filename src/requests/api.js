import axios from 'axios'

export default axios.create({
  baseURL: "http://ec2-3-83-145-142.compute-1.amazonaws.com",
  responseType: "json"
})
