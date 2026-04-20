function compareAlgorithms(start, end) {
    const dijkstraResult = dijkstra(graph, start, end);
    const astarResult = astar(graph, positions, start, end);
  
    console.log("Comparing route from", start, "to", end);
    console.log("Dijkstra:", dijkstraResult);
    console.log("A*:", astarResult);
  
    return {
      dijkstra: dijkstraResult,
      astar: astarResult
    };
  }