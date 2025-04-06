// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDFSjwthWRQv7fkf_xW5cWEGT-m7R4O49o",
    authDomain: "portfolio-stats-9a9bb.firebaseapp.com",
    projectId: "portfolio-stats-9a9bb",
    storageBucket: "portfolio-stats-9a9bb.firebaseapp.com",
    messagingSenderId: "984659360156",
    appId: "1:984659360156:web:e917f6dafd1996545bf059",
    measurementId: "G-7GNCC314QC"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Firestore
  const db = firebase.firestore();
  
  // Initialize Analytics
  const analytics = firebase.analytics();