import 'phoenix_html';
import * as Rx from 'rxjs';
import * as R from 'ramda';
import socket from './socket';
import { Video } from './video';

window['R'] = R;
window['Rx'] = Rx;

const video = document.getElementById('video');

Video.init(socket, video);
