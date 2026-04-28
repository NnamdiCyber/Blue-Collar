# Design System

BlueCollar's design system provides a consistent visual language across the application.

## Design Tokens

All design tokens are defined in `src/design-system/tokens.ts`:

- **Colors**: Brand palette (blue-based), neutral grays, semantic colors (success, warning, error)
- **Typography**: Font families (Geist Sans, Geist Mono), sizes, weights
- **Spacing**: 0–24 scale (0.25rem increments)
- **Radii**: Border radius values (sm, md, lg, xl, 2xl, full)
- **Shadows**: Elevation shadows (sm, md, lg, xl)

## Component Styles

Shared component variants are defined using `class-variance-authority` in `src/design-system/component-styles.ts`:

- **Button**: primary, secondary, ghost, danger variants; sm, md, lg sizes
- **Badge**: default, success, warning, danger, neutral variants
- **Card**: shadow and padding variants
- **Input**: default, error, success states

## Storybook

Run Storybook to explore components interactively:

```bash
pnpm storybook
```

Stories are located alongside components in `src/components/ui/*.stories.tsx`.

## Usage

Import tokens or component styles:

```ts
import { colors, spacing } from '@/design-system'
import { buttonVariants } from '@/design-system'

const className = buttonVariants({ variant: 'primary', size: 'lg' })
```

## Patterns

- Use design tokens for programmatic styling (e.g., chart colors, dynamic styles)
- Use Tailwind classes for component markup
- Use cva variants for shared component logic
- Document new components with Storybook stories
