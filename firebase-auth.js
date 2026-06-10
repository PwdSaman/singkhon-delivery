import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDUKaOWbMEyTyeNgX42mmQcNxOobV5aWzM",
    authDomain: "singkhon-delivery-11ab6.firebaseapp.com",
    projectId: "singkhon-delivery-11ab6",
    storageBucket: "singkhon-delivery-11ab6.firebasestorage.app",
    messagingSenderId: "1079364672626",
    appId: "1:1079364672626:web:146a27008433e5ad67f6eb"
};

const app = initializeApp(firebaseConfig);

window.auth = getAuth(app);
window.GoogleAuthProvider = GoogleAuthProvider;
window.signInWithPopup = signInWithPopup;
window.signOut = signOut;
window.onAuthStateChanged = onAuthStateChanged;
