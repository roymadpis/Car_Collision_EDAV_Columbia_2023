
    // Load the data from the provided GitHub link
    const dataUrl = "https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/mean_crash_per_day_over_years.csv";

    d3.csv(dataUrl)
      .then(data => {
        // Convert strings to numbers
        data.forEach(d => {
          d.total_crash = +d.total_crash;
          d.day_only = +d.day_only;
        });

        // Set up the dimensions for the chart
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create an SVG element
        const svg = d3.select("body")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        // Set up scales
        const xScale = d3.scaleLinear().domain([1, 31]).range([0, width]);
        const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.total_crash)]).range([height, 0]);

        // Set up color scale based on months
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Group data by month
        const groupedData = d3.group(data, d => d.Month);

        // Draw lines
        const lines = svg.selectAll("path")
          .data(groupedData)
          .enter()
          .append("path")
          .attr("d", d => {
            return d3.line()
              .x(d => xScale(d.day_only))
              .y(d => yScale(d.total_crash))
              (d[1]);
          })
          .attr("stroke", (d, i) => colorScale(d[0]))
          .attr("stroke-width", 2)
          .attr("fill", "none")
          .attr("display", "initial");

        // Draw points
        const points = svg.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", d => xScale(d.day_only))
          .attr("cy", d => yScale(d.total_crash))
          .attr("r", 5) // Adjust the radius as needed
          .attr("fill", d => colorScale(d.Month))
          .attr("display", "initial");

        // Add buttons
        const buttons = d3.select("body")
          .append("div")
          .selectAll("button")
          .data([...groupedData.keys()])
          .enter()
          .append("button")
          .attr("class", "button")
          .text(d => d)
          .on("click", toggleVisibility);

        // Toggle visibility function
        function toggleVisibility(selectedMonth) {
          const isActive = this.classList.toggle("active");

          // Update lines and points visibility based on the button's activity
          lines.filter(d => d[0] === selectedMonth)
            .attr("display", isActive ? "none" : "initial");
          points.filter(d => d.Month === selectedMonth)
            .attr("display", isActive ? "none" : "initial");
        }

      })
      .catch(error => console.error("Error loading data:", error));
