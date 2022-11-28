import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highmaps';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.loadMapChart();
    this.loadMortalityRate();
    this.loadHospitalizationData();
  }

  state_wise_data = [
    ['us-ma', 10], ['us-wa', 11], ['us-ca', 12], ['us-or', 13],
    ['us-wi', 14], ['us-me', 15], ['us-mi', 16], ['us-nv', 17],
    ['us-nm', 18], ['us-co', 19], ['us-wy', 20], ['us-ks', 21],
    ['us-ne', 22], ['us-ok', 23], ['us-mo', 24], ['us-il', 25],
    ['us-in', 26], ['us-vt', 27], ['us-ar', 28], ['us-tx', 29],
    ['us-ri', 30], ['us-al', 31], ['us-ms', 32], ['us-nc', 33],
    ['us-va', 34], ['us-ia', 35], ['us-md', 36], ['us-de', 37],
    ['us-pa', 38], ['us-nj', 39], ['us-ny', 40], ['us-id', 41],
    ['us-sd', 42], ['us-ct', 43], ['us-nh', 44], ['us-ky', 45],
    ['us-oh', 46], ['us-tn', 47], ['us-wv', 48], ['us-dc', 49],
    ['us-la', 50], ['us-fl', 51], ['us-ga', 52], ['us-sc', 53],
    ['us-mn', 54], ['us-mt', 55], ['us-nd', 56], ['us-az', 57],
    ['us-ut', 58], ['us-hi', 59], ['us-ak', 60]
  ];


  loadMapChart() {
    (async () => {
      const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
      ).then(response => response.json())

      const chart = Highcharts.mapChart('widget_map_view', {
        chart: {
          map: topology
        },

        title: null,
        mapNavigation: {
          enabled: true,
          enableButtons: false
        },
        colorAxis: {
          min: 1,
          type: 'logarithmic',
          minColor: '#EEEEFF',
          maxColor: '#000022',
          stops: [
            [0, '#EFEFFF'],
            [0.75, '#4444FF'],
            [1, '#000022']
          ]
        },
        credits: {
          enabled: false
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
        },
        series: [{
          data: this.state_wise_data,
          name: 'State',
          states: {
            hover: {
              color: '#BADA55'
            }
          },
          animation: {
            duration: 1000
          },

          dataLabels: {
            enabled: true,
            align: 'right',
            verticalAlign: 'middle',
            format: '{point.name}'
          }
        }]
      } as any);
    })();
  }

  loadMortalityRate() {
    Highcharts.chart('widget_mortality', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: null,
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'Total',
        colorByPoint: true,
        data: [{
          name: 'Deaths',
          y: 70.67,
          color: '#e24644'
        }, {
          name: 'Cured',
          y: 14.77,
          color: '#10a510'
        }]
      }]
    } as any);
  }

  loadHospitalizationData() {
    Highcharts.chart('widget_hospitals', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Major trophies for some English teams',
        align: 'left'
      },
      xAxis: {
        categories: ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United']
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Count trophies'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            textOutline: 'none'
          }
        }
      },
      legend: {
        align: 'left',
        x: 70,
        verticalAlign: 'top',
        y: 70,
        floating: true,
        backgroundColor: 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        name: 'BPL',
        data: [3, 5, 1, 13]
      }, {
        name: 'FA Cup',
        data: [14, 8, 8, 12]
      }, {
        name: 'CL',
        data: [0, 2, 6, 3]
      }]
    } as any);
  }

  loadCountyRawData() {

  }

}
