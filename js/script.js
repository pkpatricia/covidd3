const WIDTH = 1200;
const HEIGHT = 600;

// set width and height of svg
d3.select('svg')
    .style('width', WIDTH)
    .style('height', HEIGHT);

// Get the data
d3.json("https://api.covidtracking.com/v1/states/current.json").then(function(data) {

    // Sort the Data from Largest to Smallest
    data.sort(function(a, b) {
        return ( ((b.positive / b.totalTestResults) * 100 ) - ((a.positive / a.totalTestResults) * 100 ))
    });

        d3.select('svg').selectAll('rect')
            .data(data)
            .enter()
            .append("rect");
        var yScale = d3.scaleLinear(); //create a linear scale
        yScale.range([HEIGHT, 0]); //set its visual range to 600 -> 0 (remember bottom of svg is 600px down from top)
        var yMin = d3.min(data, function(datum, index){ //get the minimum y data value...
            return (datum.positive / datum.totalTestResults) * 100; //by looking at the count property of each datum
        })
        var yMax = d3.max(data, function(datum, index){ //get the maximum y data value...
            return (datum.positive / datum.totalTestResults) * 100; //by looking at the count property of each datum
        })
        yScale.domain([yMin-1, yMax]); //set the domain of yScale from yMin and yMax
        d3.selectAll('rect') //find all rectangles
            .attr('height', function(datum, index){ //set the height of each rectangle...
                //...by getting the count property of each datum
                //converting it to a visual value, using yScale
                //(remember, when using yScale as it is set up, a large data value will give you a small visual value and vice versa)
                //then subtract that value from HEIGHT
                //this will make a large bar for a large data value
                return HEIGHT-yScale((datum.positive / datum.totalTestResults) * 100);
            });
        var xScale = d3.scaleLinear(); //create the xScale
        xScale.range([0, WIDTH]); //set the range to 0->1200
        xScale.domain([0, data.length]); //set the domain from 0 to the number of data elements retrieved
        d3.selectAll('rect') //select all rectangles
            .attr('x', function(datum, index){ //set the x position of each rectangle...
                return xScale(index);//by converting the index of the element in the array to a point between 0->800
            });
        d3.selectAll('rect') //select all rectangles
            .attr('y', function(datum, index){ //set the y position of each rectangle...
                //by converting the count property of the datum to a visual value
                //(remember, when using yScale as it is set up, a large data value will give you a small visual value and vice versa)
                return yScale((datum.positive / datum.totalTestResults) * 100);
            });
        d3.selectAll('rect') //select all rectangles
            .attr('width', WIDTH/data.length); //set the width of all rectangles to be the width of the SVG divided by the number of data elements
        var yDomain = d3.extent(data, function(datum, index){ //set the y domain by getting the min/max with d3.extent
            return (datum.positive / datum.totalTestResults) * 100; //... and examining the count property of each datum
        })
        var colorScale = d3.scaleLinear();//create a linear scale
        colorScale.domain(yDomain) //the domain is the yDomain
        colorScale.range(['#00cc00', 'blue']) //the visual range goes from green->blue
        d3.selectAll('rect') //select all rectangles
            .attr('fill', function(datum, index){ //set the fill of each rectangle
                return colorScale((datum.positive / datum.totalTestResults) * 100) //by converting the count property of the datum to a color
            })
        var leftAxis = d3.axisLeft(yScale); //create a left axis generator using the yScale
        d3.select('svg') //select the svg
            .append('g').attr('id', 'left-axis') //append a <g> tag to it with id=left-axis
            .call(leftAxis); // create a left axis within that <g>
        var skillScale = d3.scaleBand(); //create a scale band that will map skills to horizontal positions
        var skillDomain = data.map(function(location){ //create an array of skill strings
            return location.state
        });
        skillScale.range([0, WIDTH]); //set the range of the skillScale to 0->1200
        skillScale.domain(skillDomain); //set the domain to be the array of skill strings
        var bottomAxis = d3.axisBottom(skillScale); //create a bottom axis generator that uses the skillScale
        d3.select('svg') //select the svg
            .append('g').attr('id', 'bottom-axis') //append a <g> tag to it with id=bottom-axis
            .call(bottomAxis) // create a bottom axis within that <g>
            .attr('transform', 'translate(0,'+HEIGHT+')'); //move it to the bottom of the svg

});


