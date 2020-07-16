import * as d3 from "d3";
var width = 1000;
var height = 900;
//body에 svg모눈종이 올려주기. 모눈종이 크기 셋팅하기.
var svg = d3.select("body").append("svg");
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
////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
// 순서 : scale 설정 ->  axis 에 scale 을 추가 -> plot 에 axis 추가 //
//y축의 눈금은 0-100까지 두었다. 도메인설정은 밑에서 한다.
var yScale = d3.scaleLinear().range([plotHeight, 0]);
//축 생성
var yAxis = d3.axisLeft(yScale);
//ploat 에  axis 추가.
var yAxisGroup = plotGroup.append("g").classed("y", true).classed("axis", true);
///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
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
        ///////////////////////////////////////////////////////////////////////
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
        // enterSelection.append("circle").attr("r", 2).style("fill", "red");
        // update all existing points
        enterSelection.merge(dataBound);
        //   .attr(
        //     "transform",
        //     (d, i) => `translate(${xScale(d.date)},${yScale(d.score)})`
        //   );
        enterSelection
            .append("rect")
            .attr("height", function (d, i) { return yScale(d.score); })
            .attr("width", 2)
            .attr('y', function (d) { return plotHeight - yScale(d.score); })
            .attr('x', function (d) { return xScale(d.date); });
    }
});
//# sourceMappingURL=app.js.map