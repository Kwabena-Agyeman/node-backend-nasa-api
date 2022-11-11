const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchesWithId,
  abortLaunchById,
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  launch.launchDate = new Date(launch.launchDate);
  const scheduledLaunch = await scheduleNewLaunch(launch);

  return res.status(201).json(scheduledLaunch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  // If launch does not exist

  const exisitsLaunch = await existsLaunchesWithId(launchId);

  if (!exisitsLaunch) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }

  const aborted = await abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
