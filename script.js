// Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyDMVKUrBJbOXLQClojlqQUxM3yz1Adx5Cg",
  authDomain: "my-note-app-1f593.firebaseapp.com",
  projectId: "my-note-app-1f593",
  storageBucket: "my-note-app-1f593.appspot.com",
  messagingSenderId: "582495299319",
  appId: "1:582495299319:web:a8e3a3ea177d95538ed5f2"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
console.log("Firebase initialized successfully.");

// Login
document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log("Attempting to log in...");

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            console.log("Login successful.");
            document.getElementById('authContainer').style.display = 'none';
            document.getElementById('notesContainer').style.display = 'block';
            loadNotes();
        })
        .catch((error) => {
            console.error("Login error:", error.message);
        });
});

// Add a new note
document.getElementById('addNoteBtn').addEventListener('click', () => {
    const noteInput = document.getElementById('noteInput');
    const noteTitle = document.getElementById('noteTitle');
    const note = noteInput.value;
    const title = noteTitle.value;
    const timestamp = new Date().toLocaleString();

    if (note && title) {
        const notesRef = database.ref('notes/' + auth.currentUser.uid);
        notesRef.push({ title, note, timestamp }).then(() => {
            console.log("Note added:", title, note, timestamp);
            noteInput.value = ''; // Clear the input field after adding
            noteTitle.value = ''; // Clear the title field after adding
        });
    } else {
        console.log("Cannot add an empty note or title.");
    }
});

// Load notes from the database
function loadNotes() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = ''; // Clear the current list

    const notesRef = database.ref('notes/' + auth.currentUser.uid);
    notesRef.on('child_added', (snapshot) => {
        const { title, note, timestamp } = snapshot.val();
        const li = document.createElement('li');
        li.innerHTML = `<strong>${title}</strong>: ${note} <br><small>${timestamp}</small>`;

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to delete this note?")) {
                notesRef.child(snapshot.key).remove() // Remove the note from the database
                    .then(() => {
                        console.log("Note deleted:", title);
                        li.remove(); // Remove the note from display
                    })
                    .catch((error) => {
                        console.error("Error deleting note:", error.message); // Log the error message
                    });
            }
        });

        li.appendChild(deleteBtn);
        notesList.appendChild(li);
        console.log("Note displayed:", title);
    });

    // Remove notes
    notesRef.on('child_removed', (snapshot) => {
        const note = snapshot.val();
        console.log("Note removed:", note);
    });
}
// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut().then(() => {
        console.log("Logged out successfully.");
        document.getElementById('authContainer').style.display = 'block';
        document.getElementById('notesContainer').style.display = 'none';
    }).catch((error) => {
        console.error("Logout error:", error.message);
    });
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut().then(() => {
        console.log("Logged out successfully.");
        document.getElementById('authContainer').style.display = 'block';
        document.getElementById('notesContainer').style.display = 'none';
    }).catch((error) => {
        console.error("Logout error:", error.message);
    });
});