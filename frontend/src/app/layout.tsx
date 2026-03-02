import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Factory Productivity Dashboard',
    description: 'AI-powered worker productivity monitoring system',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
