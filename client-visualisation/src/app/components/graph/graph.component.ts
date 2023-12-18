import { Component } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5wc from "@amcharts/amcharts5/wc";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {
  countries: any;

  countriesPub: any;
  yearsPub: any;
  monthsPub: any;
  universitiesPub: any;
  keywordsPub: any;
  countriesByQuartilePub: any;
  yearsByQuartilePub: any;

  columnChartRoot: any;
  columnChartChart: any;
  selectedColumnChart: any;

  clusteredColumnChartRoot: any;
  clusteredColumnChartChart: any;
  selectedClusteredColumnChart: any;
  selectedCountryClusteredColumnChart: any;

  wordCloudRoot: any;
  selectedWordCloud: any;

  pieChartRoot: any;
  pieChartChart: any;
  selectedPieChart: any;

  constructor(private graphService: GraphService) { }

  ngOnInit() {
    this.getPublicationParPays();
    this.getPublicationParAnnee();
    this.getPublicationParMois();
    this.getPublicationParUniversity();
    this.getPublicationParKeyword();
    this.getPublicationPaysParQuartile();

    this.columnChartRoot = am5.Root.new("columnChart");
    this.clusteredColumnChartRoot = am5.Root.new("clusteredColumnChart");
    this.wordCloudRoot = am5.Root.new("wordCloud");
    this.pieChartRoot = am5.Root.new("pieChart");
  }

  onSelectColumnChart(event: any) {
    this.selectedColumnChart = event.target.value;

    if ("countries" == this.selectedColumnChart) this.columnChart(this.countriesPub.slice(0, 25), "country", true);
    else if ("years" == this.selectedColumnChart) this.columnChart(this.yearsPub, "year", false);
    else if ("months" == this.selectedColumnChart) this.columnChart(this.monthsPub, "month", false);
    else if ("keywords" == this.selectedColumnChart) this.columnChart(this.keywordsPub.slice(0, 25), "keyword", true);
  }

  onSelectClusteredColumnChart(event: any) {
    this.selectedClusteredColumnChart = event.target.value;

    if ("countries" == this.selectedClusteredColumnChart) this.clusteredColumnChart(this.countriesByQuartilePub.slice(0, 8), "country");
    else if ("years" == this.selectedClusteredColumnChart) this.getCountries();
  }

  onSelectCountryClusteredColumnChart(event: any) {
    this.selectedCountryClusteredColumnChart = event.target.value;
    this.getPublicationParAnneParQuartile(this.selectedCountryClusteredColumnChart);
  }

  onSelectWordCloud(event: any) {
    this.selectedColumnChart = event.target.value;

    if ("countries" == this.selectedColumnChart) this.wordCloud(this.countriesPub.slice(0, 50), "country");
    else if ("months" == this.selectedColumnChart) this.wordCloud(this.monthsPub, "month");
    else if ("years" == this.selectedColumnChart) this.wordCloud(this.yearsPub, "year");
    else if ("keywords" == this.selectedColumnChart) this.wordCloud(this.keywordsPub.slice(0, 50), "keyword");
  }

  onSelectPieChart(event: any) {
    this.selectedColumnChart = event.target.value;

    if ("countries" == this.selectedColumnChart) this.pieChart(this.countriesPub.slice(0, 15), "country");
    else if ("months" == this.selectedColumnChart) this.pieChart(this.monthsPub, "month");
    else if ("years" == this.selectedColumnChart) this.pieChart(this.yearsPub, "year");
    else if ("universities" == this.selectedColumnChart) this.pieChart(this.universitiesPub.slice(0, 15), "university");
    else if ("keywords" == this.selectedColumnChart) this.pieChart(this.keywordsPub.slice(0, 15), "keyword");
  }

  getCountries() {
    this.graphService.getCountries().subscribe((response: any) => {
      this.countries = response;
      this.getPublicationParAnneParQuartile("China");
    })
  }

  getPublicationParPays() {
    this.graphService.getPublicationParPays().subscribe((response: any) => {
      this.countriesPub = response;

      this.columnChart(this.countriesPub.slice(0, 25), "country", true);
      this.wordCloud(this.countriesPub, "country");
      this.pieChart(this.countriesPub.slice(0, 15), "country");
    })
  }

  getPublicationParAnnee() {
    this.graphService.getPublicationParAnnee().subscribe((response: any) => {
      this.yearsPub = response;
    })
  }

  getPublicationParMois() {
    this.graphService.getPublicationParMois().subscribe((response: any) => {
      this.monthsPub = response;
    })
  }

  getPublicationParUniversity() {
    this.graphService.getPublicationParUniversity().subscribe((response: any) => {
      this.universitiesPub = response;
    })
  }

  getPublicationParKeyword() {
    this.graphService.getPublicationParKeyword().subscribe((response: any) => {
      this.keywordsPub = response;
    })
  }

  getPublicationPaysParQuartile() {
    this.graphService.getPublicationPaysParQuartile().subscribe((response: any) => {
      this.countriesByQuartilePub = response;
      this.clusteredColumnChart(this.countriesByQuartilePub.slice(0, 8), "country");
    })
  }

  getPublicationParAnneParQuartile(country: any) {
    this.graphService.getPublicationParAnneParQuartile(country).subscribe((response: any) => {
      this.yearsByQuartilePub = response;
      this.clusteredColumnChart(this.yearsByQuartilePub, "year");
    })
  }

  columnChart(data: any, category: string, sorted: boolean) {
    this.columnChartRoot.container.children.clear();

    if (this.columnChartChart) {
      this.columnChartChart.dispose();
      this.columnChartChart = null;
    }

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    this.columnChartRoot.setThemes([
      am5themes_Animated.new(this.columnChartRoot)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    this.columnChartChart = this.columnChartRoot.container.children.push(am5xy.XYChart.new(this.columnChartRoot, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true
    }));

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let cursor = this.columnChartChart.set("cursor", am5xy.XYCursor.new(this.columnChartRoot, {}));
    cursor.lineY.set("visible", false);


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xRenderer = am5xy.AxisRendererX.new(this.columnChartRoot, { minGridDistance: 30 });
    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15
    });

    xRenderer.grid.template.setAll({
      location: 1
    })

    let xAxis = this.columnChartChart.xAxes.push(am5xy.CategoryAxis.new(this.columnChartRoot, {
      maxDeviation: 0.3,
      categoryField: category,
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(this.columnChartRoot, {})
    }));

    let yAxis = this.columnChartChart.yAxes.push(am5xy.ValueAxis.new(this.columnChartRoot, {
      maxDeviation: 0.3,
      renderer: am5xy.AxisRendererY.new(this.columnChartRoot, {
        strokeOpacity: 0.1
      })
    }));


    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = this.columnChartChart.series.push(am5xy.ColumnSeries.new(this.columnChartRoot, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "publication",
      sequencedInterpolation: true,
      categoryXField: category,
      tooltip: am5.Tooltip.new(this.columnChartRoot, {
        labelText: "{valueY}"
      })
    }));

    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    series.columns.template.adapters.add("fill", (fill: any, target: any) => {
      return this.columnChartChart.get("colors")?.getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", (stroke: any, target: any) => {
      return this.columnChartChart.get("colors")?.getIndex(series.columns.indexOf(target));
    });

    if (sorted) {
      xAxis.data.setAll(data.sort((a: any, b: any) => b.publication - a.publication));
      series.data.setAll(data.sort((a: any, b: any) => b.publication - a.publication));
    } else {
      xAxis.data.setAll(data);
      series.data.setAll(data);
    }


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    this.columnChartChart.appear(1000, 100);
  }

  clusteredColumnChart(data: any, category: string) {
    this.clusteredColumnChartRoot.container.children.clear();

    if (this.clusteredColumnChartChart) {
      this.clusteredColumnChartChart.dispose();
      this.clusteredColumnChartChart = null;
    }

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    this.clusteredColumnChartRoot.setThemes([
      am5themes_Animated.new(this.clusteredColumnChartRoot)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    this.clusteredColumnChartChart = this.clusteredColumnChartRoot.container.children.push(am5xy.XYChart.new(this.clusteredColumnChartRoot, {
      panX: false,
      panY: false,
      paddingLeft: 0,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: this.clusteredColumnChartRoot.verticalLayout
    }));


    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    let legend = this.clusteredColumnChartChart.children.push(
      am5.Legend.new(this.clusteredColumnChartRoot, {
        centerX: am5.p50,
        x: am5.p50
      })
    );

    // let data = [
    //   {
    //     "year": "2021",
    //     "q1": 2500,
    //     "q2": 2500,
    //     "q3": 210,
    //     "q4": 10
    //   }, {
    //     "year": "2022",
    //     "q1": 2500,
    //     "q2": 2500,
    //     "q3": 210,
    //     "q4": 10
    //   }, {
    //     "year": "2023",
    //     "q1": 2500,
    //     "q2": 2500,
    //     "q3": 210,
    //     "q4": 10
    //   }
    // ]

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xRenderer = am5xy.AxisRendererX.new(this.clusteredColumnChartRoot, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9
    })

    let xAxis = this.clusteredColumnChartChart.xAxes.push(am5xy.CategoryAxis.new(this.clusteredColumnChartRoot, {
      categoryField: category,
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(this.clusteredColumnChartRoot, {})
    }));

    xRenderer.grid.template.setAll({
      location: 1
    })

    xAxis.data.setAll(data);

    let yAxis = this.clusteredColumnChartChart.yAxes.push(am5xy.ValueAxis.new(this.clusteredColumnChartRoot, {
      renderer: am5xy.AxisRendererY.new(this.clusteredColumnChartRoot, {
        strokeOpacity: 0.1
      })
    }));

    let root = this.clusteredColumnChartRoot;
    let chart = this.clusteredColumnChartChart;

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name: string, fieldName: string) {
      let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: fieldName,
        categoryXField: category
      }));

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}:{valueY}",
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0
      });

      series.data.setAll(data);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: 0,
            centerX: am5.p50,
            populateText: true
          })
        });
      });

      legend.data.push(series);
    }

    makeSeries("Q1", "Q1");
    makeSeries("Q2", "Q2");
    makeSeries("Q3", "Q3");
    makeSeries("Q4", "Q4");


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    this.clusteredColumnChartChart.appear(1000, 100);
  }

  wordCloud(data: any, category: string) {
    this.wordCloudRoot.container.children.clear();

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    this.wordCloudRoot.setThemes([
      am5themes_Animated.new(this.wordCloudRoot)
    ]);


    // Add series
    // https://www.amcharts.com/docs/v5/charts/word-cloud/
    let series = this.wordCloudRoot.container.children.push(am5wc.WordCloud.new(this.wordCloudRoot, {
      categoryField: category,
      valueField: "publication",
      maxFontSize: am5.percent(15)
    }));

    // Configure labels
    series.labels.template.setAll({
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
      fontFamily: "Courier New"
    });


    // Data from:
    // https://insights.stackoverflow.com/survey/2021#section-most-popular-technologies-programming-scripting-and-markup-languages
    series.data.setAll(data);
  }

  pieChart(data: any, category: string) {
    this.pieChartRoot.container.children.clear();

    if (this.pieChartChart) {
      this.pieChartChart.dispose();
      this.pieChartChart = null;
    }

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    this.pieChartRoot.setThemes([
      am5themes_Animated.new(this.pieChartRoot)
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    this.pieChartChart = this.pieChartRoot.container.children.push(
      am5percent.PieChart.new(this.pieChartRoot, {
        endAngle: 270
      })
    );

    // Create series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    let series = this.pieChartChart.series.push(
      am5percent.PieSeries.new(this.pieChartRoot, {
        valueField: "publication",
        categoryField: category,
        endAngle: 270
      })
    );

    series.states.create("hidden", {
      endAngle: -90
    });

    // Set data
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
    series.data.setAll(data);

    series.appear(1000, 100);
  }
}
