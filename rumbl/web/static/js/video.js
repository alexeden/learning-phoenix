import { Player } from './player';

const log = console.log.bind(console);
const tag = (msg = '') => data => console.log(`${msg}: `, data) || data;
const tagError = (msg = '') => data => console.error(`${msg} error: `, data) || data;
const attr = (elem, attr) => elem.getAttribute(attr);
const dataAttr = (elem, attribute) => attr(elem, `data-${attribute}`);
const elemById = id => document.getElementById(id);


const esc = str => {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const renderAnnotation = msgContainer =>
  ({user, body, at}) => {
    const template = document.createElement('div');
    template.innerHTML = `
      <a href="#" data-seek="${esc(at)}">
        <b>${esc(user.username)}</b>: ${esc(body)}
      </a>
    `;
    msgContainer.appendChild(template);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  };


export const Video = {

  init(socket, elem) {
    if(!elem) return;

    socket.connect();

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
    const vidChannel = socket.channel(`videos:${videoId}`);

    postButton.addEventListener('click', e => {
      const payload = {
        body: msgInput.value,
        at: Player.getCurrentTime()
      };

      vidChannel
        .push('new_annotation', payload)
        .receive('error', tagError('new_annotation'));

      msgInput.value = '';
    });


    vidChannel.on('new_annotation', renderAnnotation(msgContainer));
    vidChannel.on('ping', ({count}) => log('PING!', count));

    vidChannel.join()
      .receive('ok', tag('joined the video channel'))
      .receive('error', tagError('join failed'))
  }


};
