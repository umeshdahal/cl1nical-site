export type PartyCode = 'D' | 'R' | 'I';

export type StateMeta = {
  abbr: string;
  name: string;
  electoralVotes: number;
  fips: string;
};

export type StatewideOfficer = {
  name: string;
  party: PartyCode;
};

export type CurrentStatewideData = {
  governor: StatewideOfficer;
  senators: [StatewideOfficer, StatewideOfficer];
  presidentialWinner2024: PartyCode;
};

export const STATES: StateMeta[] = [
  { abbr: 'AL', name: 'Alabama', electoralVotes: 9, fips: '01' },
  { abbr: 'AK', name: 'Alaska', electoralVotes: 3, fips: '02' },
  { abbr: 'AZ', name: 'Arizona', electoralVotes: 11, fips: '04' },
  { abbr: 'AR', name: 'Arkansas', electoralVotes: 6, fips: '05' },
  { abbr: 'CA', name: 'California', electoralVotes: 54, fips: '06' },
  { abbr: 'CO', name: 'Colorado', electoralVotes: 10, fips: '08' },
  { abbr: 'CT', name: 'Connecticut', electoralVotes: 7, fips: '09' },
  { abbr: 'DE', name: 'Delaware', electoralVotes: 3, fips: '10' },
  { abbr: 'DC', name: 'District of Columbia', electoralVotes: 3, fips: '11' },
  { abbr: 'FL', name: 'Florida', electoralVotes: 30, fips: '12' },
  { abbr: 'GA', name: 'Georgia', electoralVotes: 16, fips: '13' },
  { abbr: 'HI', name: 'Hawaii', electoralVotes: 4, fips: '15' },
  { abbr: 'ID', name: 'Idaho', electoralVotes: 4, fips: '16' },
  { abbr: 'IL', name: 'Illinois', electoralVotes: 19, fips: '17' },
  { abbr: 'IN', name: 'Indiana', electoralVotes: 11, fips: '18' },
  { abbr: 'IA', name: 'Iowa', electoralVotes: 6, fips: '19' },
  { abbr: 'KS', name: 'Kansas', electoralVotes: 6, fips: '20' },
  { abbr: 'KY', name: 'Kentucky', electoralVotes: 8, fips: '21' },
  { abbr: 'LA', name: 'Louisiana', electoralVotes: 8, fips: '22' },
  { abbr: 'ME', name: 'Maine', electoralVotes: 4, fips: '23' },
  { abbr: 'MD', name: 'Maryland', electoralVotes: 10, fips: '24' },
  { abbr: 'MA', name: 'Massachusetts', electoralVotes: 11, fips: '25' },
  { abbr: 'MI', name: 'Michigan', electoralVotes: 15, fips: '26' },
  { abbr: 'MN', name: 'Minnesota', electoralVotes: 10, fips: '27' },
  { abbr: 'MS', name: 'Mississippi', electoralVotes: 6, fips: '28' },
  { abbr: 'MO', name: 'Missouri', electoralVotes: 10, fips: '29' },
  { abbr: 'MT', name: 'Montana', electoralVotes: 4, fips: '30' },
  { abbr: 'NE', name: 'Nebraska', electoralVotes: 5, fips: '31' },
  { abbr: 'NV', name: 'Nevada', electoralVotes: 6, fips: '32' },
  { abbr: 'NH', name: 'New Hampshire', electoralVotes: 4, fips: '33' },
  { abbr: 'NJ', name: 'New Jersey', electoralVotes: 14, fips: '34' },
  { abbr: 'NM', name: 'New Mexico', electoralVotes: 5, fips: '35' },
  { abbr: 'NY', name: 'New York', electoralVotes: 28, fips: '36' },
  { abbr: 'NC', name: 'North Carolina', electoralVotes: 16, fips: '37' },
  { abbr: 'ND', name: 'North Dakota', electoralVotes: 3, fips: '38' },
  { abbr: 'OH', name: 'Ohio', electoralVotes: 17, fips: '39' },
  { abbr: 'OK', name: 'Oklahoma', electoralVotes: 7, fips: '40' },
  { abbr: 'OR', name: 'Oregon', electoralVotes: 8, fips: '41' },
  { abbr: 'PA', name: 'Pennsylvania', electoralVotes: 19, fips: '42' },
  { abbr: 'RI', name: 'Rhode Island', electoralVotes: 4, fips: '44' },
  { abbr: 'SC', name: 'South Carolina', electoralVotes: 9, fips: '45' },
  { abbr: 'SD', name: 'South Dakota', electoralVotes: 3, fips: '46' },
  { abbr: 'TN', name: 'Tennessee', electoralVotes: 11, fips: '47' },
  { abbr: 'TX', name: 'Texas', electoralVotes: 40, fips: '48' },
  { abbr: 'UT', name: 'Utah', electoralVotes: 6, fips: '49' },
  { abbr: 'VT', name: 'Vermont', electoralVotes: 3, fips: '50' },
  { abbr: 'VA', name: 'Virginia', electoralVotes: 13, fips: '51' },
  { abbr: 'WA', name: 'Washington', electoralVotes: 12, fips: '53' },
  { abbr: 'WV', name: 'West Virginia', electoralVotes: 4, fips: '54' },
  { abbr: 'WI', name: 'Wisconsin', electoralVotes: 10, fips: '55' },
  { abbr: 'WY', name: 'Wyoming', electoralVotes: 3, fips: '56' },
];

