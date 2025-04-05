export const getHandleStyle = (position) => {
  const base = { position: 'absolute', zIndex: 10 };

  switch (position) {
    case 'top': return { ...base, top: -5, left: 0, width: '100%', height: 10, cursor: 'ns-resize' };
    case 'bottom': return { ...base, bottom: -5, left: 0, width: '100%', height: 10, cursor: 'ns-resize' };
    case 'left': return { ...base, left: -5, top: 0, width: 10, height: '100%', cursor: 'ew-resize' };
    case 'right': return { ...base, right: -5, top: 0, width: 10, height: '100%', cursor: 'ew-resize' };
    case 'top-left': return { ...base, top: -5, left: -5, width: 10, height: 10, cursor: 'nwse-resize' };
    case 'top-right': return { ...base, top: -5, right: -5, width: 10, height: 10, cursor: 'nesw-resize' };
    case 'bottom-left': return { ...base, bottom: -5, left: -5, width: 10, height: 10, cursor: 'nesw-resize' };
    case 'bottom-right': return { ...base, bottom: -5, right: -5, width: 10, height: 10, cursor: 'nwse-resize' };
    default: return {};
  }
};

export const resizeHandles = [
  { position: 'top-left', x: -1, y: -1, cursor: 'nwse-resize' },
  { position: 'top', x: 0, y: -1, cursor: 'ns-resize' },
  { position: 'top-right', x: 1, y: -1, cursor: 'nesw-resize' },
  { position: 'right', x: 1, y: 0, cursor: 'ew-resize' },
  { position: 'bottom-right', x: 1, y: 1, cursor: 'nwse-resize' },
  { position: 'bottom', x: 0, y: 1, cursor: 'ns-resize' },
  { position: 'bottom-left', x: -1, y: 1, cursor: 'nesw-resize' },
  { position: 'left', x: -1, y: 0, cursor: 'ew-resize' },
];
