import { isObject } from 'axis.js'
import Point from '../point'
import * as methods from './methods'

export default function GridFactory({ HexFactory } = {}) {
    /**
     * @module src/grid
     * @function Grid
     *
     * @description
     * Factory function for creating grids. It accepts optional hex settings that apply to all hexes in the grid. Several "shape" methods are exposed that return an array of hexes in a certain shape.
     *
     * A grid is *viewless*, i.e.: it's a virtual grid with undefined dimensions. If you want to render a tangible grid, use {@link View}.
     *
     * @param {Object} [hexSettings]                            Optional settings that apply to *all* hexes in the grid.
     * @param {number} [hexSettings.size=1]                     Size of all hexes.
     * @param {(FLAT|POINTY)} [hexSettings.orientation=POINTY]  All hexes are either POINTY ⬢ or FLAT ⬣.
     * @param {Point} [hexSettings.origin=Point(0,0)]           Used to convert a hex to a point. Defaults to the hex's center at `Point(0, 0)`.
     *
     * @returns {Grid}                                          A grid instance containing a {@link Hex} factory and several methods. Use the {@link Hex} factory for creating individual hexes or using any of the {@link Hex}'s methods.
     *
     * @example
     * import { Grid, HEX_ORIENTATIONS } from 'Honeycomb'
     *
     * const grid = Grid({
     *     size: 50,
     *     orientation: HEX_ORIENTATIONS.FLAT,
     *     customProperty: `I'm custom 😃`
     * })
     *
     * const singleHex = grid.Hex(5, -1, -4)
     * singleHex.coordinates()      // { x: 5, y: -1, z: -4 }
     * singleHex.size               // 50
     * singleHex.customProperty     // I'm custom 😃
     *
     * grid.triangle(3)             // [ { x: 0, y: 0, z: 0 },
     *                              //   { x: 0, y: 1, z: -1 },
     *                              //   { x: 0, y: 2, z: -2 },
     *                              //   { x: 1, y: 0, z: -1 },
     *                              //   { x: 1, y: 1, z: -2 },
     *                              //   { x: 2, y: 0, z: -2 } ]
     */
    return function Grid(hexSettings) {
        // TODO: validate hexSettings
        const Hex = HexFactory(hexSettings)

        return {
            Hex,
            pointToHex:     methods.pointToHexFactory({ Point, Hex }),
            hexToPoint:     methods.hexToPoint,
            colSize:        methods.colSizeFactory({ Hex }),
            rowSize:        methods.rowSizeFactory({ Hex }),
            parallelogram:  methods.parallelogramFactory({ Hex, isObject }),
            triangle:       methods.triangleFactory({ Hex, isObject }),
            hexagon:        methods.hexagonFactory({ Hex, isObject }),
            rectangle:      methods.rectangleFactory({ Hex, isObject })
        }
    }
}
