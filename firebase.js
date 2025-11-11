<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBP8gsl0KZqIV1x7bo6sI3tXDvkKdWoXRQ",
    authDomain: "fx-habit-tracker.firebaseapp.com",
    projectId: "fx-habit-tracker",
    storageBucket: "fx-habit-tracker.firebasestorage.app",
    messagingSenderId: "98676989959",
    appId: "1:98676989959:web:344a6957933ab0dfaf0aa2",
    measurementId: "G-784KT79J8C"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);


// ✅ Sign Up with Email & Password
export async function signUpWithEmail(email, password) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created successfully!");
    window.location.href = "login.html"; // redirect after sign-up
  } catch (error) {
    alert(error.message);
  }
}

// ✅ Sign In with Email & Password
export async function loginWithEmail(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "index.html"; // redirect after login
  } catch (error) {
    alert(error.message);
  }
}

// ✅ Google Sign In
export async function loginWithGoogle() {
  try {
    await signInWithPopup(auth, provider);
    alert("Signed in successfully!");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Google Sign-In error:", error);
    alert("Failed to sign in with Google. Check console for details.");
  }
}

// ✅ Logout
export async function logout() {
  try {
    await signOut(auth);
    alert("Signed out successfully!");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// ✅ Save habit data to Firestore (example)
export async function saveHabitToCloud(habit) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please sign in first.");
    return;
  }
  const habitRef = doc(db, "users", user.uid, "habits", habit.id);
  await setDoc(habitRef, habit);
  alert("Habit saved to cloud!");
}

// ✅ Detect auth state changes
onAuthStateChanged(auth, (user) => {
  const nameEl = document.getElementById("user-name");
  if (user) {
    console.log("Logged in as:", user.displayName || user.email);
    if (nameEl) nameEl.textContent = user.displayName || user.email;
  } else {
    console.log("Not signed in");
    if (nameEl) nameEl.textContent = "Guest";
  }
});

console.log("✅ Firebase connected successfully!");
export { auth, db, provider };