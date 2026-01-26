import axios from 'axios';

const APIURL = 'http://localhost:3000/api/words';

const getALL = async () => {
    const response = await axios.get(APIURL);
    return response.data;
};

const update = async (word) => {
    const response = await axios.put(`${APIURL}/${word.id}`, word);
    return response.data;
};

export default { getALL, update };
