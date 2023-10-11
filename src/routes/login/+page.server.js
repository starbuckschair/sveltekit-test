import { error, redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, locals }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);
		// console.log(body.email);

		try {
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
			if (!locals.pb?.authStore?.model?.verified) {
				locals.pb.authStore.clear();
				return {
					notVerified: true
				};
			}
		} catch (err) {
			console.log('Error: ', err);
			throw error(500, 'Something went wrong logging in');
		}

		throw redirect(303, '/');
	}
};
