// Source: Rubbish_Routes_2026_Updated_TOO.pdf + 2026_Recycling_Schedule.pdf
// New schedule effective June 1, 2026
// Mon/Tue/Wed: RUBBISH every week, RECYCLING every other week (A/B routes)
// A Routes begin week of June 8, B Routes begin week of June 1

const STREET_DATA = [
    // Monday A — rubbish every Mon, recycling on A weeks
    { name: "Baintree", route: "A", day: "Monday" },
    { name: "Cedar", segment: "Warrensville to S. Green", route: "A", day: "Monday" },
    { name: "Churchill", route: "A", day: "Monday" },
    { name: "Groveland", route: "A", day: "Monday" },
    { name: "Lalemant", route: "A", day: "Monday" },
    { name: "Laurelhurst", segment: "E. Carroll to University Pkwy", route: "A", day: "Monday" },
    { name: "Loyola", route: "A", day: "Monday" },
    { name: "Milton", segment: "North of E. Carroll", route: "A", day: "Monday" },
    { name: "S. Green", segment: "Cedar to E. Carroll", route: "A", day: "Monday" },
    { name: "Silsby", segment: "S. Belvoir to S. Green", route: "A", day: "Monday" },
    { name: "Summerfield", route: "A", day: "Monday" },
    { name: "University Parkway", route: "A", day: "Monday" },
    { name: "White", route: "A", day: "Monday" },
    { name: "Wrenford", segment: "South of S. Belvoir", route: "A", day: "Monday" },

    // Monday B — rubbish every Mon, recycling on B weeks
    { name: "Bromley", route: "B", day: "Monday" },
    { name: "Carroll", route: "B", day: "Monday" },
    { name: "Claver", route: "B", day: "Monday" },
    { name: "E. Carroll", route: "B", day: "Monday" },
    { name: "Elmdale", route: "B", day: "Monday" },
    { name: "Hadleigh", route: "B", day: "Monday" },
    { name: "Kerwick", route: "B", day: "Monday" },
    { name: "Lafayette", route: "B", day: "Monday" },
    { name: "Laurelhurst", segment: "E. Carroll to Milton", route: "B", day: "Monday" },
    { name: "Milton", segment: "E. Carroll to Fairmount", route: "B", day: "Monday" },
    { name: "Rubyvale", route: "B", day: "Monday" },
    { name: "S. Belvoir", route: "B", day: "Monday" },
    { name: "S. Green", segment: "E. Carroll to Fairmount", route: "B", day: "Monday" },
    { name: "Washington", segment: "S. Belvoir to Fairmount", route: "B", day: "Monday" },
    { name: "Whiton", route: "B", day: "Monday" },

    // Tuesday A — rubbish every Tue, recycling on A weeks
    { name: "Bushnell", route: "A", day: "Tuesday" },
    { name: "Conover", route: "A", day: "Tuesday" },
    { name: "Fenwick", segment: "Silsby to Cedar", route: "A", day: "Tuesday" },
    { name: "Fenwood", route: "A", day: "Tuesday" },
    { name: "Glendon", route: "A", day: "Tuesday" },
    { name: "Hillbrook", segment: "Fenwood to Warrensville", route: "A", day: "Tuesday" },
    { name: "Lansdale", route: "A", day: "Tuesday" },
    { name: "Meadowbrook", segment: "Milford to Washington", route: "A", day: "Tuesday" },
    { name: "Milford", route: "A", day: "Tuesday" },
    { name: "Miramar", route: "A", day: "Tuesday" },
    { name: "Silsby", segment: "Warrensville to S. Belvoir", route: "A", day: "Tuesday" },
    { name: "Traymore", segment: "Warrensville to Silsby", route: "A", day: "Tuesday" },
    { name: "Vernon", route: "A", day: "Tuesday" },
    { name: "Warrensville", route: "A", day: "Tuesday" },
    { name: "Washington", segment: "Cedar to S. Belvoir", route: "A", day: "Tuesday" },
    { name: "Westwood", route: "A", day: "Tuesday" },
    { name: "Wrenford", segment: "North of S. Belvoir", route: "A", day: "Tuesday" },

    // Tuesday B — rubbish every Tue, recycling on B weeks
    { name: "Bethany", route: "B", day: "Tuesday" },
    { name: "Channing", segment: "Hillbrook to University Blvd", route: "B", day: "Tuesday" },
    { name: "Charney", segment: "Hillbrook to Edgerton", route: "B", day: "Tuesday" },
    { name: "Dysart", segment: "Hillbrook to Charney", route: "B", day: "Tuesday" },
    { name: "Eardley", route: "B", day: "Tuesday" },
    { name: "Faversham", route: "B", day: "Tuesday" },
    { name: "Fenwick", segment: "Traymore to Silsby", route: "B", day: "Tuesday" },
    { name: "Grenville", route: "B", day: "Tuesday" },
    { name: "Hillbrook", segment: "Meadowbrook to Warrensville", route: "B", day: "Tuesday" },
    { name: "Meadowbrook", segment: "Charney to Warrensville", route: "B", day: "Tuesday" },
    { name: "Saybrook", segment: "Hillbrook to University Blvd", route: "B", day: "Tuesday" },
    { name: "Traymore", segment: "Warrensville to Claridge Oval", route: "B", day: "Tuesday" },
    { name: "Tyndall", route: "B", day: "Tuesday" },
    { name: "University Blvd", route: "B", day: "Tuesday" },

    // Wednesday A — rubbish every Wed, recycling on A weeks
    { name: "Barrington", route: "A", day: "Wednesday" },
    { name: "Brockway", route: "A", day: "Wednesday" },
    { name: "Cedar", segment: "S. Taylor to Fenwick", route: "A", day: "Wednesday" },
    { name: "Cedarbrook", route: "A", day: "Wednesday" },
    { name: "Cranston", route: "A", day: "Wednesday" },
    { name: "Edgerton", segment: "Silsby to Washington", route: "A", day: "Wednesday" },
    { name: "Farland", route: "A", day: "Wednesday" },
    { name: "Jackson", route: "A", day: "Wednesday" },
    { name: "Raymont", route: "A", day: "Wednesday" },
    { name: "S. Taylor", route: "A", day: "Wednesday" },
    { name: "Silsby", segment: "Warrensville to S. Taylor", route: "A", day: "Wednesday" },
    { name: "Staunton", route: "A", day: "Wednesday" },
    { name: "Thayne", route: "A", day: "Wednesday" },
    { name: "Tullamore", route: "A", day: "Wednesday" },
    { name: "Washington", segment: "Wynn to Cedar", route: "A", day: "Wednesday" },
    { name: "Wynn", route: "A", day: "Wednesday" },

    // Wednesday B — rubbish every Wed, recycling on B weeks
    { name: "Allison", route: "B", day: "Wednesday" },
    { name: "Ashurst", route: "B", day: "Wednesday" },
    { name: "Bradford", route: "B", day: "Wednesday" },
    { name: "Canterbury", route: "B", day: "Wednesday" },
    { name: "Charney", segment: "Hillbrook to Claridge Oval", route: "B", day: "Wednesday" },
    { name: "Claridge Oval", route: "B", day: "Wednesday" },
    { name: "Dysart", segment: "Hillbrook to Claridge Oval", route: "B", day: "Wednesday" },
    { name: "E. Scarborough", route: "B", day: "Wednesday" },
    { name: "Eaton", route: "B", day: "Wednesday" },
    { name: "Edgerton", segment: "Silsby to Fairmount", route: "B", day: "Wednesday" },
    { name: "Meadowbrook", segment: "Charney to Cleveland Hts", route: "B", day: "Wednesday" },
    { name: "Nordway", route: "B", day: "Wednesday" },
    { name: "Northcliffe", route: "B", day: "Wednesday" },
    { name: "Northwood", route: "B", day: "Wednesday" },
    { name: "Scholl", route: "B", day: "Wednesday" }
];

// 2026 Holidays — city holidays delay pickup by one day
const HOLIDAYS_2026 = [
    { date: "2026-01-01", name: "New Year's Day", day: 4 },
    { date: "2026-01-19", name: "MLK Day", day: 1 },
    { date: "2026-02-16", name: "President's Day", day: 1 },
    { date: "2026-05-25", name: "Memorial Day", day: 1 },
    { date: "2026-06-19", name: "Juneteenth", day: 5 },
    { date: "2026-07-03", name: "Independence Day (Observed)", day: 5 },
    { date: "2026-09-07", name: "Labor Day", day: 1 },
    { date: "2026-11-11", name: "Veterans Day", day: 3 },
    { date: "2026-11-26", name: "Thanksgiving", day: 4 },
    { date: "2026-12-25", name: "Christmas", day: 5 }
];

// Reference Monday of an A week
const A_ROUTE_START = "2026-01-05";
