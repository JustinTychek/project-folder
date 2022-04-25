var svg = d3.select("svg"),
  margin = 200,
  width = svg.attr("width") - margin,
  height = svg.attr("height") - margin;

//add a title
svg
  .append("text")
  .attr("transform", "translate(100,0)")
  .attr("x", 70)
  .attr("y", 50)
  .attr("font-size", "30px")
  .text("MPG Comparison by Model");

var xScale = d3.scaleBand().range([0, width]).padding(0.4);
var yScale = d3.scaleLinear().range([height, 0]);
var g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");

d3.csv("car.csv").then(function (data) {
  xScale.domain(
    data.map(function (d) {
      return d.yAxis;
    })
  );
  yScale.domain([
    0,
    d3.max(data, function (d) {
      return d.xAxis;
    }),
  ]);

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))

    .attr("font-size", 7)
    // .attr("width", 10)
    .append("text")
    .attr("x", 650)
    .attr("y", 50)
    .attr("text-anchor", "bottom")
    .attr("fill", "black")
    .attr("font-size", "20px")
    .text("Car Model");

  g.append("g")
    .call(
      d3
        .axisLeft(yScale)
        .tickFormat(function (d) {
          // return "$" + d;
          return d;
        })
        .ticks(10)
    )
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    // .attr("dy", "-6em")
    .attr("text-anchor", "bottom")
    .attr("x", -120)
    .attr("fill", "black")
    .attr("font-size", "20px")
    .text("Miles Per Gallon");

  g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    //interactivity goes here
    .on("mouseover", onMouseOver)
    .on("mouseout", onMouseOut)
    .attr("x", function (d) {
      return xScale(d.yAxis);
    })
    .attr("y", function (d) {
      return yScale(d.xAxis);
    })
    .attr("width", xScale.bandwidth())
    .transition()
    .ease(d3.easeLinear)
    .duration(500)
    .delay(function (d, i) {
      return i * 50;
    })
    .attr("height", function (d) {
      return height - yScale(d.xAxis);
    });

  //Mouseover event handler
  function onMouseOver(d, i) {
    //get bar's xy values, then augment for the tooltip
    var xPos = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
    var yPos = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;

    //Update the tooltip's position and value
    d3.select("#tooltip")
      .style("left", xPos + 120 + "px")
      .style("top", yPos - 30 + "px")
      .select("#value")
      .text(i.xAxis);
    //i.value can be anypart of your csv data (ex: i.year)
    d3.select("#tooltip").classed("hidden", false);

    d3.select(this).attr("class", "highlight");
    d3.select(this)
      .transition()
      .duration(300)
      .attr("width", xScale.bandwidth() + 5)
      .attr("y", function (d) {
        return yScale(d.xAxis) - 10;
      })
      .attr("height", function (d) {
        return height - yScale(d.xAxis);
      });
  }

  //Mouseout event handler
  function onMouseOut(d, i) {
    d3.select(this).attr("class", "bar");
    d3.select(this)
      .transition()
      .duration(300)
      .attr("width", xScale.bandwidth())
      .attr("y", function (d) {
        return yScale(d.xAxis);
      })
      .attr("height", function (d) {
        return height - yScale(d.xAxis);
      });
    d3.select("#tooltip").classed("hidden", true);
  }
});
