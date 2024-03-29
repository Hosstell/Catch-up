export default {
  width: 800,
  height: 800,
  dragCoefficient: 0.94,
  borderCoefficient: 0.3,
  waitAfterStatusFalse: 5000,
  tickTime: 10, // ms
  keyboard: {
    '87': 'up',
    '83': 'down',
    '68': 'left',
    '65': 'right'
  },
  myId: null,
  protectCode: null,
  serverHost: window.location.host
}