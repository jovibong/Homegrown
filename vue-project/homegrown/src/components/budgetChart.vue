<template>
    <div >
        <apexchart :options="chartOptions" :series="filteredSeries" type="donut" height="350"></apexchart>

        <div class="buttons d-flex justify-content-center p-2">
            <button @click="appendData" :disabled="totalExceedsLimit">Add Data</button> <!-- Disable button if total exceeds 500 -->
            <button @click="reset">Reset Data</button>
        </div>

        <!-- Display overflow message if the sum exceeds 500 -->
        <div v-if="totalExceedsLimit" class="alert">
            <p>You are over by {{ overflowAmount }}. Please adjust the values to stay within 500.</p>
        </div>

        <!-- Table for editable labels and values -->
        <table class="series-table">
            <thead>
                <tr>
                    <th>Label</th>
                    <th>Value</th>
                    <th>Action</th> <!-- Add action column for remove buttons -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="(value, index) in series" :key="index">
                    <td>
                        <!-- Show "Savings" as a fixed label for the first item -->
                        <span v-if="index === 0">{{ customLabels[index] }}</span>
                        <input v-else type="text" v-model="customLabels[index]" @input="updateChart" />
                    </td>
                    <td>
                        <!-- Make the first value non-editable -->
                        <span v-if="index === 0">{{ series[index] }}</span>
                        <input v-else type="number" v-model.number="series[index]" @input="updateChart" />
                    </td>
                    <td>
                        <!-- Show remove button only for non-"Savings" rows -->
                        <button v-if="index !== 0" @click="removeData(index)">Remove</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
// const props = defineProps({
//     savings: Number,

// })
</script>

<script>
import { defineComponent } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

export default defineComponent({
    components: {
        apexchart: VueApexCharts
    },
    data() {
        return {
            // Series data with the first item set to 500
            series: [100,20],

            // Custom category labels with the first item labeled as "Savings"
            customLabels: ['Amount left','Savings'],

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
                    formatter: (seriesName, opts) => {
                        return this.customLabels[opts.seriesIndex];
                    }
                },
                tooltip: {
                    y: {
                        formatter: (val) => {
                            return `${val}`;
                        },
                        title: {
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
    computed: {
        filteredSeries() {
            return this.series;
        },

        // Calculate total of the series excluding the first item ("Savings")
        totalSum() {
            return this.series.reduce((acc, val) => acc + val, 0);
        },

        // Check if the total sum exceeds 500
        totalExceedsLimit() {
            return this.totalSum > 500;
        },

        // Calculate how much the total exceeds the limit
        overflowAmount() {
            return this.totalSum - 500;
        }
    },
    watch: {
        // Watch for changes in the series array and update "Savings" to keep total 500
        series: {
            handler(newSeries) {
                const totalOtherValues = newSeries.slice(1).reduce((acc, val) => acc + val, 0);
                this.series[0] = Math.max(0, 500 - totalOtherValues); // Adjust "Savings" value to keep total 500
            },
            deep: true
        }
    },
    methods: {
        appendData() {
            this.series.push(0); // Start with 0 for new entries
            this.customLabels.push(`Category ${this.customLabels.length + 1}`);
        },

        removeData(index) {
            // Remove data at the specified index (if it's not "Savings")
            if (this.series.length > 1 && index !== 0) {
                this.series.splice(index, 1);
                this.customLabels.splice(index, 1);
            }
        },

        reset() {
            this.series = [500];
            this.customLabels = ['Savings'];
            this.updateChart();
        },

        updateChart() {
            // Trigger reactivity for series updates
            this.series = [...this.series];
        },

        getMaxValue(index) {
            // Ensure the max value is based on the first item in the series
            return index === 0 ? 500 : this.series[0];
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
