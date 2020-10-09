var getId = () => {
  let number_10 = (Math.random() * 1000000000).toFixed()
  let number_36 = number_10.toString(36)
  return number_36
}

module.exports.getId = getId