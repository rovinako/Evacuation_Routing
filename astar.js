function heuristic(positions, node, end) {
    const dx = positions[node].x - positions[end].x;
    const dy = positions[node].y - positions[end].y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  function astar(graph, positions, start, end) {
    const openSet = [start];
    const cameFrom = {};
  
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
  
      if (current === end) {
        const path = [];
        let temp = end;
  
        while (temp) {
          path.unshift(temp);
          temp = cameFrom[temp];
        }
  
        return {
          path,
          totalRisk: gScore[end]
        };
      }
  
      openSet.splice(openSet.indexOf(current), 1);
  
      for (const neighbor of graph[current]) {
        const tentativeG = gScore[current] + neighbor.risk;
  
        if (tentativeG < gScore[neighbor.node]) {
          cameFrom[neighbor.node] = current;
          gScore[neighbor.node] = tentativeG;
          fScore[neighbor.node] =
            tentativeG + heuristic(positions, neighbor.node, end);
  
          if (!openSet.includes(neighbor.node)) {
            openSet.push(neighbor.node);
          }
        }
      }
    }
  
    return {
      path: [],
      totalRisk: Infinity
    };
  }