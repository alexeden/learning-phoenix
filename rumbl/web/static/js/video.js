import { Player, tag } from './player';
import { Observable } from 'rxjs';
import * as R from 'ramda';
const { pipe, compose, prop, map, of } = R;

const log = console.log.bind(console);
const tagError = (msg = '') => data => console.error(`${msg} error: `, data) || data;
const attr = (elem, attr) => elem.getAttribute(attr);
const dataAttr = (elem, attribute) => attr(elem, `data-${attribute}`);
const elemById = id => document.getElementById(id);

const formatTime = at => new Date(null).setSeconds(at/1000).toISOString().substr(14, 5);

const escape =
  str => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

const templatize = a =>
  Object.assign({}, a, {
    $id: `annotation-${a.id}`,
    $elem: Object.assign(document.createElement('div'), {
      id: `annotation-${a.id}`,
      innerHTML: `
        <a href="#" data-seek="${escape(a.at)}">
          <b>${escape(a.user.username)}</b>: ${escape(a.body)}
        </a>`
    })
  });

const renderAnnotation =
  msgContainer => annotation => {
    const {$elem} = annotation;
    msgContainer.appendChild($elem);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    return annotation;
  };


const renderAtTime =
  msgContainer => (seconds, annos) => {

  };

const scheduleMessages =
  msgContainer => annotations => {
    Player.currentTime$
      .map(t => [
        /* show */ annotations.filter(a => a.at <= t && !a.$elem.isConnected),
        /* hide */ annotations.filter(a => a.at > t && a.$elem.isConnected)
      ])
      .subscribe(([show, hide]) => {
        show.map(({$elem}) => msgContainer.appendChild($elem));
        hide.map(({$elem}) => msgContainer.removeChild($elem));
        console.log('show: ', show);
        console.log('hide: ', hide);
      });
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
    const msgContainer = window['msgContainer'] = elemById('msg-container');
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

    const renderer = scheduleMessages(msgContainer);

    vidChannel.on('new_annotation', compose(renderer, of, templatize));
    vidChannel.on('ping', ({count}) => log('PING!', count));

    vidChannel.join()
      .receive(
        'ok',
        pipe(
          prop('annotations'),
          map(templatize),
          renderer
        )
      )
      .receive('error', tagError('join failed'))
  }


};
