declare var require: {
  context: (path: string, deep?: boolean, filter?: RegExp) => {
    keys: () => string[];
    (id: string): any;
  };
};

declare module '*.webp' {
  const content: string;
  export default content;
}

// Removed the specific relative path declaration
