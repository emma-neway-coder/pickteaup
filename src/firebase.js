import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// pickteaup-emma 프로젝트의 Firebase 콘솔 config (2026-07-18 등록 화면 기준)
const firebaseConfig = {
  apiKey: 'AIzaSyDo_Ipdu1ZsWA_-Jq0L_ceGOYuaVQzZ8y0',
  authDomain: 'pickteaup-emma.firebaseapp.com',
  projectId: 'pickteaup-emma',
  storageBucket: 'pickteaup-emma.firebasestorage.app',
  messagingSenderId: '141656156596',
  appId: '1:141656156596:web:675535605a49dbcf21eae1',
  measurementId: 'G-5HJRHN46Y8',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// config가 채워졌는지 감지 (개발 중 안내 배너용)
export const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)
