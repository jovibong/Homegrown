<script setup>
import Modal from './logsModal.vue'
import { ref } from 'vue'

const showModal = ref(false)
</script>

<template>
    <div class="row g-3 mx-auto px-0 mb-3 d-flex justify-content-between">
        <!-- https://stackoverflow.com/questions/67559395/dropdown-menu-to-push-contents-below-when-opened -->
        <div class="col-lg-6 col-sm-8 px-0 d-flex justify-content-start">
            <div class="input-group">
                <input type="text" class="form-control  border-right-0   border-dark" placeholder="Search here..."
                    aria-label="Text input with dropdown button">
                <select class="form-select  text-nowrap  border-dark fw-bold" aria-label="Default select example">
                    <option value="None" selected> Filter by </option>
                    <option value="Tilte">Tilte</option>
                    <option value="Amount">Amount</option>
                    <option value="Status">Status</option>
                    <option value="Date">Date</option>
                    <option value="Image">Image</option>
                </select>
            </div>
        </div>
        <div class=" col-sm-3 d-flex justify-content-end px-0">
            <button class="btn btn-outline-dark btn-add w-100" id="show-modal" @click="showModal = true">
                <i class='fas fa-plus-circle fs-5'></i>
                <span> Add Logs</span>
            </button>
            <Teleport to="body">
                <!-- use the modal component, pass in the prop -->
                <logs-modal :show="showModal" @close="showModal = false" :stat="stat" :description="description">
                    <template #header>
                        <h2>Add Payment Log</h2>
                    </template>
                </logs-modal>
            </Teleport>
        </div>
    </div>

    <!-- end of search bar -->

    <div class="table-responsive logs-scroll">
        <table class="table table-striped text-center mb-0">
            <thead class="table-dark">
                <tr>
                    <th scope="col">Select</th>
                    <th scope="col">Title</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date of Payment</th>
                    <th scope="col">Image</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody class="table-group-divider">
                <tr v-for="(row, index) in tableData" :key="index" :class="{ 'selected-row': isSelected(index) }">
                    <td>
                        <input type="checkbox" @change="toggleRowSelection(index)" :checked="isSelected(index)" />
                    </td>
                    <th scope="row">{{ row.title }}</th>
                    <td>{{ row.amount }}</td>
                    <td>
                        <span class="badge rounded-pill" :class="row.badgeClass">{{ row.status }}</span>
                    </td>
                    <td>{{ row.date }}</td>
                    <td><a href='#' class="text-dark">{{ row.image }}</a></td>
                    <td class="text-nowrap">
                        <a href='#' class="text-decoration-none text-dark"><i class='fas fa-eye'></i>|</a>
                        <a href='#' class="text-decoration-none text-dark"><i class='fas fa-trash'></i>|</a>
                        <a href='#' class="text-decoration-none text-dark"><i class='fas fa-edit'></i></a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</template>

<script>
export default {
    components:
    {
        'logs-modal': Modal,
    },
    data() {
        return {
            // Sample data for the table rows
            tableData: [
                { title: 'June Payment', amount: '$5000', status: 'ON TIME', date: '15/06/2024', image: 'example.png', badgeClass: 'text-bg-primary' },
                { title: 'May Payment', amount: '$5000', status: 'EARLY', date: '10/05/2024', image: 'example.png', badgeClass: 'text-bg-success' },
                { title: 'April Payment', amount: '$5000', status: 'LATE', date: '20/04/2024', image: 'example.png', badgeClass: 'text-bg-danger' },
                { title: 'April Bonus', amount: '$1111', status: 'BONUS', date: '11/04/2024', image: 'example.png', badgeClass: 'text-bg-success' },
            ],
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
</style>