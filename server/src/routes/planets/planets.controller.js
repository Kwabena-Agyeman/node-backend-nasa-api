const { getAllPlanets } = require('../../models/planets.model');

const httpGetAllPlanets = async (req, res) => {
  return res.status(200).json(getAllPlanets());
};

module.exports = {
  httpGetAllPlanets,
};
