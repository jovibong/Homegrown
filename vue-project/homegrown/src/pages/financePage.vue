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
                                <stats-tile :title="title4" :statNonEditable="statNonEditable4"
                                    :statEditable="statEditable4" :descriptionNonEditable="descriptionNonEditable4"
                                    :descriptionEditable="descriptionEditable4"></stats-tile>
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
                                <stats-tile :title="title1" :statNonEditable="statNonEditable1"
                                    :statEditable="statEditable1" :descriptionNonEditable="descriptionNonEditable1"
                                    :descriptionEditable="descriptionEditable1"></stats-tile>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="bento-tile p-3 h-100">
                                <stats-tile :title="title2" :statNonEditable="statNonEditable2"
                                    :statEditable="statEditable2" :descriptionNonEditable="descriptionNonEditable2"
                                    :descriptionEditable="descriptionEditable2"></stats-tile>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="bento-tile p-3 h-100">
                                <stats-tile :title="title3" :statNonEditable="statNonEditable3"
                                    :statEditable="statEditable3" :descriptionNonEditable="descriptionNonEditable3"
                                    :descriptionEditable="descriptionEditable3"></stats-tile>
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

import { onMounted, ref } from 'vue'
// import { ref, watch } from 'vue'
// import { doc, collection, addDoc, Timestamp, getDoc } from 'firebase/firestore';
import { doc, getDoc, collection } from "firebase/firestore";
import { db } from "../firebase/initialize";
// import { getAuth } from 'firebase/auth';

const title1 =ref('');
const statNonEditable1 = ref('');
const statEditable1 = ref('');
const descriptionNonEditable1 = ref('');
const descriptionEditable1 = ref('');

const title2 =ref('');
const statNonEditable2 = ref('');
const statEditable2 = ref('');
const descriptionNonEditable2 = ref('');
const descriptionEditable2 = ref('');

const title3 =ref('');
const statNonEditable3 = ref('');
const statEditable3 = ref('');
const descriptionNonEditable3 = ref('');
const descriptionEditable3 = ref('');

const title4 =ref('');
const statNonEditable4 = ref('');
const statEditable4 = ref('');
const descriptionNonEditable4 = ref('');
const descriptionEditable4 = ref('');


function formatDate(timestamp) {
    // Convert the Firebase Timestamp to a JavaScript Date
    const date = timestamp.toDate();

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    // Return formatted date as dd/mm/yyyy
    return `${day}/${month}/${year}`;
}

onMounted(async () => {
    // const auth = getAuth();
    // const user = auth.currentUser;
    try {
        const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        console.log('session in progress');
        console.log(sessionUser.uid);

        // if (!user) {
        //     console.log("No user is logged in");
        //     return;
        // }

        const userId = sessionUser.uid;
        const statsRef = collection(db, 'finance', userId, 'stats');

        const totalEarnedDoc = doc(statsRef, 'Total earned');
        const paydayDoc = doc(statsRef, 'Payday');
        const latePaymentsDoc = doc(statsRef, 'Late Payments');
        const goalDoc = doc(statsRef, 'Goal');


        const totalEarnedData = await getDoc(totalEarnedDoc);
        const paydayData = await getDoc(paydayDoc);
        const latePaymentsData = await getDoc(latePaymentsDoc);
        const goalData = await getDoc(goalDoc);

        if (totalEarnedData.exists()) {
            title1.value = totalEarnedData.data().title;
            statNonEditable1.value = totalEarnedData.data().statNonEditable;
            statEditable1.value = totalEarnedData.data().statEditable;
            descriptionNonEditable1.value = totalEarnedData.data().descriptionNonEditable;
            descriptionEditable1.value = totalEarnedData.data().descriptionEditable;
        }
        if (paydayData.exists()) {
            title2.value = paydayData.data().title;
            statNonEditable2.value = paydayData.data().statNonEditable;
            statEditable2.value = paydayData.data().statEditable;
            descriptionNonEditable2.value = paydayData.data().descriptionNonEditable;
            descriptionEditable2.value = paydayData.data().descriptionEditable;
        }
        if (latePaymentsData.exists()) {
            title3.value = latePaymentsData.data().title;
            statNonEditable3.value = latePaymentsData.data().statNonEditable;
            statEditable3.value = latePaymentsData.data().statEditable;
            descriptionNonEditable3.value = latePaymentsData.data().descriptionNonEditable;
            descriptionEditable3.value = latePaymentsData.data().descriptionEditable;
        }
        if (goalData.exists()) {
            title4.value = goalData.data().title;
            statNonEditable4.value = goalData.data().statNonEditable;
            statEditable4.value = goalData.data().statEditable;
            descriptionNonEditable4.value = goalData.data().descriptionNonEditable;
            descriptionEditable4.value = formatDate(goalData.data().descriptionEditable);
        }
    } catch {
        console.log('no session user');

        return;
    }




})

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