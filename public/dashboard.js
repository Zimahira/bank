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


const userName = document.getElementById("userName");

auth.onAuthStateChanged((user) => {
    if (user) {
        userName.innerHTML = "<h1>Welcome " + user.displayName + "</h1>";
    } else {
        console.log("User is signed out");
    }
});

function recharge() {
    const modalHTML = `
        <div class="modal" tabindex="-1" id="rechargeModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Recharge</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="rechargeForm">
                            <div class="mb-3">
                                <label for="amount" class="form-label">Amount</label>
                                <input type="number" class="form-control" id="amount" placeholder="Enter amount">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="submitRecharge()">Recharge</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;

    document.body.appendChild(modalContainer);

    const rechargeModal = new bootstrap.Modal(document.getElementById('rechargeModal'));
    rechargeModal.show();
}

function submitRecharge() {
    const rechargeAmount = parseFloat(document.getElementById('amount').value);

    if (isNaN(rechargeAmount)) {
        alert("Please enter a valid recharge amount.");
        return;
    }

    updateAccountBalance(rechargeAmount);
}

function updateAccountBalance(rechargeAmount) {
    const user = firebase.auth().currentUser;

    if (user) {
        const userDocRef = db.collection("users").doc(user.email);

        userDocRef.get().then(doc => {
            if (doc.exists) {
                const currentBalance = parseFloat(doc.data().accountBalance);
                const updatedBalance = currentBalance - rechargeAmount;

                userDocRef.update({ accountBalance: updatedBalance })
                    .then(() => {
                        alert(`Amount ${rechargeAmount} has been successfully deducted. New balance is: ${updatedBalance}`);
                    })
                    .catch(error => {
                        console.error("Error updating account balance:", error);
                    });
            } else {
                console.log("User document does not exist!");
            }
        }).catch(error => {
            console.error("Error retrieving account balance:", error);
        });
    } else {
        console.log("User is not signed in.");
        // Handle error or redirect to sign-in page
    }
}


let userNname = document.getElementById("userNname");
const balance = document.getElementById("balance");
let history=document.getElementById("history")
let updatedBalance;

function updateAccountBalance(rechargeAmount) {
    const user = firebase.auth().currentUser;

    if (user) {
        const userDocRef = db.collection("users").doc(user.email);

        // Retrieve current account balance
        userDocRef.get().then(doc => {
            if (doc.exists) {
                const currentBalance = parseFloat(doc.data().accountBalance);
                console.log("Current Balance:", currentBalance);
                console.log("Recharge Amount:", rechargeAmount);

                if (isNaN(currentBalance)) {
                    console.error("Error: Current balance is not a number.");
                    return;
                }

                if (isNaN(rechargeAmount)) {
                    console.error("Error: Recharge amount is not a number.");
                    return;
                }

                const updatedBalance = currentBalance - parseFloat(rechargeAmount);
                console.log("Updated Balance:", updatedBalance);

                // Update account balance in Firestore
                userDocRef.update({ accountBalance: updatedBalance })
                    .then(() => {
                        alert(`Amount ${rechargeAmount} has been successfully deducted. New balance is: ${updatedBalance}`);
                        // Close modal or do any other necessary actions
                    })
                    .catch(error => {
                        console.error("Error updating account balance:", error);
                        // Handle error
                    });
            } else {
                console.log("User document does not exist!");
                // Handle error
            }
        }).catch(error => {
            console.error("Error retrieving account balance:", error);
            // Handle error
        });
    } else {
        console.log("User is not signed in.");
        // Handle error or redirect to sign-in page
    }
}



auth.onAuthStateChanged((user) => {
    if (user) {
        const userDocRef = db.collection("users").doc(user.email);

        userDocRef.get().then(doc => {
            if (doc.exists) {
                const currentBalance = parseFloat(doc.data().accountBalance);
                const accountNumber = doc.data().Accountnumber;
                userNname.innerHTML = `<h4> Hi,${user.displayName}</h4>`;
                balance.innerHTML = `<h4> $ ${currentBalance}</h4>`;
                accno.innerHTML =  `${accountNumber}` 
                // userName.innerHTML = `
                //     <h2> welcome ${user.displayName}</h2>
                //     <div id="message">
                //         <div><h1>Account balance:<br><span id="accountBalance">${currentBalance}</span></h1></div>
                //         <div><h1>Account number:<br>${accountNumber}</h1></div>
                //     </div>
                // `;

                userDocRef.onSnapshot(snapshot => {
                    const updatedBalance = snapshot.data().accountBalance;
                    document.getElementById('accountBalance').innerText = updatedBalance;
                });
                displayTransferHistory();
                
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
});



