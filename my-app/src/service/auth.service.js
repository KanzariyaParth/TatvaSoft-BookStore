import request from "./request"

const ENDPOINT = "api/user";


const login = async (data) => {
    const url =`${ENDPOINT}/login`;
    return request.post(url, data).then((res) => {
        return res;
    })
}

const create = async (data) => {
    const url = `${ENDPOINT}`;
    // console.log('auth ==> create');
    return request.post(url, data).then((res) => {
        // console.log('auth ==> create ==> then')
        return res;
    });
};

const authService = {
    login,
    create,
}

export default authService;