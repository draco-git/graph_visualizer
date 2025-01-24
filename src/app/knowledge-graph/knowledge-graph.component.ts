import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { GraphService } from '../graph.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-knowledge-graph',
  templateUrl: './knowledge-graph.component.html',
  styleUrls: ['./knowledge-graph.component.css'],
  providers: [ApiService],
})
export class KnowledgeGraphComponent implements OnInit {
  private nodes: any[] = [];
  private links: any[] = [];
  private url = '/jsonRes/getNodesByLabel.json';

  constructor(
    private el: ElementRef,
    private graphService: GraphService,
    private http: HttpClient,
    private api: ApiService
  ) {}

  ngOnInit() {
    // Define the graph data
    // this.http.get<{ nodes: any[] }>(this.url).subscribe((data) => {
    //   console.log('nodes', data)
    //   return this.nodes = data.nodes;
    // })

    this.api.getNodesByLabel().then((response) => {
      console.log('res', response.data.result[0].nodes);
      this.nodes = response.data.result[0].nodes;
      this.loadGraph(this.nodes);
    });
  }

  loadGraph(nodes: any[]) {
    const data = {
      nodes,
      links: [
        { source: 'Node 1', target: 'Node 2' },
        { source: 'Node 2', target: 'Node 3' },
        { source: 'Node 3', target: 'Node 1' },
      ],
    };

    console.log('data', data);

    // Set up the SVG container dimensions
    const width = 1080;
    const height = 1080;

    const svg = d3
      .select(this.el.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const labelGroup = svg.append('g').attr('class', 'labels-group');

    // Create a force simulation
    const simulation = d3
      .forceSimulation(data.nodes as any)
      .force(
        'link',
        d3
          .forceLink(data.links)
          .id((d: any) => d.id)
          .distance(200)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create links
    const link = svg
      .append('g')
      .selectAll('.link')
      .data(data.links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#aaa')
      .attr('stroke-width', 2);

    // Create nodes
    const node = svg
      .append('g')
      .selectAll('.node')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 20)
      .attr('fill', 'steelblue')
      .call(
        // @ts-ignore
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      )
      .on('mouseover', function (event, d) {
        showLabel(d, event);
      })
      .on('mouseout', function () {
        hideLabel();
      })
      .on('click', function (event, d) {
        toggleLabel(d, event);
      });

    // Add labels to nodes

    // Update positions on each simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

      labelGroup
        .selectAll('.hover-label, .click-label')
        .attr('x', (d: any) => d.x + 25)
        .attr('y', (d: any) => d.y + 5);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = event.x; // Fix the node's x position
      d.fy = event.y; // Fix the node's y position
    }

    // Display label

    function showLabel(d: any, event: any) {
      labelGroup
        .append('text')
        .attr('class', 'hover-label')
        .attr('x', d.x + 25) // Adjust horizontal offset
        .attr('y', d.y + 5) // Adjust vertical offset
        .text(d.label || 'No Data') // Replace 'property' with your property key
        .style('font-size', '12px')
        .style('fill', 'black');
    }

    // Function to hide label on mouseout
    function hideLabel() {
      labelGroup.selectAll('.hover-label').remove();
    }

    // Function to toggle label visibility on click
    function toggleLabel(d: any, event: any) {
      const existingLabel = labelGroup.select(
        `.click-label[data-id="${d.id}"]`
      );
      if (!existingLabel.empty()) {
        existingLabel.remove(); // Remove the label if it already exists
      } else {
        labelGroup
          .append('text')
          .attr('class', 'click-label')
          .attr('data-id', d.id) // Use a unique identifier for each label
          .attr('x', d.x + 25)
          .attr('y', d.y + 5)
          .text(d.label || 'No Data')
          .style('font-size', '12px')
          .style('fill', 'black');
      }
    }
  }
}
