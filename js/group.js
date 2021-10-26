import PluginBase from './base.js'

const collapseIcon = (x, y, r) => {
  return [
    ['M', x - r, y],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x - r + 4, y],
    ['L', x - r + 2 * r - 4, y],
  ];
};
const expandIcon = (x, y, r) => {
  return [
    ['M', x - r, y],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x - r + 4, y],
    ['L', x - r + 2 * r - 4, y],
    ['M', x - r + r, y - r + 4],
    ['L', x, y + r - 4],
  ];
};

G6.registerCombo(
  'cCircle',
  {
    drawShape: function draw(cfg, group) {
      const self = this;
      // Get the shape style, where the style.r corresponds to the R in the Illustration of Built-in Rect Combo
      const style = self.getShapeStyle(cfg);
      // Add a circle shape as keyShape which is the same as the extended 'circle' type Combo
      const circle = group.addShape('circle', {
        attrs: {
          ...style,
          x: 0,
          y: 0,
          r: style.r,
        },
        draggable: true,
        name: 'combo-keyShape',
      });
      // Add the marker on the bottom
      const marker = group.addShape('marker', {
        attrs: {
          ...style,
          fill: '#fff',
          opacity: 1,
          x: 0,
          y: style.r,
          r: 10,
          symbol: 'x',
        },
        draggable: true,
        name: 'combo-marker-shape',
      });

      const deleteMarker = group.addShape('marker', {
        attrs: {
          ...style,
          fill: '#fff',
          opacity: 1,
          x: 0,
          y: -style.r,
          r: 10,
          symbol: 'diamond',
        },
        draggable: true,
        name: 'combo-delete-shape',
      });

      return circle;
    },
    // Define the updating logic for the marker
    afterUpdate: function afterUpdate(cfg, combo) {
      const self = this;
      // Get the shape style, where the style.r corresponds to the R in the Illustration of Built-in Rect Combo
      const style = self.getShapeStyle(cfg);
      const group = combo.get('group');
      // Find the marker shape in the graphics group of the Combo
      const marker = group.find((ele) => ele.get('name') === 'combo-marker-shape');
      const deleteMarker = group.find((ele) => ele.get('name') === 'combo-delete-shape');
      // Update the marker shape
      marker.attr({
        x: 0,
        y: style.r,
        // The property 'collapsed' in the combo data represents the collapsing state of the Combo
        // Update the symbol according to 'collapsed'
        symbol: cfg.collapsed ? expandIcon : collapseIcon,
      });
      deleteMarker.attr({
        x: 0,
        y: -style.r,
      });
    },
  },
  'circle',
);

class GroupPlugin extends PluginBase {
  constructor(config) {
    super(config)

    this.selectedNodes = [];
    this.selectedCombo = null;
  }

  init() {
    const graph = this.get('graph');

    graph.on('nodeselectchange', (e) => {
      this.selectedNodes = e.selectedItems.nodes
    });

    graph.on('combo:click', (e) => {
      // this.selectedCombo = e.
      if (e.target.get('name') === 'combo-marker-shape') {
        graph.collapseExpandCombo(e.item);
        if (graph.get('layout')) graph.layout();
        else graph.refreshPositions();
      }
      if (e.target.get('name') === 'combo-delete-shape') {
        this.ungroup(e.item)
      }
    });
  }

  generateId (length) {
    let result = ''
    const characters= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
  }

  group (nodes) {
    const graph = this.get('graph');
    const allNodes = nodes ?? this.selectedNodes
    graph.createCombo({
      id: this.generateId(5),
      type: 'cCircle'
    }, allNodes.map((node) => node.get('id')))
  }

  ungroup (combo) {
    const graph = this.get('graph');
    graph.expandCombo(combo)
    graph.uncombo(combo)
    graph.refresh()
  }
}

window.G6.Group = GroupPlugin

export default GroupPlugin
