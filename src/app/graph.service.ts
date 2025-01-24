import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private apiUrl = 'http://localhost:3000/neo4j'; 

  constructor() { }
  async getNodesByLabel(label: string): Promise<any> {
    try {
      // const response: AxiosResponse = await axios.get(`${this.apiUrl}/nodes/${label}`);
      const response: AxiosResponse = await axios.get('https://mocki.io/v1/df0bc01d-ffd9-424b-8b7f-daebd0eb18bd');
      console.log('called', response.data.nodes)
      return response.data.nodes;
    } catch (error) {
      console.error('Error fetching nodes:', error);
      throw new Error('Error fetching nodes');
    }
  }

  // Get all relationships of a node by its ID
  async getRelationshipsByNodeId(nodeId: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(`${this.apiUrl}/relationships/${nodeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching relationships:', error);
      throw new Error('Error fetching relationships');
    }
  }

  // Execute a custom Cypher query
  async runQuery(query: string, params: any): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${this.apiUrl}/cypher`, { query, params });
      return response.data;
    } catch (error) {
      console.error('Error running query:', error);
      throw new Error('Error running query');
    }
  }

  // Create a new node
  async createNode(label: string, properties: any): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${this.apiUrl}/node`, { label, properties });
      return response.data;
    } catch (error) {
      console.error('Error creating node:', error);
      throw new Error('Error creating node');
    }
  }

  // Create a relationship between nodes
  async createRelationship(startNodeId: string, endNodeId: string, relationshipType: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${this.apiUrl}/relationship`, { startNodeId, endNodeId, relationshipType });
      return response.data;
    } catch (error) {
      console.error('Error creating relationship:', error);
      throw new Error('Error creating relationship');
    }
  }

  // Delete a node by ID
  async deleteNode(nodeId: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.delete(`${this.apiUrl}/node/${nodeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting node:', error);
      throw new Error('Error deleting node');
    }
  }

  // Delete a relationship by ID
  async deleteRelationship(relationshipId: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.delete(`${this.apiUrl}/relationship/${relationshipId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting relationship:', error);
      throw new Error('Error deleting relationship');
    }
  }
}
