import type { HTTPMethod } from "h3";

export interface IHttpRequestOptions {
	method?: HTTPMethod;
	url: string;
	body?: any;
	params?: Record<string, any>;
	headers?: Record<string, string>;
	credentials?: RequestCredentials;
}

export default defineNuxtPlugin((_) => {
	const config = useRuntimeConfig();

	const request = async <T = any>(opts: IHttpRequestOptions) => {
		const { method = "GET", url, body, params, headers = {}, credentials = "include" } = opts;

		const fullUrl = config.public.backendUrl + url;

		const mergedHeaders = { ...headers };

		if (process.server) {
			const reqHeaders = useRequestHeaders(["cookie", "authorization"]);
			if (reqHeaders.cookie) {
				mergedHeaders["cookie"] = reqHeaders.cookie;
			}
			if (reqHeaders.authorization) {
				mergedHeaders["authorization"] = reqHeaders.authorization;
			}
		}

		return await $fetch<T>(fullUrl, {
			method,
			body,
			params,
			headers: mergedHeaders,
			credentials,
		});
	};

	// agora “métodos sintáticos” que chamam request
	const http = {
		get: <T = any>(url: string, opts?: Omit<IHttpRequestOptions, "method" | "url">) => {
			return request<T>({ method: "GET", url, ...(opts || {}) });
		},
		post: <T = any>(url: string, body?: any, opts?: Omit<IHttpRequestOptions, "method" | "url" | "body">) => {
			return request<T>({ method: "POST", url, body, ...(opts || {}) });
		},
		put: <T = any>(url: string, body?: any, opts?: Omit<IHttpRequestOptions, "method" | "url" | "body">) => {
			return request<T>({ method: "PUT", url, body, ...(opts || {}) });
		},
		delete: <T = any>(url: string, opts?: Omit<IHttpRequestOptions, "method" | "url">) => {
			return request<T>({ method: "DELETE", url, ...(opts || {}) });
		},
		// você pode adicionar mais (patch, head…) se quiser
	};

	return {
		provide: {
			http,
		},
	};
});
