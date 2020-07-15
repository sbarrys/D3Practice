import * as d3 from "d3";
console.log("helloworld");
//도형이 그려질 모눈종이 올리기 (svg)
var svg = d3.select("body").append("svg");
var w = 960;
var h = 480;
svg.attr("width", w);
svg.attr("height", h);
//바인딩할 데이터들.
var dataset = [5, 10, 15, 20, 25];
//svg에 dataset을 바인딩할 circle 요소를 찾는다. 없다면 circle요소을 만들어서 바인딩해주기
//그 circle요소들을 circle이라는 변수로 둔다.
var circle = svg.selectAll("circle").data(dataset).enter().append("circle");
//circle 의 x,y,반지름 입력해주기.
//circle변수 하나하나가 bindedData, idx라는 함수를 사용할수 있다.
circle
    .attr("cx", function (bindedData, idx) {
    return idx * 50 + 25;
})
    .attr("cy", h / 2)
    .attr("r", function (bindedData) {
    return bindedData;
});
//# sourceMappingURL=app.js.map