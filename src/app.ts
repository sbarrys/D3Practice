import * as d3 from "d3";

let width = 700;
let height = 300;

//body에 svg모눈종이 올려주기. 모눈종이 크기 셋팅하기.
let svg = d3.select("body").append("svg");
svg.attr("width", width);
svg.attr("width", height);
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

////////////////////////////////////////////////////////////////////
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
  .attr("transform", `translate(${0},${plotHeight})`)
  .call(xAxis);
///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
// 순서 : scale 설정 ->  axis 에 scale 을 추가 -> plot 에 axis 추가 //
//x축의 눈금은 시간으로 두었다.
let yScale = d3.scaleLinear().range([plotHeight, 0]);
//축 생성
let yAxis = d3.axisLeft(yScale);
//ploat 에  axis 추가.
let yAxisGroup = plotGroup
  .append("g")
  .classed("y", true)
  .classed("axis", true)
  .call(yAxis);
///////////////////////////////////////////////////////////////////////
