//Runs Dijkstra and A*
// Each node has a list of neighbours.
// Each neighbour has four cost values:
//   danger        - how risky the road is (1-6)
//   time          - how long it takes (1-4)
//   congestion    - how busy the road is (2-4)
//   roadCondition - quality of the road (1-3)

var graph = {
  "Gaza City": [
    { node: "Jabalia",       danger: 4, time: 2, congestion: 3, roadCondition: 2 },
    { node: "Nuseirat",      danger: 6, time: 4, congestion: 4, roadCondition: 3 }
  ],
  "Jabalia": [
    { node: "Gaza City",     danger: 4, time: 2, congestion: 3, roadCondition: 2 },
    { node: "Beit Lahia",    danger: 3, time: 2, congestion: 2, roadCondition: 2 },
    { node: "Beit Hanoun",   danger: 5, time: 3, congestion: 3, roadCondition: 3 }
  ],
  "Beit Lahia": [
    { node: "Jabalia",       danger: 3, time: 2, congestion: 2, roadCondition: 2 },
    { node: "Shelter A",     danger: 2, time: 2, congestion: 2, roadCondition: 1 }
  ],
  "Beit Hanoun": [
    { node: "Jabalia",       danger: 5, time: 3, congestion: 3, roadCondition: 3 },
    { node: "Shelter A",     danger: 4, time: 2, congestion: 2, roadCondition: 2 }
  ],
  "Nuseirat": [
    { node: "Gaza City",     danger: 6, time: 4, congestion: 4, roadCondition: 3 },
    { node: "Bureij",        danger: 3, time: 2, congestion: 2, roadCondition: 2 },
    { node: "Deir al-Balah", danger: 4, time: 3, congestion: 3, roadCondition: 2 }
  ],
  "Bureij": [
    { node: "Nuseirat",      danger: 3, time: 2, congestion: 2, roadCondition: 2 },
    { node: "Medical Point", danger: 2, time: 1, congestion: 2, roadCondition: 1 },
    { node: "Deir al-Balah", danger: 3, time: 2, congestion: 2, roadCondition: 2 }
  ],
  "Deir al-Balah": [
    { node: "Nuseirat",      danger: 4, time: 3, congestion: 3, roadCondition: 2 },
    { node: "Bureij",        danger: 3, time: 2, congestion: 2, roadCondition: 2 },
    { node: "Khan Younis",   danger: 5, time: 3, congestion: 3, roadCondition: 2 },
    { node: "Shelter B",     danger: 2, time: 2, congestion: 2, roadCondition: 1 }
  ],
  "Khan Younis": [
    { node: "Deir al-Balah", danger: 5, time: 3, congestion: 3, roadCondition: 2 },
    { node: "Rafah",         danger: 4, time: 2, congestion: 3, roadCondition: 2 },
    { node: "Medical Point", danger: 3, time: 2, congestion: 2, roadCondition: 1 }
  ],
  "Rafah": [
    { node: "Khan Younis",   danger: 4, time: 2, congestion: 3, roadCondition: 2 },
    { node: "Border Exit",   danger: 2, time: 2, congestion: 2, roadCondition: 1 },
    { node: "Shelter B",     danger: 3, time: 2, congestion: 2, roadCondition: 1 }
  ],
  "Shelter A": [
    { node: "Beit Lahia",    danger: 2, time: 2, congestion: 2, roadCondition: 1 },
    { node: "Beit Hanoun",   danger: 4, time: 2, congestion: 2, roadCondition: 2 }
  ],
  "Shelter B": [
    { node: "Deir al-Balah", danger: 2, time: 2, congestion: 2, roadCondition: 1 },
    { node: "Rafah",         danger: 3, time: 2, congestion: 2, roadCondition: 1 }
  ],
  "Medical Point": [
    { node: "Bureij",        danger: 2, time: 1, congestion: 2, roadCondition: 1 },
    { node: "Khan Younis",   danger: 3, time: 2, congestion: 2, roadCondition: 1 }
  ],
  "Border Exit": [
    { node: "Rafah",         danger: 2, time: 2, congestion: 2, roadCondition: 1 }
  ]
};


// =============================================
// NODE POSITIONS
// Normalised x/y values between 0 and 1.
// These are used to place nodes on the canvas.
// North Gaza is near the top, south near the bottom.
// =============================================

