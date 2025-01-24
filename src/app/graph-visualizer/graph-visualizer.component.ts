import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { GraphService } from '../graph.service';


@Component({
  selector: 'app-graph-visualizer',
  template: `
    <div class="graph-container">
      <svg #graphSvg></svg>
    </div>
  `,
  styles: [
    `
      .graph-container {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      svg {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class GraphVisualizerComponent implements OnInit {
  private nodes: any[] = [];
  private links: any[] = [];
  
  // private graphData = {
  //   nodes: [
  //     { id: '1', label: 'Node 1' },
  //     { id: '2', label: 'Node 2' },
  //     { id: '3', label: 'Node 3' },
  //   ],
  //   links: [
  //     { source: '1', target: '2' },
  //     { source: '2', target: '3' },
  //     { source: '3', target: '1' },
  //   ],
  // };

  constructor (private graphService: GraphService) {}

  ngOnInit(): void {
    this.loadGraph();
  }

  private async loadGraph(): Promise<void> {

    this.nodes = await this.graphService.getNodesByLabel('Person')
    this.links = await this.graphService.getRelationshipsByNodeId('1')
    this.createGraph();
  }

  private createGraph(): void {
    const svg = d3.select('svg');
    const width = parseInt(svg.style('width'));
    const height = parseInt(svg.style('height'));

    const simulation = d3.forceSimulation(this.nodes as any)
      .force('link', d3.forceLink(this.links as any).id((d: any) => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.links)
      .enter()
      .append('line')
      .attr('stroke-width', 2)
      .attr('stroke', '#999');

    const node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.nodes)
      .enter()
      .append('circle')
      .attr('r', 10)
      .attr('fill', '#69b3a2')
      .call(
        () => d3.drag<Element, any>()
          .on('start', (event, d: any) => this.dragStarted(event, d, simulation))
          .on('drag', (event, d: any) => this.dragged(event, d))
          .on('end', (event, d: any) => this.dragEnded(event, d, simulation))
      );

    const labels = svg
      .append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(this.nodes)
      .enter()
      .append('text')
      .attr('dy', -15)
      .attr('dx', -10)
      .attr('font-size', '12px')
      .attr('fill', '#333')
      .text((d: any) => d.label);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => {
          console.log(d.source, 'soruce', d.source.x, 'd', d)
          return d.source.x;
        })
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

      labels.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y);
    });
  }

  private dragStarted(event: any, d: any, simulation: any): void {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(event: any, d: any): void {
    d.fx = event.x;
    d.fy = event.y;
  }

  private dragEnded(event: any, d: any, simulation: any): void {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}
