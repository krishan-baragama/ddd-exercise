import { logError } from "./logger.js"

//============================================================================
// EXERCISE 6: Temporal Logic Error - Operating Hours
//
// ANTI-PATTERN: Representing domain-specific time concepts as raw numbers.
// Two problems: (1) invalid values (25, -5) are accepted, and (2) the
// business logic for "is the restaurant open?" is wrong for overnight spans.
//
// DDD FIX: Encapsulate the concept of "operating hours" in a Value Object
// that owns its own validation AND its own logic.
//
// HINT - Value Object with behavior:
//   type Hour = number & { readonly __brand: unique symbol }
//   function createHour(h: number): Hour {
//       if (!Number.isInteger(h) || h < 0 || h > 23)
//           throw new Error("Hour must be 0-23")
//       return h as Hour
//   }
//
//   class OperatingHours {
//       private constructor(
//           public readonly opens: Hour,
//           public readonly closes: Hour,
//       ) {}
//
//       static create(opens: number, closes: number): OperatingHours {
//           return new OperatingHours(createHour(opens), createHour(closes))
//       }
//
//       isOpenAt(hour: Hour): boolean {
//           // Handles midnight crossover correctly
//           if (this.opens <= this.closes) {
//               return hour >= this.opens && hour < this.closes
//           }
//           return hour >= this.opens || hour < this.closes
//       }
//   }
//
// KEY INSIGHT: In DDD, domain logic lives inside the domain objects, not in
// external utility functions. OperatingHours knows how to answer "am I open?"
// because that question is part of its domain responsibility.
// ============================================================================

type Hour = number & { readonly __brand: unique symbol }

function createHour(h: number): Hour {
	if (!Number.isInteger(h) || h < 0 || h > 23)
		throw new Error("Hour must be 0-23")
	return h as Hour
}

class OperatingHours {
	private constructor(
		public readonly opens: Hour,
		public readonly closes: Hour,
	) {}

	static create(opens: number, closes: number): OperatingHours {
		return new OperatingHours(createHour(opens), createHour(closes))
	}

	isOpenAt(hour: Hour): boolean {
		// Handles midnight crossover correctly
		if (this.opens <= this.closes) {
			return hour >= this.opens && hour < this.closes
		}
		return hour >= this.opens || hour < this.closes
	}
}

export function exercise6_TemporalLogic() {
	type Restaurant = {
		name: string
		operatingHours: OperatingHours
	}

	const restaurant: Restaurant = {
		name: "Joe's Diner",
		operatingHours: OperatingHours.create(22, 6), 
	}

	// TODO: Replace the raw numbers with an OperatingHours Value Object.
	// Move the isOpen logic INSIDE the Value Object so it correctly handles
	// overnight spans and rejects invalid hours at construction time.

	logError(6, "Operating hours logic broken for overnight restaurants", {
		restaurant,
		testHour: 2,
		isOpenCalculated: restaurant.operatingHours.isOpenAt(createHour(2)),
		issue: "Simple comparison fails when hours cross midnight!",
	})

	// Also accepts invalid hours
	const brokenRestaurant: Restaurant = {
		name: "Broken Cafe",
		operatingHours: OperatingHours.create(22, -5),
	}

	logError(6, "Invalid hours accepted without validation", {
		restaurant: brokenRestaurant,
		issue: "Hours should be 0-23 only!",
	})
}