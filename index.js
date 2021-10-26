const data = {
  nodes: [
    { id: 'node1', x: 150, y: 250 },
    { id: 'node2', x: 350, y: 280 },
    { id: 'node3', x: 450, y: 120 },
    { id: 'node4', x: 550, y: 230 },
    { id: 'node5', x: 650, y: 260 },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
    },
  ],
};

let selectedNodes = [];

const init = () => {
  const container = document.getElementById('container');
  const width = container.scrollWidth;
  const height = (container.scrollHeight || 500) - 30;

  const alignment = new G6.Alignment({})
  const group = new G6.Group({})

  const menu = new G6.Menu({
    offsetX: 10,
    offsetY: 20,
    itemTypes: ['node'],
    getContent(e, graph) {
      const outDiv = document.createElement('div');
      outDiv.style.width = '180px';
      outDiv.innerHTML = `<ul>
          <li value="align_left">Align Left</li>
          <li value="align_center">Align Center</li>
          <li value="align_right">Align Right</li>
          <li value="align_top">Align Top</li>
          <li value="align_middle">Align Middle</li>
          <li value="align_bottom">Align Bottom</li>
          <li value="group">Group</li>
        </ul>`
      return outDiv
    },
    handleMenuClick(target, item, graph) {
      const valueType = target.getAttribute('value')
      // G6Extension.alignPosition(selectedNodes, target.getAttribute('value'))
      if (valueType === 'group') {
        group.group()
      } else {
        alignment.alignPosition(valueType)
      }
      // graph.render();
      // graph.refreshPositions();
      
    },
  });

  const graph = new G6.Graph({
    container: 'container',
    width,
    height,
    fitCenter: true,
    plugins: [menu, alignment, group],
    groupByTypes: false,
    modes: {
      default: ['brush-select', 'drag-node', 'drag-canvas', 'click-select', 'drag-combo', 'collapse-expand-combo'],
      altSelect: [
        {
          type: 'brush-select',
          trigger: 'drag',
        },
        'drag-node',
      ],
    },
  });

  window.graph = graph


  graph.on('node:mouseenter', (e) => {
    graph.setItemState(e.item, 'active', true);
  });

  graph.on('node:mouseleave', (e) => {
    graph.setItemState(e.item, 'active', false);
  });

  graph.on('nodeselectchange', (e) => {
    selectedNodes = e.selectedItems.nodes
  });

  graph.data(data);
  graph.render();

  if (typeof window !== 'undefined')
    window.onresize = () => {
      if (!graph || graph.get('destroyed')) return;
      if (!container || !container.scrollWidth || !container.scrollHeight) return;
      graph.changeSize(container.scrollWidth, container.scrollHeight - 30);
    };
}

init()
