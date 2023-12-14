const dataUrls = {
    'January': 'https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/data_for_d3/Jan_data.csv',
    'February': 'https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/data_for_d3/Feb_data.csv',
    'March': 'https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/data_for_d3/March_data.csv',
    'April': 'https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/data_for_d3/April_data.csv',
    'May': 'https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/data_for_d3/May_data.csv',
    'June': 'https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/data_for_d3/June_data.csv',
    'July': 'https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/data_for_d3/July_data.csv',
    'August': 'https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/data_for_d3/August_data.csv',
    'September': 'https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/data_for_d3/September_data.csv',
    'October': 'https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/data_for_d3/October_data.csv',
    'November': 'https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/data_for_d3/November_data.csv',
    'December': 'https://raw.githubusercontent.com/roymadpis/Car_Collision_EDAV_Columbia_2023/main/data/data_for_d3/December_data.csv'
};

const monthColors = {
    'January': 'steelblue',
    'February': 'darkorange',
    'March': 'forestgreen',
    'April': 'DarkMagenta',
    'May': 'brown',
    'June': 'teal',
    'July': 'indigo',
    'August': 'red',
    'September': 'DeepPink',
    'October': 'yellow',
    'November': 'DarkOliveGreen',
    'December': 'blue'
};

let visibleMonths = ['January']; // Initial visible months

// Load initial data
loadData();

// Load data from CSV
function loadData() {
    const urls = Object.entries(dataUrls).filter(([month]) => visibleMonths.includes(month));

    Promise.all(urls.map(([month, url]) => d3.csv(url))).then(data => {
        const allData = data.flat(); // Combine data for all visible months

        // Parse data types if needed
        allData.forEach(d => {
            d.day_only = +d.day_only;
            d.total_crash = +d.total_crash;
        });

        // Create SVG container
        const margin = { top: 20, right: 20, bottom: 60, left: 70 };
        const plotWidth = 850; // Adjust the plot width as needed
        const legendWidth = 200; // Adjust the legend width as needed
        const width = plotWidth + legendWidth + margin.left + margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select("#chart")
            .html("") // Clear previous content
            .append("svg")
            .attr("width", width)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Create scales
        const xScale = d3.scaleLinear()
            .domain([1, 31]) // Assuming days go from 1 to 31
            .range([0, plotWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(allData, d => d.total_crash)])
            .range([height, 0]);

        // Create axes
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")); // Format ticks as integers
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        // Create color scale for months
        const colorScale = d3.scaleOrdinal().domain(Object.keys(monthColors)).range(Object.values(monthColors));

        // Create scatter plot points
        const points = svg.selectAll("circle")
            .data(allData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.day_only))
            .attr("cy", d => yScale(d.total_crash))
            .attr("r", 5) // Adjust the radius as needed
            .attr("fill", d => colorScale(d.Month))
            .attr("opacity", 0.7)
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip);

        // Create lines for each month
        const line = d3.line()
            .x(d => xScale(d.day_only))
            .y(d => yScale(d.total_crash));

        const paths = svg.selectAll(".line")
            .data(d3.groups(allData, d => d.Month))
            .enter()
            .append("path")
            .attr("class", d => `line ${visibleMonths.includes(d[0]) ? 'visible' : 'hidden'}`)
            .attr("d", d => line(d[1]))
            .attr("stroke", d => colorScale(d[0]))
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .attr("opacity", 0.5);

        // Legend
        const legend = svg.selectAll(".legend")
            .data(colorScale.domain())
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => "translate(" + (plotWidth + 10) + "," + (i * 20) + ")");

        legend.append("rect")
            .attr("x", 0)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", colorScale);

        legend.append("text")
            .attr("x", 25)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(d => d);

        // Axis labels
        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 35) + ")")
            .style("text-anchor", "middle")
            .text("Day of Month");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Average Crashes");

        // Tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

       function showTooltip(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 2.5);

            tooltip.html(`${d.Month}<br>Day: ${d.day_only}<br>Average Crashes: ${d.total_crash.toFixed(2)}`)
                .style("left", width / 1.1 + "px" ) // Center the tooltip horizontally
                .style("top", height + margin.top + margin.bottom + 10 + 20 + "px")
                .style("font-size", "17px");

        }

        function hideTooltip() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        }

        // Button functionality
        const buttons = d3.select("#buttons")
            .selectAll("button")
            .data(Object.keys(dataUrls))
            .enter()
            .append("button")
            .text(d => d)
            .style("background-color", d => visibleMonths.includes(d) ? colorScale(d) : "gray")
            .on("click", function (event, d) {
                const button = d3.select(this);
                const index = visibleMonths.indexOf(d);

                if (index === -1) {
                    visibleMonths.push(d);
                    button.style("background-color", colorScale(d));
                } else {
                    visibleMonths.splice(index, 1);
                    button.style("background-color", "gray");
                }


                // Reload data and update visualization
                loadData();
            });

    }).catch(error => {
        console.error("Error loading data:", error);
    });
}

