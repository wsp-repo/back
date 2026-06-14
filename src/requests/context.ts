import { AsyncLocalStorage } from 'node:async_hooks';

export type RequestContext = {
  requestId: string;
  startedAt: number;
};

type RequestInitContext = Partial<Omit<RequestContext, 'startedAt'>>;

const requestContextStorage = new AsyncLocalStorage<RequestContext>();

export function createRequestContext(
  requestInitContext?: RequestInitContext,
): Promise<RequestContext> {
  return new Promise((resolve) => {
    const initStore: RequestContext = {
      requestId: crypto.randomUUID(),
      ...requestInitContext,
      startedAt: Date.now(),
    };

    requestContextStorage.run(initStore, () => {
      const store = requestContextStorage.getStore();

      if (store) return resolve(store);

      throw new Error();
    });
  });
}

export function getRequestContext(): RequestContext | undefined {
  return requestContextStorage.getStore();
}

export function getRequestId(): string | undefined {
  return getRequestContext()?.requestId;
}
