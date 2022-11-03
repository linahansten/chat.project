// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getDatabase, ref, onChildAdded, set } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCiY8ZCWjTIG47-zVZ_JTWGA0aUXIzDc0",
    authDomain: "chat-prog22.firebaseapp.com",
    databaseURL: "https://chat-prog22-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "chat-prog22",
    storageBucket: "chat-prog22.appspot.com",
    messagingSenderId: "958896767796",
    appId: "1:958896767796:web:ad658e048f1a87f9591b61"
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
//==========================================================

//Set variable with Bootstrap modal
const loginModal = new bootstrap.Modal('#login-modal')
loginModal.show()

// Listen for click on login button
document.querySelector("#login-button").addEventListener("click", function () {
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value
    const auth = getAuth();

    // Sign in with Firebase
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user)

            // Hide modal
            loginModal.hide()

            // Call function to init database
            initDatabase()
        })
        .catch((error) => {
            console.log(error)
        });

})

//DataBase
//======================================================

// initializes Realtime Database and get a reference service
function initDatabase() {
    const db = getDatabase(app);

    // create reference, where in the database we want to take info from
    const chatRef = ref(db, '/chat');

    // listens for database changes
    onChildAdded(chatRef, function (data) {
        // create element and append to list element
        const list = document.querySelector("ul")
        const message = document.createElement("li")

        message.innerText = new Date(data.key).toLocaleString("fi-FI") + ": " + data.val(); // copy message from input

        list.appendChild(message)
    })
}

// New message 
const input = document.querySelector("input");

input.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {

        // create 'unique' id for message   
        const messageId = new Date().toUTCString()  // 27/10 9.52 message

        // send to database
        set(ref(db, "chat/" + messageId), input.value)

        // clear input
        input.value = "";
    }
})