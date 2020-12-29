import canvas from 'canvas';
import path from 'path';
import fs from 'fs';

const { createCanvas, loadImage, registerFont } = canvas;

const WIDTH = 370;
const HEIGHT = 65;

const DEFAULT_STATUS = 'UNKNOWN';
const DEFAULT_MESSAGE = 'Their presence has an air of mystery.';

const FA_BASE_PATH = 'node_modules/@fortawesome/fontawesome-free/svgs';
const DEFAULT_STATUS_IMAGE = 'solid/question.svg';
const STATUS_IMAGE_MAP = {
  CODING: 'brands/github.svg',
  GAMING: 'solid/gamepad.svg',
  MUSIC: 'solid/headphones-alt.svg',
  AWAY: 'solid/door-closed.svg',
};

registerFont('./fonts/NotoSans-Regular.ttf', { family: 'NotoSans-Regular' });

const loadFontAwesomeImage = async (imageSubpath) => {
  const p = path.join(FA_BASE_PATH, imageSubpath ?? DEFAULT_STATUS_IMAGE);
  if (!fs.existsSync(p)) {
    console.warn('Unable to locate font-awesome image located at', p);
    return;
  }

  const svgContent = fs.readFileSync(p);
  const b = Buffer.from(svgContent);
  const i = await loadImage(b);

  return i;
};

export const generateStatusImage = async (
  status = DEFAULT_STATUS,
  message = DEFAULT_MESSAGE
) => {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const context = canvas.getContext('2d');
  const statusImagePromise = loadFontAwesomeImage(STATUS_IMAGE_MAP[status]);

  context.fillStyle = '#fff';
  context.fillRect(0, 0, WIDTH, HEIGHT);

  const statusImage = await statusImagePromise;
  if (statusImage) {
    context.fillStyle = '#000';
    context.drawImage(statusImage, 8, 8, 48, 48);
  }

  context.font = '24px NotoSans-Regular';
  context.fillStyle = '#000';
  context.fillText(status, 70, 30);

  context.font = '16px NotoSans-Regular';
  context.fillStyle = '#000';
  context.fillText(message, 70, 55);

  return canvas.toBuffer('image/png');
};
