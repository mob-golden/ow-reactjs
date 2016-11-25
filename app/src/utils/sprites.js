import path from 'path';

import {
  RIOT_SPRITES_URL
} from '../../constants/urls';

// TODO: generate sprite styles for sprites other than Champions
export function generateSpriteStyle ({sprite, x, y}) {
  const basename = path.basename(sprite);
  const spriteId = sprite.substr(sprite.length - 1);

  const {
    w,
    h
  } = constructSpriteSize(spriteId);

  return {
    backgroundImage: `url(${RIOT_SPRITES_URL}/${sprite})`,
    backgroundPosition: `-${x}px -${y}px`
    // backgroundPosition: `${150/(w-x) * 100}% ${150/(h-y) * 100}%`
  };
}

function constructSpriteSize (spriteId) {
  let w = 480;

  // champions4.png is only 2 rows long
  let h = (spriteId === 4) ? 96 : 144;

  return {
    w,
    h
  };
}
