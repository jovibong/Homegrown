var options = {
    chart: {
        type: 'area'
    },
    series: [{
        name: 'Balance',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
    }],
    xaxis: {
        categories: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003',
            '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'
        ]
    }
}

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();