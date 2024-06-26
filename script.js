// U86364709

function main(){
    // d3 code goes here

    let stockData,
    stock,
    begDate,
    endDate,
    csvSelection; // ^stock variables

    const width = 600, 
    height = 600;// <^ svg width/height according to guidelines

    d3.select('body').append('svg').attr('width', width).attr('height', height);// create svg using dimension variables above

    d3.csv("data/mock_stock_data.csv").then(function(data){stockData = data}); // get data from csv file

    document.getElementById('stockControls').addEventListener('submit',(e)=>{ // get button and listen for action
        e.preventDefault() //prevent page from auto loading
        function reset(){
            d3.select(this).attr('class', 'bar')
            d3.select('#tooltip').classed('hidden', true);
        }// reset action

        stock = document.getElementById('selectStock').value// stock variables -> html id
        begDate = document.getElementById('begDate').value // begDate variables -> html id
        endDate = document.getElementById('endDate').value // endDate variables -> html id

        // validate that beg date is before end date
        if(begDate >= endDate){alert("Date selection invalid! Beginning date must be before ending date."); return;}

        document.getElementById('stockControls').reset(); 

        csvSelection = stockData.filter((el)=>{return el.Stock === stock;}) //select required data from csv
        for(let i=1;i<begDate;i++){csvSelection.shift()} // get beginning date from csv
        for(let i =5;i>endDate;i--){csvSelection.pop()} // get ending date from csv

        const stock_prices = csvSelection.map(({ Price })=>Number(Price)), // maping through csv file to get price/date
        stock_dates = csvSelection.map(({ Date })=>Date);


        const svg = d3.select('svg')
        svg.selectAll("*").remove()//all from svg

        // adding x axis characteristics
        const xScale = d3.scaleBand().domain(stock_dates).range([0,width-40]).padding(0.1),
        xAxis = d3.axisBottom().scale(xScale);

        // adding y axis characteristics
        const yScale = d3.scaleLinear().domain([100,160]).range([height-40,0]),
        yAxis = d3.axisLeft().scale(yScale);

        // calling x/y axis
        svg.append('g').attr('transform', `translate(50,10)`).call(yAxis)
        svg.append('g').attr('transform', `translate(50, ${(height-40)})`).call(xAxis)

        svg.selectAll('.bar')
            .data(stock_prices).enter().append('rect')
            .attr('class', 'bar')
            .attr('x', function(d,i){return xScale(stock_dates[i])+40}).attr('y', function(d){return yScale(d)+8})
            .attr('width', xScale.bandwidth()).attr('height', function(d){return height-45-yScale(d)})
            .on('mouseover',function(e,d){highlight(e,d,this,stock_dates,stock_prices);}) // mouseover highlight/tooltip
            .on('mouseout', reset) // mouseout -> reset function 

        function highlight(e,d, el, stock_dates,stock_prices){
            const xPosition = parseFloat(d3.select(el).attr('x')), //converting
            yPosition = parseFloat(d3.select(el).attr('y')),//converting
            i = stock_prices.indexOf(d),
            stock_price = stock_prices[i],
            stock_date = stock_dates[i];

            d3.select('#tooltip') // text for hover tool tipinformation
                .style('left', xPosition+'px').style('top', yPosition+'px')
                .select('#ttText').html(`Stock: ${stock}   Date: ${stock_date}   Price: ${stock_price}`)
            d3.select('#tooltip').classed('hidden',false)
            d3.select(el).attr('class', 'hightlight')

        }
    });
}