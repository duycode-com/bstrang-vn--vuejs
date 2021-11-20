import { initializeApp } from 'firebase/app'

const firebaseConfig = {
    apiKey: 'AIzaSyA0Bp0iHNdtSLNe-Jnr9pXIohl_MuvoMfs',
    authDomain: 'bstrang-vn.firebaseapp.com',
    projectId: 'bstrang-vn',
    storageBucket: 'bstrang-vn.appspot.com',
    messagingSenderId: '195870625919',
    appId: '1:195870625919:web:e76a190a0c1f03639d6f4a',
    measurementId: 'G-7JZXHCLFCR',
}
const firebaseInit = initializeApp(firebaseConfig)

export default firebaseInit