var nodePositions = {
  "Gaza City":     { x: 0.24, y: 0.05 },
  "Jabalia":       { x: 0.17, y: 0.16 },
  "Beit Lahia":    { x: 0.06, y: 0.24 },
  "Beit Hanoun":   { x: 0.31, y: 0.25 },
  "Nuseirat":      { x: 0.37, y: 0.40 },
  "Bureij":        { x: 0.51, y: 0.50 },
  "Deir al-Balah": { x: 0.61, y: 0.58 },
  "Khan Younis":   { x: 0.68, y: 0.70 },
  "Rafah":         { x: 0.74, y: 0.81 },
  "Shelter A":     { x: 0.04, y: 0.36 },
  "Shelter B":     { x: 0.63, y: 0.77 },
  "Medical Point": { x: 0.56, y: 0.63 },
  "Border Exit":   { x: 0.87, y: 0.92 }
};


// =============================================
// NODE APPEARANCE
// Each node has a type which determines its
// colour and icon on the map.
// =============================================

var nodeTypes = {
  "Gaza City":     "city",
  "Jabalia":       "city",
  "Beit Lahia":    "camp",
  "Beit Hanoun":   "camp",
  "Nuseirat":      "camp",
  "Bureij":        "camp",
  "Deir al-Balah": "camp",
  "Khan Younis":   "city",
  "Rafah":         "city",
  "Shelter A":     "safe",
  "Shelter B":     "safe",
  "Medical Point": "medical",
  "Border Exit":   "exit"
};

// Colours used for each node type
var nodeColors = {
  city:    "#f97316",
  camp:    "#fbbf24",
  safe:    "#4ade80",
  medical: "#22d3ee",
  exit:    "#a78bfa"
};

//icons drawn inside each node circle
var nodeIcons = {
  city:    "🏙",
  camp:    "⛺",
  safe:    "🏥",
  medical: "➕",
  exit:    "🚪"
};


// One object that holds everything the app
// needs to remember between function calls.

var state = {
  mode:      "safest",     // current routing mode
  algorithm: "dijkstra",   // current algorithm
  path:      [],           // the current found route as an array of node names
  result:    null,         // the full result object from the last route search
  scale:     1,            // zoom level
  offsetX:   0,            // how far the map has been panned horizontally
  offsetY:   0,            // how far the map has been panned vertically
  isDragging: false,       // whether the user is currently dragging the map
  dragStart:  null,        // where the drag started
  isLooping:  false,       // whether the animation loop is running
  rafId:      null         // the requestAnimationFrame ID (used to cancel it)
};



// CANVAS SETUP
// Get references to the canvas and its drawing
// context, and resize it to fill the map area.

var canvas  = document.getElementById("mapCanvas");
var ctx     = canvas.getContext("2d");
var mapArea = document.getElementById("mapArea");

// Resize the canvas to match the container size
function resizeCanvas() {
  canvas.width  = mapArea.clientWidth;
  canvas.height = mapArea.clientHeight;
}

// Re-resize and redraw whenever the window changes size
window.addEventListener("resize", function() {
  resizeCanvas();
  if (!state.isLooping) redraw();
});



// COORDINATE HELPER
//incharge of zoom and map view

function toCanvasCoords(nx, ny) {
  // Add padding so nodes don't appear right at the edge
  var padding = Math.min(canvas.width, canvas.height) * 0.09;
  var drawWidth  = canvas.width  - padding * 2;
  var drawHeight = canvas.height - padding * 2;

  return {
    x: padding + nx * drawWidth  * state.scale + state.offsetX,
    y: padding + ny * drawHeight * state.scale + state.offsetY
  };
}



// Combines the four edge values into one cost
// number based on the selected routing mode.


function getEdgeCost(edge, mode) {
  if (mode === "safest") {
    // Prioritise low danger roads
    return edge.danger * 0.5 + edge.time * 0.2 + edge.congestion * 0.2 + edge.roadCondition * 0.1;
  }
  if (mode === "fastest") {
    // Prioritise low travel time
    return edge.time * 0.5 + edge.danger * 0.2 + edge.congestion * 0.2 + edge.roadCondition * 0.1;
  }
  // Balanced - equal weight on danger and time
  return edge.danger * 0.35 + edge.time * 0.35 + edge.congestion * 0.2 + edge.roadCondition * 0.1;
}


