import { Icon } from '@iconify/react';

export function getStrategyIcon(id: string, size = 22): React.ReactNode {
  const style = { width: size, height: size, display: 'block', flexShrink: 0 };
  switch (id) {
    case 'always-cooperate': return <Icon icon="noto:smiling-face-with-halo"     style={style} />;
    case 'always-cheat':     return <Icon icon="noto:smiling-face-with-horns"     style={style} />;
    case 'copycat':          return <Icon icon="noto:cat-face"                     style={style} />;
    case 'grudger':          return <Icon icon="noto:pouting-face"                 style={style} />;
    case 'detective':        return <Icon icon="noto:face-with-monocle"            style={style} />;
    case 'random':           return <Icon icon="noto:game-die"                     style={style} />;
    case 'copykitten':       return <Icon icon="noto:grinning-cat"                 style={style} />;
    default:                 return null;
  }
}
