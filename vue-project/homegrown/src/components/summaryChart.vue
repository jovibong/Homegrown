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
import { doc, getDoc, getDocs, collection, query, orderBy } from 'firebase/firestore';
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
                    console.log('Stat Editable:', statEditable);

                    // Update annotations with statEditable value
                    chartOptions.value = {
                        ...chartOptions.value, // Keep the previous chart options
                        annotations: {
                            yaxis: [{
                                y: statEditable, // Bind the statEditable value to the annotation y-axis
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

                // Fetch payment logs as before
                const paymentLogsCollectionRef = collection(db, 'finance', userId, 'paymentlogs');
                const logsQuery = query(paymentLogsCollectionRef, orderBy('date', 'asc'));
                const querySnapshot = await getDocs(logsQuery);

                let cumulativeSum = 0;
                cumulativeLogs.value = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const timestamp = data.date.toMillis();
                    cumulativeSum += data.amount;
                    return [timestamp, cumulativeSum];
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
