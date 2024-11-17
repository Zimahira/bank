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

let  Recipientaccountno = document.getElementById('Recipientaccountno');
let amount = document.getElementById( 'amount' );
let Recipientname = document.getElementById("Recipientname");
let userarray = []
let  finduser=[]
Recipientname.innerText = ""
let uuser
function getdata() {
    db.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
    userarray.push(doc.data())
             
        });
    });
}

getdata()

function findname() {
    for (let i = 0; i < userarray.length; i++) 
        if (Recipientaccountno.value == userarray[i].Accountnumber)
        Recipientname.innerText = userarray[i].Name; 
           
            return; 
        
    alert("Recipient's account number not found");
}

function transfer() {
    // Check if recipient's account number exists in the database
    let recipientFound = false;
    let recipientDocRef = null;
    for (let i = 0; i < userarray.length; i++) {
        if (Recipientaccountno.value == userarray[i].Accountnumber) {
            recipientFound = true;
            recipientDocRef = db.collection("users").doc(userarray[i].Email); // Assuming the email is stored in the 'Email' field
            break; // Exit loop once a match is found
        }
    }

    if (!recipientFound) {
        alert("Recipient's account number not found");
        return;
    }

    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
        console.log("User is not signed in.");
        return;
    }

    const currentUserDocRef = db.collection("users").doc(currentUser.email);
    currentUserDocRef.get().then(currentUserDoc => {
        if (currentUserDoc.exists) {
            const currentBalance = parseFloat(currentUserDoc.data().accountBalance);
            const transferAmount = parseFloat(amount.value);

            if (transferAmount <= 0 || transferAmount > currentBalance) {
                alert("Invalid transfer amount or insufficient balance");
            } else {
                const updatedBalanceSender = currentBalance - transferAmount;

                currentUserDocRef.update({ accountBalance: updatedBalanceSender })
                    .then(() => {
                        console.log(`Sender's balance updated. New balance: ${updatedBalanceSender}`);
                        recipientDocRef.get().then(recipientDoc => {
                            if (recipientDoc.exists) {
                                const recipientCurrentBalance = parseFloat(recipientDoc.data().accountBalance);
                                const updatedBalanceRecipient = recipientCurrentBalance + transferAmount;

                                recipientDocRef.update({ accountBalance: updatedBalanceRecipient })
                                    .then(() => {
                                        alert(`Amount ${transferAmount} has been transferred to ${Recipientname.innerText}.`);
                                    //    GetBeneficiary()
                                       saveUserTransfer()
                                       saveRecieverTransfer()
                                    })
                                    .catch(error => {
                                        console.error("Error updating recipient's account balance:", error);
                                    });
                            } else {
                                console.log("Recipient's document does not exist!");
                            }
                        }).catch(error => {
                            console.error("Error retrieving recipient's account balance:", error);
                        });
                    })
                    .catch(error => {
                        console.error("Error updating sender's account balance:", error);
                    });
            }
        } else {
            console.log("Current user's document does not exist!");
        }
    }).catch(error => {
        console.error("Error retrieving current user's account balance:", error);
    });
}

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

    
 function saveUserTransfer(){
    BenAccNumberValue= Number(Recipientaccountno.value)
    db.collection("users").where("Accountnumber", "==", BenAccNumberValue)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            myBen= doc.data()
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    }).then(()=>{
        const user =firebase.auth( ).currentUser;
        db.collection(user.email).add({
            type: "Debit",
            date: "Monday",
            amount: parseFloat(amount.value),
            title: myBen.Name,
            isAirtime: false
        })

    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}



    
function saveRecieverTransfer() {
    BenAccNumberValue = Number(Recipientaccountno.value);
    db.collection("users").where("Accountnumber", "==", BenAccNumberValue)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                myBen = doc.data();
                myDoc = doc.id;
                console.log(doc.id, " => ", doc.data());
            });
        })
        .then(() => {
            const user = firebase.auth().currentUser;
            db.collection(myDoc).add({
                type: "Credit",
                date: "Monday",
                amount: parseFloat(amount.value),
                title: user.displayName, // Using sender's (current user's) name
                isAirtime: false
            })
            .then(() => {
                console.log("Recipient's transfer saved successfully");
            })
            .catch((error) => {
                console.error("Error saving recipient's transfer:", error);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

