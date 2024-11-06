<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-container p-5">
                <div class="modal-header">
                    <slot name="header">{{ title }}</slot>
                </div>

                <div class="container ">
                    <!-- update validation func later -->
                    <form class="row g-3 needs-validation " novalidate @submit.prevent="addLogs()">

                        <div class="col-12">
                            <label for="validationCustomUsername" class="form-label mt-4"></label>
                            <div class="input-group has-validation">
                                <span v-if="statNonEditable.length > 0" class="input-group-text"
                                    id="inputGroupPrepend">{{
                                        statNonEditable }}</span>
                                <input :type="statType" class="form-control text-center" id="validationCustomUsername"
                                    aria-describedby="inputGroupPrepend" placeholder="Enter pay" required
                                    v-model="InputStatEditable">
                                <div class="invalid-feedback">
                                    Please enter a valid number.
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <label for="validationCustomUsername" class="form-label mt-4"></label>
                            <div class="input-group has-validation">
                                <span class="input-group-text" id="inputGroupPrepend">{{ descriptionNonEditable
                                    }}</span>
                                <input :type="descType" class="form-control  text-center" id="validationCustomUsername"
                                    aria-describedby="inputGroupPrepend" placeholder="Enter pay" required
                                    v-model="InputDescriptionEditable">
                                <div class="invalid-feedback">
                                    Please enter a valid number.
                                </div>
                            </div>
                        </div>

                        <div class="col-12 ">
                            <br>
                            <hr>
                        </div>

                    </form>

                </div>

                <div class="modal-footer">
                    <button class="btn btn-danger m-3" type="button" @click="$emit('close')">Cancel</button>
                    <button class="btn btn-success" type="button" @click="() => { $emit('close'); updateStats(); }">Edit
                        stat</button>
                </div>


            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import { updateDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/initialize";
import { Date } from 'core-js';

const { show, title, statNonEditable, statEditable, descriptionNonEditable, descriptionEditable } = defineProps({
    show: Boolean,
    title: String,
    statNonEditable: String,
    statEditable: [String, Number, Date, Timestamp],
    descriptionNonEditable: String,
    descriptionEditable: [String, Number],
});


function formatDate(value) {
    if (typeof value === 'string' && value.indexOf('/') != -1) {
        // Return the date in YYYY-MM-DD format
        const dateArray = value.split('/')
        return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
    } else {
        return value; // For String, Number, etc.

    }
}

const statType = ref('');
const descType = ref('');
const InputStatEditable = ref(null);
const InputDescriptionEditable = ref('');


function determineType(value) {

    if (typeof value === 'string' && value.indexOf('/') != -1) {
        return 'date';
    } else {
        return typeof value
    }



}

watch(() => [title, statNonEditable, statEditable, descriptionNonEditable, descriptionEditable], (newValues) => {
    console.log('this is modal');
    console.log('Updated tile props:', newValues);

    statType.value = determineType(statEditable);
    descType.value = determineType(descriptionEditable);
    InputStatEditable.value = statEditable;
    InputDescriptionEditable.value = formatDate(descriptionEditable);

    console.log(statType.value);
    console.log(descType.value);
}, { immediate: true }); // Logs the values 




async function updateStats() {
    try {
        const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        console.log('session in progress');
        console.log(sessionUser.uid);

        const userId = sessionUser.uid;
        // const userDocRef = doc(db, 'finance', userId); // Reference to the user's document
        // const statsref = collection(userDocRef, 'stats', title); // Reference to the user's paymentlogs subcollection
        const statsref = doc(db, 'finance', userId, 'stats', title);
        console.log(statType.value);
        console.log('this is the date', InputDescriptionEditable.value);



        

        if (descType.value == 'date') {
            // console.log(  Timestamp.fromDate(new Date(InputDescriptionEditable.value)));
            // console.log( typeof(Timestamp.fromDate(new Date(InputDescriptionEditable.value))));
            await updateDoc(statsref, {
                statEditable: InputStatEditable.value,
                descriptionEditable: Timestamp.fromDate(new Date(InputDescriptionEditable.value)),
            });
            console.log("date updating data:");


        } else {
            const updatelog = {
                statEditable: InputStatEditable.value,
                descriptionEditable: InputDescriptionEditable.value,
            };
            await updateDoc(statsref, updatelog);
            console.log("success updating data:");


        }


    } catch (error) {
        console.error("Error updating data:", error);
    }
    // console.log(InputStatEditable.value)
    // console.log(InputDescriptionEditable.value)

}



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
