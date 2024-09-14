function logger(message) {
  if (process.env.NELA_DEBUG === 'true') {
    console.log(message); // eslint-disable-line no-console
  }
}

module.exports = { logger };
