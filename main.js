
 async function getData(){
     let response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json");
     let data = await response.json();

     return data;

}

getData().then((data)=>{
    createChart(data);
}).catch((error)=>{
    console.log(error);
})

let createChart = (data)=>{
    let requiredData = [];

    let svg = d3.select('.chart')
                .attr('width',850)
                .attr('height',650);

                svg.append('text')
                   .attr('transform','rotate(-90)')
                   .attr('x',-200)
                   .attr('y',13)
                   .style('font-size',18)
                   .style('fill','orange')
                   .text("Time in Minutes");
                

                let xScale=d3.scaleLinear()
                             .domain([d3.min(data,(d)=>{
                                 return d.Year - 1;
                             }),d3.max(data,(d)=>{
                                 return d.Year + 1;
                             })])
                             .range([0,750]);
                
                var tooltip=d3.select('body')
                              .append('div')
                              .attr('id','tooltip')
                              .style('background','orangered')
                              .style('opacity',0);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

                let yScale=d3.scaleTime()
                             .domain(d3.extent(data,(d)=>{
                                 var parsedTime = d.Time.split(':');
                                 d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
                                 return d.Time;
                             }))
                             .range([0,500]);

                var timeFormat = d3.timeFormat("%M:%S");


                let xAxis=d3.axisBottom(xScale).tickFormat(d3.format("d"));
                let yAxis=d3.axisLeft(yScale).tickFormat(timeFormat);
                
                
                svg.append('g')
                   .attr('id','x-axis')
                   .attr('transform','translate(50,550)')
                   .call(xAxis)
                
                svg.append('g')
                   .attr('id','y-axis')
                   .attr('transform','translate(50,50)')
                   .call(yAxis)

                var chart=svg.selectAll('circle')
                             .data(data)
                             .enter()
                             .append('circle')
                             .attr('class','dot')
                             .attr('data-xvalue',(d)=>{
                                 return d.Year;
                             })
                             .attr('data-yvalue',(d)=>{
                                 return d.Time;
                             })
                             .attr('cx',(d)=>{
                                 return xScale(d.Year);
                             })
                             .attr('cy',(d)=>{
                                 return yScale(d.Time)
                             })
                             .attr('r','8')
                             .attr('fill',(d)=>{
                                 return color(d.Doping !== '');
                             })
                             .attr('transform','translate(50,50)')
                             .on('mouseover',(d)=>{

                                tooltip.style('opacity',0.8)
                                       .attr('data-year',d.Year);

                                tooltip.html(d.Name + ": " + d.Nationality + "<br/>"
                                     + "Year: " + d.Year + ", Time: " + timeFormat(d.Time)
                                     + (d.Doping ? "<br/><br/>" + d.Doping : ""))
                                     .style("left", (d3.event.pageX)+ 15+ "px")
                                     .style("top", (d3.event.pageY)+15 + "px")

                             })
                             .on('mouseout',(d)=>{
                                 tooltip.style('opacity',0);
                             });
                            
                            var title=svg.append('g')
                                         .attr('id','title');

                             title.append('text')
                                .attr('x', 200)
                                .attr('y', 25)
                                .attr('width', 20)
                                .attr('height', 20)
                                .attr('fill', 'orange')
                                .style('font-size','35')
                                .text('Doping in Professional Bicycle Racing')

                            title.append('text')
                                .attr('x', 350)
                                .attr('y', 45)
                                .attr('width', 20)
                                .attr('height', 20)
                                .attr('fill', 'orange')
                                .style('font-size', '15')
                                .text("35 Fastest times up Alpe d'Huez'")

                            var legend=svg.append('g')
                                          .attr('id','legend');
                                          
                             legend.append('text')
                                .attr('x',600)
                                .attr('y',200)
                                .text('No Doping allegations')
                                .attr('fill','orange')

                            legend.append('rect')
                                .attr('x',750)
                                .attr('y',185)
                                .attr('width',20)
                                .attr('height',20)
                                .attr('fill','orange')


                            legend.append('text')
                                .attr('x', 600)
                                .attr('y', 230)
                                .text('No Doping allegations')
                                .attr('fill', 'blue')

                            legend.append('rect')
                                .attr('x', 750)
                                .attr('y', 215)
                                .attr('width', 20)
                                .attr('height', 20)
                                .attr('fill', 'blue')


}