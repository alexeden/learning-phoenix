export const height = '360';
export const width = '420';

const PLAYER_CONFIG = {
  height: '360',
  width: '420',
  playerVars: {
    color: 'white',
    rel: 0
  }
};

export const PlayerConfig =
  (config = {}) =>
    Object.assign(
      {},
      config,
      PLAYER_CONFIG
    );
