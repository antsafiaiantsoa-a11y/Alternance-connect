import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Alternance Connect">
            <defs>
                <linearGradient id="alternance-connect-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6941C6" />
                    <stop offset="100%" stopColor="#3563EB" />
                </linearGradient>
            </defs>
            <rect width="40" height="40" rx="13" fill="url(#alternance-connect-gradient)" />
            <text x="20" y="25" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="800" letterSpacing="-.5">AC</text>
        </svg>
    );
}
