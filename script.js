// U86364709

function main(){
    // d3 code goes here

    let stockData,
    stock,
    begDate,
    endDate,
    csvSelection; // stock variables

    const width = 600; // svg width
    const height = 600;// svg height

    d3.select('body') // create svg using dimension variables above
        .append('svg')
        .attr('width', width)
        .attr('height', height);



    d3.csv("data/mock_stock_data.csv").then(function(data){ //get data from csv file
        stockData = data
    });





    
    document.getElementById('stockControls').addEventListener('submit',(e)=>{ // get button and listen for action
        e.preventDefault(); //prevent page from auto loading

        stock = document.getElementById('selectStock').value;// stock variables -> html id
        begDate = document.getElementById('begDate').value;
        endDate = document.getElementById('endDate').value;

        // validate that beg date is before end date
        if(begDate >= endDate){
            alert("Date selection invalid! Beginning date must be before ending date.")
            return;
        }

        document.getElementById('stockControls').reset();

        csvSelection = stockData.filter((e)=>{return e.Stock === stock}) //select required data from csv

        for(let i=1;i<begDate;i++){csvSelection.shift()} // get beginning date from csv
        for(let i =5;i>endDate;i--){csvSelection.pop()} // get ending date from csv

        const stock_prices = csvSelection.map(({ Price })=>Number(Price));
        const stock_dates = csvSelection.map(({ Date })=>Date);



        const svg = d3.select('svg')
        svg.selectAll("*")
            .remove()

        const xScale = d3.scaleBand() // adding x axis
            .domain(stock_dates)
            .range([0,width-50])
            .padding(0.1);
        const xAxis = d3.axisBottom()
            .scale(xScale);

        const yScale = d3.scaleLinear() // adding y axis
            .domain([100,170])
            .range([height-50,0]);
        const yAxis = d3.axisLeft()
            .scale(yScale);

        svg.append('g')
            .attr('transform', `translate(50,10)`)
            .call(yAxis)
        svg.append('g')
            .attr('transform', `translate(50, ${(height-40)})`)
            .call(xAxis)

        svg.selectAll('.bar')
            .data(stock_prices)
            .enter()
            .append('rect')
            .attr('class', '.bar')
            .attr('x', function(d,i){
                return xScale(stock_dates[i])+50
            })
            .attr('y', function(d){
                return yScale(d)+10
            })
            .attr('width', xScale.bandwidth())
            .attr('height', function(d){
                return height-50-yScale(d)
            })
        
    });

    
}