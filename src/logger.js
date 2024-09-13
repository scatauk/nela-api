function logger(message) {
  if (process.env.NELA_DEBUG === "true") {
    console.log(message);
  }
}

module.exports = { logger };
