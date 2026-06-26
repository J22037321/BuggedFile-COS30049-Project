import { useEffect, useRef } from "react";
import * as d3 from "d3";

const data = [
    { name: "Apples", value: 300 },
    { name: "Bananas", value: 150 },
    { name: "Cherries", value: 100 },
    { name: "Dates", value: 80 },
];

export default function PieChart() {
    const svgRef = useRef(null);
    const width = 450;
    const height = Math.min(width, 500);

    useEffect(() => {

        const svg = d3.select(svgRef.current)  // ✅ use the ref, don't recreate
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

        svg.selectAll("*").remove(); // ✅ clear before redraw

        const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

        const pie = d3.pie().sort(null).value(d => d.value);
        const arc = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2 - 1);
        const labelRadius = arc.outerRadius()() * 0.8;
        const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
        const arcs = pie(data);

        svg.append("g")
        .attr("stroke", "white")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
        .append("title")
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString("en-US")}`);

        svg.append("g")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        .call(text => text.append("tspan")
            .attr("y", "-0.5em")
            .attr("font-weight", "bold")
            .attr("font-size", "12px")
            .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .attr("font-size", "10px")
            .text(d => d.data.value.toLocaleString("en-US")));

        return () => svg.selectAll("*").remove(); // ✅ proper cleanup
    }, []);

    return <svg ref={svgRef} width={width} height={height} />; // ✅ match D3 dimensions
}