function findRoute() {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
  
    const result = dijkstra(graph, start, end, "safest");
  
    if (!result.path || result.path.length === 0 || result.totalCost === Infinity) {
      document.getElementById("output").innerHTML = `
        <p><strong>No route found.</strong></p>
      `;
      return;
    }
  
    document.getElementById("output").innerHTML = `
      <p><strong>Route:</strong> ${result.path.join(" → ")}</p>
      <p><strong>Total Cost:</strong> ${result.totalCost.toFixed(2)}</p>
      <p><strong>Visited Nodes:</strong> ${result.visitedCount}</p>
      <p><strong>Mode:</strong> ${result.mode}</p>
    `;
  }
  
  function compareAlgorithms(start, end, mode = "safest") {
    const dijkstraResult = dijkstra(graph, start, end, mode);
    const astarResult = astar(graph, positions, start, end, mode);
  
    console.log(`Comparing ${mode} route from ${start} to ${end}`);
    console.log("Dijkstra:", dijkstraResult);
    console.log("A*:", astarResult);
  
    return {
      dijkstra: dijkstraResult,
      astar: astarResult
    };
  }