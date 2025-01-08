declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": Record<string, {
  id: string;
  slug: string;
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">;
  render(): Render[".md"];
}>;
"books": {
"consistency-and-consensus-in-distributed-systems.md": {
	id: "consistency-and-consensus-in-distributed-systems.md";
  slug: "consistency-and-consensus-in-distributed-systems";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"data-models-and-query-languages.md": {
	id: "data-models-and-query-languages.md";
  slug: "data-models-and-query-languages";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"data-replication-in-distributed-systems.md": {
	id: "data-replication-in-distributed-systems.md";
  slug: "data-replication-in-distributed-systems";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"data-storage-and-retrieval.md": {
	id: "data-storage-and-retrieval.md";
  slug: "data-storage-and-retrieval";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"database-partitioning.md": {
	id: "database-partitioning.md";
  slug: "database-partitioning";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"ddia-encoding-decoding-schemas-and-data-evolution.md": {
	id: "ddia-encoding-decoding-schemas-and-data-evolution.md";
  slug: "ddia-encoding-decoding-schemas-and-data-evolution";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"essentialism-book-review-and-notes.md": {
	id: "essentialism-book-review-and-notes.md";
  slug: "essentialism-book-review-and-notes";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"high-productivity-and-clear-communication-in-different-cultures.md": {
	id: "high-productivity-and-clear-communication-in-different-cultures.md";
  slug: "high-productivity-and-clear-communication-in-different-cultures";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"how-to-model-microservices.md": {
	id: "how-to-model-microservices.md";
  slug: "how-to-model-microservices";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"how-to-read-a-book-review-summary-and-notes.md": {
	id: "how-to-read-a-book-review-summary-and-notes.md";
  slug: "how-to-read-a-book-review-summary-and-notes";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"integrating-microservices-part-1.md": {
	id: "integrating-microservices-part-1.md";
  slug: "integrating-microservices-part-1";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"integrating-microservices-part-2.md": {
	id: "integrating-microservices-part-2.md";
  slug: "integrating-microservices-part-2";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"make-time-book-summary-review-and-notes.md": {
	id: "make-time-book-summary-review-and-notes.md";
  slug: "make-time-book-summary-review-and-notes";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"measure-what-matters-by-john-doerr-summary-review-and-book-notes.md": {
	id: "measure-what-matters-by-john-doerr-summary-review-and-book-notes.md";
  slug: "measure-what-matters-by-john-doerr-summary-review-and-book-notes";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"microservices-and-their-benefits.md": {
	id: "microservices-and-their-benefits.md";
  slug: "microservices-and-their-benefits";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"psychology-of-money.md": {
	id: "psychology-of-money.md";
  slug: "psychology-of-money";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"reliability-maintainability-and-scalability-in-applications.md": {
	id: "reliability-maintainability-and-scalability-in-applications.md";
  slug: "reliability-maintainability-and-scalability-in-applications";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"splitting-the-monolith.md": {
	id: "splitting-the-monolith.md";
  slug: "splitting-the-monolith";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"team-topologies-book-review-summary-and-notes.md": {
	id: "team-topologies-book-review-summary-and-notes.md";
  slug: "team-topologies-book-review-summary-and-notes";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"the-evolutionary-architect.md": {
	id: "the-evolutionary-architect.md";
  slug: "the-evolutionary-architect";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"the-subtle-art-of-not-giving-a-fuck-book-note-you-are-not-special.md": {
	id: "the-subtle-art-of-not-giving-a-fuck-book-note-you-are-not-special.md";
  slug: "the-subtle-art-of-not-giving-a-fuck-book-note-you-are-not-special";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"the-subtle-art-of-not-giving-a-fuck-by-mark-manson-book-summary-review-and-notes.md": {
	id: "the-subtle-art-of-not-giving-a-fuck-by-mark-manson-book-summary-review-and-notes.md";
  slug: "the-subtle-art-of-not-giving-a-fuck-by-mark-manson-book-summary-review-and-notes";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"the-trouble-with-distributed-systems.md": {
	id: "the-trouble-with-distributed-systems.md";
  slug: "the-trouble-with-distributed-systems";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"think-again-by-adam-grant-book-summary-review-and-notes.md": {
	id: "think-again-by-adam-grant-book-summary-review-and-notes.md";
  slug: "think-again-by-adam-grant-book-summary-review-and-notes";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"turn-the-ship-around-summary-book-chapter-notes.md": {
	id: "turn-the-ship-around-summary-book-chapter-notes.md";
  slug: "turn-the-ship-around-summary-book-chapter-notes";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"understanding-how-database-transactions-work.md": {
	id: "understanding-how-database-transactions-work.md";
  slug: "understanding-how-database-transactions-work";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
"worth-doing-wrong-book-summary-review-and-notes.md": {
	id: "worth-doing-wrong-book-summary-review-and-notes.md";
  slug: "worth-doing-wrong-book-summary-review-and-notes";
  body: string;
  collection: "books";
  data: any
} & { render(): Render[".md"] };
};
"de": {
"vier-schritte-fuer-einen-neustart.md": {
	id: "vier-schritte-fuer-einen-neustart.md";
  slug: "vier-schritte-fuer-einen-neustart";
  body: string;
  collection: "de";
  data: any
} & { render(): Render[".md"] };
};
"feed": Record<string, {
  id: string;
  slug: string;
  body: string;
  collection: "feed";
  data: InferEntrySchema<"feed">;
  render(): Render[".md"];
}>;
"journal": {
"added-decap-cms-finally.md": {
	id: "added-decap-cms-finally.md";
  slug: "added-decap-cms-finally";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"an-article-about-bidens-debate-on-tv-and-retirement.md": {
	id: "an-article-about-bidens-debate-on-tv-and-retirement.md";
  slug: "an-article-about-bidens-debate-on-tv-and-retirement";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"consuming-news-weekly.md": {
	id: "consuming-news-weekly.md";
  slug: "consuming-news-weekly";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"crawlers-and-robots-txt.md": {
	id: "crawlers-and-robots-txt.md";
  slug: "crawlers-and-robots-txt";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"ctos-expected-to-do-more-in-2024.md": {
	id: "ctos-expected-to-do-more-in-2024.md";
  slug: "ctos-expected-to-do-more-in-2024";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"employer-market-will-change.md": {
	id: "employer-market-will-change.md";
  slug: "employer-market-will-change";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"explain-how-to-manage-your-team.md": {
	id: "explain-how-to-manage-your-team.md";
  slug: "explain-how-to-manage-your-team";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"learn-how-to-work-with-average-talent.md": {
	id: "learn-how-to-work-with-average-talent.md";
  slug: "learn-how-to-work-with-average-talent";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"missing-product-engineering-partnership.md": {
	id: "missing-product-engineering-partnership.md";
  slug: "missing-product-engineering-partnership";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"nature-heals.md": {
	id: "nature-heals.md";
  slug: "nature-heals";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"new-books-for-systems-thinking-and-software-architecture-and-strategy.md": {
	id: "new-books-for-systems-thinking-and-software-architecture-and-strategy.md";
  slug: "new-books-for-systems-thinking-and-software-architecture-and-strategy";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"public-zettelkasten.md": {
	id: "public-zettelkasten.md";
  slug: "public-zettelkasten";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"reading-qr-code-without-phone-or-scanner.md": {
	id: "reading-qr-code-without-phone-or-scanner.md";
  slug: "reading-qr-code-without-phone-or-scanner";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"retrospective-look-change-strategy.md": {
	id: "retrospective-look-change-strategy.md";
  slug: "retrospective-look-change-strategy";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"rituals-not-traditions.md": {
	id: "rituals-not-traditions.md";
  slug: "rituals-not-traditions";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"saying-something-once-is-not-enough.md": {
	id: "saying-something-once-is-not-enough.md";
  slug: "saying-something-once-is-not-enough";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"short-definition-of-good-engineer.md": {
	id: "short-definition-of-good-engineer.md";
  slug: "short-definition-of-good-engineer";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"the-world-in-2050.md": {
	id: "the-world-in-2050.md";
  slug: "the-world-in-2050";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"transparency-is-not-sharing-everything.md": {
	id: "transparency-is-not-sharing-everything.md";
  slug: "transparency-is-not-sharing-everything";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
"your-job-title-depends-on-the-organization.md": {
	id: "your-job-title-depends-on-the-organization.md";
  slug: "your-job-title-depends-on-the-organization";
  body: string;
  collection: "journal";
  data: any
} & { render(): Render[".md"] };
};
"newsletter": {
"mediations-1.md": {
	id: "mediations-1.md";
  slug: "mediations-1";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mediations-2.md": {
	id: "mediations-2.md";
  slug: "mediations-2";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mediations-3.md": {
	id: "mediations-3.md";
  slug: "mediations-3";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mediations-4.md": {
	id: "mediations-4.md";
  slug: "mediations-4";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mediations-5.md": {
	id: "mediations-5.md";
  slug: "mediations-5";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mediations-6.md": {
	id: "mediations-6.md";
  slug: "mediations-6";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mediations-7.md": {
	id: "mediations-7.md";
  slug: "mediations-7";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-1.md": {
	id: "mektup-1.md";
  slug: "mektup-1";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-10.md": {
	id: "mektup-10.md";
  slug: "mektup-10";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-11.md": {
	id: "mektup-11.md";
  slug: "mektup-11";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-12.md": {
	id: "mektup-12.md";
  slug: "mektup-12";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-13.md": {
	id: "mektup-13.md";
  slug: "mektup-13";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-14.md": {
	id: "mektup-14.md";
  slug: "mektup-14";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-15.md": {
	id: "mektup-15.md";
  slug: "mektup-15";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-16.md": {
	id: "mektup-16.md";
  slug: "mektup-16";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-17.md": {
	id: "mektup-17.md";
  slug: "mektup-17";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-18.md": {
	id: "mektup-18.md";
  slug: "mektup-18";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-19.md": {
	id: "mektup-19.md";
  slug: "mektup-19";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-2.md": {
	id: "mektup-2.md";
  slug: "mektup-2";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-20.md": {
	id: "mektup-20.md";
  slug: "mektup-20";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-21.md": {
	id: "mektup-21.md";
  slug: "mektup-21";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-22.md": {
	id: "mektup-22.md";
  slug: "mektup-22";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-23.md": {
	id: "mektup-23.md";
  slug: "mektup-23";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-24.md": {
	id: "mektup-24.md";
  slug: "mektup-24";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-25.md": {
	id: "mektup-25.md";
  slug: "mektup-25";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-26.md": {
	id: "mektup-26.md";
  slug: "mektup-26";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-27.md": {
	id: "mektup-27.md";
  slug: "mektup-27";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-28.md": {
	id: "mektup-28.md";
  slug: "mektup-28";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-29.md": {
	id: "mektup-29.md";
  slug: "mektup-29";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-3.md": {
	id: "mektup-3.md";
  slug: "mektup-3";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-30.md": {
	id: "mektup-30.md";
  slug: "mektup-30";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-31.md": {
	id: "mektup-31.md";
  slug: "mektup-31";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-32.md": {
	id: "mektup-32.md";
  slug: "mektup-32";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-33.md": {
	id: "mektup-33.md";
  slug: "mektup-33";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-34.md": {
	id: "mektup-34.md";
  slug: "mektup-34";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-35.md": {
	id: "mektup-35.md";
  slug: "mektup-35";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-36.md": {
	id: "mektup-36.md";
  slug: "mektup-36";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-37.md": {
	id: "mektup-37.md";
  slug: "mektup-37";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-38.md": {
	id: "mektup-38.md";
  slug: "mektup-38";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-39.md": {
	id: "mektup-39.md";
  slug: "mektup-39";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-4.md": {
	id: "mektup-4.md";
  slug: "mektup-4";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-40.md": {
	id: "mektup-40.md";
  slug: "mektup-40";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-41.md": {
	id: "mektup-41.md";
  slug: "mektup-41";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-42.md": {
	id: "mektup-42.md";
  slug: "mektup-42";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-43.md": {
	id: "mektup-43.md";
  slug: "mektup-43";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-44.md": {
	id: "mektup-44.md";
  slug: "mektup-44";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-45.md": {
	id: "mektup-45.md";
  slug: "mektup-45";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-46.md": {
	id: "mektup-46.md";
  slug: "mektup-46";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-47.md": {
	id: "mektup-47.md";
  slug: "mektup-47";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-48.md": {
	id: "mektup-48.md";
  slug: "mektup-48";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-49.md": {
	id: "mektup-49.md";
  slug: "mektup-49";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-5.md": {
	id: "mektup-5.md";
  slug: "mektup-5";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-50.md": {
	id: "mektup-50.md";
  slug: "mektup-50";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-51.md": {
	id: "mektup-51.md";
  slug: "mektup-51";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-52.md": {
	id: "mektup-52.md";
  slug: "mektup-52";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-53.md": {
	id: "mektup-53.md";
  slug: "mektup-53";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-6.md": {
	id: "mektup-6.md";
  slug: "mektup-6";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-7.md": {
	id: "mektup-7.md";
  slug: "mektup-7";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-8.md": {
	id: "mektup-8.md";
  slug: "mektup-8";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup-9.md": {
	id: "mektup-9.md";
  slug: "mektup-9";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
};
"notes": {
"1.md": {
	id: "1.md";
  slug: "1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"10.md": {
	id: "10.md";
  slug: "10";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"10a.md": {
	id: "10a.md";
  slug: "10a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"10b.md": {
	id: "10b.md";
  slug: "10b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"11.md": {
	id: "11.md";
  slug: "11";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"12.md": {
	id: "12.md";
  slug: "12";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"12a.md": {
	id: "12a.md";
  slug: "12a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"13.md": {
	id: "13.md";
  slug: "13";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"14.md": {
	id: "14.md";
  slug: "14";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"15.md": {
	id: "15.md";
  slug: "15";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"16.md": {
	id: "16.md";
  slug: "16";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"16a.md": {
	id: "16a.md";
  slug: "16a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"16b.md": {
	id: "16b.md";
  slug: "16b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"16c.md": {
	id: "16c.md";
  slug: "16c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"17.md": {
	id: "17.md";
  slug: "17";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"17a.md": {
	id: "17a.md";
  slug: "17a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"17b.md": {
	id: "17b.md";
  slug: "17b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"17c.md": {
	id: "17c.md";
  slug: "17c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"17d.md": {
	id: "17d.md";
  slug: "17d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"17e.md": {
	id: "17e.md";
  slug: "17e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"17f.md": {
	id: "17f.md";
  slug: "17f";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"17g.md": {
	id: "17g.md";
  slug: "17g";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"17h.md": {
	id: "17h.md";
  slug: "17h";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"17i.md": {
	id: "17i.md";
  slug: "17i";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"18.md": {
	id: "18.md";
  slug: "18";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"19.md": {
	id: "19.md";
  slug: "19";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"19a.md": {
	id: "19a.md";
  slug: "19a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"19a1.md": {
	id: "19a1.md";
  slug: "19a1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"19a2.md": {
	id: "19a2.md";
  slug: "19a2";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"19b.md": {
	id: "19b.md";
  slug: "19b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"19c.md": {
	id: "19c.md";
  slug: "19c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"19d.md": {
	id: "19d.md";
  slug: "19d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"19e.md": {
	id: "19e.md";
  slug: "19e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"19f.md": {
	id: "19f.md";
  slug: "19f";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"1a.md": {
	id: "1a.md";
  slug: "1a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"1b.md": {
	id: "1b.md";
  slug: "1b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"1c.md": {
	id: "1c.md";
  slug: "1c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"1d.md": {
	id: "1d.md";
  slug: "1d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"1e.md": {
	id: "1e.md";
  slug: "1e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"1f.md": {
	id: "1f.md";
  slug: "1f";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"1g.md": {
	id: "1g.md";
  slug: "1g";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"1h.md": {
	id: "1h.md";
  slug: "1h";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"1i.md": {
	id: "1i.md";
  slug: "1i";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"1j.md": {
	id: "1j.md";
  slug: "1j";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"2.md": {
	id: "2.md";
  slug: "2";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"20.md": {
	id: "20.md";
  slug: "20";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"20a.md": {
	id: "20a.md";
  slug: "20a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"20b.md": {
	id: "20b.md";
  slug: "20b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"20c.md": {
	id: "20c.md";
  slug: "20c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"20d.md": {
	id: "20d.md";
  slug: "20d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"20e.md": {
	id: "20e.md";
  slug: "20e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"20f.md": {
	id: "20f.md";
  slug: "20f";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"20g.md": {
	id: "20g.md";
  slug: "20g";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"20h.md": {
	id: "20h.md";
  slug: "20h";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"20i.md": {
	id: "20i.md";
  slug: "20i";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"21.md": {
	id: "21.md";
  slug: "21";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"21a.md": {
	id: "21a.md";
  slug: "21a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"21b.md": {
	id: "21b.md";
  slug: "21b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"22.md": {
	id: "22.md";
  slug: "22";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"22a.md": {
	id: "22a.md";
  slug: "22a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"23.md": {
	id: "23.md";
  slug: "23";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"23a.md": {
	id: "23a.md";
  slug: "23a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"23b.md": {
	id: "23b.md";
  slug: "23b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"23b1.md": {
	id: "23b1.md";
  slug: "23b1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"23c.md": {
	id: "23c.md";
  slug: "23c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"23c1.md": {
	id: "23c1.md";
  slug: "23c1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"23d.md": {
	id: "23d.md";
  slug: "23d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"23e.md": {
	id: "23e.md";
  slug: "23e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"23f.md": {
	id: "23f.md";
  slug: "23f";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"23g.md": {
	id: "23g.md";
  slug: "23g";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"23h.md": {
	id: "23h.md";
  slug: "23h";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"23i.md": {
	id: "23i.md";
  slug: "23i";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"24.md": {
	id: "24.md";
  slug: "24";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"24a.md": {
	id: "24a.md";
  slug: "24a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"24b.md": {
	id: "24b.md";
  slug: "24b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"24b1.md": {
	id: "24b1.md";
  slug: "24b1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"24c.md": {
	id: "24c.md";
  slug: "24c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"24d.md": {
	id: "24d.md";
  slug: "24d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"24e.md": {
	id: "24e.md";
  slug: "24e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"25.md": {
	id: "25.md";
  slug: "25";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"25a.md": {
	id: "25a.md";
  slug: "25a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"25b.md": {
	id: "25b.md";
  slug: "25b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"25c.md": {
	id: "25c.md";
  slug: "25c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"25d.md": {
	id: "25d.md";
  slug: "25d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"26.md": {
	id: "26.md";
  slug: "26";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"26a.md": {
	id: "26a.md";
  slug: "26a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"26b.md": {
	id: "26b.md";
  slug: "26b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"26c.md": {
	id: "26c.md";
  slug: "26c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"26d.md": {
	id: "26d.md";
  slug: "26d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"27.md": {
	id: "27.md";
  slug: "27";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"27a.md": {
	id: "27a.md";
  slug: "27a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"27b.md": {
	id: "27b.md";
  slug: "27b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"27b1.md": {
	id: "27b1.md";
  slug: "27b1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"27c.md": {
	id: "27c.md";
  slug: "27c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"27d.md": {
	id: "27d.md";
  slug: "27d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"27e.md": {
	id: "27e.md";
  slug: "27e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"27f.md": {
	id: "27f.md";
  slug: "27f";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"27f1.md": {
	id: "27f1.md";
  slug: "27f1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"28.md": {
	id: "28.md";
  slug: "28";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"29.md": {
	id: "29.md";
  slug: "29";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"29a.md": {
	id: "29a.md";
  slug: "29a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"2a.md": {
	id: "2a.md";
  slug: "2a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"2b.md": {
	id: "2b.md";
  slug: "2b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"2c.md": {
	id: "2c.md";
  slug: "2c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"2d.md": {
	id: "2d.md";
  slug: "2d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"2e.md": {
	id: "2e.md";
  slug: "2e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"2f.md": {
	id: "2f.md";
  slug: "2f";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3.md": {
	id: "3.md";
  slug: "3";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"30.md": {
	id: "30.md";
  slug: "30";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"30a.md": {
	id: "30a.md";
  slug: "30a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"30b.md": {
	id: "30b.md";
  slug: "30b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"30b1.md": {
	id: "30b1.md";
  slug: "30b1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"30b2.md": {
	id: "30b2.md";
  slug: "30b2";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"30b3.md": {
	id: "30b3.md";
  slug: "30b3";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"30c.md": {
	id: "30c.md";
  slug: "30c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"30d.md": {
	id: "30d.md";
  slug: "30d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"30d1.md": {
	id: "30d1.md";
  slug: "30d1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"30e.md": {
	id: "30e.md";
  slug: "30e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"31.md": {
	id: "31.md";
  slug: "31";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"31a.md": {
	id: "31a.md";
  slug: "31a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"31b.md": {
	id: "31b.md";
  slug: "31b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"31c.md": {
	id: "31c.md";
  slug: "31c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"31d.md": {
	id: "31d.md";
  slug: "31d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"32.md": {
	id: "32.md";
  slug: "32";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"32a.md": {
	id: "32a.md";
  slug: "32a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"32b.md": {
	id: "32b.md";
  slug: "32b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"33.md": {
	id: "33.md";
  slug: "33";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"33a.md": {
	id: "33a.md";
  slug: "33a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"34.md": {
	id: "34.md";
  slug: "34";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"34a.md": {
	id: "34a.md";
  slug: "34a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"35.md": {
	id: "35.md";
  slug: "35";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"36.md": {
	id: "36.md";
  slug: "36";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"37.md": {
	id: "37.md";
  slug: "37";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"37a.md": {
	id: "37a.md";
  slug: "37a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"38.md": {
	id: "38.md";
  slug: "38";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"38a.md": {
	id: "38a.md";
  slug: "38a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"38b.md": {
	id: "38b.md";
  slug: "38b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"39.md": {
	id: "39.md";
  slug: "39";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"39a.md": {
	id: "39a.md";
  slug: "39a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3a.md": {
	id: "3a.md";
  slug: "3a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3b.md": {
	id: "3b.md";
  slug: "3b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3b1.md": {
	id: "3b1.md";
  slug: "3b1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3b2.md": {
	id: "3b2.md";
  slug: "3b2";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3b3.md": {
	id: "3b3.md";
  slug: "3b3";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3b4.md": {
	id: "3b4.md";
  slug: "3b4";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3b5.md": {
	id: "3b5.md";
  slug: "3b5";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3b6.md": {
	id: "3b6.md";
  slug: "3b6";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3b7.md": {
	id: "3b7.md";
  slug: "3b7";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3c.md": {
	id: "3c.md";
  slug: "3c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3c1.md": {
	id: "3c1.md";
  slug: "3c1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3c2.md": {
	id: "3c2.md";
  slug: "3c2";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3c3.md": {
	id: "3c3.md";
  slug: "3c3";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3c3a.md": {
	id: "3c3a.md";
  slug: "3c3a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3c4.md": {
	id: "3c4.md";
  slug: "3c4";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3d.md": {
	id: "3d.md";
  slug: "3d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"3e.md": {
	id: "3e.md";
  slug: "3e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"4.md": {
	id: "4.md";
  slug: "4";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"40.md": {
	id: "40.md";
  slug: "40";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"40a.md": {
	id: "40a.md";
  slug: "40a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"40b.md": {
	id: "40b.md";
  slug: "40b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"40c.md": {
	id: "40c.md";
  slug: "40c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"40d.md": {
	id: "40d.md";
  slug: "40d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"40d1.md": {
	id: "40d1.md";
  slug: "40d1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"40e.md": {
	id: "40e.md";
  slug: "40e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"41.md": {
	id: "41.md";
  slug: "41";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"41a.md": {
	id: "41a.md";
  slug: "41a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"41b.md": {
	id: "41b.md";
  slug: "41b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"41b1.md": {
	id: "41b1.md";
  slug: "41b1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"41c.md": {
	id: "41c.md";
  slug: "41c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"41d.md": {
	id: "41d.md";
  slug: "41d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"42.md": {
	id: "42.md";
  slug: "42";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"42a.md": {
	id: "42a.md";
  slug: "42a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"42b.md": {
	id: "42b.md";
  slug: "42b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"42c.md": {
	id: "42c.md";
  slug: "42c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"42d.md": {
	id: "42d.md";
  slug: "42d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"42e.md": {
	id: "42e.md";
  slug: "42e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"43.md": {
	id: "43.md";
  slug: "43";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"44.md": {
	id: "44.md";
  slug: "44";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"44a.md": {
	id: "44a.md";
  slug: "44a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"44b.md": {
	id: "44b.md";
  slug: "44b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"44c.md": {
	id: "44c.md";
  slug: "44c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"44d.md": {
	id: "44d.md";
  slug: "44d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"44e.md": {
	id: "44e.md";
  slug: "44e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"44f.md": {
	id: "44f.md";
  slug: "44f";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"44g.md": {
	id: "44g.md";
  slug: "44g";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"44h.md": {
	id: "44h.md";
  slug: "44h";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"44i.md": {
	id: "44i.md";
  slug: "44i";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"44j.md": {
	id: "44j.md";
  slug: "44j";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"44k.md": {
	id: "44k.md";
  slug: "44k";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"44l.md": {
	id: "44l.md";
  slug: "44l";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"45.md": {
	id: "45.md";
  slug: "45";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"45a.md": {
	id: "45a.md";
  slug: "45a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"46.md": {
	id: "46.md";
  slug: "46";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"46a.md": {
	id: "46a.md";
  slug: "46a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"46b.md": {
	id: "46b.md";
  slug: "46b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"46c.md": {
	id: "46c.md";
  slug: "46c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"46d.md": {
	id: "46d.md";
  slug: "46d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"46d1.md": {
	id: "46d1.md";
  slug: "46d1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"46e.md": {
	id: "46e.md";
  slug: "46e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"46f.md": {
	id: "46f.md";
  slug: "46f";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"46g.md": {
	id: "46g.md";
  slug: "46g";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"47.md": {
	id: "47.md";
  slug: "47";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"47a.md": {
	id: "47a.md";
  slug: "47a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"47a1.md": {
	id: "47a1.md";
  slug: "47a1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"47b.md": {
	id: "47b.md";
  slug: "47b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"48.md": {
	id: "48.md";
  slug: "48";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"48a.md": {
	id: "48a.md";
  slug: "48a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"48b.md": {
	id: "48b.md";
  slug: "48b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"48c.md": {
	id: "48c.md";
  slug: "48c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"48d.md": {
	id: "48d.md";
  slug: "48d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"49.md": {
	id: "49.md";
  slug: "49";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"49a.md": {
	id: "49a.md";
  slug: "49a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"4a.md": {
	id: "4a.md";
  slug: "4a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"4b.md": {
	id: "4b.md";
  slug: "4b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"4c.md": {
	id: "4c.md";
  slug: "4c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"4d.md": {
	id: "4d.md";
  slug: "4d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"4e.md": {
	id: "4e.md";
  slug: "4e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"5.md": {
	id: "5.md";
  slug: "5";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"50.md": {
	id: "50.md";
  slug: "50";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"51.md": {
	id: "51.md";
  slug: "51";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"51a.md": {
	id: "51a.md";
  slug: "51a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"51b.md": {
	id: "51b.md";
  slug: "51b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"51c.md": {
	id: "51c.md";
  slug: "51c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"51d.md": {
	id: "51d.md";
  slug: "51d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"52.md": {
	id: "52.md";
  slug: "52";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"52a.md": {
	id: "52a.md";
  slug: "52a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"52b.md": {
	id: "52b.md";
  slug: "52b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"52c.md": {
	id: "52c.md";
  slug: "52c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"52d.md": {
	id: "52d.md";
  slug: "52d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"52e.md": {
	id: "52e.md";
  slug: "52e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"53.md": {
	id: "53.md";
  slug: "53";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"53a.md": {
	id: "53a.md";
  slug: "53a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"53a1.md": {
	id: "53a1.md";
  slug: "53a1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"53b.md": {
	id: "53b.md";
  slug: "53b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"53c.md": {
	id: "53c.md";
  slug: "53c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"53d.md": {
	id: "53d.md";
  slug: "53d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"53e.md": {
	id: "53e.md";
  slug: "53e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"54.md": {
	id: "54.md";
  slug: "54";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"54a.md": {
	id: "54a.md";
  slug: "54a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"54b.md": {
	id: "54b.md";
  slug: "54b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"54c.md": {
	id: "54c.md";
  slug: "54c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"54d.md": {
	id: "54d.md";
  slug: "54d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"55.md": {
	id: "55.md";
  slug: "55";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"55a.md": {
	id: "55a.md";
  slug: "55a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"55b.md": {
	id: "55b.md";
  slug: "55b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"55c.md": {
	id: "55c.md";
  slug: "55c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"55d.md": {
	id: "55d.md";
  slug: "55d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56.md": {
	id: "56.md";
  slug: "56";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56a.md": {
	id: "56a.md";
  slug: "56a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56b.md": {
	id: "56b.md";
  slug: "56b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56b1.md": {
	id: "56b1.md";
  slug: "56b1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56c.md": {
	id: "56c.md";
  slug: "56c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56d.md": {
	id: "56d.md";
  slug: "56d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56d1.md": {
	id: "56d1.md";
  slug: "56d1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56d2.md": {
	id: "56d2.md";
  slug: "56d2";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56d3.md": {
	id: "56d3.md";
  slug: "56d3";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56d4.md": {
	id: "56d4.md";
  slug: "56d4";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56d4a.md": {
	id: "56d4a.md";
  slug: "56d4a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56e.md": {
	id: "56e.md";
  slug: "56e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56f.md": {
	id: "56f.md";
  slug: "56f";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56g.md": {
	id: "56g.md";
  slug: "56g";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56g1.md": {
	id: "56g1.md";
  slug: "56g1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56h.md": {
	id: "56h.md";
  slug: "56h";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56i.md": {
	id: "56i.md";
  slug: "56i";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56i1.md": {
	id: "56i1.md";
  slug: "56i1";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56j.md": {
	id: "56j.md";
  slug: "56j";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56k.md": {
	id: "56k.md";
  slug: "56k";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"56l.md": {
	id: "56l.md";
  slug: "56l";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"57.md": {
	id: "57.md";
  slug: "57";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"58.md": {
	id: "58.md";
  slug: "58";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"58a.md": {
	id: "58a.md";
  slug: "58a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"58b.md": {
	id: "58b.md";
  slug: "58b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"58c.md": {
	id: "58c.md";
  slug: "58c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"58d.md": {
	id: "58d.md";
  slug: "58d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"59.md": {
	id: "59.md";
  slug: "59";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"5a.md": {
	id: "5a.md";
  slug: "5a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"5b.md": {
	id: "5b.md";
  slug: "5b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"6.md": {
	id: "6.md";
  slug: "6";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"60.md": {
	id: "60.md";
  slug: "60";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"61.md": {
	id: "61.md";
  slug: "61";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"61a.md": {
	id: "61a.md";
  slug: "61a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"62.md": {
	id: "62.md";
  slug: "62";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"62a.md": {
	id: "62a.md";
  slug: "62a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"63.md": {
	id: "63.md";
  slug: "63";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"64.md": {
	id: "64.md";
  slug: "64";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"65.md": {
	id: "65.md";
  slug: "65";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"66.md": {
	id: "66.md";
  slug: "66";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"66a.md": {
	id: "66a.md";
  slug: "66a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"66b.md": {
	id: "66b.md";
  slug: "66b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"66c.md": {
	id: "66c.md";
  slug: "66c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"66d.md": {
	id: "66d.md";
  slug: "66d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"66e.md": {
	id: "66e.md";
  slug: "66e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"66f.md": {
	id: "66f.md";
  slug: "66f";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"66g.md": {
	id: "66g.md";
  slug: "66g";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"66h.md": {
	id: "66h.md";
  slug: "66h";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"66i.md": {
	id: "66i.md";
  slug: "66i";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"67.md": {
	id: "67.md";
  slug: "67";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"68.md": {
	id: "68.md";
  slug: "68";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"69.md": {
	id: "69.md";
  slug: "69";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"69a.md": {
	id: "69a.md";
  slug: "69a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"7.md": {
	id: "7.md";
  slug: "7";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"70.md": {
	id: "70.md";
  slug: "70";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"71.md": {
	id: "71.md";
  slug: "71";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"71a.md": {
	id: "71a.md";
  slug: "71a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"72.md": {
	id: "72.md";
  slug: "72";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"73.md": {
	id: "73.md";
  slug: "73";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"73a.md": {
	id: "73a.md";
  slug: "73a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"74.md": {
	id: "74.md";
  slug: "74";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"75.md": {
	id: "75.md";
  slug: "75";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"76.md": {
	id: "76.md";
  slug: "76";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"77.md": {
	id: "77.md";
  slug: "77";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"77a.md": {
	id: "77a.md";
  slug: "77a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"77b.md": {
	id: "77b.md";
  slug: "77b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"78.md": {
	id: "78.md";
  slug: "78";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"78a.md": {
	id: "78a.md";
  slug: "78a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"79.md": {
	id: "79.md";
  slug: "79";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"8.md": {
	id: "8.md";
  slug: "8";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"80.md": {
	id: "80.md";
  slug: "80";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"81.md": {
	id: "81.md";
  slug: "81";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"8a.md": {
	id: "8a.md";
  slug: "8a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"8b.md": {
	id: "8b.md";
  slug: "8b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"8c.md": {
	id: "8c.md";
  slug: "8c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"8d.md": {
	id: "8d.md";
  slug: "8d";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"8e.md": {
	id: "8e.md";
  slug: "8e";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"8f.md": {
	id: "8f.md";
  slug: "8f";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"8g.md": {
	id: "8g.md";
  slug: "8g";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"8h.md": {
	id: "8h.md";
  slug: "8h";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"8i.md": {
	id: "8i.md";
  slug: "8i";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"8j.md": {
	id: "8j.md";
  slug: "8j";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"9.md": {
	id: "9.md";
  slug: "9";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"9a.md": {
	id: "9a.md";
  slug: "9a";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"9b.md": {
	id: "9b.md";
  slug: "9b";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
"9c.md": {
	id: "9c.md";
  slug: "9c";
  body: string;
  collection: "notes";
  data: any
} & { render(): Render[".md"] };
};
"podcast": {
"1-tech-interviews.md": {
	id: "1-tech-interviews.md";
  slug: "1-tech-interviews";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"10-building-healthy-on-call-culture.md": {
	id: "10-building-healthy-on-call-culture.md";
  slug: "10-building-healthy-on-call-culture";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"11-learning-and-growing-in-front-end-development.md": {
	id: "11-learning-and-growing-in-front-end-development.md";
  slug: "11-learning-and-growing-in-front-end-development";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"12-the-life-of-a-generalist-software-engineer.md": {
	id: "12-the-life-of-a-generalist-software-engineer.md";
  slug: "12-the-life-of-a-generalist-software-engineer";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"13-devops-and-site-reliability-engineering.md": {
	id: "13-devops-and-site-reliability-engineering.md";
  slug: "13-devops-and-site-reliability-engineering";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"14-protective-leadership-and-leadership-style.md": {
	id: "14-protective-leadership-and-leadership-style.md";
  slug: "14-protective-leadership-and-leadership-style";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"15-prioritization-for-senior-and-staff-software-engineers.md": {
	id: "15-prioritization-for-senior-and-staff-software-engineers.md";
  slug: "15-prioritization-for-senior-and-staff-software-engineers";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"16-being-an-indie-hacker.md": {
	id: "16-being-an-indie-hacker.md";
  slug: "16-being-an-indie-hacker";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"17-banish-your-inner-critic.md": {
	id: "17-banish-your-inner-critic.md";
  slug: "17-banish-your-inner-critic";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"18-managing-organizational-changes.md": {
	id: "18-managing-organizational-changes.md";
  slug: "18-managing-organizational-changes";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"19-software-architect-role-and-archicture.md": {
	id: "19-software-architect-role-and-archicture.md";
  slug: "19-software-architect-role-and-archicture";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"2-how-engineering-teams-work-with-product-teams.md": {
	id: "2-how-engineering-teams-work-with-product-teams.md";
  slug: "2-how-engineering-teams-work-with-product-teams";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"20-software-architecture-design-systems.md": {
	id: "20-software-architecture-design-systems.md";
  slug: "20-software-architecture-design-systems";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"21-intent-based-leadership-with-david-marquet.md": {
	id: "21-intent-based-leadership-with-david-marquet.md";
  slug: "21-intent-based-leadership-with-david-marquet";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"22-effective-11-meetings-for-software.md": {
	id: "22-effective-11-meetings-for-software.md";
  slug: "22-effective-11-meetings-for-software";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"23-accessibility-and-inclusive-design.md": {
	id: "23-accessibility-and-inclusive-design.md";
  slug: "23-accessibility-and-inclusive-design";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"24-understanding-distributed-systems.md": {
	id: "24-understanding-distributed-systems.md";
  slug: "24-understanding-distributed-systems";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"25-live-pair-programming-open-source.md": {
	id: "25-live-pair-programming-open-source.md";
  slug: "25-live-pair-programming-open-source";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"26-machine-learning-and-data-science.md": {
	id: "26-machine-learning-and-data-science.md";
  slug: "26-machine-learning-and-data-science";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"27-problem-solving-skills-and-a-strategy.md": {
	id: "27-problem-solving-skills-and-a-strategy.md";
  slug: "27-problem-solving-skills-and-a-strategy";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"28-how-to-present-solutions-as-software.md": {
	id: "28-how-to-present-solutions-as-software.md";
  slug: "28-how-to-present-solutions-as-software";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"3-diversity-gender-discrimination.md": {
	id: "3-diversity-gender-discrimination.md";
  slug: "3-diversity-gender-discrimination";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"4-how-to-be-a-working-student.md": {
	id: "4-how-to-be-a-working-student.md";
  slug: "4-how-to-be-a-working-student";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"5-startup-marketing.md": {
	id: "5-startup-marketing.md";
  slug: "5-startup-marketing";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"6-software-development-in-startups.md": {
	id: "6-software-development-in-startups.md";
  slug: "6-software-development-in-startups";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"7-mobile-apps-at-scale.md": {
	id: "7-mobile-apps-at-scale.md";
  slug: "7-mobile-apps-at-scale";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"8-cross-cultural-communication.md": {
	id: "8-cross-cultural-communication.md";
  slug: "8-cross-cultural-communication";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"9-engineering-career-path.md": {
	id: "9-engineering-career-path.md";
  slug: "9-engineering-career-path";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
"trailer-season-3.md": {
	id: "trailer-season-3.md";
  slug: "trailer-season-3";
  body: string;
  collection: "podcast";
  data: any
} & { render(): Render[".md"] };
};
"posts": {
"14-lessons-i-learned-in-10-years.md": {
	id: "14-lessons-i-learned-in-10-years.md";
  slug: "14-lessons-i-learned-in-10-years";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"a-life-without-problems-the-happiness.md": {
	id: "a-life-without-problems-the-happiness.md";
  slug: "a-life-without-problems-the-happiness";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"adrs-rfcs-differences-when-which.md": {
	id: "adrs-rfcs-differences-when-which.md";
  slug: "adrs-rfcs-differences-when-which";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"being-morally-good-in-the-war-of-life.md": {
	id: "being-morally-good-in-the-war-of-life.md";
  slug: "being-morally-good-in-the-war-of-life";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"bias-towards-action.md": {
	id: "bias-towards-action.md";
  slug: "bias-towards-action";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"can-you-fire-your-colleague.md": {
	id: "can-you-fire-your-colleague.md";
  slug: "can-you-fire-your-colleague";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"chestertons-fence.md": {
	id: "chestertons-fence.md";
  slug: "chestertons-fence";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"communicating-decisions-in-the-organizations.md": {
	id: "communicating-decisions-in-the-organizations.md";
  slug: "communicating-decisions-in-the-organizations";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"concluding-my-struggle-with-note-taking-systems-and-apps-finally.md": {
	id: "concluding-my-struggle-with-note-taking-systems-and-apps-finally.md";
  slug: "concluding-my-struggle-with-note-taking-systems-and-apps-finally";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"concurrency-in-ios.md": {
	id: "concurrency-in-ios.md";
  slug: "concurrency-in-ios";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"csikszentmihalyi-newport-and-pressfield-on-creativity-time-and-deep-walks-in-remote-work.md": {
	id: "csikszentmihalyi-newport-and-pressfield-on-creativity-time-and-deep-walks-in-remote-work.md";
  slug: "csikszentmihalyi-newport-and-pressfield-on-creativity-time-and-deep-walks-in-remote-work";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"deciding-on-what-you-should-focus-on-next.md": {
	id: "deciding-on-what-you-should-focus-on-next.md";
  slug: "deciding-on-what-you-should-focus-on-next";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"decisions-that-remove-other-decisions.md": {
	id: "decisions-that-remove-other-decisions.md";
  slug: "decisions-that-remove-other-decisions";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"diversity-in-tech-is-a-first-world-problem.md": {
	id: "diversity-in-tech-is-a-first-world-problem.md";
  slug: "diversity-in-tech-is-a-first-world-problem";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"do-not-change-jobs.md": {
	id: "do-not-change-jobs.md";
  slug: "do-not-change-jobs";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"dont-assume-consensus-in-the-absence-of-objection.md": {
	id: "dont-assume-consensus-in-the-absence-of-objection.md";
  slug: "dont-assume-consensus-in-the-absence-of-objection";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"dont-take-responsibility-more-and-stop-blaming.md": {
	id: "dont-take-responsibility-more-and-stop-blaming.md";
  slug: "dont-take-responsibility-more-and-stop-blaming";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"effective-1-1-meetings-one-on-one-meeting-template.md": {
	id: "effective-1-1-meetings-one-on-one-meeting-template.md";
  slug: "effective-1-1-meetings-one-on-one-meeting-template";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"effective-1-on-1-meetings-own-your-one-on-one-meeting.md": {
	id: "effective-1-on-1-meetings-own-your-one-on-one-meeting.md";
  slug: "effective-1-on-1-meetings-own-your-one-on-one-meeting";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"embracing-the-joy-of-missing-out.md": {
	id: "embracing-the-joy-of-missing-out.md";
  slug: "embracing-the-joy-of-missing-out";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"explicit-disagreement-is-better-than-implicit-misunderstanding.md": {
	id: "explicit-disagreement-is-better-than-implicit-misunderstanding.md";
  slug: "explicit-disagreement-is-better-than-implicit-misunderstanding";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"faucets-and-bad-ideas.md": {
	id: "faucets-and-bad-ideas.md";
  slug: "faucets-and-bad-ideas";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"firebase-predictions.md": {
	id: "firebase-predictions.md";
  slug: "firebase-predictions";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"generics-in-swift.md": {
	id: "generics-in-swift.md";
  slug: "generics-in-swift";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"goals-and-existence.md": {
	id: "goals-and-existence.md";
  slug: "goals-and-existence";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"growth-with-systematic-bliss.md": {
	id: "growth-with-systematic-bliss.md";
  slug: "growth-with-systematic-bliss";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"have-the-first-win-to-build-team-spirit.md": {
	id: "have-the-first-win-to-build-team-spirit.md";
  slug: "have-the-first-win-to-build-team-spirit";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"hidden-monoliths-affect-the-software-design.md": {
	id: "hidden-monoliths-affect-the-software-design.md";
  slug: "hidden-monoliths-affect-the-software-design";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"how-and-why-rfcs-fail.md": {
	id: "how-and-why-rfcs-fail.md";
  slug: "how-and-why-rfcs-fail";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"how-to-approach-software-architecture-design.md": {
	id: "how-to-approach-software-architecture-design.md";
  slug: "how-to-approach-software-architecture-design";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"how-to-build-trust-in-a-team-as-a-new-manager.md": {
	id: "how-to-build-trust-in-a-team-as-a-new-manager.md";
  slug: "how-to-build-trust-in-a-team-as-a-new-manager";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"how-to-get-to-the-end-of-a-pile-of-unread-books.md": {
	id: "how-to-get-to-the-end-of-a-pile-of-unread-books.md";
  slug: "how-to-get-to-the-end-of-a-pile-of-unread-books";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"how-to-give-feedback-on-design-as-an-engineer.md": {
	id: "how-to-give-feedback-on-design-as-an-engineer.md";
  slug: "how-to-give-feedback-on-design-as-an-engineer";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"how-to-handle-and-overcome-objections-to-your-proposal-at-work.md": {
	id: "how-to-handle-and-overcome-objections-to-your-proposal-at-work.md";
  slug: "how-to-handle-and-overcome-objections-to-your-proposal-at-work";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"how-to-organize-your-engineering-teams-documents.md": {
	id: "how-to-organize-your-engineering-teams-documents.md";
  slug: "how-to-organize-your-engineering-teams-documents";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"how-to-reset-first-commit-in-git.md": {
	id: "how-to-reset-first-commit-in-git.md";
  slug: "how-to-reset-first-commit-in-git";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"how-to-solve-and-prevent-conflicts.md": {
	id: "how-to-solve-and-prevent-conflicts.md";
  slug: "how-to-solve-and-prevent-conflicts";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"how-to-stop-endless-discussions.md": {
	id: "how-to-stop-endless-discussions.md";
  slug: "how-to-stop-endless-discussions";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"importance-of-the-feedback.md": {
	id: "importance-of-the-feedback.md";
  slug: "importance-of-the-feedback";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"ios-application-lifecycle.md": {
	id: "ios-application-lifecycle.md";
  slug: "ios-application-lifecycle";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"ios-developer-productivity-kit.md": {
	id: "ios-developer-productivity-kit.md";
  slug: "ios-developer-productivity-kit";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"is-software-engineering-an-art.md": {
	id: "is-software-engineering-an-art.md";
  slug: "is-software-engineering-an-art";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"joining-sumup.md": {
	id: "joining-sumup.md";
  slug: "joining-sumup";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"krishnamurti-and-seneca-on-freeing-the-mind.md": {
	id: "krishnamurti-and-seneca-on-freeing-the-mind.md";
  slug: "krishnamurti-and-seneca-on-freeing-the-mind";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"learn-the-rules-of-promotions.md": {
	id: "learn-the-rules-of-promotions.md";
  slug: "learn-the-rules-of-promotions";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"learning-cone-and-blame-spiral-the-case-of-blame-absorbers.md": {
	id: "learning-cone-and-blame-spiral-the-case-of-blame-absorbers.md";
  slug: "learning-cone-and-blame-spiral-the-case-of-blame-absorbers";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"learnings-on-dealing-with-ambiguity.md": {
	id: "learnings-on-dealing-with-ambiguity.md";
  slug: "learnings-on-dealing-with-ambiguity";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"love-the-constraints.md": {
	id: "love-the-constraints.md";
  slug: "love-the-constraints";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"machine-learning-introduction.md": {
	id: "machine-learning-introduction.md";
  slug: "machine-learning-introduction";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"managing-multiple-aws-environments-with-terraform.md": {
	id: "managing-multiple-aws-environments-with-terraform.md";
  slug: "managing-multiple-aws-environments-with-terraform";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"managing-partially-distributed-teams.md": {
	id: "managing-partially-distributed-teams.md";
  slug: "managing-partially-distributed-teams";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"maximizing-personal-growth-by-understanding.md": {
	id: "maximizing-personal-growth-by-understanding.md";
  slug: "maximizing-personal-growth-by-understanding";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"migrating-from-vapor-1-to-vapor-2.md": {
	id: "migrating-from-vapor-1-to-vapor-2.md";
  slug: "migrating-from-vapor-1-to-vapor-2";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"moving-to-substack.md": {
	id: "moving-to-substack.md";
  slug: "moving-to-substack";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"my-experience-living-without-social-media.md": {
	id: "my-experience-living-without-social-media.md";
  slug: "my-experience-living-without-social-media";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"navigating-the-writing-challenge-every-day.md": {
	id: "navigating-the-writing-challenge-every-day.md";
  slug: "navigating-the-writing-challenge-every-day";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"new-horizons-with-server-side-swift.md": {
	id: "new-horizons-with-server-side-swift.md";
  slug: "new-horizons-with-server-side-swift";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"no-more-debate-with-latest-or-daily-news.md": {
	id: "no-more-debate-with-latest-or-daily-news.md";
  slug: "no-more-debate-with-latest-or-daily-news";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"no-you-dont-need-to-learn-another-programming-language-every-three-months.md": {
	id: "no-you-dont-need-to-learn-another-programming-language-every-three-months.md";
  slug: "no-you-dont-need-to-learn-another-programming-language-every-three-months";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"on-drugs-and-great-people.md": {
	id: "on-drugs-and-great-people.md";
  slug: "on-drugs-and-great-people";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"on-good-software-engineers.md": {
	id: "on-good-software-engineers.md";
  slug: "on-good-software-engineers";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"on-listening-to-audiobooks.md": {
	id: "on-listening-to-audiobooks.md";
  slug: "on-listening-to-audiobooks";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"on-the-purpose-of-life.md": {
	id: "on-the-purpose-of-life.md";
  slug: "on-the-purpose-of-life";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"passing-down-the-experience.md": {
	id: "passing-down-the-experience.md";
  slug: "passing-down-the-experience";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"prioritization-skills-for-senior-and-staff-software-engineers.md": {
	id: "prioritization-skills-for-senior-and-staff-software-engineers.md";
  slug: "prioritization-skills-for-senior-and-staff-software-engineers";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"productivity-scam-and-perception-of-time.md": {
	id: "productivity-scam-and-perception-of-time.md";
  slug: "productivity-scam-and-perception-of-time";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"put-remote-work-in-your-inclusion-efforts-not-only-in-diversity-in-the-workplace.md": {
	id: "put-remote-work-in-your-inclusion-efforts-not-only-in-diversity-in-the-workplace.md";
  slug: "put-remote-work-in-your-inclusion-efforts-not-only-in-diversity-in-the-workplace";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"questioning-vs-asking.md": {
	id: "questioning-vs-asking.md";
  slug: "questioning-vs-asking";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"relationship-vs-task-conflicts.md": {
	id: "relationship-vs-task-conflicts.md";
  slug: "relationship-vs-task-conflicts";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"retiring-from-the-idea-of-retirement.md": {
	id: "retiring-from-the-idea-of-retirement.md";
  slug: "retiring-from-the-idea-of-retirement";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"seek-goals-that-will-change-how-you-live.md": {
	id: "seek-goals-that-will-change-how-you-live.md";
  slug: "seek-goals-that-will-change-how-you-live";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"separation-of-concerns-at-work.md": {
	id: "separation-of-concerns-at-work.md";
  slug: "separation-of-concerns-at-work";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"shift-left-on-security.md": {
	id: "shift-left-on-security.md";
  slug: "shift-left-on-security";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"simple-linear-regression.md": {
	id: "simple-linear-regression.md";
  slug: "simple-linear-regression";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"sometimes-saying-nothing-tells-everything.md": {
	id: "sometimes-saying-nothing-tells-everything.md";
  slug: "sometimes-saying-nothing-tells-everything";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"speaking-writing-and-high-quality-ideas.md": {
	id: "speaking-writing-and-high-quality-ideas.md";
  slug: "speaking-writing-and-high-quality-ideas";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"strong-ownership-culture-in-a-team.md": {
	id: "strong-ownership-culture-in-a-team.md";
  slug: "strong-ownership-culture-in-a-team";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"studying-and-learning-leadership.md": {
	id: "studying-and-learning-leadership.md";
  slug: "studying-and-learning-leadership";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"supplying-books-to-my-father.md": {
	id: "supplying-books-to-my-father.md";
  slug: "supplying-books-to-my-father";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"systematic-approach-to-give-feedback-to-blame-absorbers.md": {
	id: "systematic-approach-to-give-feedback-to-blame-absorbers.md";
  slug: "systematic-approach-to-give-feedback-to-blame-absorbers";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"testing-in-ios.md": {
	id: "testing-in-ios.md";
  slug: "testing-in-ios";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"the-blue-green-deployment-strategy.md": {
	id: "the-blue-green-deployment-strategy.md";
  slug: "the-blue-green-deployment-strategy";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"the-decision-making-pendulum.md": {
	id: "the-decision-making-pendulum.md";
  slug: "the-decision-making-pendulum";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"the-good-the-bad-and-the-ugly-of-career-ladders-and-frameworks.md": {
	id: "the-good-the-bad-and-the-ugly-of-career-ladders-and-frameworks.md";
  slug: "the-good-the-bad-and-the-ugly-of-career-ladders-and-frameworks";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"the-must-have-skill-for-every-leader-listening-with-empathy.md": {
	id: "the-must-have-skill-for-every-leader-listening-with-empathy.md";
  slug: "the-must-have-skill-for-every-leader-listening-with-empathy";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"the-power-of-ritualization-rituals-vs-routines.md": {
	id: "the-power-of-ritualization-rituals-vs-routines.md";
  slug: "the-power-of-ritualization-rituals-vs-routines";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"the-real-difficulty-of-engineering-leadership.md": {
	id: "the-real-difficulty-of-engineering-leadership.md";
  slug: "the-real-difficulty-of-engineering-leadership";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"there-are-no-analytics-on-this-blog.md": {
	id: "there-are-no-analytics-on-this-blog.md";
  slug: "there-are-no-analytics-on-this-blog";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"these-annoying-tenure-engineers.md": {
	id: "these-annoying-tenure-engineers.md";
  slug: "these-annoying-tenure-engineers";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"three-types-of-feedback.md": {
	id: "three-types-of-feedback.md";
  slug: "three-types-of-feedback";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"timely-estimations-are-underrated.md": {
	id: "timely-estimations-are-underrated.md";
  slug: "timely-estimations-are-underrated";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"top-3-tips-for-planners.md": {
	id: "top-3-tips-for-planners.md";
  slug: "top-3-tips-for-planners";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"transparency-over-context.md": {
	id: "transparency-over-context.md";
  slug: "transparency-over-context";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"unit-tests-in-server-side-swift.md": {
	id: "unit-tests-in-server-side-swift.md";
  slug: "unit-tests-in-server-side-swift";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"using-firebase-cloud-messaging-for-remote-notifications-in-ios.md": {
	id: "using-firebase-cloud-messaging-for-remote-notifications-in-ios.md";
  slug: "using-firebase-cloud-messaging-for-remote-notifications-in-ios";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"using-swiftlint-and-danger-for-swift-best-practices.md": {
	id: "using-swiftlint-and-danger-for-swift-best-practices.md";
  slug: "using-swiftlint-and-danger-for-swift-best-practices";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"vapor-2-what-to-do-after-hello-world-example.md": {
	id: "vapor-2-what-to-do-after-hello-world-example.md";
  slug: "vapor-2-what-to-do-after-hello-world-example";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"view-lifecycle-in-ios.md": {
	id: "view-lifecycle-in-ios.md";
  slug: "view-lifecycle-in-ios";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"weekday-weekend-concepts-are-useless.md": {
	id: "weekday-weekend-concepts-are-useless.md";
  slug: "weekday-weekend-concepts-are-useless";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"what-hades-the-game-had-taught-me.md": {
	id: "what-hades-the-game-had-taught-me.md";
  slug: "what-hades-the-game-had-taught-me";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"what-i-learned-about-getting-better-at-giving-talks-and-presentations.md": {
	id: "what-i-learned-about-getting-better-at-giving-talks-and-presentations.md";
  slug: "what-i-learned-about-getting-better-at-giving-talks-and-presentations";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"why-are-hybrid-meetings-terrible-remote-vs-on-site-meetings.md": {
	id: "why-are-hybrid-meetings-terrible-remote-vs-on-site-meetings.md";
  slug: "why-are-hybrid-meetings-terrible-remote-vs-on-site-meetings";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"why-cant-this-be-done-sooner.md": {
	id: "why-cant-this-be-done-sooner.md";
  slug: "why-cant-this-be-done-sooner";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"why-did-i-stop-live-streaming.md": {
	id: "why-did-i-stop-live-streaming.md";
  slug: "why-did-i-stop-live-streaming";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"why-dont-they-leave-the-software-to-engineers.md": {
	id: "why-dont-they-leave-the-software-to-engineers.md";
  slug: "why-dont-they-leave-the-software-to-engineers";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"why-is-it-so-hard-to-be-kind.md": {
	id: "why-is-it-so-hard-to-be-kind.md";
  slug: "why-is-it-so-hard-to-be-kind";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"why-is-writing-important.md": {
	id: "why-is-writing-important.md";
  slug: "why-is-writing-important";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"why-should-leaders-have-good-storytelling-skills-in-reorganizations-or-restructurings.md": {
	id: "why-should-leaders-have-good-storytelling-skills-in-reorganizations-or-restructurings.md";
  slug: "why-should-leaders-have-good-storytelling-skills-in-reorganizations-or-restructurings";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"yet-i-cried-one-more-time.md": {
	id: "yet-i-cried-one-more-time.md";
  slug: "yet-i-cried-one-more-time";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
