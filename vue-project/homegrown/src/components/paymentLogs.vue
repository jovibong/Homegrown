<template>

        <div class="my-4">
            <button class="btn btn-outline-dark btn-add w-100" id="show-modal" @click="showModal = true">
                <i class='fas fa-plus-circle fs-5'></i>
                <span> Add Logs</span>
            </button>
            <Teleport to="body">
                <!-- use the modal component, pass in the prop -->
                <logs-modal :show="showModal" @close="showModal = false" :stat="stat" :description="description">
                    <template #header>
                        <div class="w-100">
                            <h2>Add Payment Log</h2>
                            <hr>
                        </div>
                    </template>
                </logs-modal>
            </Teleport> 
        </div>



    <!-- end of search bar -->

    <div class="table-responsive logs-scroll">
        <table class="table table-striped text-center mb-0">
            <thead class="table-dark">
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date of Payment</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody class="table-group-divider" v-if="hasLogs">
                <tr v-for="(row, index) in tableData" :key="index" :class="{ 'selected-row': isSelected(index) }">
                    <th scope="row">{{ row.title }}</th>
                    <td>${{ row.amount }}</td>
                    <td>
                        <span class="badge rounded-pill" :class="row.badgeClass">{{ row.status }}</span>
                    </td>
                    <td>{{ row.date }}</td>
                    <td class="text-nowrap">
                        <a href='#' class="text-decoration-none trash " @click.prevent="deleteLog(row.id,)"><i class='fas fa-trash'></i></a>
                    </td>
                </tr>
            </tbody>
            <tbody class="table-group-divider" v-if="!hasLogs">
                <tr>
                    <td colspan="7" class=" fw-bold text-center">No Entries yet!</td>
                </tr>
            </tbody>
        </table>
    </div>

</template>


<script setup>
import Modal from './logsModal.vue'
import { onMounted, ref } from 'vue'
// import { ref, watch } from 'vue'
// import { doc, collection, addDoc, Timestamp, getDoc } from 'firebase/firestore';
import { updateDoc,deleteDoc,doc, getDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/initialize";
// import { getAuth } from 'firebase/auth';

const showModal = ref(false)
const hasLogs = ref(true)
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
        // console.log('session in progress');
        // console.log(sessionUser.uid);

        // if (!user) {
        //     console.log("No user is logged in");
        //     return;
        // }

        const userId = sessionUser.uid;
        const userDocRef = doc(db, 'finance', userId); // Reference to the user's document
        const paymentLogsCollectionRef = collection(userDocRef, 'paymentlogs'); // Reference to the user's paymentlogs subcollection

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
            let countLate = 0;
            querySnapshot.forEach((doc) => {
                logs.push({
                    id: doc.id, 
                    title: doc.data().title,
                    amount: doc.data().amount,
                    status: doc.data().statusPayment,
                    date: formatDate(doc.data().date),
                    image: doc.data().image,
                    badgeClass: doc.data().badgeClass
                });
                if (doc.data().statusPayment === 'LATE') {
                    countLate++;
                }
            });
            tableData.value = logs; // Update tableData with fetched logs

            // Check if there are any logs
            hasLogs.value = tableData.value.length > 0;

            updateLateCount(countLate);
        });
    } catch {
        console.log('no session user');
        tableData.value = [];
        hasLogs.value = false;
        return;
    }




});


function updateLateCount(countLate) {
    const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    const userId = sessionUser.uid;

    // Reference to the user's document in the 'finance' collection
    const userDocRef = doc(db, 'finance', userId, 'stats', 'Late Payments');

    updateDoc(userDocRef, { statEditable: countLate });
}


function deleteLog(logId) {
    const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    // console.log('session in progress');
    // console.log(sessionUser.uid);

    // if (!user) {
    //     console.log("No user is logged in");
    //     return;
    // }

    const userId = sessionUser.uid;
    const logRef = doc(db, 'finance', userId, 'paymentlogs', logId);

    deleteDoc(logRef)
        // .then(() => {
        //     // Remove log from tableData on successful deletion
        //     tableData.value.splice(index, 1);
        //     hasLogs.value = tableData.value.length > 0;
        // })
        // .catch(error => console.error("Error deleting log: ", error));
}
</script>


<script>
export default {
    components:
    {
        'logs-modal': Modal,
    },
    data() {
        return {
            // // Sample data for the table rows
            // tableData: [
            //     { title: 'June Payment', amount: '$5000', status: 'ON TIME', date: '15/06/2024', image: 'example.png', badgeClass: 'text-bg-primary' },
            //     { title: 'May Payment', amount: '$5000', status: 'EARLY', date: '10/05/2024', image: 'example.png', badgeClass: 'text-bg-success' },
            //     { title: 'April Payment', amount: '$5000', status: 'LATE', date: '20/04/2024', image: 'example.png', badgeClass: 'text-bg-danger' },
            //     { title: 'April Bonus', amount: '$1111', status: 'BONUS', date: '11/04/2024', image: 'example.png', badgeClass: 'text-bg-success' },
            // ],
            selectedRows: [], // Array to hold the selected row indices
        };
    },
    methods: {
        toggleRowSelection(index) {
            const rowIndex = this.selectedRows.indexOf(index);
            if (rowIndex === -1) {
                // If not selected, add to the array
                this.selectedRows.push(index);
            } else {
                // If already selected, remove from the array
                this.selectedRows.splice(rowIndex, 1);
            }
        },
        isSelected(index) {
            return this.selectedRows.includes(index);
        },
    },
};
</script>

<style scoped>
.selected-row {
    background-color: #007bff;
    /* Change this to your desired highlight color */
    color: white;
    /* Optional: Change text color for better contrast */
}

td,
th {
    vertical-align: middle;
}


.trash{
color: black;
}


.trash:hover{
    color:red;
}
</style>