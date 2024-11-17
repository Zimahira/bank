let email = document.getElementById("email")
let password= document.getElementById("password")
let arr=[]

const firebaseConfig = {
    apiKey: "AIzaSyBNzL6OAUJFhsvnW0aaqYlIOHwuB_IzaaY",
    authDomain: "zbankk-2ee84.firebaseapp.com",
    projectId: "zbankk-2ee84",
    storageBucket: "zbankk-2ee84.appspot.com",
    messagingSenderId: "995619523966",
    appId: "1:995619523966:web:985b329eb99f8d7dc4b72f"
};

const app =firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


function  submit(e) {
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
  .then((userCredential) => {
    // Signed in
    // var user = userCredential.user;
    alert("login successfull")
    window.location.href="dash.html"
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}