<template>
    <div>
        <button class="btn btn-outline-light btn-add-light w-100 mb-2" id="show-modal" @click="showModal = true">
            <i class="fas fa-plus-circle fs-5"></i>
            <span> Add Logs</span>
        </button>
        <Teleport to="body">
            <expense-modal :show="showModal" @close="showModal = false" :stat="stat" :description="description">
                <template #header>
                    <div class="w-100">
                        <h2>Add Expense</h2>
                        <hr> 
                    </div>
                </template>
            </expense-modal>
        </Teleport>
        <div class="table-responsive logs-scroll">
            <table class="table table-striped text-center mb-0">
                <thead class="table-dark">
                    <tr>
                        <th scope="col">Select</th>
                        <th scope="col">Title</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Category</th>
                        <th scope="col">Date</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <!-- Show this tbody if logs exist -->
                <tbody v-if="hasLogs" class="table-group-divider">
                    <tr v-for="(log, index) in tableData" :key="index">
                        <td><input type="checkbox" v-model="log.selected" @change="updateSelectedCount" /></td>
                        <th scope="row">{{ log.title }}</th>
                        <td>${{ log.amount }}</td>
                        <td>{{ log.category }}</td>
                        <td>{{ log.date }}</td>
                        <td class="text-nowrap">
                            <a href="#" class="text-decoration-none text-dark" @click.prevent="deleteLog(index)">
                                <i class="fas fa-trash"></i> |
                            </a>
                            <a href="#" class="text-decoration-none text-dark" @click.prevent="editLog(index)">
                                <i class="fas fa-edit"></i>
                            </a>
                        </td>
                    </tr>
                </tbody>
                <!-- Show this tbody if no logs exist -->
                <tbody v-else>
                    <tr>
                        <td colspan="6" class=" fw-bold text-center">No Entries yet!</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>





<script setup>
import Modal from './expenseModal.vue'
import { onMounted, ref } from 'vue'
// import { ref, watch } from 'vue'
// import { doc, collection, addDoc, Timestamp, getDoc } from 'firebase/firestore';
import { doc, getDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/initialize";
// import { getAuth } from 'firebase/auth';

const showModal = ref(false)
const hasLogs = ref(false)
const tableData = ref([])

function formatDate(timestamp) {
    // Convert the Firebase Timestamp to a JavaScript Date
    const date = timestamp.toDate();

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    // Return formatted date as dd/mm/yyyy
    return `${day}/${month}/${year}`;
}

onMounted(async () => {
    // const auth = getAuth();
    // const user = auth.currentUser;
    try {
        const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        console.log('session in progress');
        console.log(sessionUser.uid);

        // if (!user) {
        //     console.log("No user is logged in");
        //     return;
        // }

        const userId = sessionUser.uid;
        const userDocRef = doc(db, 'finance', userId); // Reference to the user's document
        const paymentLogsCollectionRef = collection(userDocRef, 'expenseLogs'); // Reference to the user's paymentlogs subcollection

        // Check if the user document exists
        const userDocSnapshot = await getDoc(userDocRef);

        // If the user document doesn't exist, create it (you can optionally add some initial data to it)
        if (!userDocSnapshot.exists()) {
            hasLogs.value = false;
            return;
        }
        // can add sorting functionality easily using this later
        const logsQuery = query(paymentLogsCollectionRef, orderBy('date', 'desc'));

        const unsubscribe = onSnapshot(logsQuery, (querySnapshot) => {
            const logs = [];
            querySnapshot.forEach((doc) => {
                logs.push({
                    title: doc.data().title,
                    amount: doc.data().amount,
                    date: formatDate(doc.data().date),
                    category: doc.data().category
                });
            });
            tableData.value = logs; // Update tableData with fetched logs

            // Check if there are any logs
            hasLogs.value = tableData.value.length > 0;
        });
    } catch {
        console.log('no session user');
        tableData.value = [];
        hasLogs.value = false;
        return;
    }




})
</script>

<script>
export default {
    components:
    {
        'expense-modal': Modal,
    },
    data() {
        return {
            tableData: [

            ],
            selectedCount: 0,
        };
    },
    methods: {
        updateSelectedCount() {
            this.selectedCount = this.tableData.filter(log => log.selected).length;
        },
        addLog() {
            // Logic to add a new log entry
        },
        deleteLog(index) {
            this.tableData.splice(index, 1);
            this.updateSelectedCount();
        },
        editLog(index) {
            // Logic to edit an existing log entry
            return index;
        },
    },
};
</script>

<style scoped>
.logs-scroll {
    max-height: 300px;
    overflow-y: auto;
}
</style>