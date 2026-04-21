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

export interface NewUser {
    username: string;
    email?: string;
    password: string;
}

export interface User {
    token: string;
    username: string;
    _id: string;
}

export interface UserStats {
    todayCount: number;
    totalCount: number;
}
