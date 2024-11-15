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
import { ref, onMounted, defineComponent, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { doc, getDoc, collection, query, orderBy, updateDoc, onSnapshot } from 'firebase/firestore';
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

            tooltip: {
                x: { format: 'dd MMM yyyy' },
                y: {
                    formatter: function (value) {
                        return `$${value.toFixed(2)}`;  // Format y value with dollar sign and 2 decimal places
                    },
                    title: {
                        formatter: () => {
                            return 'Total Amount';
                        }
                    }
                }
            },
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

        watch(cumulativeLogs, (newValue) => {
            // Update the series data whenever the cumulativeLogs array changes
            series.value = [{ data: newValue }];
            if (chart.value) {
                chart.value.updateSeries(series.value);
            }
        }, { deep: true });

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

        onMounted(() => {
            try {
                const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
                const userId = sessionUser.uid;

                // Access the user's finance collection and specific stats document
                const goalRef = doc(db, 'finance', userId, 'stats', 'Goal');
                getDoc(goalRef).then(goalSnap => {
                    if (goalSnap.exists()) {
                        const statEditable = goalSnap.data().statEditable;
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
                });

                // Real-time listener for payment logs
                const paymentLogsCollectionRef = collection(db, 'finance', userId, 'paymentlogs');
                const paymentLogsQuery = query(paymentLogsCollectionRef, orderBy('date', 'asc'));
                onSnapshot(paymentLogsQuery, (querySnapshot) => {
                    const paymentLogs = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        const timestamp = data.date.toMillis();
                        return { timestamp, amount: data.amount, type: 'payment' };
                    });

                    // Real-time listener for expense logs
                    const expenseLogsCollectionRef = collection(db, 'finance', userId, 'expenseLogs');
                    const expenseLogsQuery = query(expenseLogsCollectionRef, orderBy('date', 'asc'));
                    onSnapshot(expenseLogsQuery, (expenseSnapshot) => {
                        const expenseLogs = expenseSnapshot.docs.map(doc => {
                            const data = doc.data();
                            const timestamp = data.date.toMillis();
                            return { timestamp, amount: data.amount, type: 'expense' };
                        });

                        // Combine both logs and sort by timestamp
                        const allLogs = [...paymentLogs, ...expenseLogs].sort((a, b) => a.timestamp - b.timestamp);

                        // Calculate cumulative sum for each transaction and keep only the last entry of each day
                        let cumulativeSum = 0;
                        const dailyLogs = {}; // Store only the last entry per day

                        allLogs.forEach(log => {
                            if (log.type === 'payment') {
                                cumulativeSum += log.amount;
                            } else if (log.type === 'expense') {
                                cumulativeSum -= log.amount;
                            }

                            // Format date to YYYY-MM-DD to use as key for grouping by day
                            const logDate = new Date(log.timestamp);
                            const day = `${logDate.getFullYear()}-${logDate.getMonth() + 1}-${logDate.getDate()}`;

                            // Update the last entry for this day
                            dailyLogs[day] = [log.timestamp, cumulativeSum];
                        });

                        // Store only the last entry for each day in cumulativeLogs
                        cumulativeLogs.value = Object.values(dailyLogs);

                        // Update Firebase with the last cumulative amount
                        if (cumulativeLogs.value.length > 0) {
                            const lastAmount = cumulativeLogs.value[cumulativeLogs.value.length - 1][1];
                            const statsRef = doc(db, 'finance', userId, 'stats', 'Total earned');
                            updateDoc(statsRef, {
                                statEditable: lastAmount,
                            });
                        } else {
                            const statsRef = doc(db, 'finance', userId, 'stats', 'Total earned');
                            updateDoc(statsRef, {
                                statEditable: 0,
                            });
                        }

                        series.value = [{ data: cumulativeLogs.value }];

                    }, (error) => {
                        console.error('Error fetching expense logs:', error);
                    });
                }, (error) => {
                    console.error('Error fetching payment logs:', error);
                });

            } catch (error) {
                console.error('Error setting up real-time updates or fetching data:', error);

                // Fallback for when an error occurs
                const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
                const userId = sessionUser.uid;
                const statsRef = doc(db, 'finance', userId, 'stats', 'Total earned');
                updateDoc(statsRef, {
                    statEditable: 0,
                });
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
