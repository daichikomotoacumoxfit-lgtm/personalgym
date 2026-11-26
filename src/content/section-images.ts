import type { CMSImage } from '@/types/cms';

export const concernImages: Readonly<Partial<Record<string, CMSImage>>> = {
  "疲れ・身体の不調": {
    "url": "/images/concerns/fatigue-color.webp",
    "width": 480,
    "height": 480,
    "alt": "仕事を終えて肩に手を当てる男性のイメージ"
  },
  "姿勢・身体のライン": {
    "url": "/images/concerns/posture-color.webp",
    "width": 480,
    "height": 480,
    "alt": "鏡で横からの姿勢を確認する女性のイメージ"
  },
  "運動の続け方": {
    "url": "/images/concerns/exercise-color.webp",
    "width": 480,
    "height": 480,
    "alt": "自宅で運動の準備をする女性のイメージ"
  }
};

export const lifestyleImage: CMSImage = {
  "url": "/images/lifestyle-color.webp",
  "width": 1254,
  "height": 1254,
  "alt": "仕事や趣味を楽しむ暮らしのイメージ"
};
