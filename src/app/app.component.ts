import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GraphVisualizerComponent } from './graph-visualizer/graph-visualizer.component';
import { KnowledgeGraphComponent } from './knowledge-graph/knowledge-graph.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GraphVisualizerComponent, KnowledgeGraphComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'kumar';
}
