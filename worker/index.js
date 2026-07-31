const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (request.method === "OPTIONS") {
			return new Response(null, { headers: corsHeaders(env) });
		}

		if (request.method !== "POST" || !url.pathname.endsWith("/subscribe")) {
			return json({ error: "Not found" }, 404, env);
		}

		let body;
		try {
			body = await request.json();
		} catch (e) {
			return json({ error: "Invalid request body" }, 400, env);
		}

		const email = String(body.email || "").trim().toLowerCase();

		if (!EMAIL_REGEX.test(email)) {
			return json({ error: "Invalid email" }, 400, env);
		}

		const existing = await env.EMAILS.get(email);
		if (existing) {
			return json({ ok: true, alreadySubscribed: true }, 200, env);
		}

		await env.EMAILS.put(email, JSON.stringify({
			subscribedAt: new Date().toISOString()
		}));

		return json({ ok: true }, 200, env);
	}
};

function corsHeaders(env) {
	return {
		"Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type"
	};
}

function json(data, status, env) {
	return new Response(JSON.stringify(data), {
		status: status,
		headers: {
			"Content-Type": "application/json",
			...corsHeaders(env)
		}
	});
}