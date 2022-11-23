const axios = require('axios');

const launchesModel = require('./launches.mongo');
const planetsModel = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

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
async function populateSpaceXLaunches() {
  console.log('Downloading spaceX launch data...');

  // This Post request returns launch data from the spaceX REST Api
  // The options object allows us to populate our launches data with data from other collections in the spaceX Mongo Database. i.e => populate the luabches data with data from the rockets and payloads collections
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log('Error downloading spaceX date');
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload) => {
      return payload.customers;
    });
    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers: customers,
    };
    await saveLaunch(launch);
  }
}

async function loadSpaceXLaunchesData() {
  const firstSpaceXLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (firstSpaceXLaunch) {
    console.log('SpaceX launch data already loaded!');
  } else {
    await populateSpaceXLaunches();
  }
}

async function findLaunch(filter) {
  return await launchesModel.findOne(filter);
}

async function existsLaunchesWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesModel.findOne().sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return launchesModel.find({}, { _id: 0, __v: 0 }).skip(skip).limit(limit);
}

async function saveLaunch(launch) {
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
  const planet = await planetsModel.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet was found');
  }
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
  loadSpaceXLaunchesData,
};
