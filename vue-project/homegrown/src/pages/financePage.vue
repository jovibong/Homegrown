<template>

    <div class="finance ">

        <div class="layout animated-background" id="financeApp">

            <!-- start Summary tab nav -->
            <input name="nav" type="radio" id="Summary" checked="checked" />
            <div class="page">
                <div class="container">
                    <div class="row g-3 my-5">

                        <div class="col-md-6">
                            <div
                                class="text-center bento-tile h-100 p-3 d-flex justify-content-center align-items-center">
                                <div>
                                    <h1 class=" display-1 fw-bold text-primary">Summary</h1>
                                    <p class="text-muted">A quick glance at your income and spending</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="bento-tile  h-100 p-3">
                                <stats-tile :title="stats.totalEarned.title"
                                    :statNonEditable="stats.totalEarned.statNonEditable"
                                    :statEditable="stats.totalEarned.statEditable"
                                    :descriptionNonEditable="stats.totalEarned.descriptionNonEditable"
                                    :descriptionEditable="stats.totalEarned.descriptionEditable"></stats-tile>
                            </div>
                        </div>

                        <div class="col-12">
                            <div id="chart" class="bento-tile p-3">
                                <!-- summart chart here -->
                                <summary-chart />
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="text-center bento-tile text-light h-100 p-3"
                                style="background-color: rgb(225, 100, 100);">
                                <div>
                                    <h1 class=" display-5 fw-bold">Expense</h1>
                                </div>
                                <expense-log></expense-log>

                            </div>
                        </div>

                    </div>


                </div>


            </div>
            <label class="nav" for="Summary">
                <span>
                    <svg width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round" stroke-linejoin="round">
                    </svg>
                    <i class="fa fa-university text-primary"></i>
                    <p class="d-inline"> Summary</p>
                </span>
            </label>
            <!-- end Summary tab nav -->

            <!-- start BudgetPlanner tab nav -->
            <input name="nav" type="radio" id="BudgetPlanner" />
            <div class="page">

                <div class="container">
                    <div class="row my-5 g-3">
                        <div class="col-12">
                            <div class="bento-tile h-100 p-3 text-center">
                                <div>
                                    <h1 class="display-1 fw-bold text-primary">Budget Planner</h1>
                                    <p class="text-muted">Plan ahead to achieve your financial freedom</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-xl-4 col-md-6">
                            <div class="bento-tile p-3 h-100">
                                <stats-tile :title="stats.goal.title" :statNonEditable="stats.goal.statNonEditable"
                                    :statEditable="stats.goal.statEditable"
                                    :descriptionNonEditable="stats.goal.descriptionNonEditable"
                                    :descriptionEditable="stats.goal.descriptionEditable"></stats-tile>
                            </div>
                        </div>
                        <div class="col-xl-4 col-md-6">
                            <div class="bento-tile p-4 h-100" :style="toggleBackgroundColor()">
                                <div class="d-flex justify-content-start align-items-center mb-3">
                                    <span class="fw-bold ps-2">Achieve goal by</span>

                                </div>
                                <div>
                                    <h1 class="text-center text-primary fw-bolder display-5"> {{ GoalDate }}
                                    </h1>
                                </div>
                                <div>
                                    <p class="text-center text-muted">Note: if you save ${{ savings }} amount
                                        monthly
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-4 col-md-12">
                            <div class="p-3 bento-tile h-100 my-auto">
                                <h3 class="text-center  fw-bolder "> Monthly Savings</h3>
                                <h1 class="text-center text-primary fw-bolder display-5"> ${{ savings }}
                                </h1>

                                <input type="range" class="form-range" min="1"
                                    :max="stats.totalEarned.descriptionEditable" id="customRange2" v-model="savings">
                            </div>
                        </div>

                        <div class="col-12 ">
                            <div class="p-3 bento-tile">
                                <budget-chart :savings="savings"></budget-chart>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <label class="nav" for="BudgetPlanner">
                <span>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                    </svg>
                    <i class="fa fa-trophy text-primary"></i>
                    <p class="d-inline"> Budget Planner</p>
                </span>
            </label>
            <!-- end BudgetPlanner tab nav -->

            <!-- start PaymentTracker tab nav -->
            <input name="nav" type="radio" id="PaymentTracker" />
            <div class="page">
                <div class="container">
                    <div class="row my-5 g-3">


                        <div class="col-12">
                            <div class="bento-tile h-100 p-3 text-center">
                                <div>
                                    <h1 class="display-1 fw-bold text-primary">Payment Tracker</h1>
                                    <p class="text-muted">Keep track of your income and any late payments</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="bento-tile p-3 h-100">
                                <stats-tile :title="stats.payday.title" :statNonEditable="stats.payday.statNonEditable"
                                    :statEditable="stats.payday.statEditable"
                                    :descriptionNonEditable="stats.payday.descriptionNonEditable"
                                    :descriptionEditable="stats.payday.descriptionEditable"></stats-tile>
                            </div>
                        </div>
                        <div class="col-md-6">

                            <div class="bento-tile p-4 h-100">
                                <div class="d-flex justify-content-start align-items-center mb-3">
                                    <span class="fw-bold ps-2">{{ stats.latePayments.title }}</span>

                                </div>
                                <div>
                                    <h1 class="text-center text-primary fw-bolder display-1"> {{
                                        stats.latePayments.statEditable }}
                                    </h1>
                                </div>

                            </div>

                        </div>


                        <div class="col-12">
                            <div class="bento-tile h-100 p-3">
                                <!-- start of table logs -->
                                <!-- https://www.w3schools.com/bootstrap/tryit.asp?filename=trybs_filters_table&stacked=h -->
                                <payment-logs></payment-logs>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <label class="nav" for="PaymentTracker">
                <span>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                    </svg>
                    <i class="fa fa-list-alt text-primary"></i>
                    <p class="d-inline"> Payment Tracker</p>
                </span>
            </label>
            <!-- start PaymentTracker tab nav -->

        </div>



    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { doc, onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebase/initialize";

const savings = ref(1);
const GoalDate = computed(() => {
    var toEarn = stats.value.goal.statEditable - stats.value.totalEarned.statEditable;
    if (toEarn <= 0) {
        var currentDate = new Date();
        var day = String(currentDate.getDate()).padStart(2, '0');  // Add leading zero if needed
        var month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed
        var year = currentDate.getFullYear();

        var formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    }
    var numMonths = Math.ceil(toEarn / savings.value);

    var currentDate1 = new Date();
    currentDate1.setMonth(currentDate1.getMonth() + numMonths);
    const goalMonth = currentDate1.getMonth() + 1;
    const goalYear = currentDate1.getFullYear();
    const goalDay = stats.value.payday.descriptionEditable;

    return `${goalDay}/${goalMonth}/${goalYear}`;
});

function toggleBackgroundColor() {
    const acieveBy = new Date(stats.value.goal.descriptionEditable);
    const goalDateParts = GoalDate.value.split('/');
    const goal = new Date(`${goalDateParts[2]}-${goalDateParts[1]}-${goalDateParts[0]}`); // YYYY-MM-DD

    console.log('this is ahhhhhh');
    console.log(goal);
    if (acieveBy > goal) {
        return { backgroundColor: 'rgb(188, 225, 188)' };
    } else {
        return { backgroundColor: 'rgb(255, 188, 188)' };
    }
}

const stats = ref({
    totalEarned: {
        title: '',
        statNonEditable: '',
        statEditable: '',
        descriptionNonEditable: '',
        descriptionEditable: ''
    },
    payday: {
        title: '',
        statNonEditable: '',
        statEditable: '',
        descriptionNonEditable: '',
        descriptionEditable: ''
    },
    latePayments: {
        title: '',
        statNonEditable: '',
        statEditable: '',
        descriptionNonEditable: '',
        descriptionEditable: ''
    },
    goal: {
        title: '',
        statNonEditable: '',
        statEditable: '',
        descriptionNonEditable: '',
        descriptionEditable: ''
    }
});

function formatDate(timestamp) {
    if (timestamp && timestamp.toDate) {
        const date = timestamp.toDate();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    return '';
}

onMounted(() => {
    const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    if (!sessionUser || !sessionUser.uid) {
        console.log('No session user found');
        return;
    }

    const userId = sessionUser.uid;
    const statsRef = collection(db, 'finance', userId, 'stats');

    const docsToFetch = [
        { key: 'totalEarned', name: 'Total earned' },
        { key: 'payday', name: 'Payday' },
        { key: 'latePayments', name: 'Late Payments' },
        { key: 'goal', name: 'Goal' }
    ];

    docsToFetch.forEach(({ key, name }) => {
        const docRef = doc(statsRef, name);

        // Set up a real-time listener for each document
        onSnapshot(docRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                stats.value[key].title = data.title;
                stats.value[key].statNonEditable = data.statNonEditable;
                stats.value[key].statEditable = data.statEditable;
                stats.value[key].descriptionNonEditable = data.descriptionNonEditable;
                stats.value[key].descriptionEditable = key === 'goal' ? formatDate(data.descriptionEditable) : data.descriptionEditable;
            } else {
                console.log(`Document for ${name} does not exist.`);
            }
        }, (error) => {
            console.error(`Error fetching real-time data for ${name}:`, error);
        });
    });
});
</script>





<script>
import StatsTile from '../components/statsTile.vue';
import SummaryChart from '../components/summaryChart.vue';
import paymentLogs from '../components/paymentLogs.vue';
import budgetChart from '@/components/budgetChart.vue';
import expenseLog from '@/components/expenseLog.vue';
export default {

    props: {
        msg: String
    },
    components:
    {
        'stats-tile': StatsTile,
        'summary-chart': SummaryChart,
        'payment-logs': paymentLogs,
        'budget-chart': budgetChart,
        'expense-log': expenseLog,

    }

}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../css/finance.css";
</style>