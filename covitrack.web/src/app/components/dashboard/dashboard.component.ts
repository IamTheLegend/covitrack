import { Component, OnInit } from '@angular/core';
import { AppHttpService } from '@app/services/app-http.service';
import * as Highcharts from 'highcharts/highmaps';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private appHttpService: AppHttpService) { }

  api_repo = {
    "url_map_widget": "http://localhost:4201/api/mapWidget",
    "url_hospitalization": "http://localhost:4201/api/hospitalizationData"
  }

  states_data: any = [];
  hospital_data: any = [];

  ngOnInit(): void {
    this.getMapsData();
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


  getMapsData() {
    this.appHttpService.GET(this.api_repo.url_map_widget).subscribe((response: any) => {
      this.states_data = response;
      this.loadMapChart();
      this.getHospitalData();
    });
  }

  getHospitalData() {
    let stateIdList = []
    for (let i = 0; i < this.states_data.length; i++) {
      stateIdList.push(this.states_data[i]["state_id"])
    }

    this.appHttpService.POST(this.api_repo.url_hospitalization, { "states": stateIdList }).subscribe((response: any) => {
      this.hospital_data = response;
      this.loadHospitalizationData();
    });

  }

  loadMapChart() {
    (async () => {
      const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
      ).then(response => response.json())

      this.state_wise_data = [];

      for (let index = 0; index < this.states_data.length; index++) {
        this.state_wise_data.push(['us-' + this.states_data[index]['state_code'].toLowerCase(), this.states_data[index]['cases']]);
      }

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

    let hospitalBedsOccupied = []
    let hospitalBedsFree = []
    let seriesData = []

    for (let i = 0; i < this.hospital_data.length; i++) {
      seriesData.push(this.hospital_data[i]["state_code"])
      hospitalBedsFree.push(this.hospital_data[i]["hospital_beds_free"] || 0)
      hospitalBedsOccupied.push(this.hospital_data[i]["hospital_beds_occupied"] || 0)
    }

    Highcharts.chart('widget_hospitalization', {
      chart: {
        type: 'column'
      },
      title: null,
      xAxis: {
        categories: seriesData
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Beds'
        }
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
      },
      plotOptions: {
        column: {
          stacking: 'percent'
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Beds Free',
        data: hospitalBedsFree,
        color: "forestgreen"
      }, {
        name: 'Beds Occupied',
        data: hospitalBedsOccupied,
        color: "#c12828"
      }]
    } as any);

  }

  loadCountyRawData() {

  }

}
