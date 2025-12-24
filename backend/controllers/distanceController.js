const axios = require("axios");

const getDistance = async (req, res) => {
  const { lat, lng, destination } = req.query;

  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/distancematrix/json",
    {
      params: {
        origins: `${lat},${lng}`,
        destinations: destination,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    }
  );

  res.json(response.data.rows[0].elements[0]);
};

module.exports = { getDistance };
