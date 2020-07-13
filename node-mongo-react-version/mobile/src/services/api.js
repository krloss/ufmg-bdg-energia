import axios from 'axios'

const api = axios.create({
    baseURL:'http://10.5.3.115:4321'
})

export default api