// Returns a modified copy of the graph with the
// Deir al-Balah <-> Khan Younis road removed.
// We copy it so we never modify the original.


function getBlockedGraph() {
  // Deep copy the graph so we don't change the original
  var blocked = JSON.parse(JSON.stringify(graph));

  // Remove the connection in both directions
  blocked["Deir al-Balah"] = blocked["Deir al-Balah"].filter(function(e) {
    return e.node !== "Khan Younis";
  });
  blocked["Khan Younis"] = blocked["Khan Younis"].filter(function(e) {
    return e.node !== "Deir al-Balah";
  });

  return blocked;
}



// DIJKSTRA'S ALGORITHM



function dijkstra(g, startNode, endNode, mode) {
  // Set all distances to infinity to start
  var distances = {};
  var previous  = {};
  var visited   = [];

  for (var node in g) {
    distances[node] = Infinity;
    previous[node]  = null;
  }

  // The start node costs nothing to reach
  distances[startNode] = 0;

  while (true) {
    // Find the unvisited node with the lowest distance
    var current = null;
    for (var n in distances) {
      if (visited.indexOf(n) === -1) {
        if (current === null || distances[n] < distances[current]) {
          current = n;
        }
      }
    }

    // Stop if we've reached the destination or run out of nodes
    if (current === null || current === endNode) break;

    visited.push(current);

    // Update distances for each neighbour
    for (var i = 0; i < g[current].length; i++) {
      var neighbour = g[current][i];
      var newCost   = distances[current] + getEdgeCost(neighbour, mode);

      if (newCost < distances[neighbour.node]) {
        distances[neighbour.node] = newCost;
        previous[neighbour.node]  = current;
      }
    }
  }

  // Reconstruct the path by following previous[] backwards from end to start
  var path = [];
  var step = endNode;
  while (step !== null) {
    path.unshift(step);
    step = previous[step];
  }

  return {
    path:    path,
    cost:    distances[endNode],
    visited: visited.length,
    algo:    "Dijkstra"
  };
}



// A* ALGORITHM



// Heuristic

function heuristic(nodeA, nodeB) {
  var dx = nodePositions[nodeA].x - nodePositions[nodeB].x;
  var dy = nodePositions[nodeA].y - nodePositions[nodeB].y;
  return Math.sqrt(dx * dx + dy * dy) * 3;
}

function astar(g, startNode, endNode, mode) {
  var openSet  = [startNode];   // nodes to explore
  var cameFrom = {};            // tracks the path
  var visited  = [];

  // gScore = actual cost from start to this node
  // fScore = gScore + heuristic estimate to end
  var gScore = {};
  var fScore = {};

  for (var node in g) {
    gScore[node] = Infinity;
    fScore[node] = Infinity;
  }

  gScore[startNode] = 0;
  fScore[startNode] = heuristic(startNode, endNode);

  while (openSet.length > 0) {
    // Pick the node in openSet with the lowest fScore
    var current = openSet[0];
    for (var i = 1; i < openSet.length; i++) {
      if (fScore[openSet[i]] < fScore[current]) {
        current = openSet[i];
      }
    }

    visited.push(current);

    // If we reached the end, reconstruct and return the path
    if (current === endNode) {
      var path = [];
      var step = endNode;
      while (step !== undefined) {
        path.unshift(step);
        step = cameFrom[step];
      }
      return {
        path:    path,
        cost:    gScore[endNode],
        visited: visited.length,
        algo:    "A*"
      };
    }

    // Remove current from openSet
    openSet.splice(openSet.indexOf(current), 1);

    // Check each neighbour
    for (var j = 0; j < g[current].length; j++) {
      var neighbour    = g[current][j];
      var tentativeG   = gScore[current] + getEdgeCost(neighbour, mode);

      if (tentativeG < gScore[neighbour.node]) {
        cameFrom[neighbour.node] = current;
        gScore[neighbour.node]   = tentativeG;
        fScore[neighbour.node]   = tentativeG + heuristic(neighbour.node, endNode);

        if (openSet.indexOf(neighbour.node) === -1) {
          openSet.push(neighbour.node);
        }
      }
    }
  }

  // No path found
  return { path: [], cost: Infinity, visited: visited.length, algo: "A*" };
}



// DANGER COLOUR HELPER




