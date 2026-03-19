export type LoginFormFieldType = {
    username: string;
    password: string;
    remember?: string;
};

export type RegisterFormFieldType = {
    username: string;
    email?: string;
    password: string;
    agreement: string;
};

export type StatusType = 'idle' | 'loading' | 'success' | 'failed';
