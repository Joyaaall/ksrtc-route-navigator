
// Hardcoded bus data
export const busData = [
  {
    id: 1,
    name: "KSRTC 123",
    from: "Ernakulam",
    to: "Kozhikode",
    departure: "8:30 AM",
    depot_location: [9.9312, 76.2673]
  },
  {
    id: 2,
    name: "KSRTC 456",
    from: "Ernakulam",
    to: "Trivandrum",
    departure: "9:15 AM",
    depot_location: [9.9312, 76.2673]
  },
  {
    id: 3,
    name: "KSRTC 789",
    from: "Kozhikode",
    to: "Ernakulam",
    departure: "7:45 AM",
    depot_location: [11.2588, 75.7804]
  },
  {
    id: 4,
    name: "KSRTC 234",
    from: "Trivandrum",
    to: "Ernakulam",
    departure: "6:30 AM",
    depot_location: [8.4855, 76.9492]
  },
  {
    id: 5,
    name: "KSRTC 567",
    from: "Kozhikode",
    to: "Trivandrum",
    departure: "10:00 AM",
    depot_location: [11.2588, 75.7804]
  },
  {
    id: 6,
    name: "KSRTC 890",
    from: "Trivandrum",
    to: "Kozhikode",
    departure: "11:30 AM",
    depot_location: [8.4855, 76.9492]
  }
];

// Get unique locations from bus data
export const locations = Array.from(
  new Set(busData.flatMap(bus => [bus.from, bus.to]))
).sort();

// Mock user location (Kochi)
export const defaultUserLocation: [number, number] = [9.9312, 76.2673];
