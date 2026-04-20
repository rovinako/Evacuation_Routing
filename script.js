function findRoute() {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
  
    const result = dijkstra(graph, start, end);
  
    document.getElementById("output").innerHTML = `
      <p><strong>Safest Path:</strong> ${result.path.join(" → ")}</p>
      <p><strong>Total Risk:</strong> ${result.totalRisk}</p>
    `;
  }