export const STATES_BY_ABBR = Object.fromEntries(STATES.map((state) => [state.abbr, state])) as Record<string, StateMeta>;
export const FIPS_TO_ABBR = Object.fromEntries(STATES.map((state) => [state.fips, state.abbr])) as Record<string, string>;

export const CURRENT_STATEWIDE_DATA: Record<string, CurrentStatewideData> = {
  AL: { governor: { name: 'Kay Ivey', party: 'R' }, senators: [{ name: 'Katie Britt', party: 'R' }, { name: 'Tommy Tuberville', party: 'R' }], presidentialWinner2024: 'R' },
  AK: { governor: { name: 'Mike Dunleavy', party: 'R' }, senators: [{ name: 'Lisa Murkowski', party: 'R' }, { name: 'Dan Sullivan', party: 'R' }], presidentialWinner2024: 'R' },
  AZ: { governor: { name: 'Katie Hobbs', party: 'D' }, senators: [{ name: 'Mark Kelly', party: 'D' }, { name: 'Ruben Gallego', party: 'D' }], presidentialWinner2024: 'R' },
  AR: { governor: { name: 'Sarah Huckabee Sanders', party: 'R' }, senators: [{ name: 'John Boozman', party: 'R' }, { name: 'Tom Cotton', party: 'R' }], presidentialWinner2024: 'R' },
  CA: { governor: { name: 'Gavin Newsom', party: 'D' }, senators: [{ name: 'Alex Padilla', party: 'D' }, { name: 'Adam Schiff', party: 'D' }], presidentialWinner2024: 'D' },
  CO: { governor: { name: 'Jared Polis', party: 'D' }, senators: [{ name: 'Michael Bennet', party: 'D' }, { name: 'John Hickenlooper', party: 'D' }], presidentialWinner2024: 'D' },
  CT: { governor: { name: 'Ned Lamont', party: 'D' }, senators: [{ name: 'Richard Blumenthal', party: 'D' }, { name: 'Chris Murphy', party: 'D' }], presidentialWinner2024: 'D' },
  DE: { governor: { name: 'Matt Meyer', party: 'D' }, senators: [{ name: 'Chris Coons', party: 'D' }, { name: 'Lisa Blunt Rochester', party: 'D' }], presidentialWinner2024: 'D' },
  DC: { governor: { name: 'Muriel Bowser', party: 'D' }, senators: [{ name: 'No Senate seat', party: 'D' }, { name: 'No Senate seat', party: 'D' }], presidentialWinner2024: 'D' },
  FL: { governor: { name: 'Ron DeSantis', party: 'R' }, senators: [{ name: 'Ashley Moody', party: 'R' }, { name: 'Rick Scott', party: 'R' }], presidentialWinner2024: 'R' },
  GA: { governor: { name: 'Brian Kemp', party: 'R' }, senators: [{ name: 'Jon Ossoff', party: 'D' }, { name: 'Raphael Warnock', party: 'D' }], presidentialWinner2024: 'R' },
  HI: { governor: { name: 'Josh Green', party: 'D' }, senators: [{ name: 'Brian Schatz', party: 'D' }, { name: 'Mazie Hirono', party: 'D' }], presidentialWinner2024: 'D' },
  ID: { governor: { name: 'Brad Little', party: 'R' }, senators: [{ name: 'Mike Crapo', party: 'R' }, { name: 'Jim Risch', party: 'R' }], presidentialWinner2024: 'R' },
  IL: { governor: { name: 'J.B. Pritzker', party: 'D' }, senators: [{ name: 'Dick Durbin', party: 'D' }, { name: 'Tammy Duckworth', party: 'D' }], presidentialWinner2024: 'D' },
  IN: { governor: { name: 'Mike Braun', party: 'R' }, senators: [{ name: 'Todd Young', party: 'R' }, { name: 'Jim Banks', party: 'R' }], presidentialWinner2024: 'R' },
  IA: { governor: { name: 'Kim Reynolds', party: 'R' }, senators: [{ name: 'Chuck Grassley', party: 'R' }, { name: 'Joni Ernst', party: 'R' }], presidentialWinner2024: 'R' },
  KS: { governor: { name: 'Laura Kelly', party: 'D' }, senators: [{ name: 'Jerry Moran', party: 'R' }, { name: 'Roger Marshall', party: 'R' }], presidentialWinner2024: 'R' },
  KY: { governor: { name: 'Andy Beshear', party: 'D' }, senators: [{ name: 'Mitch McConnell', party: 'R' }, { name: 'Rand Paul', party: 'R' }], presidentialWinner2024: 'R' },
  LA: { governor: { name: 'Jeff Landry', party: 'R' }, senators: [{ name: 'Bill Cassidy', party: 'R' }, { name: 'John Kennedy', party: 'R' }], presidentialWinner2024: 'R' },
  ME: { governor: { name: 'Janet Mills', party: 'D' }, senators: [{ name: 'Susan Collins', party: 'R' }, { name: 'Angus King', party: 'I' }], presidentialWinner2024: 'D' },
  MD: { governor: { name: 'Wes Moore', party: 'D' }, senators: [{ name: 'Chris Van Hollen', party: 'D' }, { name: 'Angela Alsobrooks', party: 'D' }], presidentialWinner2024: 'D' },
  MA: { governor: { name: 'Maura Healey', party: 'D' }, senators: [{ name: 'Elizabeth Warren', party: 'D' }, { name: 'Ed Markey', party: 'D' }], presidentialWinner2024: 'D' },
  MI: { governor: { name: 'Gretchen Whitmer', party: 'D' }, senators: [{ name: 'Gary Peters', party: 'D' }, { name: 'Elissa Slotkin', party: 'D' }], presidentialWinner2024: 'R' },
  MN: { governor: { name: 'Tim Walz', party: 'D' }, senators: [{ name: 'Amy Klobuchar', party: 'D' }, { name: 'Tina Smith', party: 'D' }], presidentialWinner2024: 'D' },
  MS: { governor: { name: 'Tate Reeves', party: 'R' }, senators: [{ name: 'Roger Wicker', party: 'R' }, { name: 'Cindy Hyde-Smith', party: 'R' }], presidentialWinner2024: 'R' },
  MO: { governor: { name: 'Mike Kehoe', party: 'R' }, senators: [{ name: 'Josh Hawley', party: 'R' }, { name: 'Eric Schmitt', party: 'R' }], presidentialWinner2024: 'R' },
  MT: { governor: { name: 'Greg Gianforte', party: 'R' }, senators: [{ name: 'Steve Daines', party: 'R' }, { name: 'Tim Sheehy', party: 'R' }], presidentialWinner2024: 'R' },
  NE: { governor: { name: 'Jim Pillen', party: 'R' }, senators: [{ name: 'Deb Fischer', party: 'R' }, { name: 'Pete Ricketts', party: 'R' }], presidentialWinner2024: 'R' },
  NV: { governor: { name: 'Joe Lombardo', party: 'R' }, senators: [{ name: 'Catherine Cortez Masto', party: 'D' }, { name: 'Jacky Rosen', party: 'D' }], presidentialWinner2024: 'R' },
  NH: { governor: { name: 'Kelly Ayotte', party: 'R' }, senators: [{ name: 'Maggie Hassan', party: 'D' }, { name: 'Jeanne Shaheen', party: 'D' }], presidentialWinner2024: 'D' },
  NJ: { governor: { name: 'Mikie Sherrill', party: 'D' }, senators: [{ name: 'Cory Booker', party: 'D' }, { name: 'Andy Kim', party: 'D' }], presidentialWinner2024: 'D' },
  NM: { governor: { name: 'Michelle Lujan Grisham', party: 'D' }, senators: [{ name: 'Martin Heinrich', party: 'D' }, { name: 'Ben Ray Lujan', party: 'D' }], presidentialWinner2024: 'D' },
  NY: { governor: { name: 'Kathy Hochul', party: 'D' }, senators: [{ name: 'Chuck Schumer', party: 'D' }, { name: 'Kirsten Gillibrand', party: 'D' }], presidentialWinner2024: 'D' },
  NC: { governor: { name: 'Josh Stein', party: 'D' }, senators: [{ name: 'Ted Budd', party: 'R' }, { name: 'Thom Tillis', party: 'R' }], presidentialWinner2024: 'R' },
  ND: { governor: { name: 'Kelly Armstrong', party: 'R' }, senators: [{ name: 'John Hoeven', party: 'R' }, { name: 'Kevin Cramer', party: 'R' }], presidentialWinner2024: 'R' },
  OH: { governor: { name: 'Mike DeWine', party: 'R' }, senators: [{ name: 'Jon Husted', party: 'R' }, { name: 'Bernie Moreno', party: 'R' }], presidentialWinner2024: 'R' },
  OK: { governor: { name: 'Kevin Stitt', party: 'R' }, senators: [{ name: 'James Lankford', party: 'R' }, { name: 'Markwayne Mullin', party: 'R' }], presidentialWinner2024: 'R' },
  OR: { governor: { name: 'Tina Kotek', party: 'D' }, senators: [{ name: 'Ron Wyden', party: 'D' }, { name: 'Jeff Merkley', party: 'D' }], presidentialWinner2024: 'D' },
  PA: { governor: { name: 'Josh Shapiro', party: 'D' }, senators: [{ name: 'John Fetterman', party: 'D' }, { name: 'Dave McCormick', party: 'R' }], presidentialWinner2024: 'R' },
  RI: { governor: { name: 'Dan McKee', party: 'D' }, senators: [{ name: 'Jack Reed', party: 'D' }, { name: 'Sheldon Whitehouse', party: 'D' }], presidentialWinner2024: 'D' },
  SC: { governor: { name: 'Henry McMaster', party: 'R' }, senators: [{ name: 'Lindsey Graham', party: 'R' }, { name: 'Tim Scott', party: 'R' }], presidentialWinner2024: 'R' },
  SD: { governor: { name: 'Larry Rhoden', party: 'R' }, senators: [{ name: 'John Thune', party: 'R' }, { name: 'Mike Rounds', party: 'R' }], presidentialWinner2024: 'R' },
  TN: { governor: { name: 'Bill Lee', party: 'R' }, senators: [{ name: 'Marsha Blackburn', party: 'R' }, { name: 'Bill Hagerty', party: 'R' }], presidentialWinner2024: 'R' },
  TX: { governor: { name: 'Greg Abbott', party: 'R' }, senators: [{ name: 'John Cornyn', party: 'R' }, { name: 'Ted Cruz', party: 'R' }], presidentialWinner2024: 'R' },
  UT: { governor: { name: 'Spencer Cox', party: 'R' }, senators: [{ name: 'Mike Lee', party: 'R' }, { name: 'John Curtis', party: 'R' }], presidentialWinner2024: 'R' },
  VT: { governor: { name: 'Phil Scott', party: 'R' }, senators: [{ name: 'Peter Welch', party: 'D' }, { name: 'Bernie Sanders', party: 'I' }], presidentialWinner2024: 'D' },
  VA: { governor: { name: 'Abigail Spanberger', party: 'D' }, senators: [{ name: 'Mark Warner', party: 'D' }, { name: 'Tim Kaine', party: 'D' }], presidentialWinner2024: 'D' },
  WA: { governor: { name: 'Bob Ferguson', party: 'D' }, senators: [{ name: 'Patty Murray', party: 'D' }, { name: 'Maria Cantwell', party: 'D' }], presidentialWinner2024: 'D' },
  WV: { governor: { name: 'Patrick Morrisey', party: 'R' }, senators: [{ name: 'Shelley Moore Capito', party: 'R' }, { name: 'Jim Justice', party: 'R' }], presidentialWinner2024: 'R' },
  WI: { governor: { name: 'Tony Evers', party: 'D' }, senators: [{ name: 'Tammy Baldwin', party: 'D' }, { name: 'Ron Johnson', party: 'R' }], presidentialWinner2024: 'R' },
  WY: { governor: { name: 'Mark Gordon', party: 'R' }, senators: [{ name: 'John Barrasso', party: 'R' }, { name: 'Cynthia Lummis', party: 'R' }], presidentialWinner2024: 'R' },
};
