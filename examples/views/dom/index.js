'use strict'

var Grid = Honeycomb.Grid,
    View = Honeycomb.View,
    container = document.getElementById('container'),
    rect = container.getBoundingClientRect(),
    grid,
    view

grid = Grid({ size: 50 })

view = View({
    grid: grid,
    template: function createTemplate(hex) {
        var position = this.hexToPixel(hex),
            div = document.createElement('div')

        div.classList.add('hex')
        div.style.left = position.x + 'px'
        div.style.top = position.y + 'px'

        return div
    },
    container: container,
    origin: {
        x: rect.width / 2,
        y: rect.height / 2
    }
})

view.renderGrid()
// view.renderHexes(grid.rectangle({ width: 4, height: 4 }))
