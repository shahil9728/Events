import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: 'your-api-key',
    authDomain: 'your-auth-domain',
    projectId: 'your-project-id',
    storageBucket: 'your-storage-bucket',
    messagingSenderId: 'your-sender-id',
    appId: 'your-app-id',
    measurementId: 'your-measurement-id',
};

// Initialize Firebase
if (!firebase.getApps().length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.getApps(); // if already initialized
}

export default firebase;
