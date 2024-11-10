<template>
    <div id="app">
        <apexchart :options="chartOptions" :series="series" type="donut" height="350"></apexchart>

        <div class="buttons">
            <button @click="appendData">Add Data</button>
            <button @click="removeData">Remove Data</button>
            <button @click="randomize">Randomize Data</button>
            <button @click="reset">Reset Data</button>
        </div>

        <!-- Table showing series and corresponding values -->
        <table class="series-table">
            <thead>
                <tr>
                    <th>Index</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(value, index) in series" :key="index">
                    <td>{{ customLabels[index] }}</td>
                    <td>{{ value }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

export default defineComponent({
    components: {
        apexchart: VueApexCharts
    },
    data() {
        return {
            // Series data
            series: [44, 55, 13, 33],

            // Custom category labels
            customLabels: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],

            // Chart options
            chartOptions: {
                chart: {
                    width: 380,
                    type: 'donut',
                },
                dataLabels: {
                    enabled: false,
                },
                legend: {
                    position: 'right',
                    offsetY: 0,
                    height: 230,
                    // Format legend labels with custom names
                    formatter: (seriesName, opts) => {
                        // Use custom label for the legend
                        return this.customLabels[opts.seriesIndex];
                    }
                },
                tooltip: {
                    y: {
                        formatter: (val) => {
                            return `${val}`;},
                        title:{
                            // Tooltip formatter to show custom category name and value
                        formatter: (val, opts) => {
                            const category = this.customLabels[opts.seriesIndex];
                            return `${category}:`;
                        }
                        }
                        
                    },
                    
                }
            }
        };
    },
    methods: {
        appendData() {
            const arr = this.series.slice();
            arr.push(Math.floor(Math.random() * (100 - 1 + 1)) + 1);
            this.series = arr;

            // Add a custom label for the new series
            this.customLabels.push(`Category ${this.customLabels.length + 1}`);
        },

        removeData() {
            if (this.series.length === 1) return;
            const arr = this.series.slice();
            arr.pop();
            this.series = arr;

            // Remove the last custom label as well
            this.customLabels.pop();
        },

        randomize() {
            this.series = this.series.map(() => {
                return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
            });
        },

        reset() {
            this.series = [44, 55, 13, 33];
            this.customLabels = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
        }
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
</style>
