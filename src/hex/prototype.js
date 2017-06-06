import { ORIENTATIONS } from './constants'

/**
 * @method Hex#coordinates
 * @returns {Object}    The hex's x, y and z coordinates.
 */
export function coordinates() {
    return {
        x: this.x,
        y: this.y,
        z: this.z
    }
}

/**
 * @method Hex#isPointy
 * @returns {boolean}   Whether hexes have a pointy ⬢ orientation.
 */
export function isPointy() {
    return this.orientation === ORIENTATIONS.POINTY
}

/**
 * @method Hex#isFlat
 * @returns {boolean}   Whether hexes have a flat ⬣ orientation.
 */
export function isFlat() {
    return this.orientation === ORIENTATIONS.FLAT
}

/**
 * @method Hex#oppositeCornerDistance
 * @returns {number}    The distance between opposite corners of a hex.
 */
export function oppositeCornerDistance() {
    return this.size * 2
}

/**
 * @method Hex#oppositeSideDistance
 * @returns {number}    The distance between opposite sides of a hex.
 */
export function oppositeSideDistance() {
    return Math.sqrt(3) / 2 * this.oppositeCornerDistance()
}

/**
 * @method Hex#width
 * @returns {number}    The (horizontal) width of any hex.
 */
export function width() {
    return this.isPointy() ?
        this.oppositeSideDistance() :
        this.oppositeCornerDistance()
}

/**
 * @method Hex#height
 * @returns {number}    The (vertical) height of any hex.
 */
export function height() {
    return this.isPointy() ?
        this.oppositeCornerDistance() :
        this.oppositeSideDistance()
}

export function cornersFactory({ Point }) {
    /**
     * @method Hex#corners
     * @returns {Point[]}   Array of corner points. Starting at the top right corner for pointy hexes and the right corner for flat hexes.
     */
    return function corners() {
        const width = this.width()
        const height = this.height()

        if (this.isPointy()) {
            return [
                Point(width, height * 0.25),
                Point(width, height * 0.75),
                Point(width * 0.5, height),
                Point(0, height * 0.75),
                Point(0, height * 0.25),
                Point(width * 0.5, 0)
            ]
        } else {
            return [
                Point(width, height * 0.5),
                Point(width * 0.75, height),
                Point(width * 0.25, height),
                Point(0, height * 0.5),
                Point(width * 0.25, 0),
                Point(width * 0.75, 0)
            ]
        }
    }
}

export function toPointFactory({ Point }) {
    /**
     * @method Hex#toPoint
     *
     * @description
     * Converts the current hex to its origin {@link Point|point} relative to the start hex.
     *
     * @returns {Point} The 2D point the hex corresponds to.
     */
    return function toPoint() {
        let x, y

        if (this.isPointy()) {
            x = this.size * Math.sqrt(3) * (this.x + this.y / 2)
            y = this.size * 3/2 * this.y
        } else {
            x = this.size * 3/2 * this.x
            y = this.size * Math.sqrt(3) * (this.y + this.x / 2)
        }

        // `x` and `y` are always the hex's center, so the origin needs to be subtracted
        return Point(x, y).subtract(this.origin)
    }
}

/**
 * @method Hex#hexesBetween
 *
 * @see {@link http://www.redblobgames.com/grids/hexagons/#line-drawing|redblobgames.com}
 *
 * @param {Hex} otherHex    The other hex.
 *
 * @returns {Hex[]}         Array of hexes from the current hex and up to the passed `otherHex`.
 */
export function hexesBetween(otherHex) {
    const _distance = this.distance(otherHex)
    const step = 1.0 / Math.max(_distance, 1)
    let hexes = []

    for (let i = 0; i <= _distance; i++) {
        hexes.push(this.nudge())
        hexes.push(Hex.round(Hex.lerp(Hex.nudge(startHex), Hex.nudge(otherHex), step * i)))
    }

    return hexes
}

export function addFactory({ Hex }) {
    /**
     * @method Hex.add
     * @param {Hex} firstHex    A hex.
     * @param {Hex} secondHex   The hex that will be added to the first.
     *
     * @todo Accept any number of hexes to add.
     *
     * @returns {Hex}   The sum of the passed hexes coordinates.
     */
    return function add(firstHex, secondHex) {
        return Hex(
            firstHex.x + secondHex.x,
            firstHex.y + secondHex.y,
            firstHex.z + secondHex.z
        )
    }
}

export function subtractFactory({ Hex }) {
    /**
     * @method Hex.subtract
     * @param {Hex} firstHex    A hex.
     * @param {Hex} secondHex   The hex that will be subtracted from the first.
     *
     * @todo Accept any number of hexes to subtract.
     *
     * @returns {Hex}   The difference between the passed hexes coordinates.
     */
    return function subtract(firstHex, secondHex) {
        return Hex(
            firstHex.x - secondHex.x,
            firstHex.y - secondHex.y,
            firstHex.z - secondHex.z
        )
    }
}

