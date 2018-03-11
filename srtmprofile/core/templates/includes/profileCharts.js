var ctx = $("#chart");
var labels = [];
var distance = JSON.parse('{{ distance|safe }}');
var elevation = JSON.parse('{{ elevation|safe }}');


var profileChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: distance,
        datasets: [{
            label: 'Altitude (m)',
            data: elevation,
            borderWidth: 2,
        }]
    },
    options: {
        //maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
