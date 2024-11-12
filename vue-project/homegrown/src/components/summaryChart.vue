<template>
    <div id="chart">
        <div class="toolbar">
            <button @click="updateData('one_week')" class="btn-chart m-1 text-primary">1W</button>
            <button @click="updateData('one_month')" class="btn-chart m-1 text-primary">1M</button>
            <button @click="updateData('one_year')" class="btn-chart m-1 text-primary">1Y</button>
            <button @click="updateData('all')" class="btn-chart m-1 text-primary">ALL</button>
        </div>

        <div id="chart-timeline">
            <apexchart type="area" height="350" ref="chart" :options="chartOptions" :series="series"></apexchart>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, defineComponent } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { doc, getDoc, getDocs, collection, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from "../firebase/initialize";

export default defineComponent({
    components: {
        apexchart: VueApexCharts,
    },
    setup() {
        const cumulativeLogs = ref([]);
        const series = ref([{ data: [] }]);  // Start with an empty array for data

        const chartOptions = ref({
            chart: {
                id: 'area-datetime',
                type: 'area',
                height: 350,
                zoom: {
                    autoScaleYaxis: true
                }
            },
            annotations: {
                yaxis: [{
                    y: 35,
                    borderColor: '#999',
                    label: {
                        show: true,
                        text: 'GOAL',
                        style: {
                            color: "#fff",
                            background: '#00E396'
                        }
                    }
                }],
            },
            dataLabels: { enabled: false },
            markers: { size: 0, style: 'hollow' },
            xaxis: {
                type: 'datetime',

            },
            tooltip: { x: { format: 'dd MMM yyyy' } },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 100]
                }
            },

        });

        const selection = ref('one_year');
        const chart = ref(null);

        const updateData = (timeline) => {
            if (chart.value && cumulativeLogs.value.length > 0) {
                // Get the min and max timestamps from the logs
                const minTimestamp = cumulativeLogs.value[0][0];
                const maxTimestamp = cumulativeLogs.value[cumulativeLogs.value.length - 1][0];

                let startDate, endDate;

                // Calculate the date range based on the timeline
                switch (timeline) {
                    case 'one_week':
                        startDate = new Date(maxTimestamp).setDate(new Date(maxTimestamp).getDate() - 7);  // 1 week ago
                        endDate = maxTimestamp;  // Latest data point
                        break;
                    case 'one_month':
                        startDate = new Date(maxTimestamp).setMonth(new Date(maxTimestamp).getMonth() - 1);  // 1 month ago
                        endDate = maxTimestamp;  // Latest data point
                        break;
                    case 'one_year':
                        startDate = new Date(maxTimestamp).setFullYear(new Date(maxTimestamp).getFullYear() - 1);  // 1 year ago
                        endDate = maxTimestamp;  // Latest data point
                        break;
                    case 'all':
                        startDate = minTimestamp;  // Earliest data point
                        endDate = maxTimestamp;  // Latest data point
                        break;
                    default:
                        startDate = minTimestamp;
                        endDate = maxTimestamp;
                }

                // Zoom the chart to the calculated date range
                chart.value.zoomX(startDate, endDate);
            }
            return timeline;
        };

        onMounted(async () => {
    try {
        const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        const userId = sessionUser.uid;

        // Access the user's finance collection and specific stats document
        const goalRef = doc(db, 'finance', userId, 'stats', 'Goal');
        const goalSnap = await getDoc(goalRef);

        if (goalSnap.exists()) {
            const statEditable = goalSnap.data().statEditable; // Access the statEditable field
            chartOptions.value = {
                ...chartOptions.value,
                annotations: {
                    yaxis: [{
                        y: statEditable,
                        borderColor: '#999',
                        label: {
                            show: true,
                            text: 'GOAL',
                            style: {
                                color: "#fff",
                                background: '#00E396'
                            }
                        }
                    }]
                }
            };
        } else {
            console.log('No such document!');
        }

        // Fetch payment logs
        const paymentLogsCollectionRef = collection(db, 'finance', userId, 'paymentlogs');
        const logsQuery = query(paymentLogsCollectionRef, orderBy('date', 'asc'));
        const querySnapshot = await getDocs(logsQuery);

        const paymentLogs = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const timestamp = data.date.toMillis();
            return { timestamp, amount: data.amount, type: 'payment' };
        });

        // Fetch expense logs
        const expenseLogsCollectionRef = collection(db, 'finance', userId, 'expenseLogs');
        const expenseQuery = query(expenseLogsCollectionRef, orderBy('date', 'asc'));
        const expenseSnapshot = await getDocs(expenseQuery);

        const expenseLogs = expenseSnapshot.docs.map(doc => {
            const data = doc.data();
            const timestamp = data.date.toMillis();
            return { timestamp, amount: data.amount, type: 'expense' };
        });

        // Combine both logs and sort by timestamp
        const allLogs = [...paymentLogs, ...expenseLogs].sort((a, b) => a.timestamp - b.timestamp);

        // Group logs by day (ignoring time) and keep the last entry of each day
        const groupedLogs = {};
        allLogs.forEach(log => {
            const logDate = new Date(log.timestamp);
            const day = `${logDate.getFullYear()}-${logDate.getMonth() + 1}-${logDate.getDate()}`;
            
            // Replace or add log for this day, keeping the last log of the day
            groupedLogs[day] = log;
        });

        // Get the filtered logs (one log per day)
        const filteredLogs = Object.values(groupedLogs).sort((a, b) => a.timestamp - b.timestamp);

        // Calculate cumulative sum
        let cumulativeSum = 0;
        cumulativeLogs.value = filteredLogs.map(log => {
            // Add payment logs to cumulative sum
            if (log.type === 'payment') {
                cumulativeSum += log.amount;
            }
            // Subtract expense logs from cumulative sum
            if (log.type === 'expense') {
                cumulativeSum -= log.amount;
            }
            return [log.timestamp, cumulativeSum];
        });

        // Update Firebase with the last cumulative amount
        const lastAmount = cumulativeLogs.value[cumulativeLogs.value.length - 1][1];
        const statsRef = doc(db, 'finance', userId, 'stats', 'Total earned');
        await updateDoc(statsRef, {
            statEditable: lastAmount,
        });

        series.value = [{ data: cumulativeLogs.value }];
    } catch (error) {
        console.log('Error fetching logs or statEditable:', error);
    }
});





        return {
            series,
            chartOptions,
            selection,
            chart,
            updateData,
        };
    }
});
</script>

<style scoped>
#chart {
    text-align: center;
}

button {
    margin: 5px;
}
</style>
