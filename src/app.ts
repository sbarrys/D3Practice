import * as d3 from "d3";
import { redditObject } from "./redditFormat";
import * as topojson from "topojson";

let width = 1000;
let height = 900;

//body에 svg모눈종이 올려주기. 모눈종이 크기 셋팅하기.
let svg = d3.select("chart").append("svg");
svg.attr("width", width);
svg.attr("height", height);
//차트는 다음과같이 Margin을 준다.
let plotMargins = {
  top: 30,
  bottom: 30,
  left: 150,
  right: 30,
};
let plotGroup = svg
  .append("g") //그룹을 설정하는것이다.  svg내의 모든 엘리먼트를 그루핑
  .classed("plot", true)
  .attr("transform", `translate(${plotMargins.left},${plotMargins.top})`); //Translate(60,60) =>  60,60만큼 이동  //Rotate : 몇도 만큼 회전  //Scale(10) 확대

let plotWidth = width - plotMargins.left - plotMargins.right;
let plotHeight = height - plotMargins.top - plotMargins.bottom;

// 순서 : scale 설정 ->  axis 에 scale 을 추가 -> plot 에 axis 추가 //
//x축의 눈금은 시간으로 두었다.
let xScale = d3.scaleTime().range([0, plotWidth]);
//축 생성
let xAxis = d3.axisBottom(xScale);
//ploat 에  axis 추가.
let xAxisGroup = plotGroup
  .append("g")
  .classed("x", true)
  .classed("axis", true)
  .attr("transform", `translate(${0},${plotHeight})`);
// 순서 : scale 설정 ->  axis 에 scale 을 추가 -> plot 에 axis 추가 //
//y축의 눈금은 0-100까지 두었다. 도메인설정은 밑에서 한다.
let yScale = d3.scaleLinear().range([plotHeight, 0]);
//축 생성
let yAxis = d3.axisLeft(yScale);
//ploat 에  axis 추가.
let yAxisGroup = plotGroup.append("g").classed("y", true).classed("axis", true);

//데이터 바인딩
d3.json<redditObject>("https://api.reddit.com", (error, data) => {
  if (error) {
    console.error(error);
  } else {
    let minn: number;
    let maxx: number;

    let prepared = data.data.children.map((d) => {
      return {
        date: new Date(d.data.created * 1000),
        score: d.data.score,
      };
    });

    //축 도메인 설정
    xScale.domain(d3.extent(prepared, (d) => d.date)).nice();
    xAxisGroup.call(xAxis);
    maxx = d3.max(prepared, (d) => d.score);
    minn = d3.min(prepared, (d) => d.score);
    yScale.domain(d3.extent(prepared, (d) => d.score)).nice();
    yAxisGroup.call(yAxis);

    //데이터 실어주기

    let pointsGroup = plotGroup.append("g").classed("points", true);
    var dataBound = pointsGroup.selectAll(".post").data(prepared);
    //표 초기화
    dataBound.exit().remove();
    var enterSelection: d3.Selection<
      d3.BaseType,
      {
        date: Date;
        score: number;
      },
      SVGGElement,
      unknown
    > = dataBound.enter().append("g").classed("post", true);

    enterSelection.append("circle").attr("r", 2).style("fill", "red");
    // update all existing points
    enterSelection
      .merge(dataBound)
      .attr(
        "transform",
        (d, i) => `translate(${xScale(d.date)},${plotHeight - yScale(d.score)})`
      );
  }
});
/////////////////////////////////////////////////////////////////////////////////
////MAP 만들기 ////////////////////////////////////////////////////////////////////

//모눈종이
let svgForMap = d3.select("map").append("svg");
svgForMap.attr("height", height).attr("width", width);

let map = svgForMap.append("g").attr("id", "map"),
  places = svgForMap.append("g").attr("id", "places");

let projection = d3
  .geoMercator()
  .center([126.9895, 37.5651])
  .scale(1000)
  .translate([width / 2, height / 2]);

let path = d3.geoPath().projection(projection);

const seoulPath = require("./seoulPath.json");
const geojson = topojson.feature(
  seoulPath,
  seoulPath.objects.seoul_municipalities_geo
);
var bounds = path.bounds(geojson);
const widthScale = (bounds[1][0] - bounds[0][0]) / width;
const heightScale = (bounds[1][1] - bounds[0][1]) / height;
const scale = 1 / Math.max(widthScale, heightScale);
const xoffset = width / 2 - (scale * (bounds[1][0] + bounds[0][0])) / 2 + 10;
const yoffset = height / 2 - (scale * (bounds[1][1] + bounds[0][1])) / 2 + 80;
projection.scale(scale).translate([xoffset, yoffset]);
console.log(geojson);
const center = d3.geoCentroid(geojson);
map
  .selectAll("path")
  .data(geojson.properties.feature)
  .enter()
  .append("path")
  .attr("d", path);
