import * as d3 from "d3";
import * as topojson from "topojson";
var width = 1000;
var height = 900;
//body에 svg모눈종이 올려주기. 모눈종이 크기 셋팅하기.
var svg = d3.select("chart").append("svg");
svg.attr("width", width);
svg.attr("height", height);
//차트는 다음과같이 Margin을 준다.
var plotMargins = {
    top: 30,
    bottom: 30,
    left: 150,
    right: 30,
};
var plotGroup = svg
    .append("g") //그룹을 설정하는것이다.  svg내의 모든 엘리먼트를 그루핑
    .classed("plot", true)
    .attr("transform", "translate(" + plotMargins.left + "," + plotMargins.top + ")"); //Translate(60,60) =>  60,60만큼 이동  //Rotate : 몇도 만큼 회전  //Scale(10) 확대
var plotWidth = width - plotMargins.left - plotMargins.right;
var plotHeight = height - plotMargins.top - plotMargins.bottom;
// 순서 : scale 설정 ->  axis 에 scale 을 추가 -> plot 에 axis 추가 //
//x축의 눈금은 시간으로 두었다.
var xScale = d3.scaleTime().range([0, plotWidth]);
//축 생성
var xAxis = d3.axisBottom(xScale);
//ploat 에  axis 추가.
var xAxisGroup = plotGroup
    .append("g")
    .classed("x", true)
    .classed("axis", true)
    .attr("transform", "translate(" + 0 + "," + plotHeight + ")");
// 순서 : scale 설정 ->  axis 에 scale 을 추가 -> plot 에 axis 추가 //
//y축의 눈금은 0-100까지 두었다. 도메인설정은 밑에서 한다.
var yScale = d3.scaleLinear().range([plotHeight, 0]);
//축 생성
var yAxis = d3.axisLeft(yScale);
//ploat 에  axis 추가.
var yAxisGroup = plotGroup.append("g").classed("y", true).classed("axis", true);
//데이터 바인딩
d3.json("https://api.reddit.com", function (error, data) {
    if (error) {
        console.error(error);
    }
    else {
        var minn = void 0;
        var maxx = void 0;
        var prepared = data.data.children.map(function (d) {
            return {
                date: new Date(d.data.created * 1000),
                score: d.data.score,
            };
        });
        //축 도메인 설정
        xScale.domain(d3.extent(prepared, function (d) { return d.date; })).nice();
        xAxisGroup.call(xAxis);
        maxx = d3.max(prepared, function (d) { return d.score; });
        minn = d3.min(prepared, function (d) { return d.score; });
        yScale.domain(d3.extent(prepared, function (d) { return d.score; })).nice();
        yAxisGroup.call(yAxis);
        //데이터 실어주기
        var pointsGroup = plotGroup.append("g").classed("points", true);
        var dataBound = pointsGroup.selectAll(".post").data(prepared);
        //표 초기화
        dataBound.exit().remove();
        var enterSelection = dataBound.enter().append("g").classed("post", true);
        enterSelection.append("circle").attr("r", 2).style("fill", "red");
        // update all existing points
        enterSelection
            .merge(dataBound)
            .attr("transform", function (d, i) { return "translate(" + xScale(d.date) + "," + (plotHeight - yScale(d.score)) + ")"; });
    }
});
/////////////////////////////////////////////////////////////////////////////////
////MAP 만들기 ////////////////////////////////////////////////////////////////////
//모눈종이
var svgForMap = d3.select("map").append("svg");
svgForMap.attr("height", height).attr("width", width);
var map = svgForMap.append("g").attr("id", "map"), places = svgForMap.append("g").attr("id", "places");
var projection = d3
    .geoMercator()
    .center([126.9895, 37.5651])
    .scale(1000)
    .translate([width / 2, height / 2]);
var path = d3.geoPath().projection(projection);
var seoulPath = require("./seoulPath.json");
var geojson = topojson.feature(seoulPath, seoulPath.objects.seoul_municipalities_geo);
var bounds = path.bounds(geojson);
var widthScale = (bounds[1][0] - bounds[0][0]) / width;
var heightScale = (bounds[1][1] - bounds[0][1]) / height;
var scale = 1 / Math.max(widthScale, heightScale);
var xoffset = width / 2 - (scale * (bounds[1][0] + bounds[0][0])) / 2 + 10;
var yoffset = height / 2 - (scale * (bounds[1][1] + bounds[0][1])) / 2 + 80;
projection.scale(scale).translate([xoffset, yoffset]);
console.log(geojson);
var center = d3.geoCentroid(geojson);
map
    .selectAll("path")
    .data(geojson.properties.feature)
    .enter()
    .append("path")
    .attr("d", path);
//# sourceMappingURL=app.js.map