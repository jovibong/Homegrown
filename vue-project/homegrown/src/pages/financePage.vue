<template>
    <div class="finance">

        <div class="layout" id="financeApp">
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
                                <stats-tile :title="stats.goal.title" :statNonEditable="stats.goal.statNonEditable"
                                    :statEditable="stats.goal.statEditable" :descriptionNonEditable="stats.goal.descriptionNonEditable"
                                    :descriptionEditable="stats.goal.descriptionEditable"></stats-tile>
                            </div>
                        </div>

                        <div class="col-12">
                            <div id="chart" class="bento-tile p-3">
                                <!-- summart chart here -->
                                <summary-chart />
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="text-center bento-tile bg-success text-light h-100 p-3">
                                <div>
                                    <h1 class=" display-5 fw-bold">Income</h1>
                                </div>
                                <div>
                                    <div class="table-responsive logs-scroll">
                                        <table class="table table-striped text-center mb-0">
                                            <thead class="table-dark">
                                                <tr>
                                                    <th scope="col">Select</th>
                                                    <!-- titles should be clickable to view the details if needed -->
                                                    <th scope="col">Title</th>
                                                    <th scope="col">Amount</th>
                                                    <th scope="col">Category</th>
                                                    <th scope="col">Date</th>
                                                    <!-- if some selected, it should show the total number of items selected and the actions should be shown -->
                                                    <th scope="col"></th>

                                                </tr>
                                            </thead>
                                            <tbody class="table-group-divider">
                                                <tr>
                                                    <td><input type="checkbox" onclick="toggleRowSelection(this)"></td>
                                                    <th scope="row">June Payment</th>
                                                    <td>$5000</td>
                                                    <td><span class="badge rounded-pill text-bg-primary">ON TIME</span>
                                                    </td>
                                                    <td>15/06/2024</td>
                                                    <td class="text-nowrap">
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-eye'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-trash'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-edit'></i></a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input type="checkbox" onclick="toggleRowSelection(this)"></td>
                                                    <th scope="row">May Payment</th>
                                                    <td>$5000</td>
                                                    <td><span class="badge rounded-pill text-bg-success">Early</span>
                                                    </td>
                                                    <td>10/05/2024</td>
                                                    <td class="text-nowrap">
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-eye'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-trash'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-edit'></i></a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input type="checkbox" onclick="toggleRowSelection(this)"></td>
                                                    <th scope="row">April Payment</th>
                                                    <td>$5000</td>
                                                    <td><span class="badge rounded-pill text-bg-danger">LATE</span></td>
                                                    <td>20/04/2024</td>
                                                    <td class="text-nowrap">
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-eye'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-trash'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-edit'></i></a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input type="checkbox" onclick="toggleRowSelection(this)"></td>
                                                    <th scope="row">April Bonus</th>
                                                    <td>$1111</td>
                                                    <td><span class="badge rounded-pill text-bg-success">Bonus</span>
                                                    </td>
                                                    <td>11/04/2024</td>
                                                    <td class="text-nowrap">
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-eye'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-trash'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-edit'></i></a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="7"><a href='#'><i
                                                                class='fas fa-plus-circle text-dark fs-2'></i></a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="text-center bento-tile bg-danger text-light h-100 p-3">
                                <div>
                                    <h1 class=" display-5 fw-bold">Expense</h1>
                                </div>
                                <div>
                                    <div class="table-responsive logs-scroll">
                                        <table class="table table-striped text-center mb-0">
                                            <thead class="table-dark">
                                                <tr>
                                                    <th scope="col">Select</th>
                                                    <!-- titles should be clickable to view the details if needed -->
                                                    <th scope="col">Title</th>
                                                    <th scope="col">Amount</th>
                                                    <th scope="col">Category</th>
                                                    <th scope="col">Date</th>
                                                    <!-- if some selected, it should show the total number of items selected and the actions should be shown -->
                                                    <th scope="col"></th>

                                                </tr>
                                            </thead>
                                            <tbody class="table-group-divider">
                                                <tr>
                                                    <td><input type="checkbox" onclick="toggleRowSelection(this)"></td>
                                                    <th scope="row">June Payment</th>
                                                    <td>$5000</td>
                                                    <td><span class="badge rounded-pill text-bg-primary">ON TIME</span>
                                                    </td>
                                                    <td>15/06/2024</td>
                                                    <td class="text-nowrap">
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-eye'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-trash'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-edit'></i></a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input type="checkbox" onclick="toggleRowSelection(this)"></td>
                                                    <th scope="row">May Payment</th>
                                                    <td>$5000</td>
                                                    <td><span class="badge rounded-pill text-bg-success">Early</span>
                                                    </td>
                                                    <td>10/05/2024</td>
                                                    <td class="text-nowrap">
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-eye'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-trash'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-edit'></i></a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input type="checkbox" onclick="toggleRowSelection(this)"></td>
                                                    <th scope="row">April Payment</th>
                                                    <td>$5000</td>
                                                    <td><span class="badge rounded-pill text-bg-danger">LATE</span></td>
                                                    <td>20/04/2024</td>
                                                    <td class="text-nowrap">
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-eye'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-trash'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-edit'></i></a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input type="checkbox" onclick="toggleRowSelection(this)"></td>
                                                    <th scope="row">April Bonus</th>
                                                    <td>$1111</td>
                                                    <td><span class="badge rounded-pill text-bg-success">Bonus</span>
                                                    </td>
                                                    <td>11/04/2024</td>
                                                    <td class="text-nowrap">
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-eye'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-trash'></i>
                                                            |</a>
                                                        <a href='#' class="text-decoration-none text-dark"><i
                                                                class='fas fa-edit'></i></a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="7"><a href='#'><i
                                                                class='fas fa-plus-circle text-dark fs-2'></i></a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
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
                    <p>fill up here too</p>
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


                        <div class="col-lg-4">
                            <div class="bento-tile p-3 h-100">
                                <stats-tile :title="stats.totalEarned.title" :statNonEditable="stats.totalEarned.statNonEditable"
                                    :statEditable="stats.totalEarned.statEditable" :descriptionNonEditable="stats.totalEarned.descriptionNonEditable"
                                    :descriptionEditable="stats.totalEarned.descriptionEditable"></stats-tile>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="bento-tile p-3 h-100">
                                <stats-tile :title="stats.payday.title" :statNonEditable="stats.payday.statNonEditable"
                                    :statEditable="stats.payday.statEditable" :descriptionNonEditable="stats.payday.descriptionNonEditable"
                                    :descriptionEditable="stats.payday.descriptionEditable"></stats-tile>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="bento-tile p-3 h-100">
                                <stats-tile :title="stats.latePayments.title" :statNonEditable="stats.latePayments.statNonEditable"
                                    :statEditable="stats.latePayments.statEditable" :descriptionNonEditable="stats.latePayments.descriptionNonEditable"
                                    :descriptionEditable="stats.latePayments.descriptionEditable"></stats-tile>
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
import { onMounted, ref } from 'vue';
import { doc, getDoc, collection } from "firebase/firestore";
import { db } from "../firebase/initialize";

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
    // Convert the Firebase Timestamp to a JavaScript Date
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

onMounted(async () => {
    try {
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

        for (const { key, name } of docsToFetch) {
            const docRef = doc(statsRef, name);
            const docData = await getDoc(docRef);

            if (docData.exists()) {
                stats.value[key].title = docData.data().title;
                stats.value[key].statNonEditable = docData.data().statNonEditable;
                stats.value[key].statEditable = docData.data().statEditable;
                stats.value[key].descriptionNonEditable = docData.data().descriptionNonEditable;
                stats.value[key].descriptionEditable = key === 'goal' ? formatDate(docData.data().descriptionEditable) : docData.data().descriptionEditable;
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
</script>




<script>
import StatsTile from '../components/statsTile.vue';
import SummaryChart from '../components/summaryChart.vue';
import paymentLogs from '../components/paymentLogs.vue';

export default {

    props: {
        msg: String
    },
    components:
    {
        'stats-tile': StatsTile,
        'summary-chart': SummaryChart,
        'payment-logs': paymentLogs

    }

}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../css/finance.css";
</style>