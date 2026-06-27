import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function SectionLayoutLineChart({ features }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 70;
    const marginLeft = 60;

    const data = [
      { name: "text_VirtualSize", value: features.text_VirtualSize },
      { name: "text_SizeOfRawData", value: features.text_SizeOfRawData },
      { name: "rdata_VirtualAddress", value: features.rdata_VirtualAddress },
      { name: "rdata_PointerToRawData", value: features.rdata_PointerToRawData },
      { name: "SizeOfHeaders", value: features.SizeOfHeaders },
      { name: "SectionAlignment", value: features.SectionAlignment },
      { name: "EntryPoint", value: features.EntryPoint }
    ];

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    svg.selectAll("*").remove();

    const x = d3.scalePoint()
      .domain(data.map(d => d.name))
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height - marginBottom, marginTop]);

    const line = d3.line()
      .x(d => x(d.name))
      .y(d => y(d.value));

    // Tooltip div
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.7)")
      .style("color", "#fff")
      .style("padding", "6px 8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // X axis
    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end");

    // Y axis
    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call(g => g.select(".domain"))
      .call(g => g.selectAll(".tick line").clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Value"));

    // Line path
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    // Points with tooltip events
    svg.append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", d => x(d.name))
      .attr("cy", d => y(d.value))
      .attr("r", 5)
      .attr("fill", "steelblue")
      .on("mouseover", (event, d) => {
        tooltip.style("opacity", 1)
          .html(`<strong>${d.name}</strong><br/>Value: ${d.value}`);
      })
      .on("mousemove", (event) => {
        tooltip.style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    return () => {
      svg.selectAll("*").remove();
      tooltip.remove();
    };
  }, [features]);

  return <svg ref={svgRef}></svg>;
}