function getDangerColor(danger) {
  if (danger <= 2) return "#4ade80";   // green  - low
  if (danger <= 3) return "#86efac";   // light green - moderate
  if (danger <= 4) return "#fbbf24";   // yellow - high
  if (danger <= 5) return "#f87171";   // red    - severe
  return "#dc2626";                     // dark red - critical
}

function getDangerLabel(danger) {
  if (danger <= 2) return "Low";
  if (danger <= 3) return "Moderate";
  if (danger <= 4) return "High";
  if (danger <= 5) return "Severe";
  return "Critical";
}



// PATH EDGE SET
// quickly check if a given edge is on the route.


function buildPathEdgeSet(path) {
  var edgeSet = {};
  for (var i = 0; i < path.length - 1; i++) {
    edgeSet[path[i] + "~" + path[i + 1]] = true;
    edgeSet[path[i + 1] + "~" + path[i]] = true;
  }
  return edgeSet;
}



// DRAW FUNCTIONS



// Schedule a single redraw 
function redraw() {
  if (state.isLooping) return;
  if (state.rafId) return;
  state.rafId = requestAnimationFrame(function() {
    state.rafId = null;
    drawAll();
  });
}

// Start the continuous animation loop 
function startAnimationLoop() {
  if (state.isLooping) return;
  state.isLooping = true;

  function loop() {
    if (!state.isLooping) return;
    drawAll();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var useBlocked = document.getElementById("chkB").checked;
  var showCosts  = document.getElementById("chkE").checked;
  var activeGraph = useBlocked ? getBlockedGraph() : graph;
  var pathEdges   = buildPathEdgeSet(state.path);

  drawBackground();
  drawEdges(activeGraph, pathEdges, showCosts, useBlocked);

  // Only draw the moving dots if there is an active route
  if (state.path.length > 1) {
    drawFlowAnimation();
  }

  drawNodes(pathEdges);
}

// Draw a subtle radial gradient and horizontal lines as background
function drawBackground() {
  var gradient = ctx.createRadialGradient(
    canvas.width * 0.5, canvas.height * 0.5, 0,
    canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.7
  );
  gradient.addColorStop(0, "rgba(0, 40, 55, 0.2)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Faint horizontal lines (topographic effect)
  ctx.save();
  ctx.globalAlpha  = 0.035;
  ctx.strokeStyle  = "#22d3ee";
  ctx.lineWidth    = 1;
  for (var y = 0; y < canvas.height; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}

// Draw all roads (edges) between nodes
function drawEdges(activeGraph, pathEdges, showCosts, useBlocked) {
  var alreadyDrawn = {};   // avoid drawing the same road twice

  for (var fromNode in activeGraph) {
    for (var i = 0; i < activeGraph[fromNode].length; i++) {
      var edge    = activeGraph[fromNode][i];
      var toNode  = edge.node;

      // Create a sorted key so A-B and B-A use the same key
      var key = [fromNode, toNode].sort().join("~");
      if (alreadyDrawn[key]) continue;
      alreadyDrawn[key] = true;

      var p1    = toCanvasCoords(nodePositions[fromNode].x, nodePositions[fromNode].y);
      var p2    = toCanvasCoords(nodePositions[toNode].x,   nodePositions[toNode].y);
      var onRoute = pathEdges[fromNode + "~" + toNode];

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);

      if (onRoute) {
        // Active route roads are white and glowing
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth   = 3.5;
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur  = 16;
        ctx.setLineDash([]);
      } else {
        // Other roads are coloured by danger level and dashed
        ctx.strokeStyle = getDangerColor(edge.danger);
        ctx.lineWidth   = 1.8;
        ctx.globalAlpha = 0.28;
        ctx.setLineDash([6, 5]);
      }

      ctx.stroke();
      ctx.restore();

      // Draw the cost number in the middle of the road if option is on
      if (showCosts && !onRoute) {
        var midX = (p1.x + p2.x) / 2;
        var midY = (p1.y + p2.y) / 2;
        var cost = getEdgeCost(edge, state.mode).toFixed(1);

        ctx.save();
        ctx.font          = "9px 'Roboto Mono', monospace";
        ctx.fillStyle     = "rgba(75, 86, 117, 0.85)";
        ctx.textAlign     = "center";
        ctx.textBaseline  = "middle";
        ctx.fillText(cost, midX, midY - 5);
        ctx.restore();
      }
    }
  }

  // If blocked road is enabled, draw a red dashed line with an X over it
  if (useBlocked) {
    var p1 = toCanvasCoords(nodePositions["Deir al-Balah"].x, nodePositions["Deir al-Balah"].y);
    var p2 = toCanvasCoords(nodePositions["Khan Younis"].x,   nodePositions["Khan Younis"].y);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = "#f87171";
    ctx.lineWidth   = 2.5;
    ctx.globalAlpha = 0.6;
    ctx.setLineDash([8, 4]);
    ctx.stroke();
    ctx.restore();

    // Draw the X marker in the middle
    var midX = (p1.x + p2.x) / 2;
    var midY = (p1.y + p2.y) / 2;
    ctx.save();
    ctx.font          = "bold 14px sans-serif";
    ctx.fillStyle     = "#f87171";
    ctx.textAlign     = "center";
    ctx.textBaseline  = "middle";
    ctx.fillText("✕", midX, midY);
    ctx.restore();
  }
}

// Draw white dots that move along the active route
function drawFlowAnimation() {
  // t goes from 0 to 1 repeatedly (based on time)
  var t = (Date.now() % 1600) / 1600;

  for (var i = 0; i < state.path.length - 1; i++) {
    var fromNode = state.path[i];
    var toNode   = state.path[i + 1];

    if (!nodePositions[fromNode] || !nodePositions[toNode]) continue;

    var p1 = toCanvasCoords(nodePositions[fromNode].x, nodePositions[fromNode].y);
    var p2 = toCanvasCoords(nodePositions[toNode].x,   nodePositions[toNode].y);

    // Each segment is offset slightly so they don't all move in sync
    var progress = (t + i * 0.2) % 1;
    var dotX = p1.x + (p2.x - p1.x) * progress;
    var dotY = p1.y + (p2.y - p1.y) * progress;

    ctx.save();
    ctx.beginPath();
    ctx.arc(dotX, dotY, 4.5, 0, Math.PI * 2);
    ctx.fillStyle   = "#ffffff";
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur  = 12;
    ctx.fill();
    ctx.restore();
  }
}

// Draw all the node circles, icons, and labels
function drawNodes(pathEdges) {
  var startNode = document.getElementById("ss").value;
  var endNode   = document.getElementById("es").value;

  for (var name in nodePositions) {
    var pos    = toCanvasCoords(nodePositions[name].x, nodePositions[name].y);
    var type   = nodeTypes[name];
    var color  = nodeColors[type] || "#6b7280";

    var isStart = (name === startNode);
    var isEnd   = (name === endNode);
    var onRoute = (state.path.indexOf(name) !== -1);

    // Decide the fill colour based on role
    var fillColor = color;
    if (isStart) fillColor = "#4ade80";
    if (isEnd)   fillColor = "#f97316";
    if (onRoute && !isStart && !isEnd) fillColor = "#ffffff";

    // Bigger circle for start and end nodes
    var radius = 9;
    if (isStart || isEnd) radius = 15;
    else if (onRoute)     radius = 12;

    // Draw a glowing halo behind active nodes
    if (isStart || isEnd || onRoute) {
      var halo = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius + 13);
      var rgb  = isStart ? "34,222,128" : isEnd ? "249,115,22" : "255,255,255";
      halo.addColorStop(0, "rgba(" + rgb + ", 0.22)");
      halo.addColorStop(1, "rgba(" + rgb + ", 0)");
      ctx.save();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius + 13, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();
      ctx.restore();
    }

    // Draw a dashed ring around start and end nodes
    if (isStart || isEnd) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = fillColor;
      ctx.lineWidth   = 1.5;
      ctx.globalAlpha = 0.35;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.restore();
    }

    // Draw the main node circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    if (onRoute || isStart || isEnd) {
      ctx.shadowColor = fillColor;
      ctx.shadowBlur  = 10;
    }
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth   = 1.5;
    ctx.stroke();
    ctx.restore();

    // Draw the emoji icon inside the circle
    ctx.save();
    ctx.font          = Math.round(radius * 0.9) + "px sans-serif";
    ctx.textAlign     = "center";
    ctx.textBaseline  = "middle";
    ctx.fillText(nodeIcons[type] || "•", pos.x, pos.y);
    ctx.restore();

    // Draw the node name label below the circle
    ctx.save();
    ctx.font          = (onRoute || isStart || isEnd ? "600 " : "400 ") + "11px 'Roboto Mono', monospace";
    ctx.fillStyle     = (onRoute || isStart || isEnd) ? "rgba(255,255,255,0.95)" : "rgba(200,210,230,0.5)";
    ctx.textAlign     = "center";
    ctx.textBaseline  = "top";
    ctx.fillText(name, pos.x, pos.y + radius + 5);
    ctx.restore();
  }
}



