import { error, redirect } from '@sveltejs/kit';
import { generateUsername } from '../../lib/pocketbase';

/** @type {import('./$types').Actions} */
export const actions = {
	register: async ({ locals, request }) => {
		const formData = await request.formData();
		console.log(formData);
		const data = Object.fromEntries(formData);
		console.log(data);
		try {
			await locals.pb.collection('users').create(data);
			// await locals.pb.collection('users').requestVerification(data.email);
		} catch (e) {
			console.error(e);
			throw e;
		}
		throw redirect(303, '/login');

		// let username = generateUsername(body.name.split(' ').join('')).toLowerCase();

		// try {
		// 	await locals.pb.collection('users').create({ username, ...body });
		// 	await locals.pb.collection('users').requestVerification(body.email);
		// } catch (err) {
		// 	console.log('Error: ', err);
		// 	throw error(500, 'Something went wrong');
		// }

		// throw redirect(303, '/login');
	}
};
