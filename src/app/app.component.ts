import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GraphVisualizerComponent } from './graph-visualizer/graph-visualizer.component';
import { KnowledgeGraphComponent } from './knowledge-graph/knowledge-graph.component';
import { GraphService } from './graph.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GraphVisualizerComponent, KnowledgeGraphComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [GraphService]
})
export class AppComponent {
  title = 'kumar';
}
