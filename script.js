const margin = { t: 50, r: 50, b: 50, l: 50 };
const size = { w: 1000, h: 800 };

const svg = d3.select('svg#sankey');
svg.attr('width', size.w)
    .attr('height', size.h);

const containerG = svg.append('g')
    .classed('container', true)
    .attr('transform', `translate(${margin.t}, ${margin.l})`);

size.w = size.w - margin.l - margin.r;
size.h = size.h - margin.t - margin.b;

d3.json('data/energy.json')
    .then(function (data) {
        console.log(data);
        // { name: '', id: 0 }
        let newnodes = data.nodes.map((d, i) => {
            d.id = i;
            return d;
        }); 
        console.table(newnodes);
        data.nodes = newnodes;
        drawSankey(data);
    });

//FUNCTIONS
function drawSankey(data) {
    console.log(data);

    let sankeyLayout = d3.sankey() //won't change anything to x, y coords but will help multiply arrays. d3 does not have sankey built in
        .nodeId(d => d.id)
        .nodeAlign(d3.sankeyJustify) //d3.leftAlign/rightAlign/Centered
        .nodeWidth(15)
        .nodePadding(15)
        .extent([[0, 0], [size.w, size.h]]);

    console.log(data);
    let sankey = sankeyLayout(data); //sankeyLayout adds x y values to our network data. expected input is nodes, links, nodeID, and links should have the values 

    console.log(data);

    containerG.selectAll('rect')
        .data(sankey.nodes)
        .join('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0);

    //adding the links
    containerG.selectAll('path')
        .data(sankey.links)
        .join('path')
        .attr('d', d3.sankeyLinkHorizontal())
        .attr('stroke-width', d => d.width);

    containerG.selectAll('text')
        .data(sankey.nodes)
        .join('text')
        .text(d => d.name + i)
        .attr('transform', d => `translate(${d.x0}, ${d.y0})`); //change height here to thin or thicken the bars; can rotate here too e.g. rotate(90)

}
