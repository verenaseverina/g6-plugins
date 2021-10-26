# G6 Extenral Plugin

## How to use
1. Copy the `js` folder into the project.
2. Include the `plugin` file on the `html` that want to used.
3. Init the plugin the same way as the `G6` original plugin.


### Alignment
for initiating the plugin
```
const alignment = new G6.Alignment({})
```

to use the function
```
// valueType -> align_left | align_center | align_right | align_top | align_middle | align_bottom | distribute_horizontally | distribute_vertically
alignment.alignPosition(valueType)
```

### Grouping
for initiating the plugin
```
const group = new G6.Group({})
```

to use the function
```
group.group(nodes)

group.ungroup(combo)
```