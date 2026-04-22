function getEdgeCost(edge, mode = "safest") {
    if (mode === "safest") {
      return edge.danger * 0.5 + edge.time * 0.2 + edge.congestion * 0.2 + edge.roadCondition * 0.1;
    }
  
    if (mode === "fastest") {
      return edge.time * 0.5 + edge.danger * 0.2 + edge.congestion * 0.2 + edge.roadCondition * 0.1;
    }
  
    if (mode === "balanced") {
      return edge.danger * 0.35 + edge.time * 0.35 + edge.congestion * 0.2 + edge.roadCondition * 0.1;
    }
  
    return edge.danger;
  }