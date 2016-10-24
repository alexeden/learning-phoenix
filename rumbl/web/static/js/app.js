import 'phoenix_html';
import socket from './socket';
import { Video } from './video';

const video = document.getElementById('video');

Video.init(socket, document.getElementById('video'));
// video.id, video.getAttribute('data-player-id'), () => console.log(`${video.id} player ready!`));
