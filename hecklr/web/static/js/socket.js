import {Socket} from 'phoenix'

const socket = new Socket('/socket', {
  params: {
    token: window.userToken
  },
  logger: (kind, msg, data) => console.log(`%c${kind}:%c ${msg} - %o`, 'background-color: blue', 'color: white', data)
});

export default socket
