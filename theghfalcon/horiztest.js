// https://insights.stackoverflow.com/survey/2018/#technology-most-loved-dreaded-and-wanted-languages
const sample = [
    {
      language: 'Antonio Brown',
      value: 59,
      color: '#000000',
      rec: 576
    },
    {
      language: 'DeAndre Hopkins',
      value: 45,
      color: '#00a2ee',
      rec: 476
    },
    {
      language: 'Odell Beckham Jr.',
      value: 44,
      color: '#fbcb39',
      rec: 390
    },
    {
      language: 'Mike Evans',
      value: 40,
      color: '#007bc8',
      rec: 395
    },
    {
      language: 'Davante Adams',
      value: 39,
      color: '#65cedb',
      rec: 348
    }
  ];

  const svg = d3.select('svg');
  const svgContainer = d3.select('#container');
  
  const margin = 80;
  const width = 1000 - 2 * margin;
  const height = 600 - 2 * margin;

  const chart = svg.append('g')
    .attr('transform', `translate(${margin+60}, ${margin-20})`);

  const yScale = d3.scaleBand()
    .range([0, height])
    .domain(sample.map((s) => s.language))
    .padding(0.4)
  
  const xScale = d3.scaleLinear()
    .domain([0, 75])
    .range([0, width])
    
  // vertical grid lines
  const makeXLines = () => d3.axisBottom()
    .scale(xScale)
    /*g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))*/

    



  chart.append('g')
    //.attr('transform', `translate(0, ${height})`)
    .call(d3.axisLeft(yScale));

  chart.append('g')
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  // vertical grid lines
  chart.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0, ${height})`)
    .call(makeXLines()
      .tickSize(-height, 0, 0)
      .tickFormat('')
  )

 

  const barGroups = chart.selectAll()
    .data(sample)
    .enter()
    .append('g')

  barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('y', (g) => yScale(g.language))
    .attr('x', 0)//(g) => xScale(g.value))
    .attr('width', (g) => xScale(g.value))
    .attr('height', yScale.bandwidth())
    .on('mouseenter', function (actual, i) {
      d3.selectAll('.value')
        .attr('opacity', 0)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.6)
        .attr('y', (a) => yScale(a.language) - 5)
        .attr('height', yScale.bandwidth() + 10)

      const x = xScale(actual.value)

      /*line = chart.append('line')
        .attr('id', 'limit')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', width)
        .attr('y2', y)*/
//changes tooltip data label DURING hover
      barGroups.append('text')
        .attr('class', 'divergence')
        .attr('y', (a) => 4 + yScale(a.language) + yScale.bandwidth() / 2)
        .attr('x', (a) => xScale(a.value)- 60)
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .text((a, idx) => {
          const divergence = (a.value - actual.value).toFixed(0)
          
          let text = ''
          if (divergence > 0) text += '+'
          text += `${divergence} TDs`

          return idx !== i ? text : '';
        })

    })
    .on('mouseleave', function () {
      d3.selectAll('.value')
        .attr('opacity', 1)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 1)
        .attr('y', (a) => yScale(a.language))
        .attr('height', yScale.bandwidth())

      chart.selectAll('#limit').remove()
      chart.selectAll('.divergence').remove()
    })
//changes initial data label before hover
  barGroups 
    .append('text')
    .attr('class', 'value')
    .attr('y', (a) => 4 + yScale(a.language) + yScale.bandwidth() / 2)
    .attr('x', (a) => xScale(a.value)- 40)
    .attr('text-anchor', 'middle')
    .text((a) => `${a.value} TDs`)
  
  svg
    .append('text')
    .attr('class', 'label')
    .attr('y', height + margin*1.5)
    .attr('x', width / 2 +margin)
    //.attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Touchdown Receptions')

  svg.append('text')
    .attr('class', 'label')
    .attr('x', -height/2 - margin)
    .attr('y', 20)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('')

  svg.append('text')
    .attr('class', 'title')
    .attr('y', 40)
    .attr('x', width / 2 + margin)
    .attr('text-anchor', 'middle')
    .text('Most Receiving Touchdowns (2014-2018)')

  svg.append('text')
    .attr('class', 'source')
    .attr('y', height + margin * 1.7)
    .attr('x', width - margin / 2)
    .attr('text-anchor', 'start')
    .text('Source: Pro Football Reference, 2019')


    svg.append('text')
        .attr('class', 'byline')
        .attr('y', height + margin *1.7)
        .attr('x', width / 12 )
        .attr('text-anchor', 'middle')
        .text('By: Geoffrey Dean')
