<template>
    <div>
        <button class="btn btn-outline-light btn-add-light w-100 mb-2" @click="addLog">
            <i class="fas fa-plus-circle fs-5"></i>
            <span> Add Logs</span>
        </button>
        <div class="table-responsive logs-scroll">
            <table class="table table-striped text-center mb-0">
                <thead class="table-dark">
                    <tr>
                        <th scope="col">Select</th>
                        <th scope="col">Title</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Category</th>
                        <th scope="col">Date</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr v-for="(log, index) in logs" :key="index">
                        <td>
                            <input type="checkbox" v-model="log.selected" @change="updateSelectedCount" />
                        </td>
                        <th scope="row">{{ log.title }}</th>
                        <td>{{ log.amount }}</td>
                        <td><span :class="getBadgeClass(log.category)">{{ log.category }}</span></td>
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
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            logs: [
                { title: "June Payment", amount: "$5000", category: "ON TIME", date: "15/06/2024", selected: false },
                { title: "May Payment", amount: "$5000", category: "Early", date: "10/05/2024", selected: false },
                { title: "April Payment", amount: "$5000", category: "LATE", date: "20/04/2024", selected: false },
                { title: "April Bonus", amount: "$1111", category: "Bonus", date: "11/04/2024", selected: false },
            ],
            selectedCount: 0,
        };
    },
    methods: {
        getBadgeClass(category) {
            switch (category) {
                case "ON TIME":
                    return "badge rounded-pill text-bg-primary";
                case "Early":
                    return "badge rounded-pill text-bg-success";
                case "LATE":
                    return "badge rounded-pill text-bg-danger";
                case "Bonus":
                    return "badge rounded-pill text-bg-success";
                default:
                    return "badge rounded-pill text-bg-secondary";
            }
        },
        updateSelectedCount() {
            this.selectedCount = this.logs.filter(log => log.selected).length;
        },
        addLog() {
            // Logic to add a new log entry
        },
        deleteLog(index) {
            this.logs.splice(index, 1);
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