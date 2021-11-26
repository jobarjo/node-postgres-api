module.exports = (serverConfig) => (req, res) => res.json({
  version: process.env.npm_package_version,
  serverConfig,
});
