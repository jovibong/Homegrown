<template>
    <div id="app">
        <apexchart :options="chartOptions" :series="series" type="donut" height="350"></apexchart>

        <div class="buttons">
            <button @click="appendData">Add Data</button>
            <button @click="removeData">Remove Data</button>
            <button @click="randomize">Randomize Data</button>
            <button @click="reset">Reset Data</button>
        </div>
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
            series: [44, 55, 13, 33],
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
                }
            }
        };
    },
    methods: {
        appendData() {
            const arr = this.series.slice();
            arr.push(Math.floor(Math.random() * (100 - 1 + 1)) + 1);
            this.series = arr;
        },

        removeData() {
            if (this.series.length === 1) return;
            const arr = this.series.slice();
            arr.pop();
            this.series = arr;
        },

        randomize() {
            this.series = this.series.map(() => {
                return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
            });
        },

        reset() {
            this.series = [44, 55, 13, 33];
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
</style>