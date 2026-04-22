const graph = {
    "Gaza City": [
      { node: "Jabalia", danger: 4, time: 2, congestion: 3, roadCondition: 2 },
      { node: "Nuseirat", danger: 6, time: 4, congestion: 4, roadCondition: 3 }
    ],
    "Jabalia": [
      { node: "Gaza City", danger: 4, time: 2, congestion: 3, roadCondition: 2 },
      { node: "Beit Lahia", danger: 3, time: 2, congestion: 2, roadCondition: 2 },
      { node: "Beit Hanoun", danger: 5, time: 3, congestion: 3, roadCondition: 3 }
    ],
    "Beit Lahia": [
      { node: "Jabalia", danger: 3, time: 2, congestion: 2, roadCondition: 2 },
      { node: "Shelter A", danger: 2, time: 2, congestion: 2, roadCondition: 1 }
    ],
    "Beit Hanoun": [
      { node: "Jabalia", danger: 5, time: 3, congestion: 3, roadCondition: 3 },
      { node: "Shelter A", danger: 4, time: 2, congestion: 2, roadCondition: 2 }
    ],
    "Nuseirat": [
      { node: "Gaza City", danger: 6, time: 4, congestion: 4, roadCondition: 3 },
      { node: "Bureij", danger: 3, time: 2, congestion: 2, roadCondition: 2 },
      { node: "Deir al-Balah", danger: 4, time: 3, congestion: 3, roadCondition: 2 }
    ],
    "Bureij": [
      { node: "Nuseirat", danger: 3, time: 2, congestion: 2, roadCondition: 2 },
      { node: "Medical Point", danger: 2, time: 1, congestion: 2, roadCondition: 1 },
      { node: "Deir al-Balah", danger: 3, time: 2, congestion: 2, roadCondition: 2 }
    ],
    "Deir al-Balah": [
      { node: "Nuseirat", danger: 4, time: 3, congestion: 3, roadCondition: 2 },
      { node: "Bureij", danger: 3, time: 2, congestion: 2, roadCondition: 2 },
      { node: "Khan Younis", danger: 5, time: 3, congestion: 3, roadCondition: 2 },
      { node: "Shelter B", danger: 2, time: 2, congestion: 2, roadCondition: 1 }
    ],
    "Khan Younis": [
      { node: "Deir al-Balah", danger: 5, time: 3, congestion: 3, roadCondition: 2 },
      { node: "Rafah", danger: 4, time: 2, congestion: 3, roadCondition: 2 },
      { node: "Medical Point", danger: 3, time: 2, congestion: 2, roadCondition: 1 }
    ],
    "Rafah": [
      { node: "Khan Younis", danger: 4, time: 2, congestion: 3, roadCondition: 2 },
      { node: "Border Exit", danger: 2, time: 2, congestion: 2, roadCondition: 1 },
      { node: "Shelter B", danger: 3, time: 2, congestion: 2, roadCondition: 1 }
    ],
    "Shelter A": [
      { node: "Beit Lahia", danger: 2, time: 2, congestion: 2, roadCondition: 1 },
      { node: "Beit Hanoun", danger: 4, time: 2, congestion: 2, roadCondition: 2 }
    ],
    "Shelter B": [
      { node: "Deir al-Balah", danger: 2, time: 2, congestion: 2, roadCondition: 1 },
      { node: "Rafah", danger: 3, time: 2, congestion: 2, roadCondition: 1 }
    ],
    "Medical Point": [
      { node: "Bureij", danger: 2, time: 1, congestion: 2, roadCondition: 1 },
      { node: "Khan Younis", danger: 3, time: 2, congestion: 2, roadCondition: 1 }
    ],
    "Border Exit": [
      { node: "Rafah", danger: 2, time: 2, congestion: 2, roadCondition: 1 }
    ]
  };
  
  const positions = {
    "Gaza City": { x: 2, y: 1 },
    "Jabalia": { x: 2, y: 2 },
    "Beit Lahia": { x: 1, y: 2 },
    "Beit Hanoun": { x: 3, y: 2 },
    "Nuseirat": { x: 3, y: 4 },
    "Bureij": { x: 4, y: 5 },
    "Deir al-Balah": { x: 5, y: 6 },
    "Khan Younis": { x: 6, y: 8 },
    "Rafah": { x: 7, y: 10 },
    "Shelter A": { x: 1, y: 3 },
    "Shelter B": { x: 6, y: 9 },
    "Medical Point": { x: 5, y: 7 },
    "Border Exit": { x: 8, y: 11 }
  };
  // Blocked Road Graph
  const blockedRoadGraph = JSON.parse(JSON.stringify(graph));

blockedRoadGraph["Deir al-Balah"] = blockedRoadGraph["Deir al-Balah"].filter(
  edge => edge.node !== "Khan Younis"
);

blockedRoadGraph["Khan Younis"] = blockedRoadGraph["Khan Younis"].filter(
  edge => edge.node !== "Deir al-Balah"
);