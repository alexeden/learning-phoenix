import { Player } from './player';

const attr = (elem, attr) => elem.getAttribute(attr);
const dataAttr = (elem, attribute) => attr(elem, `data-${attribute}`);
const elemById = id => document.getElementById(id);

export const Video = {

  init(socket, elem) {
    if(!elem) return;

    socket.connect();
    console.log('socket connected');

    Player.init(
      elem.id,
      dataAttr(elem, 'player-id'),
      () => this.onReady(dataAttr(elem, 'id'), socket)
    );
  },

  onReady(videoId, socket) {
    const msgContainer = elemById('msg-container');
    const msgInput = elemById('msg-input');
    const postButton = elemById('msg-submit');
    const vidChannel = elemById(`videos:${videoId}`);

    // TODO: join the vidChannel
  }

};
