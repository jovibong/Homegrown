<script setup>
import { ref, defineProps, watch } from 'vue'
import Modal from './statsModal.vue'

const props = defineProps({
    title: String,
    statNonEditable: String,
    statEditable: [String, Number, Date],
    descriptionNonEditable: String,
    descriptionEditable: [String, Number, Date],
})

const showModal = ref(false)

// Watch the props and log their values when they change
watch(() => [props.title, props.statNonEditable, props.statEditable, props.descriptionNonEditable, props.descriptionEditable], (newValues) => {
    return newValues;
}, { immediate: true }); // Logs the values immediately on first run

</script>

<template>

    <div>

        <div class="d-flex justify-content-start align-items-center mb-2">
            <span class="fw-bold ps-2">{{ title }}</span>
            <button class="tile-interact p-2" id="show-modal" @click="showModal = true">
                <i class='fas fa-edit'></i>
            </button>
            <Teleport to="body">
                <!-- use the modal component, pass in the prop -->
                <Modal :show="showModal" @close="showModal = false" :title="title" :statNonEditable="statNonEditable"
                    :statEditable="statEditable" :descriptionNonEditable="descriptionNonEditable"
                    :descriptionEditable="descriptionEditable">
                    <template #header>
                        <div class="w-100">
                            <h2>{{ title }}</h2>
                            <hr>
                        </div>

                    </template>
                </modal>
            </Teleport>
        </div>
        <div>
            <h1 class="text-center text-primary fw-bolder display-5">{{ statNonEditable }}<span class="edit">{{
                statEditable
            }}</span>
            </h1>
        </div>
        <div>
            <p class="text-center text-muted">{{ descriptionNonEditable }}<span class="edit">{{ descriptionEditable
                    }}</span>
            </p>
        </div>

    </div>

</template>


<style scoped>
/* try to flicker edit when hover over tile-interact. prob is they are not siblings or child */
.tile-interact {
    color: rgba(255, 207, 89, 1);
    transition: color 0.2s;
}

.tile-interact:hover {
    color: red;
}

.tile-interact:active {
    color: green;
}

button {
    background: transparent;
    border: none;
}



/* bento btn animation */
@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.5);
    }

    100% {
        transform: scale(1);
    }
}

.bento-tile:hover .tile-interact {

    animation: pulse 2s 3;

}

/* words edit animation */
@keyframes flicker {
    0% {
        opacity: 100%;
    }

    50% {
        opacity: 50%;
    }

    100% {
        opacity: 100%;
    }
}

.bento-tile:hover .edit {

    animation: flicker 2s 3;

}
</style>










import { defineComponent, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

import { onMounted } from 'vue'
// import { ref, watch } from 'vue'
// import { doc, collection, addDoc, Timestamp, getDoc } from 'firebase/firestore';
import { doc, getDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/initialize";
// import { getAuth } from 'firebase/auth';

const hasLogs = ref(false)
const tableData = ref([])
const totalByCategory = ref({})

// function formatDate(timestamp) {
//     // Convert the Firebase Timestamp to a JavaScript Date
//     const date = timestamp.toDate();

//     // Extract day, month, and year
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//     const year = date.getFullYear();

//     // Return formatted date as dd/mm/yyyy
//     return `${day}/${month}/${year}`;
// }

onMounted(async () => {
    try {
        const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        console.log('session in progress');
        console.log(sessionUser.uid);

        const userId = sessionUser.uid;
        const userDocRef = doc(db, 'finance', userId); // Reference to the user's document
        const paymentLogsCollectionRef = collection(userDocRef, 'expenseLogs'); // Reference to the user's paymentlogs subcollection

        // Check if the user document exists
        const userDocSnapshot = await getDoc(userDocRef);

        const currentMonth = new Date().getMonth();

        // If the user document doesn't exist, create it (you can optionally add some initial data to it)
        if (!userDocSnapshot.exists()) {
            hasLogs.value = false;
            return;
        }

        const logsQuery = query(paymentLogsCollectionRef, orderBy('date', 'desc'));

        const unsubscribe = onSnapshot(logsQuery, (querySnapshot) => {
            totalByCategory.value = {}; // Reset the category totals

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const logDate = data.date.toDate(); // Convert Firestore Timestamp to JS Date
                const logMonth = logDate.getMonth(); // Get month of the log

                // Only proceed if the month matches the current month
                if (logMonth === currentMonth) {
                    // Sum the amount by category
                    if (!totalByCategory.value[data.category]) {
                        totalByCategory.value[data.category] = 0;
                    }
                    totalByCategory.value[data.category] += data.amount;
                }
            });

            console.log('Category Totals:', totalByCategory.value);

            // Populate series and customLabels with the category totals
            const categories = Object.keys(totalByCategory.value);
            const values = Object.values(totalByCategory.value);

            // Update the series and customLabels with the category names and totals
            tableData.value = categories.map((category, index) => ({
                category: category,
                amount: values[index],
            }));

            // Set the series and custom labels
            this.series = [...values]; // Add all category values as series data
            this.customLabels = categories.map((category) => category); // Use category names as custom labels

            // Check if there are any logs
            hasLogs.value = tableData.value.length > 0;
            return unsubscribe;
        });
    } catch (error) {
        console.log('No session user or error fetching logs:', error);
        tableData.value = [];
        hasLogs.value = false;
    }
});