const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler mission 1',
  rocket: 'Explorer IS1',
  launchDate: new Date('Decemeber 27,2030'),
  target: 'Kepler-442 b',
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(latestFlightNumber, {
    flightNumber: latestFlightNumber,
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
    ...launch,
  });
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
};
