// add your JavaScript/D3 to this file

  const w = 700;
  const h = 500;
  const margin = {top: 25, right: 0, bottom: 25,
      left: 25};
  const innerWidth = w - margin.left - margin.right;
  const innerHeight = h - margin.top - margin.bottom;

  const svg = d3.select("div#plot")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

  svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "lightblue");

  const bardata = [300, 100, 150, 220, 70, 270];









///// reading data
/*  const rowConverter = function (d) {
    return {
      disp: +d.disp,
      mpg: +d.mpg,
      carname: d.carname,
      cylcolor: d.cylcolor
      }
  };*/

/*  d3.csv("https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/mean_crash_per_day_over_years.csv", rowConverter)
    .then(function(data) {

  // stuff that requires the loaded data

    })
    .catch(function(error) {

  // error handling

    });*/


   /*       Month: d.Month
   CrashDayNoYear: d.crash_day_no_year,
          TotalCrash: parseFloat(+d.total_crash),
          DayOnly: d.day_only

          https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/mean_crash_per_day_over_years.csv
          */

d3.csv("https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/mean_crash_per_day_over_years.csv")
    .then(function (data) {
        // Check the loaded data
        console.log(data);

        // Assuming your data has a structure like [{ day_only: ..., Total_Crash: ..., Month: ... }, ...]
        const dataset = data;

        // Check if 'dataset' is an array
        if (Array.isArray(dataset)) {
            // Continue with your visualization code here

            // Set up dimensions and margins
            const margin = { top: 20, right: 20, bottom: 50, left: 50 };
            const width = 600 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            // ... rest of your code
        } else {
            console.error("Dataset is not an array. Check the data structure.");
        }
    })
    .catch(function (error) {
        // Handle error if the data cannot be loaded
        console.error(error);
    });

});




/*    d => ({
            HighwayMpg: parseInt(d.HighwayMpg),
            Horsepower: parseInt(d.Horsepower),
        })*/


//////////////////////////////////////////////////
  const xScale = d3.scaleBand()
      .domain(d3.range(bardata.length))
      .range([0, innerWidth])
      .paddingInner(.1);

  const yScale = d3.scaleLinear()
      .domain([0, 400])  // use fixed y-scale if possible
      .range([innerHeight, 0])

  const xAxis = d3.axisBottom()
      .scale(xScale);

  const yAxis = d3.axisLeft()
      .scale(yScale);

  const bars = svg.append("g")
      .attr("id", "plot")
      .attr("transform", `translate (${margin.left}, ${margin.top})`)
    .selectAll("rect")
      .data(bardata);

  bars.enter().append("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", d => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d))
      .attr("fill", "blue");

  svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate (${margin.left}, ${h - margin.bottom})`)
      .call(xAxis);

  svg.append("g")
      .attr("class", "yAxis")
      .attr("transform", `translate (${margin.left}, ${margin.top})`)
      .call(yAxis);

// General Update Pattern

  function update(data) {

    xScale.domain(d3.range(data.length));

    const bars = svg.select("#plot")
        .selectAll("rect")
        .data(data);

    const paddingpix = xScale.padding()*xScale.bandwidth()/(1 - xScale.padding())

    bars.enter().append("rect")
        .attr("x", innerWidth + paddingpix)  // new bar on the right
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d))
        .attr("fill", "orange")
      .merge(bars)
      .transition()  // all bars more into place
      .duration(2000)
      .ease(d3.easeLinear)
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d))
      .transition() // all bars turn blue
      .duration(2000)
      .ease(d3.easeLinear)
        .attr("fill", "blue");

    bars.exit()
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
        .attr("x", innerWidth + paddingpix)
      .remove();

    svg.select(".xAxis")
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .call(xAxis);

  }


    function add() {
      const newvalue = Math.floor(Math.random()*400);
      bardata.push(newvalue);
      update(bardata);
    }

    function remove() {
      bardata.pop();
      update(bardata);
      };

