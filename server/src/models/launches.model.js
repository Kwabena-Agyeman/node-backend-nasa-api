const launchesModel = require('./launches.mongo');
const planetsModel = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: 'Kepler mission 1',
  rocket: 'Explorer IS1',
  launchDate: new Date('Decemeber 27,2031'),
  target: 'Kepler-442 b',
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

function existsLaunchesWithId(launchId) {
  return launches.has(launchId);
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesModel.findOne().sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return launchesModel.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planetsModel.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet was found');
  }

  await launchesModel.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = {
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
    flightNumber: newFlightNumber,
    ...launch,
  };

  await saveLaunch(newLaunch);
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchesWithId,
  abortLaunchById,
};