// FIND ROUTE
// Called when the user presses Find Route.
// Runs the selected algorithm and shows results.


function findRoute() {
  var startNode = document.getElementById("ss").value;
  var endNode   = document.getElementById("es").value;

  // Hide any previous no-route warning
  document.getElementById("noRoute").style.display = "none";

  if (startNode === endNode) {
    showError("Start and destination must be different.");
    return;
  }

  var activeGraph = document.getElementById("chkB").checked ? getBlockedGraph() : graph;

  // Run whichever algorithm is selected
  var result;
  if (state.algorithm === "astar") {
    result = astar(activeGraph, startNode, endNode, state.mode);
  } else {
    result = dijkstra(activeGraph, startNode, endNode, state.mode);
  }

  state.result = result;

  // Check if a valid path was found
  if (result.path.length === 0 || result.cost === Infinity) {
    state.path     = [];
    state.isLooping = false;
    document.getElementById("noRoute").style.display = "flex";
    showError("No route found. Try disabling the blocked road option.");
    redraw();
    return;
  }

  // Store the path and show results
  state.path = result.path;
  showResult(result);
  startAnimationLoop();
}



// SHOW RESULT


function showResult(result) {
  var modeLabel = { safest: "Safest", fastest: "Fastest", balanced: "Balanced" }[state.mode];

  // Build the list of stops
  var stopsHTML = "";
  for (var i = 0; i < result.path.length; i++) {
    var name     = result.path[i];
    var dotClass = "dm";   // middle stop (cyan)
    if (i === 0)                        dotClass = "ds";   // start (green)
    if (i === result.path.length - 1)   dotClass = "de";   // end (orange)

    var lineHTML = (i < result.path.length - 1) ? '<div class="stop-line"></div>' : "";

    stopsHTML += '<div class="stop">'
              + '<div class="stop-dot ' + dotClass + '"></div>'
              + lineHTML
              + '<span class="stop-nm">' + name + '</span>'
              + '</div>';
  }

  document.getElementById("results").innerHTML =
    '<div class="rcard">'
    + '<div class="rcard-top">'
    + '<div class="r-cost">' + result.cost.toFixed(2) + '<span> risk pts</span></div>'
    + '<div class="r-tag">' + result.algo + ' · ' + modeLabel + '</div>'
    + '</div>'
    + '<div class="rstat-row">'
    + '<div class="rstat"><div class="rstat-l">Stops</div><div class="rstat-v">' + result.path.length + '</div></div>'
    + '<div class="rstat"><div class="rstat-l">Visited</div><div class="rstat-v">' + result.visited + '</div></div>'
    + '<div class="rstat"><div class="rstat-l">Mode</div><div class="rstat-v" style="font-size:12px">' + modeLabel + '</div></div>'
    + '</div>'
    + '<div class="rpath"><div class="rpath-lbl">Route Path</div>' + stopsHTML + '</div>'
    + '</div>';

  // Show comparison if the checkbox is on
  if (document.getElementById("chkC").checked) {
    showComparison();
  }
}



