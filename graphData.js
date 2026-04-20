const graph = {
    "Gaza": [
      { node: "Deir al-Balah", risk: 3 },
      { node: "Khan Younis", risk: 6 }
    ],
    "Deir al-Balah": [
      { node: "Gaza", risk: 3 },
      { node: "Khan Younis", risk: 2 }
    ],
    "Khan Younis": [
      { node: "Gaza", risk: 6 },
      { node: "Deir al-Balah", risk: 2 },
      { node: "Rafah", risk: 4 }
    ],
    "Rafah": [
      { node: "Khan Younis", risk: 4 },
      { node: "Border Exit", risk: 1 }
    ],
    "Border Exit": [
      { node: "Rafah", risk: 1 }
    ]
  };
  
  const positions = {
    "Gaza": { x: 1, y: 1 },
    "Deir al-Balah": { x: 2, y: 2 },
    "Khan Younis": { x: 3, y: 3 },
    "Rafah": { x: 4, y: 4 },
    "Border Exit": { x: 5, y: 5 }
  };