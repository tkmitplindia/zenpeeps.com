import type { ComponentType, ReactNode } from 'react';

type Props = {
    condition: unknown;
    fallback: ComponentType;
    children: ReactNode;
};

export function Fallback({
    condition,
    fallback: FallbackComponent,
    children,
}: Props) {
    if (!condition) {
        return <FallbackComponent />;
    }

    return <>{children}</>;
}
