<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-container p-5">
                <div class="modal-header">
                    <slot name="header">{{ title }} </slot>
                </div>

                <div class="mb-4">
                    <!-- update validation func later -->
                    <form class="needs-validation" novalidate>
                        
                            <label for="validationCustom01" class="form-label"></label>
                            <input type="text" class="form-control" id="validationCustom01" :value="stat" required>
                            <div class="valid-feedback">
                                Looks good!
                            </div>
                        
                    </form>
                </div>

                <div class="modal-footer">
                    {{ description }}
                    <button class="modal-default-button" @click="$emit('close')">OK</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
// import { ref, watch } from 'vue'
// import { doc, collection, setDoc, addDoc, Timestamp, getDoc } from 'firebase/firestore';
// import { db } from "../firebase/initialize";

const { show, title, stat, description } = defineProps({
    show: Boolean,
    title: String,
    stat: String,
    description: String,
});



// // create log
// // title
// const title = ref('')

// // amount
// const amount = ref('')

// // paymentType, date, status, and badgeClass
// const paymentType = ref('')
// const date = ref('')
// const status = ref('')
// const badgeClass = ref('')

// // Watchers for paymentType and date to set `status` and `badgeClass`
// watch([paymentType, date], () => {
//     // Update status based on paymentType and date
//     if (paymentType.value === 'bonus') {
//         status.value = 'BONUS';
//     } else if (paymentType.value === 'monthly pay') {
//         const paymentDay = 15;
//         const processDate = new Date(date.value);
//         const day = processDate.getDate();

//         if (day > paymentDay) {
//             status.value = 'LATE';
//         } else if (day < paymentDay) {
//             status.value = 'EARLY';
//         } else {
//             status.value = 'ON TIME';
//         }
//     }

//     // Update badgeClass based on status
//     switch (status.value) {
//         case 'BONUS':
//         case 'EARLY':
//             badgeClass.value = "text-bg-success";
//             break;
//         case 'ON TIME':
//             badgeClass.value = "text-bg-primary";
//             break;
//         case 'LATE':
//             badgeClass.value = "text-bg-danger";
//             break;
//         default:
//             console.log(`status not processed!`);
//     }
// });

// // need to figure out for image
// // const image = ref('')
// const image = 'needToFill.png'


// // Function to clear all input fields
// function clearFields() {
//     title.value = '';
//     amount.value = '';
//     paymentType.value = '';
//     date.value = '';
//     status.value = ''; // Reset status
//     badgeClass.value = ''; // Reset badgeClass
// }

// // to add log to firebase
// async function addLogs() {
//     // const auth = getAuth();
//     // const user = auth.currentUser;

//     try {
//         const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
//         console.log('session in progress');
//         console.log(sessionUser.uid);

//         const userId = sessionUser.uid;
//         const userDocRef = doc(db, 'finance', userId); // Reference to the user's document
//         const paymentLogsCollectionRef = collection(userDocRef, 'paymentlogs'); // Reference to the user's paymentlogs subcollection

//         // Check if the user document exists
//         const userDocSnapshot = await getDoc(userDocRef);

//         // If the user document doesn't exist, create it (you can optionally add some initial data to it)
//         if (!userDocSnapshot.exists()) {
//             await setDoc(userDocRef, { userId: userId });
//         }

//         // Add the log to the user's paymentlogs subcollection
//         await addDoc(paymentLogsCollectionRef, {
//             title: title.value,
//             amount: amount.value,
//             statusPayment: status.value,
//             date: Timestamp.fromDate(new Date(date.value)),
//             image: image,
//             badgeClass: badgeClass.value
//         });

//         // Clear input fields after adding the log
//         clearFields();
//     } catch {
//         console.log('no session user');
//         return;
//     }

// }


</script>

<style>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, .15);
    backdrop-filter: blur(5px);
    display: flex;
    transition: opacity 0.3s ease;
}

.modal-container {
    margin: auto;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
}

.modal-header h3 {
    margin-top: 0;

}

.modal-default-button {
    float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(2);
}
</style>