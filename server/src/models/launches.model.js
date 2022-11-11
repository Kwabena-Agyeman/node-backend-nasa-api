const launchesModel = require('./launches.mongo');
const planetsModel = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

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

async function existsLaunchesWithId(launchId) {
  return await launchesModel.findOne({ flightNumber: launchId });
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

  const savedPlanet = await launchesModel.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
      new: true,
    }
  );

  return savedPlanet;
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = {
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
    flightNumber: newFlightNumber,
    ...launch,
  };

  const savedLaunch = await saveLaunch(newLaunch);
  return savedLaunch;
}

async function abortLaunchById(launchId) {
  const aborted = await launchesModel.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  // Check if the operation acknowledged completion and the modified count = 1
  return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchesWithId,
  abortLaunchById,
};