function saveAirtime() {
    const user =firebase.auth( ).currentUser;

    db.collection(user.email).add({
        type: "Airtime",
        date: "Monday",
        amount: amount.value,
        title: "you",
        isAirtime: true
    })
    .then ((docref)=>{
        console.log(docref.id);
    })
    .catch((error)=>{
      console.error(error);
    })
}



function displayTransferHistory(){
    const user = firebase.auth().currentUser;
    db.collection(user.email).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

            history.innerHTML+=` <div id="eachHistory">
            <div id="image">
                <img style="width: 20%;" src="./images/airtel.png" alt="">
                 </div>
                 <div id="userr">
                 ${doc.data().title}
                   </div>
                 <div id="debitCredit">
                 ${doc.data().type}
                            </div>
                            <div id="debitCredit">
                            ${doc.data().amount}
                                       </div>
          </div>`
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    });
}

function funding() {
    const user = firebase.auth().currentUser;

    if (user) {
        // Fetch user's email and other necessary details
        const userEmail = user.email;
        const userDocRef = db.collection("users").doc(userEmail);

        userDocRef.get().then(doc => {
            if (doc.exists) {
                const accountNumber = doc.data().Accountnumber;

                // Flutterwave payment configuration
                FlutterwaveCheckout({
                    public_key: "YOUR_FLUTTERWAVE_PUBLIC_KEY",
                    tx_ref: "hira_bank_" + Math.floor((Math.random() * 1000000000) + 1),
                    amount: 100,  // Replace with the actual amount to be funded
                    currency: "USD",  // Replace with your desired currency
                    payment_options: "card, banktransfer, ussd",
                    redirect_url: "",

                    customer: {
                        email: userEmail,
                        phonenumber: "YOUR_CUSTOMER_PHONE_NUMBER", // Optional: add user's phone number
                        name: user.displayName // Optional: add user's name
                    },

                    customizations: {
                        title: "Fund Your Account",
                        description: "Funding your Hira Bank account",
                        logo: "YOUR_LOGO_URL"  // Optional: add your logo
                    },

                    callback: function(data) {
                        if (data.status === "successful") {
                            const amount = data.amount;
                            
                            // Update user's balance in Firestore
                            const currentBalance = parseFloat(doc.data().accountBalance);
                            const updatedBalance = currentBalance + amount;

                            userDocRef.update({ accountBalance: updatedBalance })
                                .then(() => {
                                    alert(`Your account has been successfully funded with ${amount}. New balance is: ${updatedBalance}`);
                                })
                                .catch(error => {
                                    console.error("Error updating account balance:", error);
                                });
                        } else {
                            alert("Transaction failed. Please try again.");
                        }
                    },

                    onclose: function() {
                        alert("Transaction cancelled.");
                    }
                });
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    } else {
        console.log("User is not signed in.");
    }
}


function recharge(network) {
    const modalHTML = `
        <div class="modal" tabindex="-1" id="rechargeModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Recharge</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="rechargeForm">
                            <div class="mb-3">
                                <label for="amount" class="form-label">Amount</label>
                                <input type="number" class="form-control" id="amount" placeholder="Enter amount">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="submitRecharge('${network}')">Recharge</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;

    document.body.appendChild(modalContainer);

    const rechargeModal = new bootstrap.Modal(document.getElementById('rechargeModal'));
    rechargeModal.show();
}

function submitRecharge() {
    const rechargeAmount = parseFloat(document.getElementById('amount').value);

    if (isNaN(rechargeAmount)) {
        alert("Please enter a valid recharge amount.");
        return;
    }

    updateAccountBalance(rechargeAmount);
}