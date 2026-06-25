import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyA2MfPcGUVhzAU2gcS36EGjFNVENAW_3Eg",
  authDomain: "plants-46aa2.firebaseapp.com",
  projectId: "plants-46aa2",
  storageBucket: "plants-46aa2.firebasestorage.app",
  messagingSenderId: "319523953630",
  appId: "1:319523953630:web:7830a249d4bd131f1d9b4f"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
