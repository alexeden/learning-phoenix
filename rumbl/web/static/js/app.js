import 'phoenix_html';
import * as Rx from 'rxjs';
import socket from './socket';
import { Video } from './video';

const video = document.getElementById('video');

Video.init(socket, video);
