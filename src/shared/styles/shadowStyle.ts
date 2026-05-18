import type { CSSProperties } from 'react';

export const shadows = {
    /** Card default: tinted shadow using colorTextBase (26,26,46) at 5% */
    card: '0 2px 8px rgba(26,26,46,0.05)',
    /** Card hover: tinted shadow at 7% */
    cardHover: '0 4px 16px rgba(26,26,46,0.07)',
    /** Dropdown/Modal: tinted shadow at 9% */
    elevated: '0 8px 24px rgba(26,26,46,0.09)',
    /** Primary button: theme color tinted shadow at 18% */
    primaryButton: '0 4px 12px rgba(22,119,255,0.18)',
} as const;

export const cardTransition: CSSProperties['transition'] =
    'transform 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)';

export const buttonActiveTransform: CSSProperties['transform'] =
    'translateY(1px) scale(0.98)';

export const cardHoverTransform: CSSProperties['transform'] =
    'translateY(-2px)';
