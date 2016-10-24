import 'phoenix_html';
import { Player } from './player';

const video = document.getElementById('video');

if(video) {
  Player.init(video.id, video.getAttribute('data-player-id'), () => console.log(`${video.id} player ready!`));
}
