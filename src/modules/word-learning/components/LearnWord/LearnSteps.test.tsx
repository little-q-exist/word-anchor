import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import React from 'react';
import { ConfigProvider } from 'antd';
import type { BriefWordWithLearnStatus } from '@modules/word-learning/types';
import LearnSteps from './LearnSteps';

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

const makeWords = (): BriefWordWithLearnStatus[] => [
    { _id: 'w1', english: 'apple', status: 'passed' },
    { _id: 'w2', english: 'banana', status: 'idle' },
    { _id: 'w3', english: 'cherry', status: 'failed' },
];

describe('LearnSteps', () => {
    it('renders Drawer with word english and status when open', () => {
        const words = makeWords();
        renderWithConfig(
            <LearnSteps briefWords={words} index={0} onChange={vi.fn()} open={true} />,
        );

        expect(screen.getByText('apple')).toBeInTheDocument();
        expect(screen.getByText('banana')).toBeInTheDocument();
        expect(screen.getByText('cherry')).toBeInTheDocument();
    });

    it('does not show words when closed', () => {
        const words = makeWords();
        renderWithConfig(
            <LearnSteps briefWords={words} index={0} onChange={vi.fn()} open={false} />,
        );

        expect(screen.queryByText('apple')).not.toBeInTheDocument();
    });

    it('renders nothing when briefWords is empty', () => {
        renderWithConfig(
            <LearnSteps briefWords={[]} index={0} onChange={vi.fn()} open={true} />,
        );

        expect(screen.queryByText('apple')).not.toBeInTheDocument();
    });
});
