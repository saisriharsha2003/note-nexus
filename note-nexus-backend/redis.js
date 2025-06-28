import { createClient } from 'redis';

export const publisher = createClient({ url: 'redis://note-nexus-redis:6379' });
export const subscriber = createClient({ url: 'redis://note-nexus-redis:6379' });

await publisher.connect();
await subscriber.connect();
