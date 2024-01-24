const a = 111;

console.log('meta', import.meta);
const query = new URL(import.meta.url).searchParams;
console.log('query', Object.fromEntries(query.entries()));

export { a };
