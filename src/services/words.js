import axios from 'axios'

const APIURL = 'http://localhost:4000/words'

const getALL = async () => {
    const response = await axios.get(APIURL)
    return response.data
}

export default { getALL }