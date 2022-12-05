import { Component, OnInit } from '@angular/core';
import { AppHttpService } from '@app/services/app-http.service';
import { AppStatesRepoService } from '@app/services/app-states-repo.service';
import * as Highcharts from 'highcharts/highmaps';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private appHttpService: AppHttpService, private appStatesRepoService: AppStatesRepoService) {
    this.state_map = this.appStatesRepoService.getStateNameCodeMap();
  }

  api_repo = {
    "url_map_widget": "http://localhost:4201/api/mapWidget",
    "url_hospitalization": "http://localhost:4201/api/hospitalizationData",
    "url_raw_data": "http://localhost:4201/api/rawData",
    "url_mortality_rate": "http://localhost:4201/api/mortalityRate",
    "url_get_counties": "http://localhost:4201/api/countiesByStateTable"
  }

  state_map: any = {};
  states_dropdown_list: any = []

  counties_data: any = [];

  model_repo: any = {
    states_selected: [],
    counties_selected: []
  };

  flags_repo: any = {
    viewTypeStates: false
  }

  states_data: any = [];
  hospital_data: any = [];
  mortalityRate_data: any = [];
  rawData: any = [];

  formattedRawData: any = [];
  filteredStates: any = [];

  ngOnInit(): void {
    this.getMapsData();
  }

  state_wise_data: any = [];

  getMapsData() {
    this.appHttpService.GET(this.api_repo.url_map_widget).subscribe((response: any) => {
      this.states_data = response;

      for (let i = 0; i < this.states_data.length; i++) {
        this.filteredStates.push(this.states_data[i]["state_id"])
        this.states_dropdown_list.push({
          "id": this.states_data[i]["state_id"],
          "name": this.state_map[this.states_data[i]["state_code"]]
        })
      }

      this.loadMapChart();
      this.getHospitalData();
      this.getMortalityRate();
      this.getRawData();
    });
  }

  stateSelected() {
    this.filteredStates = this.model_repo.states_selected;
    if (this.filteredStates.length == 0) {
      for (let i = 0; i < this.states_data.length; i++) {
        this.filteredStates.push(this.states_data[i]["state_id"])
      }
    }
    this.getCounties();
    this.getHospitalData();
    this.getMortalityRate();
    this.getRawData();
  }

  getCounties() {
    this.appHttpService.GET(this.api_repo.url_get_counties + "?states=" + this.filteredStates).subscribe((response: any) => {
      if (response.length > 0) {
        for (let i = 0; i < response.length; i++) {
          this.counties_data.push({ "id": response[i]["county_id"], "name": response[i]["county_name"] });
        }
      }
    });
  }

  countySelected() {
    console.log(this.model_repo.counties_selected)
  }

  getHospitalData() {

    this.appHttpService.POST(this.api_repo.url_hospitalization, { "states": this.filteredStates }).subscribe((response: any) => {
      this.hospital_data = response;
      this.loadHospitalizationData();
    });

  }


  getMortalityRate() {
    this.appHttpService.POST(this.api_repo.url_mortality_rate, { "states": this.filteredStates }).subscribe((response: any) => {
      this.mortalityRate_data = response;
      this.loadMortalityRate();
    });

  }

  getRawData() {
    this.appHttpService.POST(this.api_repo.url_raw_data, { "states": this.filteredStates }).subscribe((response: any) => {
      this.rawData = response;
      this.loadRawData();
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

    let population = []
    let cases = []
    let deaths = []

    let totalCases = 0
    let totalDeaths = 0

    for (let i = 0; i < this.mortalityRate_data.length; i++) {
      population.push(this.mortalityRate_data[i]["state_id"])
      cases.push(this.mortalityRate_data[i]["cases"])
      deaths.push(this.mortalityRate_data[i]["deaths"])

      totalCases += this.mortalityRate_data[i]["cases"]
      totalDeaths += this.mortalityRate_data[i]["deaths"]

    }

    Highcharts.chart('widget_mortality', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: null,
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>'
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
            format: '<b>{point.name}</b>: {point.y}  ({point.percentage:.1f} %)'
          }
        }
      },
      series: [{
        name: 'Total',
        colorByPoint: true,
        data: [{
          name: 'Deaths',
          y: totalDeaths,
          color: '#e24644'
        }, {
          name: 'Cases',
          y: totalCases,
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

  loadRawData() {

    for (let i = 0; i < this.rawData.length; i++) {
      this.rawData[i]["StateName"] = this.state_map[this.rawData[i]["state_code"]]
    }

  }

}
