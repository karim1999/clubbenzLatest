// // call api's from this file,, 

// import { Platform, StyleSheet } from 'react-native';
// import axios from 'axios';

// export const BASE_URL = 'http://localhost:3000';

// const client = axios.create({
//     baseURL: BASE_URL,
//     timeout: 1000
// });

// const unknowError = {
//     statusCode: -1,
//     error: 'Unknown Error',
//     message: 'Something went wrong, please try again later'
// }

// export default {

//     signup: function(name, email, password) {
//         return client({
//             method: 'post',
//             url: BASE_URL + '/users/customer',
//             data: {
//                 name: name,
//                 email: email,
//                 password: password
//             }
//         })
//         .then(function(response) {
//             return Promise.resolve(response.data);
//         })
//         .catch(function (error) {
//             if (error.response) {
//                 return Promise.reject(error.response.data);
//             } else {
//                 return Promise.reject(unknowError);
//             }
//         });
//     },
    

//     login: function (email, password, regId) {
//         return client({
//             method: 'post',
//             url: BASE_URL + '/users/login',
//             data: {
//                 email: email,
//                 password: password,
//                 os: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
//                 hardware: Platform.Version,
//                 regId: regId,
//                 notification: true
//             }
//         })
//         .then(function(response) {
//             return Promise.resolve(response.data);
//         })
//         .catch(function (error) {
//             if (error.response) {
//                 return Promise.reject(error.response.data);
//             } else {
//                 return Promise.reject(unknowError);
//             }
//         });
//     }
// }