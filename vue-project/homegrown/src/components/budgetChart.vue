<template>
    <div>
        <apexchart :options="chartOptions" :series="filteredSeries" type="donut" height="350"></apexchart>

        <div class="buttons d-flex justify-content-center p-2">
            <button @click="appendData" :disabled="totalExceedsLimit">Add Data</button>
            <button @click="reset">Reset Data</button>
        </div>

        <div v-if="totalExceedsLimit" class="alert">
            <p>You are over by {{ overflowAmount }}. Please adjust the values to stay within 500.</p>
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
                        <input v-else type="text" v-model="customLabels[index]" @input="updateChart" />
                    </td>
                    <td>
                        <span v-if="index == 0">{{ series[index] }}</span>
                        <input v-else type="number" v-model.number="series[index]" @input="updateChart" />
                    </td>
                    <td>
                        <button v-if="index !== 0" @click="removeData(index)">Remove</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/initialize";

export default defineComponent({
    components: {
        apexchart: VueApexCharts
    },
    setup() {
        const left = ref(500); // Default to 500, will be overwritten by Firebase data
        const series = ref([left.value]); // First item is initially set to left's value
        const customLabels = ref(['Amount left', 'Savings']);

        const chartOptions = {
            chart: { width: 380, type: 'donut' },
            dataLabels: { enabled: false },
            legend: {
                position: 'right',
                formatter: (seriesName, opts) => customLabels.value[opts.seriesIndex]
            },
            tooltip: {
                y: { formatter: (val) => `${val}`, title: (val, opts) => `${customLabels.value[opts.seriesIndex]}:` }
            }
        };

        const filteredSeries = computed(() => series.value);
        const totalSum = computed(() => series.value.reduce((acc, val) => acc + val, 0));
        const totalExceedsLimit = computed(() => totalSum.value > left.value);
        const overflowAmount = computed(() => totalSum.value - left.value);

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
            customLabels.value = ['Amount left'];
            updateChart();
        };

        const updateChart = () => {
            series.value = [...series.value]; // Trigger reactivity for chart update
        };

        onMounted(async () => {
            try {
                const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
                const userId = sessionUser.uid;

                // Access the user's finance collection and specific stats document
                const goalRef = doc(db, 'finance', userId, 'stats', 'Total earned');
                const goalSnap = await getDoc(goalRef);

                if (goalSnap.exists()) {
                    left.value = goalSnap.data().statEditable ; // Set left to "Total earned" or 500 if undefined
                    series.value[0] = left.value; // Initialize the first item in series with left's value
                    updateChart();
                }
            } catch (error) {
                console.error('Error fetching Total earned:', error);
            }
        });

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
            updateChart
        };
    }
});

</script>

<style scoped>
.buttons {
    margin-top: 20px;
}

button {
    margin-right: 10px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}

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
