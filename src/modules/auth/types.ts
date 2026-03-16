export type FieldType = {
    username: string;
    password: string;
    remember?: string;
};

export type StatusType = 'idle' | 'loading' | 'success' | 'failed';
