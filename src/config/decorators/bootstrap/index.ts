type Initializer = () => void;

let initialized: boolean = false;

const initializers: Initializer[] = [];

export function register(initializer: Initializer): void {
  if (initialized) return initializer();

  initializers.push(initializer);
}

export function initDecorators(): void {
  if (initialized) return;

  for (const initializer of initializers) {
    initializer();
  }

  initializers.length = 0;
  initialized = true;
}
