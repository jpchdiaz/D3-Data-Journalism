// setting up the SVG field
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our ,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var Group = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial x Parameters
var chosenXAxis = "poverty";

//  function used for updating x-scale var upon click on axis label
function xScale(povertyData, chosenXAxis) {
  //create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(povertyData, d => d[chosenXAxis]) * 0.8,
      d3.max(hairData, d => d[chosenXAxis]) * 1.2
  ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

  // Import Data
d3.csv("cdc_data.csv").then(function(povertyData) {
  // if (err) throw err;

  // Step 1: Parse Data/Cast as numbers
    // ==============================
  povertyData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(povertyData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(povertyData, d => d.healthcare)])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes
  // ==============================
  Group.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  Group.append("g")
    .call(leftAxis);

   // Step 5: Create Circles
  // ==============================
  var circlesGroup = Group.selectAll("circle")
  .data(povertyData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "15")
  .attr("fill", "blue")
  .attr("opacity", ".5")

  // add text to circles
  Group.append("text")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "white")
    .selectAll("tspan")
    .data(povertyData)
    .enter()
    .append("tspan")
      .attr("x", d => xLinearScale(d.poverty - 0))
      .attr("y", d => yLinearScale(d.healthcare - 0.2))
      .text(d => d.abbr);

  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>In Poverty: ${d.poverty}%<br>Lacking Healthcare: ${d.healthcare}%`);
    });

  // Step 7: Create tooltip
  // ==============================
  Group.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  Group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  Group.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");


});
