type Initializer = () => void;

let initialized: boolean = false;

const initializers: Initializer[] = [];

export function register(initializer: Initializer): void {
  initializers.push(initializer);
}

export function initDecorators(): void {
  console.warn('initDecorators');

  if (initialized) return;

  for (const initializer of initializers) {
    initializer();
  }

  initialized = true;
}
