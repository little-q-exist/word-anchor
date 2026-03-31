import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

type LoginData = {
    _id: string;
    username: string;
    token: string;
};

type BriefWord = {
    _id: string;
    english: string;
};

const API_BASE = 'http://localhost:3000/api';

const createTestUserAndLogin = async (request: APIRequestContext): Promise<LoginData> => {
    const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const username = `pw${suffix}`;
    const password = 'qa123456';

    const registerRes = await request.post(`${API_BASE}/users/register`, {
        data: {
            username,
            password,
            email: `${username}@example.com`,
        },
    });

    expect(registerRes.ok()).toBeTruthy();

    const loginRes = await request.post(`${API_BASE}/login`, {
        data: { username, password },
    });

    expect(loginRes.ok()).toBeTruthy();

    const loginPayload = (await loginRes.json()) as {
        data: LoginData;
    };

    return loginPayload.data;
};

const fetchLearnWords = async (
    request: APIRequestContext,
    user: LoginData,
    limit: number
): Promise<BriefWord[]> => {
    const response = await request.get(`${API_BASE}/words/learn?limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    });
    expect(response.ok()).toBeTruthy();

    const payload = (await response.json()) as {
        data: { words: BriefWord[] };
    };

    return payload.data.words;
};

const setAuthToLocalStorage = async (page: Page, user: LoginData) => {
    await page.addInitScript((data) => {
        localStorage.setItem('reciteWordAppUser', JSON.stringify(data));
    }, user);
};

const setLocalforageItems = async (
    page: Page,
    items: Array<{ key: string; value: unknown }>
): Promise<void> => {
    await page.evaluate(async (entries) => {
        const openDb = await new Promise<IDBDatabase>((resolve, reject) => {
            const req = indexedDB.open('localforage', 1);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains('keyvaluepairs')) {
                    db.createObjectStore('keyvaluepairs');
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });

        await new Promise<void>((resolve, reject) => {
            const tx = openDb.transaction('keyvaluepairs', 'readwrite');
            const store = tx.objectStore('keyvaluepairs');
            for (const item of entries) {
                store.put(item.value, item.key);
            }
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
        });

        openDb.close();
    }, items);
};

const getLocalforageEntries = async (
    page: Page
): Promise<Array<{ key: string; value: unknown }>> => {
    return page.evaluate(async () => {
        const openDb = await new Promise<IDBDatabase>((resolve, reject) => {
            const req = indexedDB.open('localforage', 1);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains('keyvaluepairs')) {
                    db.createObjectStore('keyvaluepairs');
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });

        const rows = await new Promise<Array<{ key: string; value: unknown }>>(
            (resolve, reject) => {
                const tx = openDb.transaction('keyvaluepairs', 'readonly');
                const store = tx.objectStore('keyvaluepairs');
                const cursor = store.openCursor();
                const data: Array<{ key: string; value: unknown }> = [];

                cursor.onsuccess = () => {
                    const current = cursor.result;
                    if (!current) {
                        resolve(data);
                        return;
                    }
                    data.push({ key: String(current.key), value: current.value });
                    current.continue();
                };
                cursor.onerror = () => reject(cursor.error);
            }
        );

        openDb.close();
        return rows;
    });
};

const waitLearnWordVisible = async (page: Page) => {
    await expect(page.locator('main h1').first()).toBeVisible();
};

test.describe('learn/review cache e2e', () => {
    test('场景1: learn/review 正常工作并记录学习数据，学习结束进入总结页', async ({
        page,
        request,
    }) => {
        const user = await createTestUserAndLogin(request);
        const [oneWord] = await fetchLearnWords(request, user, 1);
        expect(oneWord).toBeTruthy();

        await setAuthToLocalStorage(page, user);
        await page.goto('/');

        await setLocalforageItems(page, [
            {
                key: `${user._id}-learn-briefWords`,
                value: [{ ...oneWord, status: 'idle' }],
            },
            {
                key: `${user._id}-learn-lastLearnedIndex`,
                value: 0,
            },
            {
                key: `${user._id}-learn-learnQueueSnapshot`,
                value: {
                    index: 0,
                    isRepeating: false,
                    repeatQueue: [],
                    updatedAt: Date.now(),
                },
            },
        ]);

        await page.goto('/learn');
        await waitLearnWordVisible(page);
        await expect(page.locator('main h1').first()).toHaveText(oneWord.english);

        const familiarityResponsePromise = page.waitForResponse(
            (resp) =>
                resp.request().method() === 'PATCH' &&
                resp.url().includes(`/users/${user._id}/words/${oneWord._id}/familiarity`)
        );

        await page.getByRole('button', { name: 'Known', exact: true }).click();
        const familiarityResponse = await familiarityResponsePromise;
        expect(familiarityResponse.ok()).toBeTruthy();

        await page.getByRole('button', { name: 'Next', exact: true }).click();
        await expect(page.getByRole('heading', { name: 'Learning Complete!' })).toBeVisible();

        const learningDataResponse = await request.get(
            `${API_BASE}/users/${user._id}/words/${oneWord._id}?fields=lastLearned,interval,repetition`,
            {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
        );
        expect(learningDataResponse.ok()).toBeTruthy();

        const learningDataPayload = (await learningDataResponse.json()) as {
            data: { lastLearned?: string; interval?: number; repetition?: number };
        };

        expect(learningDataPayload.data.lastLearned).toBeTruthy();
        expect(Number(learningDataPayload.data.interval)).toBeGreaterThan(0);
        expect(Number(learningDataPayload.data.repetition)).toBeGreaterThan(0);

        const reviewResponsePromise = page.waitForResponse(
            (resp) => resp.request().method() === 'GET' && resp.url().includes('/api/words/review')
        );

        await page.goto('/review');
        const reviewResponse = await reviewResponsePromise;
        expect(reviewResponse.ok()).toBeTruthy();

        const hasEmptyState = (await page.getByText('You have learned all the words!').count()) > 0;
        const hasWordCard = (await page.locator('main h1').count()) > 0;
        expect(hasEmptyState || hasWordCard).toBeTruthy();
    });

    test('场景2: 学习中途刷新页面可以恢复单词与学习队列', async ({ page, request }) => {
        const user = await createTestUserAndLogin(request);
        const words = await fetchLearnWords(request, user, 2);

        test.skip(words.length < 2, '当前环境可学习词不足 2 个，无法验证中途刷新恢复。');

        await setAuthToLocalStorage(page, user);
        await page.goto('/learn');

        await waitLearnWordVisible(page);

        const firstWord = (await page.locator('main h1').first().innerText()).trim();

        await page.getByRole('button', { name: 'Unknown', exact: true }).click();
        await page.getByRole('button', { name: 'Next', exact: true }).click();

        await waitLearnWordVisible(page);
        const secondWord = (await page.locator('main h1').first().innerText()).trim();
        expect(secondWord).not.toBe(firstWord);

        const queueBeforeRefresh = (await getLocalforageEntries(page)).find(
            (entry) => entry.key === `${user._id}-learn-learnQueueSnapshot`
        )?.value as { index?: number } | undefined;

        expect(queueBeforeRefresh?.index).toBe(1);

        await page.reload();
        await waitLearnWordVisible(page);

        const wordAfterRefresh = (await page.locator('main h1').first().innerText()).trim();
        expect(wordAfterRefresh).toBe(secondWord);

        const queueAfterRefresh = (await getLocalforageEntries(page)).find(
            (entry) => entry.key === `${user._id}-learn-learnQueueSnapshot`
        )?.value as { index?: number } | undefined;

        expect(queueAfterRefresh?.index).toBe(1);
    });

    test('场景3: learn/review 切换时缓存互不串联', async ({ page, request }) => {
        const user = await createTestUserAndLogin(request);
        const words = await fetchLearnWords(request, user, 2);

        test.skip(words.length < 2, '当前环境可学习词不足 2 个，无法验证 learn/review 隔离。');

        const learnWord = words[0];
        const reviewWord = words[1];

        await setAuthToLocalStorage(page, user);
        await page.goto('/');

        await setLocalforageItems(page, [
            {
                key: `${user._id}-learn-briefWords`,
                value: [{ ...learnWord, status: 'idle' }],
            },
            {
                key: `${user._id}-learn-lastLearnedIndex`,
                value: 0,
            },
            {
                key: `${user._id}-learn-learnQueueSnapshot`,
                value: {
                    index: 0,
                    isRepeating: false,
                    repeatQueue: [],
                    updatedAt: Date.now(),
                },
            },
            {
                key: `${user._id}-review-briefWords`,
                value: [{ ...reviewWord, status: 'idle' }],
            },
            {
                key: `${user._id}-review-lastLearnedIndex`,
                value: 0,
            },
            {
                key: `${user._id}-review-learnQueueSnapshot`,
                value: {
                    index: 0,
                    isRepeating: false,
                    repeatQueue: [],
                    updatedAt: Date.now(),
                },
            },
        ]);

        await page.goto('/learn');
        await waitLearnWordVisible(page);
        await expect(page.locator('main h1').first()).toHaveText(learnWord.english);

        await page.goto('/review');
        await waitLearnWordVisible(page);
        await expect(page.locator('main h1').first()).toHaveText(reviewWord.english);

        await page.goto('/learn');
        await waitLearnWordVisible(page);
        await expect(page.locator('main h1').first()).toHaveText(learnWord.english);

        const entries = await getLocalforageEntries(page);
        const cachedLearnWords = entries.find(
            (entry) => entry.key === `${user._id}-learn-briefWords`
        )?.value as Array<{ _id: string; english: string }>;
        const cachedReviewWords = entries.find(
            (entry) => entry.key === `${user._id}-review-briefWords`
        )?.value as Array<{ _id: string; english: string }>;

        expect(cachedLearnWords[0]._id).toBe(learnWord._id);
        expect(cachedReviewWords[0]._id).toBe(reviewWord._id);
    });

    test('场景4: 学习结束后清理缓存，刷新不加载旧缓存', async ({ page, request }) => {
        const user = await createTestUserAndLogin(request);
        const [oneWord] = await fetchLearnWords(request, user, 1);
        expect(oneWord).toBeTruthy();

        await setAuthToLocalStorage(page, user);
        await page.goto('/');

        await setLocalforageItems(page, [
            {
                key: `${user._id}-learn-briefWords`,
                value: [{ ...oneWord, status: 'idle' }],
            },
            {
                key: `${user._id}-learn-lastLearnedIndex`,
                value: 0,
            },
            {
                key: `${user._id}-learn-learnQueueSnapshot`,
                value: {
                    index: 0,
                    isRepeating: false,
                    repeatQueue: [],
                    updatedAt: Date.now(),
                },
            },
        ]);

        await page.goto('/learn');
        await waitLearnWordVisible(page);
        await expect(page.locator('main h1').first()).toHaveText(oneWord.english);

        await page.getByRole('button', { name: 'Known', exact: true }).click();
        await page.getByRole('button', { name: 'Next', exact: true }).click();

        await expect(page.getByRole('heading', { name: 'Learning Complete!' })).toBeVisible();

        const entriesAfterFinish = await getLocalforageEntries(page);
        const learnCacheKeys = entriesAfterFinish
            .map((entry) => entry.key)
            .filter((key) => key.startsWith(`${user._id}-learn-`));

        expect(learnCacheKeys.length).toBe(0);

        await page.reload();
        await waitLearnWordVisible(page);

        const mainWordCount = await page.locator('main h1').count();
        if (mainWordCount > 0) {
            const refreshedWord = (await page.locator('main h1').first().innerText()).trim();
            expect(refreshedWord).not.toBe(oneWord.english);
        } else {
            await expect(page.getByText('You have learned all the words!')).toBeVisible();
        }
    });
});
