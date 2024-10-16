// The following code demonstrates the `Vector2` class, which is part of the `@dreamlab/engine` package.
// This class provides a 2D vector with a variety of utility methods for vector operations,
// such as addition, subtraction, normalization, and more.
// You can import and use this class in your project to handle 2D vector mathematics efficiently.

import { Vector2 } from '@dreamlab/engine'

// Creating vectors
const v1 = new Vector2(3, 4)
const v2 = new Vector2({ x: 1, y: 2 })

// Using static constants
const zeroVector = Vector2.ZERO
const unitX = Vector2.X

// Vector operations
const sum = v1.add(v2) // Adds v1 and v2
const difference = v1.sub(v2) // Subtracts v2 from v1
const scaled = v1.mul(2) // Multiplies v1 by 2
const normalized = v1.normalize() // Normalizes v1
const magnitude = v1.magnitude() // Gets the magnitude of v1

// Comparing vectors
const isEqual = v1.eq(v2) // Checks if v1 and v2 are equal

// Distance between vectors
const distance = v1.distance(v2)

// Linear interpolation
const midpoint = Vector2.lerp(v1, v2, 0.5)
