// Hardcoded bus data
export const busData = [
  // Existing buses (keep these if you want)
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
  // ... other existing buses ...

  // Kannur → Kasaragod buses
  {
    id: 7,
    name: "KSRTC KNR-001",
    from: "Kannur",
    to: "Kasaragod",
    departure: "6:00 AM",
    bus_type: "Town to Town Ordinary",
    route_highlights: "Pappinisseri, Thaliparamba, Pariyaaram Medical College, Payyannur, Karivellur, Kanhangad",
    depot_location: [11.8745, 75.3704] // Kannur coordinates
  },
  {
    id: 8,
    name: "KSRTC KNR-002",
    from: "Kannur",
    to: "Kasaragod",
    departure: "6:15 AM",
    bus_type: "Town to Town Ordinary",
    route_highlights: "Same as above",
    depot_location: [11.8745, 75.3704]
  },
  {
    id: 9,
    name: "KSRTC KNR-003",
    from: "Kannur",
    to: "Kasaragod",
    departure: "12:30 PM",
    bus_type: "Town to Town Ordinary",
    route_highlights: "Same as above",
    depot_location: [11.8745, 75.3704]
  },
  {
    id: 10,
    name: "KSRTC KNR-004",
    from: "Kannur",
    to: "Kasaragod",
    departure: "1:40 PM",
    bus_type: "Town to Town Ordinary",
    route_highlights: "Same as above",
    depot_location: [11.8745, 75.3704]
  },
  {
    id: 11,
    name: "KSRTC KNR-005",
    from: "Kannur",
    to: "Kasaragod",
    departure: "6:00 PM",
    bus_type: "Town to Town Ordinary",
    route_highlights: "Standard route",
    depot_location: [11.8745, 75.3704]
  },
  {
    id: 12,
    name: "KSRTC KNR-006",
    from: "Kannur",
    to: "Kasaragod",
    departure: "6:05 PM",
    bus_type: "Fast Passenger",
    route_highlights: "Pariyaaram Medical College, Payyannur, Karivellur, Cheruvathoor, Neeleswaram, Kanhangad, Cherkala",
    depot_location: [11.8745, 75.3704]
  },
  {
    id: 13,
    name: "KSRTC KNR-007",
    from: "Kannur",
    to: "Kasaragod",
    departure: "6:40 PM",
    bus_type: "Town to Town Ordinary",
    route_highlights: "Standard route",
    depot_location: [11.8745, 75.3704]
  },
  {
    id: 14,
    name: "KSRTC KNR-008",
    from: "Kannur",
    to: "Kasaragod",
    departure: "7:15 PM",
    bus_type: "Fast Passenger",
    route_highlights: "Thaliparamba, Payyannur, Kanhangad",
    depot_location: [11.8745, 75.3704]
  },
  {
    id: 15,
    name: "KSRTC KNR-009",
    from: "Kannur",
    to: "Kasaragod",
    departure: "8:10 PM",
    bus_type: "Limited Stop Fast Passenger",
    route_highlights: "Thaliparamba, Pariyaaram Medical College, Payyannur, Cheruvathoor, Neeleswaram, Kanhangad, Cherkala",
    depot_location: [11.8745, 75.3704]
  },
  {
    id: 16,
    name: "KSRTC KNR-010",
    from: "Kannur",
    to: "Kasaragod",
    departure: "10:30 PM",
    bus_type: "Super Deluxe (KSRTC-SWIFT)",
    route_highlights: "Via Payyannur",
    depot_location: [11.8745, 75.3704]
  },
  {
    id: 17,
    name: "KSRTC KNR-011",
    from: "Kannur",
    to: "Kasaragod",
    departure: "11:30 PM",
    bus_type: "Town to Town Ordinary",
    route_highlights: "Pazhayangadi, Payyannur, Kanhangad",
    depot_location: [11.8745, 75.3704]
  },

  // Trivandrum to Alappuzha buses
  {
    id: 18,
    name: "KSRTC TVM-001",
    from: "Trivandrum",
    to: "Alappuzha",
    departure: "12:00 AM",
    bus_type: "Low Floor AC",
    duration: "3h 19m",
    route_highlights: "Trivandrum → Kazhakkoottam → Kaniyapuram → Attingal → Kollam → Karunagappalli → Kayamkulam → Haripad → Ambalapuzha → Alappuzha",
    depot_location: [8.4855, 76.9492] // Trivandrum coordinates
  },
  {
    id: 19,
    name: "KSRTC TVM-002",
    from: "Trivandrum",
    to: "Alappuzha",
    departure: "12:01 AM",
    bus_type: "Super Fast",
    duration: "3h 49m",
    route_highlights: "Trivandrum → Kazhakkoottam → Kaniyapuram → Attingal → Chathannoor → Kollam → Karunagappalli → Kayamkulam → Haripad → Ambalapuzha → Alappuzha",
    depot_location: [8.4855, 76.9492]
  },
  // ... continue with all other buses from your document ...

  // Example for Trivandrum to Kottayam
  {
    id: 25,
    name: "KSRTC TVM-008",
    from: "Trivandrum",
    to: "Kottayam",
    departure: "1:00 AM",
    bus_type: "Super Fast",
    route_highlights: "Thiruvananthapuram → Venjaramoodu → Kilimanoor → Chadayamangalam → Ayoor → Valakom → Kottarakkara → Yenath → Adoor → Pandalam → Chengannur → Thiruvalla → Changanassery → Kottayam",
    depot_location: [8.4855, 76.9492]
  },
  // ... add all remaining buses ...
];

// Get unique locations from bus data
export const locations = Array.from(
  new Set(busData.flatMap(bus => [bus.from, bus.to]))
).sort();

// Mock user location (Kochi)
export const defaultUserLocation: [number, number] = [9.9312, 76.2673];
