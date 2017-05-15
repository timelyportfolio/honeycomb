(function() {
    'use strict';

    var COLORS = [ '#EEBD21', '#F3C725', '#F8D029' ],
        Grid = Honeycomb.Grid,
        View = Honeycomb.View,
        Point = Honeycomb.Point,
        container = document.getElementById('hero-visual'),
        containerRect = container.getBoundingClientRect(),
        bee = Bee(),
        grid,
        view

    grid = Grid({
        size: 20
    })

    view = View({
        grid: grid,
        template: template,
        // TODO: make this also accept a string that gets passed to `document.querySelectorAll`
        container: container,
        // TODO: make it accept a string `'center'` and/or function
        origin: {
            x: containerRect.width / 2,
            y: containerRect.height / 2
        }
    })

    view.renderGrid()

    var randomHex = view.hexes[Math.floor(Math.random() * view.hexes.length)]
    // TODO: add way to get the element belonging to a hex
    // ideal would be something like:
    //   hex.toPixel()
    //   hex.element
    // this requires extending hex though...
    bee
        .positionAt(view.hexToPixel(randomHex))
        .go()

    function template(hex) {
        var NS = 'http://www.w3.org/2000/svg',
            position = this.hexToPixel(hex),
            hexCenter = hex.center(),
            g = document.createElementNS(NS, 'g'),
            polygon = document.createElementNS(NS, 'polygon'),
            // TODO: corners are the same for every hex; optimize by caching?
            points = hex.corners()
                .map(function(corner) { return corner.x + ',' + corner.y })
                .join(' ')

        polygon.setAttribute('class', 'honey')
        polygon.setAttribute('points', points)
        polygon.setAttribute('fill', randomColor())

        g.appendChild(polygon)
        g.setAttribute('transform', 'translate(' + position.x + ',' + position.y + ')')

        return g
    }

    function randomColor() {
        return COLORS[Math.floor(Math.random() * COLORS.length)]
    }

    function Bee() {
        var element = document.getElementById('bee')

        return {
            positionAt: positionAt,
            go: go
        }

        function positionAt(position) {
            var elementRect = element.getBoundingClientRect(),
                center = Point(elementRect.width / 2, elementRect.height / 2),
                pixel = Point(position).subtract(center)

            element.style.left = containerRect.left + pixel.x + 'px'
            element.style.top = containerRect.top + pixel.y + 'px'

            return this
        }

        function go() {
            return this
        }
    }

    container.addEventListener('click', function handleClick(e) {
        // e.offsetX/Y isn't supported by firefox, so calculating it here:
        var offsetX = e.clientX - containerRect.left,
            offsetY = e.clientY - containerRect.top,
            hex = view.pixelToHex([offsetX, offsetY])

        console.log(`offset: ${[offsetX, offsetY]}, hex: ${[hex.x, hex.y, hex.z]}`)
    })
})();
