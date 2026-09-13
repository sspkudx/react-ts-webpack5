import type { PropsWithChildren, FC } from 'react';

/**
 * @tutorial
 * Due to the removal of “children” from the React.FC type in React 18,
 * code like the one below will result in a type error:
 *
 * ```tsx
 * import React from 'react';
 *
 * interface TestComponentProps {}
 *
 * const TestComponent: React.FC<TestComponentProps> => ({
 *     // "children" is no longer included in the type
       // FC as of version 18
 *     children,
 * }) => { ... };
 * ```
 *
 * If you’re using React 18, you can replace React.FC with this type as shown below:
 *
 * ```tsx
 * import type { ReactParentComponent } from '@/fixed-types';
 *
 * interface TestComponentProps {}
 *
 * const TestComponent: ReactParentComponent<TestComponentProps> = ({
 *     // correct now
 *     children,
 * }) => { ... };
 * ```
 */
export type ReactParentComponent<T = unknown> = FC<PropsWithChildren<T>>;

/**
 * @description
 * This serves as a substitute name for ReactParentComponent.
 * RFC is an acronym for "Refactored React.FC".
 * The preference for RFC over RPC (ReactParentComponent)
 * is to circumvent any misunderstanding,
 * given that RPC carries a separate implication.
 *
 * @tutorial
 *
 *```tsx
 * // prefer
 * import type { RFC } from '@/fixed-types';
 *
 * interface TestComponentProps {}
 *
 * const TestComponent: RFC<TestComponentProps> = ({
 *     // correct now
 *     children,
 * }) => { ... };
 * ```
 */
export type RFC<T = unknown> = FC<PropsWithChildren<T>>;
