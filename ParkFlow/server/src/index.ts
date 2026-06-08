import { createApp } from './app.ts';
import { env } from './env.ts';

const app = createApp();

app.listen(env.port, () => {
	console.log(`ParkFlow server ready on port ${env.port}`);
});
