import axios from 'axios'

const ubuntu = axios.create({
  baseURL: 'http://192.168.159.169:3000/api/'
})

export default ubuntu
