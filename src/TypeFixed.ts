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
 * import React from 'react';
 * import type { ParentComponent } from '@/TypeFixed';
 *
 * interface TestComponentProps {}
 *
 * const TestComponent: ParentComponent<TestComponentProps> => ({
 *     // correct now
 *     children,
 * }) => { ... };
 * ```
 */
// eslint-disable-next-line
export type ParentComponent<T extends object = {}> = FC<PropsWithChildren<T>>;
