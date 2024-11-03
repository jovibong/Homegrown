<template>

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
                <tr>
                    <td><button class="btn btn-add btn-outline-dark">
                            <i class='fas fa-plus-circle fs-5 add'></i> <p>Add Logs</p>
                        </button>
                    </td>
                    <td colspan="6">

                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</template>

<script>
export default {
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