import PluginBase from './base.js'

export const AlignmentType = {
  ALIGN_LEFT: 'align_left',
  ALIGN_CENTER: 'align_center',
  AlIGN_RIGHT: 'align_right',
  ALIGN_TOP: 'align_top',
  ALIGN_MIDDLE: 'align_middle',
  ALIGN_BOTTOM: 'align_bottom',
  DISTRIBUTE_HORIZONTALLY: 'distribute_horizontally',
  DISTRIBTUE_VERTICALLY: 'distribute_vertically',
}

const alignLeft = (nodes) => {
  if (nodes.length === 0) return;

  const value = nodes.reduce((acc, element) => {
    const box = element.getBBox()
    return Math.min(acc, box.minX)
  }, Infinity);

  nodes.forEach(element => {
    console.log(element, value)
    const box = element.getBBox()
    element.updatePosition({
      x: value,
      y: box.centerY
    })
  });
}

const alignRight = (nodes) => {
  if (nodes.length === 0) return;

  const value = nodes.reduce((acc, element) => {
    const box = element.getBBox()
    return Math.max(acc, box.maxX)
  }, -Infinity);

  nodes.forEach(element => {
    const box = element.getBBox()
    element.updatePosition({
      x: value,
      y: box.centerY
    })
  });
}

const alignCenter = (nodes) => {
  if (nodes.length === 0) return;

  const value = nodes.reduce((acc, element) => {
    const box = element.getBBox()
    return acc + box.centerX
  }, 0) / nodes.length;

  nodes.forEach(element => {
    const box = element.getBBox()
    element.updatePosition({
      x: value,
      y: box.centerY
    })
  });
}

const alignBottom = (nodes) => {
  if (nodes.length === 0) return;

  const value = nodes.reduce((acc, element) => {
    const box = element.getBBox()
    return Math.min(acc, box.minY)
  }, Infinity);

  nodes.forEach(element => {
    const box = element.getBBox()
    element.updatePosition({
      x: box.centerX,
      y: value
    })
  });
}

const alignTop = (nodes) => {
  if (nodes.length === 0) return;

  const value = nodes.reduce((acc, element) => {
    const box = element.getBBox()
    return Math.max(acc, box.maxY)
  }, -Infinity);

  nodes.forEach(element => {
    const box = element.getBBox()
    element.updatePosition({
      x: box.centerX,
      y: value
    })
  });
}

const alignMiddle = (nodes) => {
  if (nodes.length === 0) return;

  const value = nodes.reduce((acc, element) => {
    const box = element.getBBox()
    return acc + box.centerY
  }, 0) / nodes.length;

  nodes.forEach(element => {
    const box = element.getBBox()
    element.updatePosition({
      x: box.centerX,
      y: value
    })
  });
}

const alignmentMapping = {
  [AlignmentType.ALIGN_LEFT]: alignLeft,
  [AlignmentType.ALIGN_CENTER]: alignCenter,
  [AlignmentType.AlIGN_RIGHT]: alignRight,
  [AlignmentType.ALIGN_TOP]: alignTop,
  [AlignmentType.ALIGN_MIDDLE]: alignMiddle,
  [AlignmentType.ALIGN_BOTTOM]: alignBottom,
}

class AlignmentPlugin extends PluginBase {
  constructor(config) {
    super(config)

    this.selectedNodes = [];
  }

  init() {
    const graph = this.get('graph');

    graph.on('nodeselectchange', (e) => {
      this.selectedNodes = e.selectedItems.nodes
    });
  }

  alignPosition (type, nodes) {
    const graph = this.get('graph');
    alignmentMapping[type] && alignmentMapping[type](nodes ?? this.selectedNodes)
    graph.refresh();
  }
}

window.G6.Alignment = AlignmentPlugin

export default AlignmentPlugin
