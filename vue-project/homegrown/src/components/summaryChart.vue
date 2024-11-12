<template>
    <div id="chart">
        <div class="toolbar">
            <button @click="updateData('one_month')" class="btn-chart m-1 text-primary">1M</button>
            <button @click="updateData('six_months')" class="btn-chart m-1 text-primary">6M</button>
            <button @click="updateData('one_year')" class="btn-chart m-1 text-primary">1Y</button>
            <button @click="updateData('ytd')" class="btn-chart m-1 text-primary">YTD</button>
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
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
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
                tickAmount: 6,
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
            selection.value = timeline;

            if (chart.value) {
                switch (timeline) {
                    case 'one_month':
                        chart.value.zoomX(
                            new Date('28 Jan 2013').getTime(),
                            new Date('27 Feb 2013').getTime()
                        );
                        break;
                    case 'six_months':
                        chart.value.zoomX(
                            new Date('27 Sep 2012').getTime(),
                            new Date('27 Feb 2013').getTime()
                        );
                        break;
                    case 'one_year':
                        chart.value.zoomX(
                            new Date('27 Feb 2012').getTime(),
                            new Date('27 Feb 2013').getTime()
                        );
                        break;
                    case 'ytd':
                        chart.value.zoomX(
                            new Date('01 Jan 2013').getTime(),
                            new Date('27 Feb 2013').getTime()
                        );
                        break;
                    case 'all':
                        chart.value.zoomX(
                            new Date('23 Jan 2012').getTime(),
                            new Date('27 Feb 2013').getTime()
                        );
                        break;
                    default:
                }
            }
        };

        onMounted(async () => {
            try {
                const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
                const userId = sessionUser.uid;

                const paymentLogsCollectionRef = collection(db, 'finance', userId, 'paymentLogs');
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
                console.log('Error fetching logs:', error);
            }
        });

        // Watch for changes in `series` to update the chart
        watch(series, () => {
            if (chart.value) {
                chart.value.updateSeries(series.value);
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