// SHOW COMPARISON


function showComparison() {
  var startNode = document.getElementById("ss").value;
  var endNode   = document.getElementById("es").value;
  if (startNode === endNode) return;

  var activeGraph = document.getElementById("chkB").checked ? getBlockedGraph() : graph;

  var dijkstraResult = dijkstra(activeGraph, startNode, endNode, state.mode);
  var astarResult    = astar(activeGraph, startNode, endNode, state.mode);

  var maxVisited = Math.max(dijkstraResult.visited, astarResult.visited);
  if (maxVisited === 0) return;

  // Calculate bar widths as percentages
  var dijkstraPercent = Math.round((dijkstraResult.visited / maxVisited) * 100);
  var astarPercent    = Math.round((astarResult.visited    / maxVisited) * 100);

  // Work out the winner message
  var saving = dijkstraResult.visited - astarResult.visited;
  var winnerText = "Both visited the same number of nodes";
  if (astarResult.visited < dijkstraResult.visited) {
    winnerText = "A* visited fewer nodes — more efficient";
  }

  var savingHTML = "";
  if (saving > 0) {
    savingHTML = ' (<b style="color:#22d3ee">−' + saving + ' nodes</b>)';
  }

  // Remove any existing comparison card
  var existing = document.getElementById("cmpSection");
  if (existing) existing.remove();

  // Build and insert the comparison card
  var div = document.createElement("div");
  div.id  = "cmpSection";
  div.innerHTML =
    '<div class="cmp-card">'
    + '<div class="cmp-lbl">Efficiency Comparison · Nodes Visited</div>'
    + '<div class="cmp-row">'
    + '<span class="cmp-n">Dijkstra</span>'
    + '<div class="cmp-track"><div class="cmp-bar cb-d" style="width:' + dijkstraPercent + '%"></div></div>'
    + '<span class="cmp-val">' + dijkstraResult.visited + '</span>'
    + '</div>'
    + '<div class="cmp-row">'
    + '<span class="cmp-n">A* Search</span>'
    + '<div class="cmp-track"><div class="cmp-bar cb-a" style="width:' + astarPercent + '%"></div></div>'
    + '<span class="cmp-val">' + astarResult.visited + '</span>'
    + '</div>'
    + '<div class="cmp-meta">' + winnerText + savingHTML + '</div>'
    + '<div class="cmp-meta" style="margin-top:5px">Route cost: identical at <b>'
    + (dijkstraResult.cost < Infinity ? dijkstraResult.cost.toFixed(2) : "∞")
    + '</b> — both algorithms always find the optimal path</div>'
    + '</div>';

  document.getElementById("results").appendChild(div);
}

