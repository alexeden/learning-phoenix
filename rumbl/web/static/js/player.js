import { height, width } from './player-config';

export const Player = {
  player: null,

  init(domId, playerId, onReady) {
    window.onYouTubeIframeAPIReady = () => this.onIframeReady(domId, playerId, onReady);

    const youtubeScriptTag = document.createElement('script');
    youtubeScriptTag.src = '//www.youtube.com/iframe_api';
    document.head.appendChild(youtubeScriptTag);
  },

  onIframeReady(domId, videoId, onReady) {
    this.player = new window['YT'].Player(
      domId,
      {
        height,
        width,
        videoId,
        events: {
          onReady: event => onReady(event),
          onStateChange: event => this.onPlayerStateChange(event)
        }
      }
    );
  },

  onPlayerStateChange(event) {

  },

  getCurrentTime() {
    return Math.floor(this.player.getCurrentTime() * 1000)
  },

  seekTo(ms) {
    return this.player.seekTo(ms / 1000)
  }
};
