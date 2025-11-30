// Source: Recycling-Routes.pdf
const STREET_DATA = [
    // Monday A
    { name: "Baintree", route: "A", day: "Monday" },
    { name: "Cedar", segment: "S. Belvoir to S. Green", route: "A", day: "Monday" },
    { name: "Churchill", route: "A", day: "Monday" },
    { name: "Groveland", route: "A", day: "Monday" },
    { name: "Laurelhurst", segment: "E. Carroll to University Pkwy", route: "A", day: "Monday" },
    { name: "Milton", segment: "North of E. Carroll", route: "A", day: "Monday" },
    { name: "Silsby", segment: "S. Belvoir to S. Green", route: "A", day: "Monday" },
    { name: "S. Green", segment: "Cedar to E. Carroll", route: "A", day: "Monday" },
    { name: "Summerfield", route: "A", day: "Monday" },
    { name: "University Parkway", route: "A", day: "Monday" },
    { name: "White", route: "A", day: "Monday" },
    { name: "Wrenford", segment: "South of S. Belvoir", route: "A", day: "Monday" },

    // Monday B
    { name: "Bromley", route: "B", day: "Monday" },
    { name: "Claver", route: "B", day: "Monday" },
    { name: "E. Carroll", route: "B", day: "Monday" },
    { name: "Elmdale", route: "B", day: "Monday" },
    { name: "Lafayette", route: "B", day: "Monday" },
    { name: "Laurelhurst", segment: "E. Carroll to Milton", route: "B", day: "Monday" },
    { name: "Milton", segment: "E. Carroll to Fairmount", route: "B", day: "Monday" },
    { name: "Rubyvale", route: "B", day: "Monday" },
    { name: "S. Belvoir", route: "B", day: "Monday" },
    { name: "S. Green", segment: "E. Carroll to Fairmount", route: "B", day: "Monday" },
    { name: "Washington", segment: "S. Belvoir to Fairmount", route: "B", day: "Monday" },
    { name: "Whiton", route: "B", day: "Monday" },

    // Tuesday A
    { name: "Bushnell", segment: "Warrensville to Wrenford", route: "A", day: "Tuesday" },
    { name: "Cedar", segment: "Warrensville to S. Belvoir", route: "A", day: "Tuesday" },
    { name: "Conover", route: "A", day: "Tuesday" },
    { name: "Fenwood", route: "A", day: "Tuesday" },
    { name: "Glendon", route: "A", day: "Tuesday" },
    { name: "Hillbrook", segment: "Fenwood to Warrensville", route: "A", day: "Tuesday" },
    { name: "Lalemant", route: "A", day: "Tuesday" },
    { name: "Loyola", route: "A", day: "Tuesday" },
    { name: "Meadowbrook", segment: "Milford to Washington", route: "A", day: "Tuesday" },
    { name: "Miramar", route: "A", day: "Tuesday" },
    { name: "Silsby", segment: "Warrensville to S. Belvoir", route: "A", day: "Tuesday" },
    { name: "Traymore", segment: "Warrensville to Silsby", route: "A", day: "Tuesday" },
    { name: "Washington", segment: "Warrensville to S. Belvoir", route: "A", day: "Tuesday" },
    { name: "Wrenford", segment: "North of S. Belvoir", route: "A", day: "Tuesday" },

    // Tuesday B
    { name: "Carroll", route: "B", day: "Tuesday" },
    { name: "Channing", segment: "Hillbrook to University Blvd", route: "B", day: "Tuesday" },
    { name: "Fenwick", segment: "Traymore to Hillbrook", route: "B", day: "Tuesday" },
    { name: "Hadleigh", route: "B", day: "Tuesday" },
    { name: "Hillbrook", segment: "Fenwick to Warrensville", route: "B", day: "Tuesday" },
    { name: "Kerwick", route: "B", day: "Tuesday" },
    { name: "Meadowbrook", segment: "Fenwick to Warrensville", route: "B", day: "Tuesday" },
    { name: "Milford", route: "B", day: "Tuesday" },
    { name: "Saybrook", segment: "Hillbrook to University Blvd", route: "B", day: "Tuesday" },
    { name: "Traymore", segment: "Hillbrook to Claridge Oval", route: "B", day: "Tuesday" },
    { name: "Tyndall", route: "B", day: "Tuesday" },
    { name: "University Blvd", route: "B", day: "Tuesday" },
    { name: "Warrensville", route: "B", day: "Tuesday" },

    // Wednesday A
    { name: "Cedar", segment: "S. Taylor to Fenwick", route: "A", day: "Wednesday" },
    { name: "Cedarbrook", route: "A", day: "Wednesday" },
    { name: "Farland", route: "A", day: "Wednesday" },
    { name: "Jackson", route: "A", day: "Wednesday" },
    { name: "Raymont", route: "A", day: "Wednesday" },
    { name: "S. Taylor", route: "A", day: "Wednesday" },
    { name: "Staunton", route: "A", day: "Wednesday" },
    { name: "Thayne", route: "A", day: "Wednesday" },
    { name: "Tullamore", route: "A", day: "Wednesday" },
    { name: "Washington", segment: "Wynn to Cedar", route: "A", day: "Wednesday" },
    { name: "Wynn", route: "A", day: "Wednesday" },

    // Wednesday B
    { name: "Barrington", route: "B", day: "Wednesday" },
    { name: "Brockway", route: "B", day: "Wednesday" },
    { name: "Bushnell", segment: "Edgerton to Warrensville", route: "B", day: "Wednesday" },
    { name: "Cranston", route: "B", day: "Wednesday" },
    { name: "Edgerton", segment: "Silsby to Washington", route: "B", day: "Wednesday" },
    { name: "Fenwick", segment: "Silsby to Cedar", route: "B", day: "Wednesday" },
    { name: "Lansdale", route: "B", day: "Wednesday" },
    { name: "Silsby", segment: "Warrensville to S. Taylor", route: "B", day: "Wednesday" },
    { name: "Vernon", route: "B", day: "Wednesday" },
    { name: "Washington", segment: "Cedar to Silsby", route: "B", day: "Wednesday" },
    { name: "Westwood", route: "B", day: "Wednesday" },

    // Thursday A
    { name: "Bethany", route: "A", day: "Thursday" },
    { name: "Channing", segment: "Traymore to Hillbrook", route: "A", day: "Thursday" },
    { name: "Charney", route: "A", day: "Thursday" },
    { name: "Dysart", route: "A", day: "Thursday" },
    { name: "Eardley", route: "A", day: "Thursday" },
    { name: "Faversham", route: "A", day: "Thursday" },
    { name: "Fenwick", segment: "Silsby to Hillbrook", route: "A", day: "Thursday" },
    { name: "Grenville", route: "A", day: "Thursday" },
    { name: "Hillbrook", segment: "Fenwick to Meadowbrook", route: "A", day: "Thursday" },
    { name: "Meadowbrook", segment: "Dysart to Fenwick", route: "A", day: "Thursday" },
    { name: "Northwood", route: "A", day: "Thursday" },
    { name: "Saybrook", segment: "Silsby to Hillbrook", route: "A", day: "Thursday" },
    { name: "Traymore", segment: "Warrensville to Hillbrook", route: "A", day: "Thursday" },

    // Thursday B
    { name: "Allison", route: "B", day: "Thursday" },
    { name: "Ashurst", route: "B", day: "Thursday" },
    { name: "Bradford", route: "B", day: "Thursday" },
    { name: "Canterbury", route: "B", day: "Thursday" },
    { name: "Claridge Oval", route: "B", day: "Thursday" },
    { name: "E. Scarborough", route: "B", day: "Thursday" },
    { name: "Eaton", route: "B", day: "Thursday" },
    { name: "Edgerton", segment: "Silsby to Fairmount", route: "B", day: "Thursday" },
    { name: "Meadowbrook", segment: "Dysart to Cleveland Hts", route: "B", day: "Thursday" },
    { name: "Northcliffe", route: "B", day: "Thursday" },
    { name: "Scholl", route: "B", day: "Thursday" }
];

// 2026 Holidays that affect schedule (Mon-Thu pickups, or Fri if delayed)
// Note: City holidays delay pickup by one day.
const HOLIDAYS_2026 = [
    { date: "2026-01-01", name: "New Year's Day", day: 4 }, // Thursday
    { date: "2026-01-19", name: "MLK Day", day: 1 }, // Monday
    { date: "2026-02-16", name: "President's Day", day: 1 }, // Monday
    { date: "2026-05-25", name: "Memorial Day", day: 1 }, // Monday
    { date: "2026-06-19", name: "Juneteenth", day: 5 }, // Friday (No impact on Mon-Thu routes usually)
    { date: "2026-07-03", name: "Independence Day (Observed)", day: 5 }, // Friday (July 4 is Sat)
    { date: "2026-09-07", name: "Labor Day", day: 1 }, // Monday
    { date: "2026-11-11", name: "Veterans Day", day: 3 }, // Wednesday
    { date: "2026-11-26", name: "Thanksgiving", day: 4 }, // Thursday
    { date: "2026-12-25", name: "Christmas", day: 5 } // Friday
];

// Reference date for A Route cycle (Monday of an A week)
const A_ROUTE_START = "2026-01-05";
