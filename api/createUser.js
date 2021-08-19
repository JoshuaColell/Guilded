import axios from 'axios';

const createUser = async (req, res) => {
	const { userId, userName } = req.body;

	axios
		.post(
			'https://api.chatengine.io/projects/people/',
			{ username: userName, secret: userId },
			{ headers: { 'Private-Key': process.env.CHAT_ENGINE_PRIVATE_KEY } },
		)
		.then(apiRes => {
			res.json({
				body: apiRes.body,
				error: null,
			});
		})
		.catch(() => {
			res.json({
				body: null,
				error: `There was an error creating User '${userName}'!`,
			});
		});
};

export default createUser;
