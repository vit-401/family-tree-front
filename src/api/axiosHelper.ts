import axios from 'axios'

declare global {
    interface Window {
        env: {
            API_DOMAIN_ADDR: string
        }
    }
}
const target = window.env?.API_DOMAIN_ADDR || "https://family-trees-pp.herokuapp.com"

axios.interceptors.request.use(async (request) => {

    return request
})
axios.defaults.baseURL = target


export default axios
