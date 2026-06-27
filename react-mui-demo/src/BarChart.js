import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function SummaryBarChart({ features }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const barHeight = 25;
    const marginTop = 40;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 120;
    const width = 928;

    // ✅ Summary stats instead of section layout
    const data = [
      { name: "SizeOfInitializedData", value: features.SizeOfInitializedData },
      { name: "SizeOfUninitializedData", value: features.SizeOfUninitializedData }
    ];

    const height = Math.ceil((data.length + 0.1) * barHeight) + marginTop + marginBottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    svg.selectAll("*").remove();

    // X scale
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([marginLeft, width - marginRight]);

    // Y scale
    const y = d3.scaleBand()
      .domain(data.sort((a, b) => b.value - a.value).map(d => d.name))
      .rangeRound([marginTop, height - marginBottom])
      .padding(0.1);

    // Bars
    svg.append("g")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", x(0))
      .attr("y", d => y(d.name))
      .attr("width", d => x(d.value) - x(0))
      .attr("height", y.bandwidth());

    // Labels inside bars
    svg.append("g")
      .attr("fill", "white")
      .attr("text-anchor", "end")
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("x", d => x(d.value))
      .attr("y", d => y(d.name) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("dx", -4)
      .text(d => d.value)
      .call(text => text.filter(d => x(d.value) - x(0) < 30)
        .attr("dx", +4)
        .attr("fill", "black")
        .attr("text-anchor", "start"));

    // X axis
    svg.append("g")
      .attr("transform", `translate(0,${marginTop})`)
      .call(d3.axisTop(x).ticks(width / 80))
      .call(g => g.select(".domain").remove())
      .append("text")
      .attr("x", width - marginRight)
      .attr("y", -30)
      .attr("fill", "currentColor")
      .attr("text-anchor", "end")
      .text("Counts / Data size →");

    // Y axis
    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .append("text")
      .attr("x", -marginLeft)
      .attr("y", 15)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("Summary feature ↑");

  }, [features]);

  return <svg ref={svgRef}></svg>;
}
