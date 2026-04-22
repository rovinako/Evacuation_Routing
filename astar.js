function heuristic(positions, node, end) {
    const dx = positions[node].x - positions[end].x;
    const dy = positions[node].y - positions[end].y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  function astar(graph, positions, start, end, mode = "safest") {
    const openSet = [start];
    const cameFrom = {};
    const visited = new Set();
  
    const gScore = {};
    const fScore = {};
  
    for (const node in graph) {
      gScore[node] = Infinity;
      fScore[node] = Infinity;
    }
  
    gScore[start] = 0;
    fScore[start] = heuristic(positions, start, end);
  
    while (openSet.length > 0) {
      let current = openSet[0];
  
      for (const node of openSet) {
        if (fScore[node] < fScore[current]) {
          current = node;
        }
      }
  
      visited.add(current);
  
      if (current === end) {
        const path = [];
        let temp = end;
  
        while (temp) {
          path.unshift(temp);
          temp = cameFrom[temp];
        }
  
        return {
          path,
          totalCost: gScore[end],
          visitedCount: visited.size,
          mode
        };
      }
  
      openSet.splice(openSet.indexOf(current), 1);
  
      for (const neighbor of graph[current]) {
        const edgeCost = getEdgeCost(neighbor, mode);
        const tentativeG = gScore[current] + edgeCost;
  
        if (tentativeG < gScore[neighbor.node]) {
          cameFrom[neighbor.node] = current;
          gScore[neighbor.node] = tentativeG;
          fScore[neighbor.node] = tentativeG + heuristic(positions, neighbor.node, end);
  
          if (!openSet.includes(neighbor.node)) {
            openSet.push(neighbor.node);
          }
        }
      }
    }
  
    return {
      path: [],
      totalCost: Infinity,
      visitedCount: visited.size,
      mode
    };
  }