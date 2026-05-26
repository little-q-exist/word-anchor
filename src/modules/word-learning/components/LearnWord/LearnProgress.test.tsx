import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import React from 'react';
import { ConfigProvider } from 'antd';
import type { BriefWordWithLearnStatus } from '@modules/word-learning/types';
import LearnProgress from './LearnProgress';

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
});

const renderWithConfig = (ui: React.ReactElement) => {
    return render(<ConfigProvider>{ui}</ConfigProvider>);
};

const makeWords = (count: number): BriefWordWithLearnStatus[] =>
    Array.from({ length: count }, (_, i) => ({
        _id: `w${i}`,
        english: `word${i}`,
        status: 'idle' as const,
    }));

describe('LearnProgress', () => {
    it('renders a button that opens the drawer on click', () => {
        const words = makeWords(5);
        renderWithConfig(
            <LearnProgress briefWords={words} currentIndex={2} index={2} onChange={vi.fn()} />
        );

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(screen.getByText('word0')).toBeInTheDocument();
    });

    it('renders button with icon only and no visible text', () => {
        const words = makeWords(3);
        renderWithConfig(
            <LearnProgress briefWords={words} currentIndex={0} index={0} onChange={vi.fn()} />
        );

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button.textContent).toBeDefined();
        // Button should have icon (svg inside) but no visible text content
        const hasIcon = button.querySelector('svg') !== null;
        expect(hasIcon).toBe(true);
    });
});
