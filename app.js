// Firebase Configuration
const firebaseConfig = {
     apiKey: "AIzaSyDMVKUrBJbOXLQClojlqQUxM3yz1Adx5Cg",
  authDomain: "my-note-app-1f593.firebaseapp.com",
  projectId: "my-note-app-1f593",
  storageBucket: "my-note-app-1f593.firebasestorage.app",
  messagingSenderId: "582495299319",
  appId: "1:582495299319:web:a8e3a3ea177d95538ed5f2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert("Login successful");
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("notes-section").style.display = "block";
            loadNotes(); // Load notes after successful login
        })
        .catch(error => alert(error.message));
}

function logout() {
    auth.signOut().then(() => {
        alert("Logged out");
        document.getElementById("auth-section").style.display = "block";
        document.getElementById("notes-section").style.display = "none";
    });
}

function addNote() {
    const noteContent = document.getElementById('noteContent').value;
    if (noteContent.trim() === "") {
        alert("Please enter some content for the note.");
        return;
    }
    const userId = auth.currentUser.uid;
    db.collection("notes").add({
        userId: userId,
        content: noteContent,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("Note added");
        document.getElementById('noteContent').value = ""; // Clear the textarea
        loadNotes(); // Load notes immediately after adding a new note
    }).catch(error => alert(error.message));
}

function loadNotes() {
    const userId = auth.currentUser.uid;
    db.collection("notes").where("userId", "==", userId).orderBy("timestamp", "desc")
        .get()
        .then(querySnapshot => {
            const notesList = document.getElementById("notes-list");
            notesList.innerHTML = ""; // Clear current notes display
            if (querySnapshot.empty) {
                console.log("No notes found for this user.");
                notesList.innerHTML = "<p>No notes available.</p>";
            } else {
                querySnapshot.forEach(doc => {
                    const note = doc.data();
                    const noteElement = document.createElement("div");
                    noteElement.classList.add("note-box");
                    noteElement.innerHTML = `
                        <p>${note.content}</p>
                        <button onclick="deleteNote('${doc.id}')">Delete</button>
                    `;
                    notesList.appendChild(noteElement);
                });
                console.log("Notes loaded successfully.");
            }
        })
        .catch(error => {
            console.error("Error loading notes: ", error);
            alert("Error loading notes. Please check console.");
        });
}

function deleteNote(noteId) {
    db.collection("notes").doc(noteId).delete()
        .then(() => {
            alert("Note deleted");
            loadNotes(); // Reload notes after deletion
        })
        .catch(error => alert(error.message));
}