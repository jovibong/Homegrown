<template>

    <div class="finance ">

        <div class="layout animated-background " id="financeApp">

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
                            <div class="bento-tile  h-100 p-3 ">
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
                                <div class="d-flex justify-content-center mt-4">
                                    <p class="text-muted">Note: Add expense logs and payment logs to get real time
                                        updates.</p>

                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="text-center bento-tile text-dark h-100 p-3"
                                >
                                <div>
                                    <h1 class=" display-5 fw-bold mb-0 text-primary">Expense</h1>
                                </div>
                                <expense-log></expense-log>


                            </div>
                        </div>

                    </div>


                </div>


            </div>
            <label class="nav pb-2" for="Summary">
                <span class="text-center">
                    <i class="fa fa-university text-primary"></i>
                    <p class=""> Summary</p>
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
                            <div class="bento-tile p-3 h-100 ">

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
                                <h1 class="text-center text-primary fw-bolder display-5"> $ {{ savings }}
                                </h1>

                                <div class="d-flex align-items-center">
                                    <input type="range" class="form-range" min="1"
                                        :max="stats.totalEarned.descriptionEditable" id="customRange2"
                                        v-model="savings">
                                    <button class="btn btn-outline-primary text-nowrap ms-2" @click="savingsChange()">Auto</button>
                                </div>
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
            <label class="nav pb-2" for="BudgetPlanner">
                <span class="text-center">
                    <i class="fa fa-trophy text-primary"></i>
                    <p class="text-center p-auto"> Budget Planner</p>
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
                            <div class="bento-tile h-100 p-3" >
                                <!-- start of table logs -->
                                <div class="text-center">
                                    <h1 class=" display-5 fw-bold mb-0 text-primary">Payment</h1>
                                </div>
                                <payment-logs></payment-logs>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <label class="nav pb-2" for="PaymentTracker">
                <span class="text-center">

                    <i class="fa fa-list-alt text-primary"></i>
                    <p class=""> Payment Tracker</p>
                </span>
            </label>
            <!-- start PaymentTracker tab nav -->

        </div>



    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { doc, collection, getDoc, setDoc, onSnapshot, Timestamp } from "firebase/firestore";
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
    const achieveByParts = stats.value.goal.descriptionEditable.split('/');
    const achieveBy = new Date(`${achieveByParts[2]}-${achieveByParts[1]}-${achieveByParts[0]}`);
    const goalDateParts = GoalDate.value.split('/');
    const goal = new Date(`${goalDateParts[2]}-${goalDateParts[1]}-${goalDateParts[0]}`); // YYYY-MM-DD

    // console.log('this is ahhhhhh');
    // console.log(achieveBy);
    if (achieveBy > goal) {
        return { backgroundColor: 'rgb(188, 225, 188)' };
    } else {
        return { backgroundColor: 'rgb(255, 188, 188)' };
    }
}

function savingsChange() {
    var toEarn = stats.value.goal.statEditable - stats.value.totalEarned.statEditable;
    if (toEarn <= 0) {
        savings.value = 1;
        return;
    }
    var achieveByParts = stats.value.goal.descriptionEditable.split('/');
    var achieveBy = new Date(`${achieveByParts[2]}-${achieveByParts[1]}-${achieveByParts[0]}`);

    var now = new Date();

    var diff = achieveBy - now;
    var monthsDifference = Math.ceil(diff / (1000 * 60 * 60 * 24 * 30));
    // assume if same day, they update alrdy so wont get pay. 
    if (stats.value.payday.descriptionEditable <= now.getDate()) {
        monthsDifference--;
    }


    if (stats.value.payday.descriptionEditable <= achieveBy) {
        monthsDifference--;
    }

    console.log('tttttttttttt', toEarn / monthsDifference)
    


    var perMonth = Math.ceil(toEarn / monthsDifference);

    if (perMonth > stats.value.totalEarned.descriptionEditable) {
        savings.value = stats.value.totalEarned.descriptionEditable;
    } else {
        savings.value = perMonth;
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
    const userDocRef = doc(db, 'finance', userId);

    // Check if the finance document for this user exists. If not, initialize it.
    getDoc(userDocRef).then(docSnapshot => {
        if (!docSnapshot.exists()) {
            // Initialize the user document with userId and stats subcollections
            setDoc(userDocRef, {
                userId: userId // Add the userId as a field
            }).then(() => {
                console.log("User document initialized.");

                // Initialize the stats collection with the required subcollections
                const statsCollectionRef = collection(userDocRef, 'stats');
                const defaultStats = [
                    {
                        name: 'Total earned',
                        data: {
                            title: 'Total earned',
                            statNonEditable: '$',
                            statEditable: 0,
                            descriptionNonEditable: 'Per month: $',
                            descriptionEditable: 0
                        }
                    },
                    {
                        name: 'Late Payments',
                        data: {
                            title: 'Late Payments',
                            statNonEditable: '',
                            statEditable: 0,
                            descriptionNonEditable: 'Considered late (days): >',
                            descriptionEditable: 0
                        }
                    },
                    {
                        name: 'Payday',
                        data: {
                            title: 'Payday',
                            statNonEditable: 'Days left: ',
                            statEditable: 0,
                            descriptionNonEditable: 'Pay date every month:',
                            descriptionEditable: 1
                        }
                    },
                    {
                        name: 'Goal',
                        data: {
                            title: 'Goal',
                            statNonEditable: '$',
                            statEditable: 0,
                            descriptionNonEditable: 'By: ',
                            descriptionEditable: Timestamp.fromDate(new Date()), // current timestamp
                        }
                    }


                ];

                defaultStats.forEach(async ({ name, data }) => {
                    const statRef = doc(statsCollectionRef, name);
                    await setDoc(statRef, data); // Initialize each stat subcollection
                    console.log(`${name} stat initialized.`);
                });

            }).catch(error => {
                console.error("Error initializing user document: ", error);
            });
        }
    }).catch(error => {
        console.error("Error checking if user document exists: ", error);
    });

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