<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-container p-5 w-1">
                <div class="modal-header">
                    <slot name="header">this is header default </slot>
                </div>

                <div class="container">
                    <form class="row g-3 needs-validation" novalidate @submit.prevent="addLogs()">

                        <div class="col-12">
                            <label for="validationCustom01" class="form-label mt-4">Title</label>
                            <input type="text" class="form-control" id="validationCustom01" placeholder="Enter title"
                                required v-model="title" @blur="validateTitle">
                            <div v-if="titleError" class="invalid-feedback" style="display: block;">
                                Please enter a title.
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label for="validationCustom06" class="form-label mt-4">Category</label>
                            <input type="text" class="form-control" id="validationCustom06" placeholder="Enter Category"
                                required v-model="category" @blur="validateCategory">
                            <div v-if="categoryError" class="invalid-feedback" style="display: block;">
                                Please enter a category.
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label for="validationCustom05" class="form-label mt-4">Expense Date</label>
                            <input type="date" class="form-control" id="validationCustom05" required v-model="date"
                                @blur="validateDate">
                            <div v-if="dateError" class="invalid-feedback" style="display: block;">
                                Please provide a date.
                            </div>
                        </div>

                        <div class="col-12 mb-4">
                            <label for="validationCustomUsername" class="form-label ">Amount</label>
                            <div class="input-group has-validation">
                                <span class="input-group-text" id="inputGroupPrepend">SGD$</span>
                                <input type="number" class="form-control" id="validationCustomUsername"
                                    aria-describedby="inputGroupPrepend" placeholder="Enter amount" required
                                    v-model="amount" @blur="validateAmount">
                                <div v-if="amountError" class="invalid-feedback" style="display: block;">
                                    Please enter a valid number.
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <hr>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-danger m-3" type="button"
                        @click="{ $emit('close'), clearFields(); }">Cancel</button>
                    <button class="btn btn-success" type="submit" @click="addLogs">Add log</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { doc, collection, setDoc, addDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from "../firebase/initialize";
// import { getAuth } from 'firebase/auth';

// toggle model
const { show } = defineProps({
    show: Boolean,
});

const emit = defineEmits(['close']);


// Error states
const titleError = ref(false);
const amountError = ref(false);
const dateError = ref(false);
const categoryError = ref(false);

// Validation functions
function validateTitle() {
    titleError.value = !title.value;
}

function validateAmount() {
    amountError.value = !amount.value || isNaN(amount.value);
}

function validateDate() {
    dateError.value = !date.value;
}

function validateCategory() {
    categoryError.value = !category.value;
}


// create log
// title
const title = ref('')

// amount
const amount = ref('')

// paymentType, date, status, and badgeClass
const date = ref('')

const category = ref('')



// Function to clear all input fields
function clearFields() {
    title.value = '';
    amount.value = '';
    category.value = '';
    date.value = '';
    titleError.value = false;
    amountError.value = false;
    dateError.value = false;
    categoryError.value = false;
}

// to add log to firebase
async function addLogs() {
    // const auth = getAuth();
    // const user = auth.currentUser;
    // Run validation
    validateTitle();
    validateAmount();
    validateDate();
    validateCategory();

    // If any field has an error, do not proceed
    if (titleError.value || amountError.value || dateError.value || categoryError.value) {
        return;
    }

    try {
        const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        // console.log('session in progress');
        // console.log(sessionUser.uid);

        const userId = sessionUser.uid;
        const userDocRef = doc(db, 'finance', userId); // Reference to the user's document
        const paymentLogsCollectionRef = collection(userDocRef, 'expenseLogs'); // Reference to the user's paymentlogs subcollection

        // Check if the user document exists
        const userDocSnapshot = await getDoc(userDocRef);

        // If the user document doesn't exist, create it (you can optionally add some initial data to it)
        if (!userDocSnapshot.exists()) {
            await setDoc(userDocRef, { userId: userId });
        }

        // Add the log to the user's paymentlogs subcollection
        await addDoc(paymentLogsCollectionRef, {
            title: title.value,
            amount: amount.value,
            date: Timestamp.fromDate(new Date(date.value)),
            category: category.value,
        });

        // Clear input fields after adding the log
        clearFields();
        emit('close');
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