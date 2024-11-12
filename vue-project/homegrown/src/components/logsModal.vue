<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-container p-5 w-1">
                <div class="modal-header">
                    <slot name="header">This is header default</slot>
                </div>

                <div class="container">
                    <form class="row g-3 needs-validation" novalidate @submit.prevent="handleSubmit">
                        <div class="col-md-6">
                            <label for="validationCustom01" class="form-label mt-4">Title</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                id="validationCustom01" 
                                placeholder="Enter title"
                                required 
                                v-model="title"
                                @blur="validateTitle"
                            >
                            <div v-if="titleError" class="text-danger">
                                Please enter a title.
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label for="validationCustom05" class="form-label mt-4">Payment Date</label>
                            <input 
                                type="date" 
                                class="form-control" 
                                id="validationCustom05" 
                                required 
                                v-model="date"
                                @blur="validateDate"
                            >
                            <div v-if="dateError" class="text-danger">
                                Please provide a date.
                            </div>
                            <span id="dateHelpBlock" class="form-text text-muted">According to slip/transaction</span>
                        </div>

                        <div class="col-md-6">
                            <label for="validationCustom04" class="form-label mt-4">Payment Type</label>
                            <select 
                                class="form-select" 
                                id="validationCustom04" 
                                required 
                                v-model="paymentType"
                                @blur="validatePaymentType"
                            >
                                <option selected disabled value="">Select...</option>
                                <option value="bonus">Bonus</option>
                                <option value="monthly pay">Monthly Pay</option>
                            </select>
                            <div v-if="paymentTypeError" class="text-danger">
                                Please select a payment type.
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label for="validationCustomUsername" class="form-label mt-4">Amount</label>
                            <div class="input-group has-validation">
                                <span class="input-group-text" id="inputGroupPrepend">SGD$</span>
                                <input 
                                    type="number" 
                                    min=0
                                    class="form-control" 
                                    id="validationCustomUsername"
                                    aria-describedby="inputGroupPrepend" 
                                    placeholder="Enter amount" 
                                    required 
                                    v-model="amount"
                                    @blur="validateAmount"
                                >
                                <div v-if="amountError" class="text-danger">
                                    Please enter a valid amount.
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="form-check">
                                <input 
                                    class="form-check-input border-1 border-dark" 
                                    type="checkbox" 
                                    id="invalidCheck" 
                                    v-model="checkboxSelected"
                                    @blur="validateCheckbox"
                                >
                                <label class="form-check-label" for="invalidCheck">
                                    I have checked that the information is accurate to the best of my ability
                                </label>
                                <div v-if="checkboxError" class="text-danger">
                                    You must agree before submitting.
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-danger m-3" type="button" @click="{$emit('close'),clearFields();}">Cancel</button>
                    <button class="btn btn-success" type="submit" @click="handleSubmit">Add log</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { doc, collection, setDoc, addDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from "../firebase/initialize";
// import { getAuth } from 'firebase/auth';

// toggle model
const { show } = defineProps({
    show: Boolean,
});
const emit = defineEmits(['close']);

const checkboxSelected = ref(false);
const titleError = ref(false);
const amountError = ref(false);
const paymentTypeError = ref(false);
const dateError = ref(false);
const checkboxError = ref(false);

// create log
// title
const title = ref('')

// amount
const amount = ref('')

// paymentType, date, status, and badgeClass
const paymentType = ref('')
const date = ref('')
const status = ref('')
const badgeClass = ref('')

// Watchers for paymentType and date to set `status` and `badgeClass`
watch([paymentType, date], async () => {
    // Update status based on paymentType and date
    if (paymentType.value === 'bonus') {
        status.value = 'BONUS';
    } else if (paymentType.value === 'monthly pay') {

        const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        const userId = sessionUser.uid;
        const paymentDayRef = doc(db, 'finance', userId, 'stats', 'Payday');
        const paymentDaySnap = await getDoc(paymentDayRef);


        const descriptionEditable = paymentDaySnap.data().descriptionEditable;
        // console.log('this is the day',descriptionEditable)

        const paymentDay = descriptionEditable;

        const processDate = new Date(date.value);
        const day = processDate.getDate();

        if (day > paymentDay) {
            status.value = 'LATE';
        } else if (day < paymentDay) {
            status.value = 'EARLY';
        } else {
            status.value = 'ON TIME';
        }
    }

    // Update badgeClass based on status
    switch (status.value) {
        case 'BONUS':
        case 'EARLY':
            badgeClass.value = "text-bg-success";
            break;
        case 'ON TIME':
            badgeClass.value = "text-bg-primary";
            break;
        case 'LATE':
            badgeClass.value = "text-bg-danger";
            break;
        default:
            console.log(`status not processed!`);
    }
});


function validateTitle() {
    titleError.value = !title.value;
}

function validateAmount() {
    amountError.value = !amount.value;
}

function validatePaymentType() {
    paymentTypeError.value = !paymentType.value;
}

function validateDate() {
    dateError.value = !date.value;
}

function validateCheckbox() {
    checkboxError.value = !checkboxSelected.value;
}

function resetErrors() {
    titleError.value = false;
    amountError.value = false;
    paymentTypeError.value = false;
    dateError.value = false;
    checkboxError.value = false;
}


// Function to clear all input fields
function clearFields() {
    title.value = '';
    amount.value = '';
    paymentType.value = '';
    date.value = '';
    status.value = ''; // Reset status
    badgeClass.value = ''; // Reset badgeClass
    resetErrors();
}


async function handleSubmit() {
    resetErrors()

    validateTitle();
    validateAmount();
    validatePaymentType();
    validateDate();
    validateCheckbox();

    if (titleError.value || amountError.value || paymentTypeError.value || dateError.value || checkboxError.value) {
        return;
    }

    await addLogs();
    clearFields();
    emit('close');
}

// to add log to firebase
async function addLogs() {
    // const auth = getAuth();
    // const user = auth.currentUser;

    try {
        const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        console.log('session in progress');
        console.log(sessionUser.uid);

        const userId = sessionUser.uid;
        const userDocRef = doc(db, 'finance', userId); // Reference to the user's document
        const paymentLogsCollectionRef = collection(userDocRef, 'paymentlogs'); // Reference to the user's paymentlogs subcollection

        // Check if the user document exists
        const userDocSnapshot = await getDoc(userDocRef);

        // If the user document doesn't exist, create it (you can optionally add some initial data to it)
        if (!userDocSnapshot.exists()) {
            await setDoc(userDocRef, { userId: userId });
        }

        console.log(date.value)
        console.log(typeof (date.value))

        // Add the log to the user's paymentlogs subcollection
        await addDoc(paymentLogsCollectionRef, {
            title: title.value,
            amount: amount.value,
            statusPayment: status.value,
            date: Timestamp.fromDate(new Date(date.value)),
            badgeClass: badgeClass.value
        });



        // Clear input fields after adding the log
        clearFields();
    } catch {
        console.log('no session user');
        return;
    }

}






// onMounted(() => {
//     console.log('mounted')
// })
</script>

<style scoped>
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
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;
}

.modal-container {
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    /* Limit height to 80% of viewport */
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    overflow-y: auto;
    /* Enable vertical scrolling */
    transition: all 0.3s ease;
    padding-top: 0px;
}

.modal-header {
    margin-top: 0;

}

.modal-default-button {
    float: right;
}

/* if got time implement sticky header */
/* .modal-header, .modal-footer {
    position: sticky;
    top: 0; 
    background-color: white;
    z-index: 1;
} */
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
    transform: scale(1.2);
}
</style>