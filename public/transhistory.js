const firebaseConfig = {
    apiKey: "AIzaSyBNzL6OAUJFhsvnW0aaqYlIOHwuB_IzaaY",
    authDomain: "zbankk-2ee84.firebaseapp.com",
    projectId: "zbankk-2ee84",
    storageBucket: "zbankk-2ee84.appspot.com",
    messagingSenderId: "995619523966",
    appId: "1:995619523966:web:985b329eb99f8d7dc4b72f"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

function displayTransferHistory() {
    const historyContainer = document.getElementById("history");
    const user = auth.currentUser;

    if (user) {
        db.collection(user.email).get()
            .then((querySnapshot) => {
                let historyHTML = "";
                querySnapshot.forEach((doc) => {
                    historyHTML += `
                        <div class="eachHistory">
                            <div class="image">
                                <img src="./images/airtel.png" alt="Logo" style="width: 20%;">
                            </div>
                            <div class="userInfo">${doc.data().title}</div>
                            <div class="debitCredit">${doc.data().type}</div>
                            <div class="debitCredit">${doc.data().amount}</div>
                        </div>
                    `;
                });
                historyContainer.innerHTML = historyHTML;
            })
            .catch((error) => {
                console.error("Error fetching transfer history:", error);
            });
    } else {
        console.error("No user is currently signed in.");
        // Handle this case accordingly
    }
}

document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            displayTransferHistory();
        } else {
            console.error("No user is currently signed in.");
            // Handle this case accordingly
        }
    });
});


changebal= document.getElementById('changebal')

let currentBalance;
let accountNumber;

auth.onAuthStateChanged((user) => {
    if (user) {
        const userDocRef = db.collection("users").doc(user.email);

        userDocRef.get().then(doc => {
            if (doc.exists) {
                 currentBalance = parseFloat(doc.data().accountBalance);
                 accountNumber = doc.data().Accountnumber;
              changebal.innerText= ` Account Number: ${accountNumber} `

            
              userDocRef.onSnapshot(snapshot => {
                const updatedBalance = snapshot.data().accountBalance;
                currentBalance.innerText = updatedBalance;
            });
              
                
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
});

   

let isAccountNumberDisplayed = true; 

function switchh() {
    console.log("hygtfr");
    if (isAccountNumberDisplayed) {
        changebal.innerText = ` Balance: $${currentBalance}`;
       
    } else {
        changebal.innerText = ` Account Number: ${accountNumber}`;
    }
    isAccountNumberDisplayed = !isAccountNumberDisplayed;
}

