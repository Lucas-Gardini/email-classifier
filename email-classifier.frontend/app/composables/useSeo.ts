export function useSeo(opts: {
	title?: string;
	description?: string;
	image?: string;
	pathname?: string; // ex: route.fullPath
}) {
	const config = useRuntimeConfig();
	const route = useRoute();
	const siteUrl = config.public.siteUrl.replace(/\/+$/, ""); // sem barra no fim
	const path = (opts?.pathname ?? route.fullPath) || "/";
	const absoluteUrl = `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;

	const title = opts.title ?? "Email Classifier";
	const description = opts.description ?? "Classificação automática de e-mails com IA, filas e arquitetura escalável.";
	// const image = opts.image ?? "/og-default.jpg";
	// const imageAbs = image.startsWith("http") ? image : `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`;

	useSeoMeta({
		title,
		ogTitle: title,
		description,
		ogDescription: description,
		ogType: "website",
		ogUrl: absoluteUrl,
		// ogImage: imageAbs,
		twitterCard: "summary_large_image",
		twitterTitle: title,
		twitterDescription: description,
		// twitterImage: imageAbs,
	});

	// Canonical
	useHead({
		link: [{ rel: "canonical", href: absoluteUrl }],
	});
}
