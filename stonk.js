// const apikey = 'KH6ZNDXL2NPIGFV2'
// const http = new XMLHttpRequest();
// const url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey="+apikey;
// console.log(http)
// http.open("GET", url);
// http.send();

// http.onreadystatechange = (e) => {
//     // console.log(http.response)
//     res = JSON.parse(http.responseText);
//     console.log(res);
//     for(var day in res["Time Series (Daily)"]){
//         document.write(day + ': ' + res["Time Series (Daily)"][day]['1. open'] + '<br/>');
//     }
// }

const loadData = d3.json('sample-data.json').then(data => {
    const chartResultsData = data['chart']['result'][0];
    const quoteData = chartResultsData['indicators']['quote'][0];
  
    return chartResultsData['timestamp'].map((time, index) => ({
        date: new Date(time * 1000),
        high: quoteData['high'][index],
        low: quoteData['low'][index],
        open: quoteData['open'][index],
        close: quoteData['close'][index],
        volume: quoteData['volume'][index]
    }));
});

const responsivefy = svg => {
    // get container + svg aspect ratio
    const container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style('width')),
      height = parseInt(svg.style('height')),
      aspect = width / height;
  
    // get width of container and resize svg to fit it
    const resize = () => {
      var targetWidth = parseInt(container.style('width'));
      svg.attr('width', targetWidth);
      svg.attr('height', Math.round(targetWidth / aspect));
    };
  
    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('perserveAspectRatio', 'xMinYMid')
      .call(resize);
  
    // to register multiple listeners for same event type,
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on('resize.' + container.attr('id'), resize);
};

const initialiseChart = data => {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = window.innerWidth - margin.left - margin.right;
    const height = window.innerHeight - margin.top - margin.bottom; 
    // add SVG to the page
    const svg = d3
        .select('#chart')
        .append('svg')
        .attr('width', width + margin['left'] + margin['right'])
        .attr('height', height + margin['top'] + margin['bottom'])
        .call(responsivefy)
        .append('g')
        .attr('transform', `translate(${margin['left']},  ${margin['top']})`);


    const xMin = d3.min(data, d => {
        return d['date'];
    });
    const xMax = d3.max(data, d => {
        return d['date'];
    });
    const yMin = d3.min(data, d => {
        return d['close'];
    });
    const yMax = d3.max(data, d => {
        return d['close'];
    });

    const xScale = d3
        .scaleTime()
        .domain([xMin, xMax])
        .range([0, width]);
    const yScale = d3
        .scaleLinear()
        .domain([yMin - 5, yMax])
        .range([height, 0]);
    svg
        .append('g')
        .attr('id', 'xAxis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));
    svg
        .append('g')
        .attr('id', 'yAxis')
        .attr('transform', `translate(${width}, 0)`)
        .call(d3.axisRight(yScale));
    
    const line = d3
        .line()
        .x(d => {
            return xScale(d['date']);
        })
        .y(d => {
            return yScale(d['close']);
        });
      // Append the path and bind data
    svg
       .append('path')
       .data([data])
       .style('fill', 'none')
       .attr('id', 'priceChart')
       .attr('stroke', 'steelblue')
       .attr('stroke-width', '1.5')
       .attr('d', line);
}

loadData.then(data => {
    initialiseChart(data);
  });
  