import type { IHttpRequestOptions } from "~/plugins/http-client";

type Body = string | number | boolean | Record<string, any> | Array<any> | null;

export function useHttp() {
	const nuxt = useNuxtApp();
	return nuxt.$http as {
		get: <T>(url: string, opts?: Exclude<IHttpRequestOptions, "method">) => Promise<T>;
		post: <T>(url: string, body?: Body, opts?: Exclude<IHttpRequestOptions, "method">) => Promise<T>;
		put: <T>(url: string, body?: Body, opts?: Exclude<IHttpRequestOptions, "method">) => Promise<T>;
		delete: <T>(url: string, opts?: Exclude<IHttpRequestOptions, "method">) => Promise<T>;
	};
}
