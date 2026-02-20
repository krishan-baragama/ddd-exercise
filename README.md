# Strong Typing in TypeScript for robust domain-driven design

## PREVIOUS KNOWLEDGE

1. Running code in TypeScript with Node.js
2. Basic TypeScript types (number, string, boolean, etc.)
3. Functions and type annotations
4. Type safety and compile-time checks
5. Factory functions

## NEW KNOWLEDGE

1. Factory function to create Branded Types
2. Smart constructors
3. Value objects
4. Entities
5. Parse, don't validate

## Exercise 01 -- Domain-Driven Design & Strong Typing in TypeScript

## The Problem

TypeScript's type system catches a lot of bugs, but it has a blind spot: **primitive obsession**. When every price is `number`, every name is `string`, and every ID is `string`, the compiler treats them as interchangeable. You can put an email in a phone field, set a price to -50, or seat 7 guests at a 4-person table -- all without a single type error.

These are **silent bugs**. They compile, they run, and they corrupt your data quietly.

This exercise demonstrates 8 categories of silent bugs that primitive types allow, then asks you to fix them using Domain-Driven Design patterns.

## What You Will Learn

| ---- Concept -------------  | -------- What it solves ---------------------------------                                             |
| --------------------------- | ----------------------------------------------------------------------------------------------------- |
| -- **Branded Types** --     | Prevent mixing up values that share the same primitive type (e.g., Email vs Phone)                    |
| --**Smart Constructors** -- | Validate business rules at creation time so invalid values never exist                                |
| --**Value Objects** --      | Model domain concepts (Money, Email, OperatingHours) as immutable types defined by their value        |
| **Entities**                | Model things with identity and lifecycle (Table, Order) that enforce their own invariants             |
| **Parse, Don't Validate**   | Transform raw input into guaranteed-valid types at the boundary, then trust the types everywhere else |

## Project Structure

```
ex-01/
  index.ts                      # CLI runner -- imports and orchestrates exercises
  explain/                      # In-class explanations (guided, with instructor)
    001-brandedTypes.ts         # Branded Types introduction
    003-bradedTypesTwo.ts       # Branded Types continued
  exercises/                    # Personal work (students solve on their own)
    logger.ts                   # Shared error logging utility
    exercise1.ts                # Primitive Price Problem
    exercise2.ts                # Primitive Quantity Disaster
    exercise3.ts                # String Confusion (Email/Phone/Name)
    exercise4.ts                # Business Rule Violation (Table Capacity)
    exercise5.ts                # Identity Crisis (Order IDs)
    exercise6.ts                # Temporal Logic Error (Operating Hours)
    exercise7.ts                # Currency Confusion
    exercise8.ts                # Email Validation Gap
```

## Part 1 -- In-Class Explanations (`explain/`)

The `explain/` folder contains guided examples that we walk through together during class. These files introduce the core concepts step by step:

| File | Topic |
| --- | --- |
| `001-brandedTypes.ts` | Branded Types introduction |
| `003-bradedTypesTwo.ts` | Branded Types continued |

Read and follow along during the session -- these build the foundation you need for the exercises.

## Part 2 -- Exercises (`exercises/`)

The `exercises/` folder is your personal work. Each exercise demonstrates a silent bug caused by primitive types, and your job is to fix it using the patterns learned in class.

### Getting Started

```bash
# Install dependencies
npm install

# Run the exercises
npm run exercises
```

Select an exercise (1-8) or run all of them (9). After running, open `silent_errors.log` to see every silent bug that was triggered.

### How each exercise works

Each exercise file follows the same structure:

1. **Header comments** explain the anti-pattern and the DDD concept that fixes it.
2. **A HINT block** shows a concrete code example of the solution pattern.
3. **A TODO comment** tells you exactly what to change.
4. **The buggy code** demonstrates the problem in action.

### Your task for each exercise:

1. **Read** the header comments to understand the anti-pattern and the fix.
2. **Implement** the branded type / Value Object / Entity described in the hint.
3. **Refactor** the exercise function to use your new types.
4. **Verify** that the previously-silent bugs now produce either compile-time errors or runtime exceptions.

### Example -- fixing Exercise 1 (Price)

Before (primitive):

```ts
type MenuItem = {
	name: string
	price: number // accepts -50, no complaints
	quantity: number
}
```

After (branded type):

```ts
type Price = number & { readonly __brand: unique symbol }

function createPrice(amount: number): Price {
	if (amount < 0) throw new Error("Price cannot be negative")
	if (amount > 10_000) throw new Error("Price exceeds maximum")
	return amount as Price
}

type MenuItem = {
	name: string
	price: Price // only accepts values from createPrice()
	quantity: number
}
```

Now `price: -50` is a compile-time error (a raw `number` is not assignable to `Price`), and `createPrice(-50)` throws at runtime. The bug is impossible.

## Key Takeaways

- **Make illegal states unrepresentable.** If a value should never be negative, make the type reject negatives. If two fields should not be swappable, give them different types.
- **Push validation to the boundary.** Parse raw input (user forms, API responses, database rows) into strong domain types at the edge of your system. Inside the domain, trust the types.
- **Domain logic belongs inside domain objects.** An `OperatingHours` object should know how to answer "am I open at 2 AM?". A `Money` object should know how to add two amounts in the same currency. Don't scatter this logic across utility functions.
- **Types are documentation.** When a function takes `Price` instead of `number`, its intent is clear without comments. When a function takes `Email` instead of `string`, you know the value has been validated.
