import { Player, tag } from './player';
import { Observable } from 'rxjs';
import * as R from 'ramda';
const { pipe, compose, prop, map, of, lensPath, apply } = R;

const log = x => console.log(x) || x;
const tagError = (msg = '') => data => console.error(`${msg} error: `, data) || data;
const attr = (elem, attr) => elem.getAttribute(attr);
const dataAttr = (elem, attribute) => attr(elem, `data-${attribute}`);
const elemById = id => document.getElementById(id);

const formatTime =
  at => {
    const d = new Date(null);
    d.setSeconds(at/1000);
    return d.toISOString().substr(14, 5);
  };

const escape =
  str => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

const templatize =
  a =>
    Object.assign({}, a, {
      $elem: Object.assign(document.createElement('div'), {
        id: `annotation-${a.id}`,
        innerHTML: `
          <a href="#">
            [${formatTime(a.at)}]
            <b>${escape(a.user.username)}</b>: ${escape(a.body)}
          </a>`,
        onclick: () => Player.seekTo(a.at)
      })
    });

const scheduleMessages =
  msgContainer => annotations =>
    Player.currentTime$
      .map(t => [
        annotations.filter(a => a.at <= t && !a.$elem.isConnected),
        annotations.filter(a => a.at > t && a.$elem.isConnected)
      ])
      .subscribe(([show, hide]) => {
        show.map(({$elem}) => msgContainer.appendChild($elem));
        hide.map(({$elem}) => msgContainer.removeChild($elem));
      });

export const Video = {

  init(socket, elem) {
    if(!elem) return;
    socket.connect();
    Player.init(elem.id, dataAttr(elem, 'player-id'),
      () => this.onReady(dataAttr(elem, 'id'), socket)
    );
  },

  onReady(videoId, socket) {
    const msgContainer = window['msgContainer'] = elemById('msg-container');
    const msgInput = window['msgInput'] = elemById('msg-input');
    const postButton = elemById('msg-submit');
    const vidChannel = socket.channel(`videos:${videoId}`);
    const renderer = scheduleMessages(msgContainer);
    const setLastSeenId = id => vidChannel.params.last_seen_id = id;

    postButton.addEventListener('click', e => {
      if(!msgInput.value || msgInput.value.length < 1) return;

      vidChannel
        .push('new_annotation', {
          body: msgInput.value || '',
          at: Player.getCurrentTime()
        })
        .receive('error', tagError('new_annotation'))
        .receive('ok', () => msgInput.value = '');
    });

    vidChannel.on('new_annotation', compose(renderer, of, templatize));
    vidChannel.on('new_annotation', compose(setLastSeenId, prop('id')));

    vidChannel.join()
      .receive('ok', compose(renderer, map(templatize), prop('annotations')))
      .receive('ok', compose(setLastSeenId, apply(Math.max), map(prop('id')), prop('annotations')))
      .receive('error', tagError('join failed'))
  }

};
