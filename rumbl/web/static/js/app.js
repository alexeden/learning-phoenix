import 'phoenix_html';
import socket from './socket';
import { Video } from './video';

const video = document.getElementById('video');

Video.init(socket, video);
