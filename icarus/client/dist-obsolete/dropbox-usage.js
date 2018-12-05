// TODO This page is obsolete
var router = new VueRouter({
    mode: 'history',
    routes: []
});

var userReport = new Vue({
  router,
  el: '#user-report',
  data: {
    accountName: "[Loading]",
    users: [],
    selected: undefined,
    interactions: {}
  },
  mounted: function() {
    var accessToken = Vue.ls.get("icarus_user_token").accessToken;

    axios.get(lambdaPath + "/dropbox-user-report", {
        headers: {
            'X-AccessToken': accessToken
        }
    })
    .then(function (response) {
      var interactions = response.data.interactions;
      userReport.interactions = interactions;
      userReport.accountName = response.data.accountName;
      userReport.users = Object.keys(interactions).map(function(key) {
        return {
          id: key,
          name: interactions[key].userName
        }
      });
  
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

  },
  methods: {  
    showBarChart: function(interactions) {
      var hoursWorked = getHoursWorked(interactions),
          dayRange = getDayRange(hoursWorked),
          chartData = getChartData(hoursWorked, dayRange);

      buildBarChart(chartData);
    },


  },  
});

function getHoursWorked(interactions) {
  var hoursWorked = {};
  interactions.forEach(function(interaction) {
    var day = interaction.timestamp.substring(0, 10),
        hour = interaction.timestamp.substring(11, 13);
    if (!hoursWorked[day]) {
      hoursWorked[day] = {};
    }
    hoursWorked[day][hour] = true;
  });
  return hoursWorked;
}

function getDayRange(hoursWorked) {
  var daysWorked = Object.keys(hoursWorked),
      firstDay,
      lastDay,
      cursor,
      dayRange = [];

  daysWorked.sort();

  firstDay = new Date(daysWorked[0] + "T00:00:00.000Z");
  lastDay = new Date(daysWorked[daysWorked.length - 1] + "T00:00:00.000Z");
  cursor = firstDay;

  while (cursor <= lastDay) {
    dayRange.push(cursor.toISOString().substring(0, 10));
    cursor = new Date(Date.UTC(
      cursor.getFullYear(),
      cursor.getMonth(),
      cursor.getDate() + 1,
      0, 0, 0
    ));
  }
  return dayRange;
}

function getChartData(hoursWorked, dayRange) {
  return dayRange.map(function(day) {
    var hoursRecorded = hoursWorked[day];
    return hoursRecorded && Object.keys(hoursRecorded).length || 0;
  })
}




function buildBarChart(chartdata) {
  var margin = {top: 30, right: 10, bottom: 30, left: 50}

  var height = 400 - margin.top - margin.bottom,
      width = 720 - margin.left - margin.right,
      barWidth = 40,
      barOffset = 20;

  var dynamicColor;

  var yScale = d3.scaleLinear()
      .domain([0, d3.max(chartdata)])
      .range([0, height]);

  var xScale = d3.scaleBand()
      .domain(d3.range(0, chartdata.length))
      .range([0, width]);

  var colors = d3.scaleLinear()
      .domain([0, chartdata.length * .33, chartdata.length * .66, chartdata.length])
      .range(['#d6e9c6', '#bce8f1', '#faebcc', '#ebccd1']);

  var existing = d3.select('#bar-chart').select('svg');
  if (existing) {
    existing.remove();
  }

  var awesome = d3.select('#bar-chart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background', '#bce8f1')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
      .selectAll('rect').data(chartdata)
      .enter().append('rect')
      .styles({
          'fill': function (data, i) {
              return colors(i);
          }, 'stroke': '#31708f', 'stroke-width': '5'
      })
      .attr('width', xScale.bandwidth())
      .attr('x', function (data, i) {
          return xScale(i);
      })
      .attr('height', 0)
      .attr('y', height)
      .on('mouseover', function (data) {
          dynamicColor = this.style.fill;
          d3.select(this)
              .style('fill', '#3c763d')
      })

      .on('mouseout', function (data) {
          d3.select(this)
              .style('fill', dynamicColor)
      });

  awesome.transition()
      .attr('height', function (data) {
          return yScale(data);
      })
      .attr('y', function (data) {
          return height - yScale(data);
      })
      .delay(function (data, i) {
          return i * 20;
      })
      .duration(2000);

  var verticalGuideScale = d3.scaleLinear()
      .domain([0, d3.max(chartdata)])
      .range([height, 0]);

  var vAxis = d3.axisLeft()
      .scale(verticalGuideScale)
      .ticks(10);

  var verticalGuide = d3.select('svg').append('g');
  vAxis(verticalGuide);

  verticalGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
  verticalGuide.selectAll('path')
      .style({fill: 'none', stroke: "#3c763d"});
  verticalGuide.selectAll('line')
      .style({stroke: "#3c763d"});

  var hAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(chartdata.size);

  var horizontalGuide = d3.select('svg').append('g');
  hAxis(horizontalGuide);
  horizontalGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')');
  horizontalGuide.selectAll('path')
      .style({fill: 'none', stroke: "#3c763d"});
  horizontalGuide.selectAll('line')
      .style({stroke: "#3c763d"});
}
