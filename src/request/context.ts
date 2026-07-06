import { AsyncLocalStorage } from 'node:async_hooks';

export type RequestContext = {
  requestId: string;
  startedAt: number;
};

type RequestInitContext = Omit<RequestContext, 'startedAt' | 'requestId'> &
  Partial<Pick<RequestContext, 'requestId'>>;

const requestContextStorage = new AsyncLocalStorage<RequestContext>();

export function createRequestContext(
  requestInitContext?: RequestInitContext,
): RequestContext {
  const context: RequestContext = {
    requestId: crypto.randomUUID(),
    ...requestInitContext,
    startedAt: Date.now(),
  };

  requestContextStorage.enterWith(context);

  return context;
}

export function getRequestContext(): RequestContext | undefined {
  return requestContextStorage.getStore();
}

export function getRequestId(): string | undefined {
  return getRequestContext()?.requestId;
}
