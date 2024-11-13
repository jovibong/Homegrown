<template>
    <div>

        <h1 class="text-center text-primary fw-bolder display-1"> Budget Left
                                    </h1>

        <div class="d-flex justify-content-center mb-4">
            <p class="text-muted">Note: calculated based on montly pay and expense for this month.</p>

        </div>
        <apexchart :options="chartOptions" :series="filteredSeries" type="donut" height="350"></apexchart>


        <div class="buttons d-flex justify-content-center p-2">
            <button @click="appendData" :disabled="totalExceedsLimit || hasBlankInput"
                class="btn btn-secondary fw-bold mx-1">Add Data</button>
            <button @click="reset" class="btn btn-secondary fw-bold mx-1">Reset Data</button>
        </div>

        <div v-if="totalExceedsLimit" class="alert text-center">
            <p class="my-auto ">You are over by ${{ overflowAmount }}. Please adjust the values to stay within ${{ max
                }}.</p>
        </div>

        <table class="series-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>SGD$</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(value, index) in series" :key="index">
                    <td>
                        <span v-if="index == 0">{{ customLabels[index] }}</span>
                        <input class="form-control" v-else type="text" v-model="customLabels[index]"
                            @input="updateChart" />
                    </td>
                    <td>
                        <span v-if="index == 0">{{ series[index] }}</span>
                        <input class="form-control" v-else type="number" min=1 v-model.number="series[index]"
                            @input="updateChart" />
                    </td>
                    <td>
                        <button v-if="index !== 0" @click="removeData(index)" class="btn btn-danger">Remove</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { doc, onSnapshot, Timestamp, where, query, orderBy, collection } from "firebase/firestore";
import { db } from "../firebase/initialize";

export default defineComponent({
    components: {
        apexchart: VueApexCharts
    },
    setup() {
        const left = ref(0); // Default to 0, will be overwritten by Firebase data
        const series = ref([left.value]); // First item is initially set to left's value
        const customLabels = ref(['Budget Left']);
        const max = ref(0);



        const chartOptions = {
            chart: { width: 380, type: 'donut' },
            dataLabels: { enabled: false },
            legend: {
                position: 'right',
                formatter: (seriesName, opts) => { return customLabels.value[opts.seriesIndex]; }
            },
            tooltip: {
                y: {
                    formatter: (val) => {
                        return `$${val}`;
                    },
                    title: {
                        formatter: (val, opts) => {
                            const category = customLabels.value[opts.seriesIndex];
                            return `${category}:`;
                        }
                    }
                }
            }
        };

        const filteredSeries = computed(() => series.value);
        const totalSum = computed(() => series.value.reduce((acc, val) => acc + val, 0));
        const totalExceedsLimit = computed(() => totalSum.value > left.value);
        const overflowAmount = computed(() => totalSum.value - left.value);

        const currentDate = new Date();
        // Calculate the start of the current month
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startOfMonthTimestamp = Timestamp.fromDate(startOfMonth);

        // Calculate the end of the current month
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59); // Last day of the current month
        const endOfMonthTimestamp = Timestamp.fromDate(endOfMonth);

        // Watch for changes to the series and adjust the "Amount Left" accordingly
        watch(series, (newSeries) => {
            const totalOtherValues = newSeries.slice(1).reduce((acc, val) => acc + val, 0);
            series.value[0] = Math.max(0, left.value - totalOtherValues); // Ensure "Amount Left" is correctly adjusted
        }, { deep: true });

        const appendData = () => {
            series.value.push(0);
            customLabels.value.push(`Category ${customLabels.value.length + 1}`);
            updateChart();
        };

        const removeData = (index) => {
            if (series.value.length > 1 && index !== 0) {
                series.value.splice(index, 1);
                customLabels.value.splice(index, 1);
                updateChart();
            }
        };

        const reset = () => {
            series.value = [left.value]; // Reset to the Firebase "Total earned" value
            customLabels.value = ['Budget Left'];
            updateChart();
        };

        const updateChart = () => {
            series.value = [...series.value]; // Trigger reactivity for chart update
        };

        // Check for blank inputs
        const hasBlankInput = computed(() => {
            return series.value.some(val => val === '' || val === null || val === undefined) ||
                customLabels.value.some(label => label.trim() === '');
        });

        onMounted(async () => {
            try {
                const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
                const userId = sessionUser.uid;

                // Access the user's finance collection and specific stats document
                const goalRef = doc(db, 'finance', userId, 'stats', 'Total earned');
                const unsubscribe = onSnapshot(goalRef, (goalSnap) => {
                    if (goalSnap.exists()) {
                        left.value = goalSnap.data().descriptionEditable; // Fallback to 500 if undefined
                        max.value = goalSnap.data().descriptionEditable;
                        series.value[0] = left.value; // Initialize the first item in series with left's value

                    }

                    const userDocRef = doc(db, 'finance', userId); // Reference to the user's document
                    const expenseRef = collection(userDocRef, 'expenseLogs'); // Reference to the user's paymentlogs subcollection
                    const userExpenseQuery = query(
                        expenseRef,

                        where('date', '>=', startOfMonthTimestamp), // Filter for start of the current month
                        where('date', '<=', endOfMonthTimestamp),   // Filter for end of the current month
                        orderBy('date') // Optional: order expenses by date
                    );

                    const unsubscribe2 = onSnapshot(userExpenseQuery, (expenseSnap) => {
                        let total = 0;

                        expenseSnap.forEach((doc) => {
                            const expenseData = doc.data();
                            total += expenseData.amount; // Assuming 'amount' field stores the expense amount
                        });

                        left.value = left.value - total; // Update the total expenses
                        series.value[0] = left.value;
                        max.value = max.value -total;
                        updateChart();
                    });
                    console.log(unsubscribe2)



                    console.log(unsubscribe);
                });


            } catch (error) {
                console.error('Error fetching Total earned:', error);
            }
        });

        watch(left, (newLeft) => {
            series.value[0] = newLeft; // Update the first item in the series whenever left value changes
            updateChart();
        }, { immediate: true });

        return {
            series,
            customLabels,
            chartOptions,
            filteredSeries,
            totalExceedsLimit,
            overflowAmount,
            appendData,
            removeData,
            reset,
            updateChart,
            hasBlankInput,
            max
        };
    }
});
</script>


<style scoped>
.buttons {
    margin-top: 20px;
}

/* button {
    margin-right: 10px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
} */

/* button:hover {
    background-color: #45a049;
} */

.series-table {
    margin-top: 20px;
    width: 100%;
    border-collapse: collapse;
}

.series-table th,
.series-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}

.series-table th {
    background-color: #f4f4f4;
}

input[type="number"],
input[type="text"] {
    width: 100%;
    padding: 4px;
    text-align: center;
    border: 1px solid #ddd;
    box-sizing: border-box;
}

.alert {
    background-color: #f8d7da;
    color: #721c24;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #f5c6cb;
    border-radius: 5px;
}
</style>
