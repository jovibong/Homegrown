<template>
    <div>
        <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
    name: 'summary-chart',
    components: {
        apexchart: VueApexCharts,
    },
    data() {
        return {
            series: [
                {
                    name: 'Current',
                    type: 'area',
                    data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33]
                },
                {
                    name: 'Goal',
                    type: 'line',
                    data: [100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000]
                }
            ],
            chartOptions: {
                chart: {
                    
                    type: 'line',
                },
                stroke: {
                    curve: 'smooth'
                },
                fill: {
                    type: 'solid',
                    opacity: [0.35, 1],
                },
                labels: [
                    'Dec 01', 'Dec 02', 'Dec 03', 'Dec 04', 'Dec 05', 'Dec 06', 'Dec 07', 'Dec 08', 'Dec 09', 'Dec 10', 'Dec 11'
                ],
                markers: {
                    size: 0
                },
                yaxis: [
                    {
                        title: {
                            text: 'Series A',
                        },
                    },
                    {
                        opposite: true,
                        title: {
                            text: 'Series B',
                        },
                    }
                ],
                tooltip: {
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: function (y) {
                            if (typeof y !== "undefined") {
                                return y.toFixed(0) + " points";
                            }
                            return y;
                        }
                    }
                }
            }
        };
    },
};
</script>

<style scoped>
/* Optional styling for the chart component */
</style>