// Called when the compare checkbox is toggled
function maybeCompare() {
  if (!state.result) return;

  if (document.getElementById("chkC").checked) {
    showComparison();
  } else {
    var existing = document.getElementById("cmpSection");
    if (existing) existing.remove();
  }
}


//CLEAR ROUTE
// Resets the path and results panel 


function clearRoute() {
  state.path      = [];
  state.result    = null;
  state.isLooping = false;

  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }

  document.getElementById("noRoute").style.display = "none";
  document.getElementById("results").innerHTML =
    '<div class="empty-state">Select start + destination<br>then press Find Route</div>';

  redraw();
}

// Show an error message in the results panel
function showError(message) {
  document.getElementById("results").innerHTML =
    '<div class="r-err">' + message + '</div>';
}


//CONTROL FUNC


// Switch routing mode (safest / fastest / balanced)
function setMode(newMode, buttonElement) {
  state.mode = newMode;

  // Remove active class from all mode buttons, then add to the clicked one
  var allButtons = document.querySelectorAll(".mode-btn");
  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].classList.remove("active");
  }
  buttonElement.classList.add("active");

  redraw();
}

// Switch algorithm (dijkstra / astar)
function setAlgo(newAlgo, buttonElement) {
  state.algorithm = newAlgo;

  var allButtons = document.querySelectorAll(".algo-btn");
  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].classList.remove("active");
  }
  buttonElement.classList.add("active");
}

// Zoom in or out by a given factor
function zoom(factor) {
  state.scale = Math.min(Math.max(state.scale * factor, 0.35), 6);
  if (!state.isLooping) redraw();
}

// Reset zoom and pan back to default
function resetView() {
  state.scale   = 1;
  state.offsetX = 0;
  state.offsetY = 0;
  if (!state.isLooping) redraw();
}



// POPULATE DROPDOWNS
// Fills the start and destination selects with
// all node names from the graph.


(function populateSelects() {
  var nodeNames   = Object.keys(nodePositions);
  var startSelect = document.getElementById("ss");
  var endSelect   = document.getElementById("es");

  for (var i = 0; i < nodeNames.length; i++) {
    var name = nodeNames[i];
    startSelect.appendChild(new Option(name, name));
    endSelect.appendChild(new Option(name, name));
  }

  // Set sensible defaults
  startSelect.value = "Gaza City";
  endSelect.value   = "Border Exit";
})();



// MAP INTERACTION


var tooltip = document.getElementById("tt");

