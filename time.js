let tickTime = 10

var getCurrentTime = () => {
  return Math.trunc(new Date().getTime() / tickTime) * tickTime
}

module.exports.getCurrentTime = getCurrentTime;