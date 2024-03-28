import '@/app/global.css';
import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

export interface LayoutProps extends PropsWithChildren {}

export default function Layout({ children }: LayoutProps) {
    return (
        <html>
            <body>{children}</body>
        </html>
    );
}

export const metadata: Metadata = {
    title: '@comradesharf/create-next-app',
    description: '@comradesharf/create-next-app',
};
