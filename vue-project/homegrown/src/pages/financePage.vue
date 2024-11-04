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
                                <stats-tile title="Goal" stat="$100,000" description="By: 01/01/2026"></stats-tile>
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
                                <stats-tile title="Total earned" stat="$51,400"
                                    description="$5,000 per month"></stats-tile>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="bento-tile p-3 h-100">
                                <stats-tile title="Payday" stat="5 days left"
                                    description="15th of every Month"></stats-tile>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="bento-tile p-3 h-100">
                                <stats-tile title="Late Payments" stat="1"
                                    description="Considered late: >2 days"></stats-tile>
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