export function neighborFactory({ Hex }) {
    /**
     * @method Hex.neighbor
     *
     * @description
     * Returns the neighboring hex in the given direction.
     *
     * @see {@link http://www.redblobgames.com/grids/hexagons/#neighbors|redblobgames.com}
     *
     * @param {Hex} hex                         The hex to get the neighboring hex from.
     * @param {(0|1|2|3|4|5)}  [direction=0]    Any of the 6 directions. `0` is the Eastern direction (East-southeast when the hex is flat), `1` corresponds to 60° clockwise, `2` to 120° clockwise and so forth.
     * @param {boolean} [diagonal=false]        Whether to look for a neighbor opposite the hex's corner instead of its side. A direction of `0` means the top corner of the hex's right side when the hex is pointy and the right corner when the hex is flat.
     *
     * @returns {Hex}                           The neighboring hex.
     *
     * @example
     * import { Grid } from 'Honeycomb'
     * const Hex = Grid().Hex
     *
     * const targetHex = Hex()
     * Hex.neighbor(targetHex)          // { x: 1, y: -1, z: 0 }, the hex across the 0th (right) side of targetHex
     * Hex.neighbor(targetHex, 2)       // { x: 0, y: 1, z: -1 }, the hex across the 3rd (South West) side of targetHex
     * Hex.neighbor(targetHex, 3, true) // { x: -2, y: 1, z: 1 }, the hex opposite the 4th corner of targetHex
     */
    return function neighbor(hex, direction = 0, diagonal = false) {
        direction = Math.abs(direction % 6)
        const coordinates = diagonal ?
            DIAGONAL_DIRECTION_COORDINATES[direction] :
            DIRECTION_COORDINATES[direction]

        return Hex.add(hex, coordinates)
    }
}

export function neighborsFactory({ Hex }) {
    /**
     * @method Hex.neighbors
     *
     * @description
     * Returns **all** neighboring hexes of the given hex.
     *
     * @see {@link http://www.redblobgames.com/grids/hexagons/#neighbors|redblobgames.com}
     *
     * @param {Hex} hex The hex to get all neighbors from.
     *
     * @returns {Hex[]} An array of the 6 neighboring hexes.
     */
    return function neighbors(hex) {
        return DIRECTION_COORDINATES.map(coordinates => Hex.add(hex, coordinates))
    }
}

export function distanceFactory({ Hex }) {
    /**
     * @method Hex.distance
     *
     * @description
     * Returns the amount of hexes between the current and the given hex.
     *
     * @see {@link http://www.redblobgames.com/grids/hexagons/#distances|redblobgames.com}
     *
     * @param   {Hex} startHex  The start hex.
     * @param   {Hex} endHex    The end hex.
     *
     * @returns {number}        The amount of hexes between the passed `startHex` and `endHex`.
     *
     * @example
     * import { Grid } from 'Honeycomb'
     * const Hex = Grid().Hex
     *
     * Hex.distance(Hex(0, 0, 0), Hex(1, 0, -1))    // 1
     * Hex.distance(Hex(-3, -3, 6), Hex(-1, 4, -3)) // 9
     */
    return function distance(startHex, endHex) {
        const relativeHex = Hex.subtract(startHex, endHex)
        return Math.max(
            Math.abs(relativeHex.x),
            Math.abs(relativeHex.y),
            Math.abs(relativeHex.z)
        )
    }
}

export function roundFactory({ Hex }) {
    /**
     * @method Hex.round
     *
     * @description
     * Rounds the passed floating point hex coordinates to their nearest integer hex coordinates.
     *
     * @see {@link http://www.redblobgames.com/grids/hexagons/#rounding|redblobgames.com}
     *
     * @param {Hex} hex The hex to be rounded.
     *
     * @returns {Hex}   A new hex with rounded coordinates.
     */
    return function round(hex) {
        let roundedX = Math.round(hex.x)
        let roundedY = Math.round(hex.y)
        let roundedZ = Math.round(hex.z)
        const diffX = Math.abs(hex.x - roundedX)
        const diffY = Math.abs(hex.y - roundedY)
        const diffZ = Math.abs(hex.z - roundedZ)

        if (diffX > diffY && diffX > diffZ) {
            roundedX = Hex.thirdCoordinate(roundedY, roundedZ)
        } else if (diffY > diffZ) {
            roundedY = Hex.thirdCoordinate(roundedX, roundedZ)
        } else {
            roundedZ = Hex.thirdCoordinate(roundedX, roundedY)
        }

        return Hex(roundedX, roundedY, roundedZ)
    }
}

export function lerpFactory({ Hex }) {
    /**
     * @method Hex.lerp
     *
     * @description
     * Returns an interpolation between the current hex and the passed hex for a `t` between 0 and 1.
     * More info on [wikipedia](https://en.wikipedia.org/wiki/Linear_interpolation).
     *
     * @param   {Hex} firstHex  The first hex.
     * @param   {Hex} secondHex The second hex.
     * @param   {number} t      A "parameter" between 0 and 1.
     *
     * @returns {Hex}           A new hex (with possibly fractional coordinates).
     */
    return function lerp(firstHex, secondHex, t) {
        return Hex(
            firstHex.x * (1 - t) + secondHex.x * t,
            firstHex.y * (1 - t) + secondHex.y * t,
            firstHex.z * (1 - t) + secondHex.z * t
        )
    }
}

export function nudgeFactory({ Hex }) {
    /**
     * @method Hex.nudge
     *
     * @description
     * Returns a new hex with a tiny offset from the passed hex. Useful for interpolating in a consistent direction.
     *
     * @see {@link http://www.redblobgames.com/grids/hexagons/#line-drawing|redblobgames.com}
     *
     * @param {Hex} hex The hex to nudge.
     *
     * @returns {Hex}   A new hex with a minute offset.
     */
    return function nudge(hex) {
        return Hex.add(hex, Hex(EPSILON))
    }
}
