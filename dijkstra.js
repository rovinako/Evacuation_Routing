function dijkstra(graph, start, end, mode = "safest") {
    const distances = {};
    const previous = {};
    const visited = new Set();
  
    for (const node in graph) {
      distances[node] = Infinity;
      previous[node] = null;
    }
  
    distances[start] = 0;
  
    while (true) {
      let currentNode = null;
  
      for (const node in distances) {
        if (!visited.has(node)) {
          if (currentNode === null || distances[node] < distances[currentNode]) {
            currentNode = node;
          }
        }
      }
  
      if (currentNode === null) break;
      if (currentNode === end) break;
  
      visited.add(currentNode);
  
      for (const neighbor of graph[currentNode]) {
        const edgeCost = getEdgeCost(neighbor, mode);
        const newCost = distances[currentNode] + edgeCost;
  
        if (newCost < distances[neighbor.node]) {
          distances[neighbor.node] = newCost;
          previous[neighbor.node] = currentNode;
        }
      }
    }
  
    const path = [];
    let current = end;
  
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
  
    return {
      path,
      totalCost: distances[end],
      visitedCount: visited.size,
      mode
    };
  }