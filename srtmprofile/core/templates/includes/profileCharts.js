var ctx = $("#chart");
var labels = [];
var distance = JSON.parse('{{ distance|safe }}');
var elevation = JSON.parse('{{ elevation|safe }}');


var profileChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: distance,
        datasets: [{
            label: 'Elevation',
            data: elevation,
            borderWidth: 2,
        }]
    },
    options: {
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