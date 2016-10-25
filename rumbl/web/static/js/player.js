import * as Rx from 'rxjs';
import { PlayerConfig } from './player-config';

export const tag = (msg = '') =>
  ({
    next: v => console.log(`${msg} | next: `, v) || v,
    error: e => console.error(`${msg} | error: `, e) || e,
    complete: () => console.log(`${msg} | complete`)
  });

export const Player = {
  player: null,
  currentTime$: Rx.Observable.empty(),

  init(domId, videoId, onReady) {
    window.onYouTubeIframeAPIReady = () => {
      const playerStateChanges$ = new Rx.Subject();

      const player = new window['YT'].Player(domId, PlayerConfig({
        videoId,
        events: {
          onReady: event => onReady(event),
          onStateChange: event => playerStateChanges$.next(event)
        }
      }));

      this.currentTime$ = Rx.Observable.merge(
          Rx.Observable.interval(1000),
          playerStateChanges$
        )
        .map(() => player.getCurrentTime())
        .map(time => Math.floor(time  * 1000))
        .distinctUntilChanged()
        .publishReplay(1);

      this.player = player;
      this.currentTime$.connect();
    };

    const youtubeScriptTag = document.createElement('script');
    youtubeScriptTag.src = '//www.youtube.com/iframe_api';
    document.head.appendChild(youtubeScriptTag);
  },

  getCurrentTime$() {
    return Rx.Observable
      .interval(1000)
      .do(tag('getCurrentTime$'))
      .map(() => this.getCurrentTime());
  },

  onPlayerStateChange(event) {
    console.log('player state change event: ', event);
  },

  getCurrentTime() {
    return Math.floor(this.player.getCurrentTime() * 1000)
  },

  seekTo(ms) {
    return this.player.seekTo(ms / 1000)
  }
};

window['Player'] = Player;
