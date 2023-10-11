import { pb } from '$lib/pocketbase';

export async function handle({ event, resolve }) {
	//before resoponse(서버 다녀오기 전에 행하고 싶은 것들 )

	event.locals.pb = pb;
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		event.locals.pb.authStore.isValid && (await event.locals.pb.collection('users').authRefresh());
	} catch (_) {
		// clear the auth store on failed refresh
		event.locals.pb.authStore.clear();
	}

	event.locals.user = structuredClone(pb.authStore.model);

	const response = await resolve(event);

	// after response(서버 다녀온 후 행하고 싶은 것들)
	response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());
	return response;
}

// import { serializeNonPOJOs } from '$lib/utils';

// export const handle = async ({ event, resolve }) => {
// 	event.locals.pb = new PocketBase('http://127.0.0.1:8090');
// 	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

// 	if (event.locals.pb.authStore.isValid) {
// 		event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
// 	} else {
// 		event.locals.user = undefined;
// 	}

// 	const response = await resolve(event);

// 	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

// 	return response;
// };