// Start dragging when mouse button is pressed
canvas.addEventListener("mousedown", function(e) {
  state.isDragging = true;
  state.dragStart  = {
    x: e.clientX - state.offsetX,
    y: e.clientY - state.offsetY
  };
  canvas.style.cursor = "grabbing";
});

// Handle mouse movement - dragging and tooltip
canvas.addEventListener("mousemove", function(e) {
  var rect = canvas.getBoundingClientRect();
  var canvasX = e.clientX - rect.left;
  var canvasY = e.clientY - rect.top;

  // If dragging, update the pan offset
  if (state.isDragging && state.dragStart) {
    state.offsetX = e.clientX - state.dragStart.x;
    state.offsetY = e.clientY - state.dragStart.y;
    if (!state.isLooping) redraw();
    return;
  }

  // Check if the mouse is hovering over a node
  var hoveredNode = null;
  for (var name in nodePositions) {
    var pos = toCanvasCoords(nodePositions[name].x, nodePositions[name].y);
    var dx  = canvasX - pos.x;
    var dy  = canvasY - pos.y;
    if (Math.sqrt(dx * dx + dy * dy) < 18) {
      hoveredNode = name;
      break;
    }
  }

  if (hoveredNode) {
    // Build and show the tooltip
    var edges      = graph[hoveredNode] || [];
    var totalDanger = 0;
    for (var i = 0; i < edges.length; i++) totalDanger += edges[i].danger;
    var avgDanger  = edges.length ? (totalDanger / edges.length).toFixed(1) : "N/A";

    var totalCost = 0;
    for (var j = 0; j < edges.length; j++) totalCost += getEdgeCost(edges[j], state.mode);
    var avgCost   = edges.length ? (totalCost / edges.length).toFixed(2) : "N/A";

    var modeLabel = { safest: "Safest", fastest: "Fastest", balanced: "Balanced" }[state.mode];

    tooltip.innerHTML =
      '<div class="tt-nm">' + hoveredNode + '</div>'
      + '<div class="tt-row"><span>Type</span><b>' + nodeTypes[hoveredNode] + '</b></div>'
      + '<div class="tt-row"><span>Connections</span><b>' + edges.length + '</b></div>'
      + '<div class="tt-row"><span>Avg Danger</span><b style="color:' + getDangerColor(parseFloat(avgDanger)) + '">'
      + avgDanger + ' — ' + getDangerLabel(parseFloat(avgDanger)) + '</b></div>'
      + '<div class="tt-row"><span>Avg Cost (' + modeLabel + ')</span><b>' + avgCost + '</b></div>';

    tooltip.style.left    = (e.clientX + 16) + "px";
    tooltip.style.top     = (e.clientY - 12) + "px";
    tooltip.style.opacity = "1";
    canvas.style.cursor   = "pointer";
  } else {
    tooltip.style.opacity = "0";
    canvas.style.cursor   = state.isDragging ? "grabbing" : "grab";
  }
});

// Stop dragging when mouse button is released
canvas.addEventListener("mouseup", function() {
  state.isDragging = false;
  state.dragStart  = null;
  canvas.style.cursor = "grab";
});

// Hide tooltip when mouse leaves the canvas
canvas.addEventListener("mouseleave", function() {
  state.isDragging  = false;
  tooltip.style.opacity = "0";
});

// Zoom in/out with the scroll wheel
canvas.addEventListener("wheel", function(e) {
  e.preventDefault();
  zoom(e.deltaY < 0 ? 1.1 : 0.9);
}, { passive: false });

// Click to set start node, Shift+click to set destination
canvas.addEventListener("click", function(e) {
  if (state.isDragging) return;

  var rect    = canvas.getBoundingClientRect();
  var canvasX = e.clientX - rect.left;
  var canvasY = e.clientY - rect.top;

  for (var name in nodePositions) {
    var pos = toCanvasCoords(nodePositions[name].x, nodePositions[name].y);
    var dx  = canvasX - pos.x;
    var dy  = canvasY - pos.y;

    if (Math.sqrt(dx * dx + dy * dy) < 18) {
      if (e.shiftKey) {
        document.getElementById("es").value = name;
      } else {
        document.getElementById("ss").value = name;
      }
      if (!state.isLooping) redraw();
      break;
    }
  }
});


//RUN

resizeCanvas();
redraw();
