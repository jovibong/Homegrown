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
                        <span v-if="index < lastindex">{{ customLabels[index] }}</span>
                        <input v-else type="text" v-model="customLabels[index]" @input="updateChart" />
                    </td>
                    <td>
                        <span v-if="index < lastindex">{{ series[index] }}</span>
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
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { doc, getDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/initialize";

export default defineComponent({
    components: {
        apexchart: VueApexCharts
    },
    setup() {
        const left = ref(500); // Set initial "Amount Left" to 500
        const series = ref([left.value]); // First item is always 500
        const customLabels = ref(['Amount left', 'Savings']);
        const totalByCategory = ref({});
        const tableData = ref([]);
        const hasLogs = ref(false);
        const lastindex = ref(2);
        
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
        const totalExceedsLimit = computed(() => totalSum.value > 500);
        const overflowAmount = computed(() => totalSum.value - 500);

        // Watch for changes to the series and adjust the "Amount Left" accordingly
        watch(series, (newSeries) => {
            const totalOtherValues = newSeries.slice(1).reduce((acc, val) => acc + val, 0);
            series.value[0] = Math.max(0, 500 - totalOtherValues); // Ensure "Amount Left" is correctly adjusted
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
            series.value = [500]; // Reset to 500 as the first value
            customLabels.value = ['Amount left'];
            updateChart();
        };

        const updateChart = () => {
            series.value = [...series.value]; // Trigger reactivity for chart update
        };

        onMounted(async () => {
            try {
                const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
                // console.log('session in progress');
                // console.log(sessionUser.uid);

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

                    // console.log('Category Totals:', totalByCategory.value);

                    // Populate series and customLabels with the category totals
                    const categories = Object.keys(totalByCategory.value);
                    const values = Object.values(totalByCategory.value);
                    lastindex.value = categories.length;
                    // console.log(lastindex.value)

                    // Update the series and customLabels with the category names and totals
                    tableData.value = categories.map((category, index) => ({
                        category: category,
                        amount: values[index],
                    }));

                    // Set the series and custom labels
                    series.value = [500, ...values]; // Ensure the first value is always 500
                    customLabels.value = ['Amount left', ...categories]; // Add "Amount left" to customLabels

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
