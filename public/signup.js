let firstname = document.getElementById("Firstname");
let lastname = document.getElementById("lastname");
let email = document.getElementById("Email");
let password = document.getElementById("password");
let cpass = document.getElementById("cpass");
let phonenumber = document.getElementById("phonenumber");
let checkbox_ = document.getElementById("checkbox_");
let pin = document.getElementById("pin");
let AccountNumber;
let accountBalance = 0;

accountBalance = 5000;

function generateAccount() {
    AccountNumber = Math.floor(Math.random() * 10000000000) + 1;
    return AccountNumber;
}

function showhide() {
    password.type === "password" ? password.type = 'text' : password.type = "password";
}

const firebaseConfig = {
    apiKey: "AIzaSyBNzL6OAUJFhsvnW0aaqYlIOHwuB_IzaaY",
    authDomain: "zbankk-2ee84.firebaseapp.com",
    projectId: "zbankk-2ee84",
    storageBucket: "zbankk-2ee84.appspot.com",
    messagingSenderId: "995619523966",
    appId: "1:995619523966:web:985b329eb99f8d7dc4b72f"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function submit(e) {
    e.preventDefault();

    // Validate the PIN
    const pinValue = pin.value.trim();
    if (pinValue.length !== 4 || !/^\d+$/.test(pinValue)) {
        alert("PIN must be exactly 4 digits and contain only numbers.");
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            const user = firebase.auth().currentUser;

            user.updateProfile({
                displayName: firstname.value + ' ' + lastname.value,
            }).then(() => {
                console.log(user);
                const db = firebase.firestore();
                
                db.collection("users").doc(user.email).set({
                    Name: firstname.value + ' ' + lastname.value,
                    Email: email.value,
                    Password: password.value,
                    Accountnumber: generateAccount(),
                    accountBalance: accountBalance,
                    Pin: pinValue
                })
                .then(() => {
                    console.log("Document successfully written!");
                    window.location.href = './log.html';
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            }).catch((error) => {
                console.error("Error updating profile: ", error);
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`Error [${errorCode}]: ${errorMessage}`);
        });
}
