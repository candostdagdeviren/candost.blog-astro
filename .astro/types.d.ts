declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
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
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
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
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"books": {
"consistency-and-consensus-in-distributed-systems.md": {
	id: "consistency-and-consensus-in-distributed-systems.md";
  slug: "consistency-and-consensus-in-distributed-systems";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"data-models-and-query-languages.md": {
	id: "data-models-and-query-languages.md";
  slug: "data-models-and-query-languages";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"data-replication-in-distributed-systems.md": {
	id: "data-replication-in-distributed-systems.md";
  slug: "data-replication-in-distributed-systems";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"data-storage-and-retrieval.md": {
	id: "data-storage-and-retrieval.md";
  slug: "data-storage-and-retrieval";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"database-partitioning.md": {
	id: "database-partitioning.md";
  slug: "database-partitioning";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"encoding-decoding-schemas-and-data-evolution.md": {
	id: "encoding-decoding-schemas-and-data-evolution.md";
  slug: "encoding-decoding-schemas-and-data-evolution";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"essentialism-book-review-and-notes.md": {
	id: "essentialism-book-review-and-notes.md";
  slug: "essentialism-book-review-and-notes";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"high-productivity-and-clear-communication-in-different-cultures.md": {
	id: "high-productivity-and-clear-communication-in-different-cultures.md";
  slug: "high-productivity-and-clear-communication-in-different-cultures";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"how-to-model-microservices.md": {
	id: "how-to-model-microservices.md";
  slug: "how-to-model-microservices";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"integrating-microservices-part-1.md": {
	id: "integrating-microservices-part-1.md";
  slug: "integrating-microservices-part-1";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"integrating-microservices-part-2.md": {
	id: "integrating-microservices-part-2.md";
  slug: "integrating-microservices-part-2";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"make-time-book-summary-review-and-notes.md": {
	id: "make-time-book-summary-review-and-notes.md";
  slug: "make-time-book-summary-review-and-notes";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"measure-what-matters-by-john-doerr-summary-review-and-book-notes.md": {
	id: "measure-what-matters-by-john-doerr-summary-review-and-book-notes.md";
  slug: "measure-what-matters-by-john-doerr-summary-review-and-book-notes";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"microservices-and-their-benefits.md": {
	id: "microservices-and-their-benefits.md";
  slug: "microservices-and-their-benefits";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"reliability-maintainability-and-scalability-in-applications.md": {
	id: "reliability-maintainability-and-scalability-in-applications.md";
  slug: "reliability-maintainability-and-scalability-in-applications";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"splitting-the-monolith.md": {
	id: "splitting-the-monolith.md";
  slug: "splitting-the-monolith";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"team-topologies-book-review-summary-and-notes.md": {
	id: "team-topologies-book-review-summary-and-notes.md";
  slug: "team-topologies-book-review-summary-and-notes";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"the-evolutionary-architect.md": {
	id: "the-evolutionary-architect.md";
  slug: "the-evolutionary-architect";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"the-subtle-art-of-not-giving-a-fuck-book-note-you-are-not-special.md": {
	id: "the-subtle-art-of-not-giving-a-fuck-book-note-you-are-not-special.md";
  slug: "the-subtle-art-of-not-giving-a-fuck-book-note-you-are-not-special";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"the-subtle-art-of-not-giving-a-fuck-by-mark-manson-book-summary-review-and-notes.md": {
	id: "the-subtle-art-of-not-giving-a-fuck-by-mark-manson-book-summary-review-and-notes.md";
  slug: "the-subtle-art-of-not-giving-a-fuck-by-mark-manson-book-summary-review-and-notes";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"the-trouble-with-distributed-systems.md": {
	id: "the-trouble-with-distributed-systems.md";
  slug: "the-trouble-with-distributed-systems";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"think-again-by-adam-grant-book-summary-review-and-notes.md": {
	id: "think-again-by-adam-grant-book-summary-review-and-notes.md";
  slug: "think-again-by-adam-grant-book-summary-review-and-notes";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"turn-the-ship-around-summary-book-chapter-notes.md": {
	id: "turn-the-ship-around-summary-book-chapter-notes.md";
  slug: "turn-the-ship-around-summary-book-chapter-notes";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"understanding-how-database-transactions-work.md": {
	id: "understanding-how-database-transactions-work.md";
  slug: "understanding-how-database-transactions-work";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"worth-doing-wrong-book-summary-review-and-notes.md": {
	id: "worth-doing-wrong-book-summary-review-and-notes.md";
  slug: "worth-doing-wrong-book-summary-review-and-notes";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
};
"journal": {
"crawlers-and-robots-txt.md": {
	id: "crawlers-and-robots-txt.md";
  slug: "crawlers-and-robots-txt";
  body: string;
  collection: "journal";
  data: InferEntrySchema<"journal">
} & { render(): Render[".md"] };
"public-zettelkasten.md": {
	id: "public-zettelkasten.md";
  slug: "public-zettelkasten";
  body: string;
  collection: "journal";
  data: InferEntrySchema<"journal">
} & { render(): Render[".md"] };
"retrospective-look-change-strategy.md": {
	id: "retrospective-look-change-strategy.md";
  slug: "retrospective-look-change-strategy";
  body: string;
  collection: "journal";
  data: InferEntrySchema<"journal">
} & { render(): Render[".md"] };
"rituals-not-traditions.md": {
	id: "rituals-not-traditions.md";
  slug: "rituals-not-traditions";
  body: string;
  collection: "journal";
  data: InferEntrySchema<"journal">
} & { render(): Render[".md"] };
"the-world-in-2050.md": {
	id: "the-world-in-2050.md";
  slug: "the-world-in-2050";
  body: string;
  collection: "journal";
  data: InferEntrySchema<"journal">
} & { render(): Render[".md"] };
};
"newsletter": {
"mediations/mediations-1.md": {
	id: "mediations/mediations-1.md";
  slug: "mediations/mediations-1";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mediations/mediations-2.md": {
	id: "mediations/mediations-2.md";
  slug: "mediations/mediations-2";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mediations/mediations-3.md": {
	id: "mediations/mediations-3.md";
  slug: "mediations/mediations-3";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mediations/mediations-4.md": {
	id: "mediations/mediations-4.md";
  slug: "mediations/mediations-4";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-1.md": {
	id: "mektup/mektup-1.md";
  slug: "mektup/mektup-1";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-10.md": {
	id: "mektup/mektup-10.md";
  slug: "mektup/mektup-10";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-11.md": {
	id: "mektup/mektup-11.md";
  slug: "mektup/mektup-11";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-12.md": {
	id: "mektup/mektup-12.md";
  slug: "mektup/mektup-12";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-13.md": {
	id: "mektup/mektup-13.md";
  slug: "mektup/mektup-13";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-14.md": {
	id: "mektup/mektup-14.md";
  slug: "mektup/mektup-14";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-15.md": {
	id: "mektup/mektup-15.md";
  slug: "mektup/mektup-15";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-16.md": {
	id: "mektup/mektup-16.md";
  slug: "mektup/mektup-16";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-17.md": {
	id: "mektup/mektup-17.md";
  slug: "mektup/mektup-17";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-18.md": {
	id: "mektup/mektup-18.md";
  slug: "mektup/mektup-18";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-19.md": {
	id: "mektup/mektup-19.md";
  slug: "mektup/mektup-19";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-2.md": {
	id: "mektup/mektup-2.md";
  slug: "mektup/mektup-2";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-20.md": {
	id: "mektup/mektup-20.md";
  slug: "mektup/mektup-20";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-21.md": {
	id: "mektup/mektup-21.md";
  slug: "mektup/mektup-21";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-22.md": {
	id: "mektup/mektup-22.md";
  slug: "mektup/mektup-22";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-23.md": {
	id: "mektup/mektup-23.md";
  slug: "mektup/mektup-23";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-24.md": {
	id: "mektup/mektup-24.md";
  slug: "mektup/mektup-24";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-25.md": {
	id: "mektup/mektup-25.md";
  slug: "mektup/mektup-25";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-26.md": {
	id: "mektup/mektup-26.md";
  slug: "mektup/mektup-26";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-27.md": {
	id: "mektup/mektup-27.md";
  slug: "mektup/mektup-27";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-28.md": {
	id: "mektup/mektup-28.md";
  slug: "mektup/mektup-28";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-29.md": {
	id: "mektup/mektup-29.md";
  slug: "mektup/mektup-29";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-3.md": {
	id: "mektup/mektup-3.md";
  slug: "mektup/mektup-3";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-30.md": {
	id: "mektup/mektup-30.md";
  slug: "mektup/mektup-30";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-31.md": {
	id: "mektup/mektup-31.md";
  slug: "mektup/mektup-31";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-32.md": {
	id: "mektup/mektup-32.md";
  slug: "mektup/mektup-32";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-33.md": {
	id: "mektup/mektup-33.md";
  slug: "mektup/mektup-33";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-34.md": {
	id: "mektup/mektup-34.md";
  slug: "mektup/mektup-34";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-35.md": {
	id: "mektup/mektup-35.md";
  slug: "mektup/mektup-35";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-36.md": {
	id: "mektup/mektup-36.md";
  slug: "mektup/mektup-36";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-37.md": {
	id: "mektup/mektup-37.md";
  slug: "mektup/mektup-37";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-38.md": {
	id: "mektup/mektup-38.md";
  slug: "mektup/mektup-38";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-39.md": {
	id: "mektup/mektup-39.md";
  slug: "mektup/mektup-39";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-4.md": {
	id: "mektup/mektup-4.md";
  slug: "mektup/mektup-4";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-40.md": {
	id: "mektup/mektup-40.md";
  slug: "mektup/mektup-40";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-41.md": {
	id: "mektup/mektup-41.md";
  slug: "mektup/mektup-41";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-42.md": {
	id: "mektup/mektup-42.md";
  slug: "mektup/mektup-42";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-43.md": {
	id: "mektup/mektup-43.md";
  slug: "mektup/mektup-43";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-44.md": {
	id: "mektup/mektup-44.md";
  slug: "mektup/mektup-44";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-45.md": {
	id: "mektup/mektup-45.md";
  slug: "mektup/mektup-45";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-46.md": {
	id: "mektup/mektup-46.md";
  slug: "mektup/mektup-46";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-47.md": {
	id: "mektup/mektup-47.md";
  slug: "mektup/mektup-47";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-48.md": {
	id: "mektup/mektup-48.md";
  slug: "mektup/mektup-48";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-49.md": {
	id: "mektup/mektup-49.md";
  slug: "mektup/mektup-49";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-5.md": {
	id: "mektup/mektup-5.md";
  slug: "mektup/mektup-5";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-50.md": {
	id: "mektup/mektup-50.md";
  slug: "mektup/mektup-50";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-51.md": {
	id: "mektup/mektup-51.md";
  slug: "mektup/mektup-51";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-52.md": {
	id: "mektup/mektup-52.md";
  slug: "mektup/mektup-52";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-53.md": {
	id: "mektup/mektup-53.md";
  slug: "mektup/mektup-53";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-6.md": {
	id: "mektup/mektup-6.md";
  slug: "mektup/mektup-6";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-7.md": {
	id: "mektup/mektup-7.md";
  slug: "mektup/mektup-7";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-8.md": {
	id: "mektup/mektup-8.md";
  slug: "mektup/mektup-8";
  body: string;
  collection: "newsletter";
  data: any
} & { render(): Render[".md"] };
"mektup/mektup-9.md": {
	id: "mektup/mektup-9.md";
  slug: "mektup/mektup-9";
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
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"10.md": {
	id: "10.md";
  slug: "10";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"10a.md": {
	id: "10a.md";
  slug: "10a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"10b.md": {
	id: "10b.md";
  slug: "10b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"11.md": {
	id: "11.md";
  slug: "11";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"12.md": {
	id: "12.md";
  slug: "12";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"12a.md": {
	id: "12a.md";
  slug: "12a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"13.md": {
	id: "13.md";
  slug: "13";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"14.md": {
	id: "14.md";
  slug: "14";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"15.md": {
	id: "15.md";
  slug: "15";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"16.md": {
	id: "16.md";
  slug: "16";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"16a.md": {
	id: "16a.md";
  slug: "16a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"16b.md": {
	id: "16b.md";
  slug: "16b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"16c.md": {
	id: "16c.md";
  slug: "16c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"17.md": {
	id: "17.md";
  slug: "17";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"17a.md": {
	id: "17a.md";
  slug: "17a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"17b.md": {
	id: "17b.md";
  slug: "17b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"17c.md": {
	id: "17c.md";
  slug: "17c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"17d.md": {
	id: "17d.md";
  slug: "17d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"17e.md": {
	id: "17e.md";
  slug: "17e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"17f.md": {
	id: "17f.md";
  slug: "17f";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"17g.md": {
	id: "17g.md";
  slug: "17g";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"17h.md": {
	id: "17h.md";
  slug: "17h";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"17i.md": {
	id: "17i.md";
  slug: "17i";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"18.md": {
	id: "18.md";
  slug: "18";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"19.md": {
	id: "19.md";
  slug: "19";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"19a.md": {
	id: "19a.md";
  slug: "19a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"19a1.md": {
	id: "19a1.md";
  slug: "19a1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"19a2.md": {
	id: "19a2.md";
  slug: "19a2";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"19b.md": {
	id: "19b.md";
  slug: "19b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"19c.md": {
	id: "19c.md";
  slug: "19c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"19d.md": {
	id: "19d.md";
  slug: "19d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"19e.md": {
	id: "19e.md";
  slug: "19e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"19f.md": {
	id: "19f.md";
  slug: "19f";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"1a.md": {
	id: "1a.md";
  slug: "1a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"1b.md": {
	id: "1b.md";
  slug: "1b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"1c.md": {
	id: "1c.md";
  slug: "1c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"1d.md": {
	id: "1d.md";
  slug: "1d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"1e.md": {
	id: "1e.md";
  slug: "1e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"1f.md": {
	id: "1f.md";
  slug: "1f";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"1g.md": {
	id: "1g.md";
  slug: "1g";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"1h.md": {
	id: "1h.md";
  slug: "1h";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"1i.md": {
	id: "1i.md";
  slug: "1i";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"1j.md": {
	id: "1j.md";
  slug: "1j";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"2.md": {
	id: "2.md";
  slug: "2";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"20.md": {
	id: "20.md";
  slug: "20";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"20a.md": {
	id: "20a.md";
  slug: "20a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"20b.md": {
	id: "20b.md";
  slug: "20b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"20c.md": {
	id: "20c.md";
  slug: "20c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"21.md": {
	id: "21.md";
  slug: "21";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"21a.md": {
	id: "21a.md";
  slug: "21a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"21b.md": {
	id: "21b.md";
  slug: "21b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"22.md": {
	id: "22.md";
  slug: "22";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"22a.md": {
	id: "22a.md";
  slug: "22a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"23.md": {
	id: "23.md";
  slug: "23";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"23a.md": {
	id: "23a.md";
  slug: "23a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"23b.md": {
	id: "23b.md";
  slug: "23b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"23b1.md": {
	id: "23b1.md";
  slug: "23b1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"23c.md": {
	id: "23c.md";
  slug: "23c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"23c1.md": {
	id: "23c1.md";
  slug: "23c1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"23d.md": {
	id: "23d.md";
  slug: "23d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"23e.md": {
	id: "23e.md";
  slug: "23e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"23f.md": {
	id: "23f.md";
  slug: "23f";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"23g.md": {
	id: "23g.md";
  slug: "23g";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"24.md": {
	id: "24.md";
  slug: "24";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"24a.md": {
	id: "24a.md";
  slug: "24a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"24b.md": {
	id: "24b.md";
  slug: "24b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"24b1.md": {
	id: "24b1.md";
  slug: "24b1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"24c.md": {
	id: "24c.md";
  slug: "24c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"24d.md": {
	id: "24d.md";
  slug: "24d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"24e.md": {
	id: "24e.md";
  slug: "24e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"25.md": {
	id: "25.md";
  slug: "25";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"25a.md": {
	id: "25a.md";
  slug: "25a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"25b.md": {
	id: "25b.md";
  slug: "25b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"25c.md": {
	id: "25c.md";
  slug: "25c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"25d.md": {
	id: "25d.md";
  slug: "25d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"26.md": {
	id: "26.md";
  slug: "26";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"26a.md": {
	id: "26a.md";
  slug: "26a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"26b.md": {
	id: "26b.md";
  slug: "26b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"26c.md": {
	id: "26c.md";
  slug: "26c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"26d.md": {
	id: "26d.md";
  slug: "26d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"27.md": {
	id: "27.md";
  slug: "27";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"27a.md": {
	id: "27a.md";
  slug: "27a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"27b.md": {
	id: "27b.md";
  slug: "27b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"27b1.md": {
	id: "27b1.md";
  slug: "27b1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"27c.md": {
	id: "27c.md";
  slug: "27c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"27d.md": {
	id: "27d.md";
  slug: "27d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"27e.md": {
	id: "27e.md";
  slug: "27e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"27f.md": {
	id: "27f.md";
  slug: "27f";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"27f1.md": {
	id: "27f1.md";
  slug: "27f1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"28.md": {
	id: "28.md";
  slug: "28";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"29.md": {
	id: "29.md";
  slug: "29";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"29a.md": {
	id: "29a.md";
  slug: "29a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"2a.md": {
	id: "2a.md";
  slug: "2a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"2b.md": {
	id: "2b.md";
  slug: "2b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"2c.md": {
	id: "2c.md";
  slug: "2c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"2d.md": {
	id: "2d.md";
  slug: "2d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"2e.md": {
	id: "2e.md";
  slug: "2e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"2f.md": {
	id: "2f.md";
  slug: "2f";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3.md": {
	id: "3.md";
  slug: "3";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"30.md": {
	id: "30.md";
  slug: "30";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"30a.md": {
	id: "30a.md";
  slug: "30a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"30b.md": {
	id: "30b.md";
  slug: "30b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"30b1.md": {
	id: "30b1.md";
  slug: "30b1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"30b2.md": {
	id: "30b2.md";
  slug: "30b2";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"30b3.md": {
	id: "30b3.md";
  slug: "30b3";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"30c.md": {
	id: "30c.md";
  slug: "30c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"30d.md": {
	id: "30d.md";
  slug: "30d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"30e.md": {
	id: "30e.md";
  slug: "30e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"31.md": {
	id: "31.md";
  slug: "31";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"31a.md": {
	id: "31a.md";
  slug: "31a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"31b.md": {
	id: "31b.md";
  slug: "31b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"31c.md": {
	id: "31c.md";
  slug: "31c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"31d.md": {
	id: "31d.md";
  slug: "31d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"32.md": {
	id: "32.md";
  slug: "32";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"32a.md": {
	id: "32a.md";
  slug: "32a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"32b.md": {
	id: "32b.md";
  slug: "32b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"33.md": {
	id: "33.md";
  slug: "33";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"33a.md": {
	id: "33a.md";
  slug: "33a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"34.md": {
	id: "34.md";
  slug: "34";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"34a.md": {
	id: "34a.md";
  slug: "34a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"35.md": {
	id: "35.md";
  slug: "35";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"36.md": {
	id: "36.md";
  slug: "36";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"37.md": {
	id: "37.md";
  slug: "37";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"38.md": {
	id: "38.md";
  slug: "38";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"38a.md": {
	id: "38a.md";
  slug: "38a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"38b.md": {
	id: "38b.md";
  slug: "38b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"39.md": {
	id: "39.md";
  slug: "39";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"39a.md": {
	id: "39a.md";
  slug: "39a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3a.md": {
	id: "3a.md";
  slug: "3a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3b.md": {
	id: "3b.md";
  slug: "3b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3b1.md": {
	id: "3b1.md";
  slug: "3b1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3b2.md": {
	id: "3b2.md";
  slug: "3b2";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3b3.md": {
	id: "3b3.md";
  slug: "3b3";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3b4.md": {
	id: "3b4.md";
  slug: "3b4";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3b5.md": {
	id: "3b5.md";
  slug: "3b5";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3b6.md": {
	id: "3b6.md";
  slug: "3b6";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3c.md": {
	id: "3c.md";
  slug: "3c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3c1.md": {
	id: "3c1.md";
  slug: "3c1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3c2.md": {
	id: "3c2.md";
  slug: "3c2";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3c3.md": {
	id: "3c3.md";
  slug: "3c3";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3c3a.md": {
	id: "3c3a.md";
  slug: "3c3a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3c4.md": {
	id: "3c4.md";
  slug: "3c4";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3d.md": {
	id: "3d.md";
  slug: "3d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"3e.md": {
	id: "3e.md";
  slug: "3e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"4.md": {
	id: "4.md";
  slug: "4";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"40.md": {
	id: "40.md";
  slug: "40";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"40a.md": {
	id: "40a.md";
  slug: "40a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"40b.md": {
	id: "40b.md";
  slug: "40b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"40c.md": {
	id: "40c.md";
  slug: "40c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"40d.md": {
	id: "40d.md";
  slug: "40d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"40d1.md": {
	id: "40d1.md";
  slug: "40d1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"40e.md": {
	id: "40e.md";
  slug: "40e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"41.md": {
	id: "41.md";
  slug: "41";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"41a.md": {
	id: "41a.md";
  slug: "41a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"41b.md": {
	id: "41b.md";
  slug: "41b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"41b1.md": {
	id: "41b1.md";
  slug: "41b1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"41c.md": {
	id: "41c.md";
  slug: "41c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"41d.md": {
	id: "41d.md";
  slug: "41d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"42.md": {
	id: "42.md";
  slug: "42";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"42a.md": {
	id: "42a.md";
  slug: "42a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"42b.md": {
	id: "42b.md";
  slug: "42b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"42c.md": {
	id: "42c.md";
  slug: "42c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"42d.md": {
	id: "42d.md";
  slug: "42d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"42e.md": {
	id: "42e.md";
  slug: "42e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"43.md": {
	id: "43.md";
  slug: "43";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"44.md": {
	id: "44.md";
  slug: "44";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"44a.md": {
	id: "44a.md";
  slug: "44a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"44b.md": {
	id: "44b.md";
  slug: "44b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"44c.md": {
	id: "44c.md";
  slug: "44c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"44d.md": {
	id: "44d.md";
  slug: "44d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"44e.md": {
	id: "44e.md";
  slug: "44e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"44f.md": {
	id: "44f.md";
  slug: "44f";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"44g.md": {
	id: "44g.md";
  slug: "44g";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"44h.md": {
	id: "44h.md";
  slug: "44h";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"44i.md": {
	id: "44i.md";
  slug: "44i";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"44j.md": {
	id: "44j.md";
  slug: "44j";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"44k.md": {
	id: "44k.md";
  slug: "44k";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"44l.md": {
	id: "44l.md";
  slug: "44l";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"45.md": {
	id: "45.md";
  slug: "45";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"45a.md": {
	id: "45a.md";
  slug: "45a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"46.md": {
	id: "46.md";
  slug: "46";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"46a.md": {
	id: "46a.md";
  slug: "46a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"46b.md": {
	id: "46b.md";
  slug: "46b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"46c.md": {
	id: "46c.md";
  slug: "46c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"46d.md": {
	id: "46d.md";
  slug: "46d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"46d1.md": {
	id: "46d1.md";
  slug: "46d1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"46e.md": {
	id: "46e.md";
  slug: "46e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"46f.md": {
	id: "46f.md";
  slug: "46f";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"47.md": {
	id: "47.md";
  slug: "47";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"47a.md": {
	id: "47a.md";
  slug: "47a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"47a1.md": {
	id: "47a1.md";
  slug: "47a1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"47b.md": {
	id: "47b.md";
  slug: "47b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"48.md": {
	id: "48.md";
  slug: "48";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"48a.md": {
	id: "48a.md";
  slug: "48a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"48b.md": {
	id: "48b.md";
  slug: "48b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"48c.md": {
	id: "48c.md";
  slug: "48c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"48d.md": {
	id: "48d.md";
  slug: "48d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"49.md": {
	id: "49.md";
  slug: "49";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"49a.md": {
	id: "49a.md";
  slug: "49a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"4a.md": {
	id: "4a.md";
  slug: "4a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"4b.md": {
	id: "4b.md";
  slug: "4b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"5.md": {
	id: "5.md";
  slug: "5";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"50.md": {
	id: "50.md";
  slug: "50";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"51.md": {
	id: "51.md";
  slug: "51";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"51a.md": {
	id: "51a.md";
  slug: "51a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"51b.md": {
	id: "51b.md";
  slug: "51b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"51c.md": {
	id: "51c.md";
  slug: "51c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"51d.md": {
	id: "51d.md";
  slug: "51d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"52.md": {
	id: "52.md";
  slug: "52";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"52a.md": {
	id: "52a.md";
  slug: "52a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"52b.md": {
	id: "52b.md";
  slug: "52b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"52c.md": {
	id: "52c.md";
  slug: "52c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"52d.md": {
	id: "52d.md";
  slug: "52d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"52e.md": {
	id: "52e.md";
  slug: "52e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"53.md": {
	id: "53.md";
  slug: "53";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"53a.md": {
	id: "53a.md";
  slug: "53a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"53a1.md": {
	id: "53a1.md";
  slug: "53a1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"53b.md": {
	id: "53b.md";
  slug: "53b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"53c.md": {
	id: "53c.md";
  slug: "53c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"53d.md": {
	id: "53d.md";
  slug: "53d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"53e.md": {
	id: "53e.md";
  slug: "53e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"54.md": {
	id: "54.md";
  slug: "54";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"54a.md": {
	id: "54a.md";
  slug: "54a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"54b.md": {
	id: "54b.md";
  slug: "54b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"54c.md": {
	id: "54c.md";
  slug: "54c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"54d.md": {
	id: "54d.md";
  slug: "54d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"55.md": {
	id: "55.md";
  slug: "55";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"55a.md": {
	id: "55a.md";
  slug: "55a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"55b.md": {
	id: "55b.md";
  slug: "55b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"55c.md": {
	id: "55c.md";
  slug: "55c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"55d.md": {
	id: "55d.md";
  slug: "55d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56.md": {
	id: "56.md";
  slug: "56";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56a.md": {
	id: "56a.md";
  slug: "56a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56b.md": {
	id: "56b.md";
  slug: "56b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56b1.md": {
	id: "56b1.md";
  slug: "56b1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56c.md": {
	id: "56c.md";
  slug: "56c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56d.md": {
	id: "56d.md";
  slug: "56d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56d1.md": {
	id: "56d1.md";
  slug: "56d1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56d2.md": {
	id: "56d2.md";
  slug: "56d2";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56d3.md": {
	id: "56d3.md";
  slug: "56d3";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56d4.md": {
	id: "56d4.md";
  slug: "56d4";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56d4a.md": {
	id: "56d4a.md";
  slug: "56d4a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56e.md": {
	id: "56e.md";
  slug: "56e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56f.md": {
	id: "56f.md";
  slug: "56f";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56g.md": {
	id: "56g.md";
  slug: "56g";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56g1.md": {
	id: "56g1.md";
  slug: "56g1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56h.md": {
	id: "56h.md";
  slug: "56h";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56i.md": {
	id: "56i.md";
  slug: "56i";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56i1.md": {
	id: "56i1.md";
  slug: "56i1";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56j.md": {
	id: "56j.md";
  slug: "56j";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56k.md": {
	id: "56k.md";
  slug: "56k";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"56l.md": {
	id: "56l.md";
  slug: "56l";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"57.md": {
	id: "57.md";
  slug: "57";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"58.md": {
	id: "58.md";
  slug: "58";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"58a.md": {
	id: "58a.md";
  slug: "58a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"58b.md": {
	id: "58b.md";
  slug: "58b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"58c.md": {
	id: "58c.md";
  slug: "58c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"58d.md": {
	id: "58d.md";
  slug: "58d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"59.md": {
	id: "59.md";
  slug: "59";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"5a.md": {
	id: "5a.md";
  slug: "5a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"5b.md": {
	id: "5b.md";
  slug: "5b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"6.md": {
	id: "6.md";
  slug: "6";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"60.md": {
	id: "60.md";
  slug: "60";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"61.md": {
	id: "61.md";
  slug: "61";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"61a.md": {
	id: "61a.md";
  slug: "61a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"62.md": {
	id: "62.md";
  slug: "62";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"62a.md": {
	id: "62a.md";
  slug: "62a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"63.md": {
	id: "63.md";
  slug: "63";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"64.md": {
	id: "64.md";
  slug: "64";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"65.md": {
	id: "65.md";
  slug: "65";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"66.md": {
	id: "66.md";
  slug: "66";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"66a.md": {
	id: "66a.md";
  slug: "66a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"66b.md": {
	id: "66b.md";
  slug: "66b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"66c.md": {
	id: "66c.md";
  slug: "66c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"66d.md": {
	id: "66d.md";
  slug: "66d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"66e.md": {
	id: "66e.md";
  slug: "66e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"66f.md": {
	id: "66f.md";
  slug: "66f";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"66g.md": {
	id: "66g.md";
  slug: "66g";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"66h.md": {
	id: "66h.md";
  slug: "66h";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"66i.md": {
	id: "66i.md";
  slug: "66i";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"67.md": {
	id: "67.md";
  slug: "67";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"68.md": {
	id: "68.md";
  slug: "68";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"69.md": {
	id: "69.md";
  slug: "69";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"7.md": {
	id: "7.md";
  slug: "7";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"8.md": {
	id: "8.md";
  slug: "8";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"8a.md": {
	id: "8a.md";
  slug: "8a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"8b.md": {
	id: "8b.md";
  slug: "8b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"8c.md": {
	id: "8c.md";
  slug: "8c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"8d.md": {
	id: "8d.md";
  slug: "8d";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"8e.md": {
	id: "8e.md";
  slug: "8e";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"8f.md": {
	id: "8f.md";
  slug: "8f";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"8g.md": {
	id: "8g.md";
  slug: "8g";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"8h.md": {
	id: "8h.md";
  slug: "8h";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"8i.md": {
	id: "8i.md";
  slug: "8i";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"8j.md": {
	id: "8j.md";
  slug: "8j";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"9.md": {
	id: "9.md";
  slug: "9";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"9a.md": {
	id: "9a.md";
  slug: "9a";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"9b.md": {
	id: "9b.md";
  slug: "9b";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"9c.md": {
	id: "9c.md";
  slug: "9c";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
};
"pages": {
"about.md": {
	id: "about.md";
  slug: "about";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"feeds.md": {
	id: "feeds.md";
  slug: "feeds";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"now.md": {
	id: "now.md";
  slug: "now";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
};
"podcast": {
"1-tech-interviews.md": {
	id: "1-tech-interviews.md";
  slug: "1-tech-interviews";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"10-building-healthy-on-call-culture.md": {
	id: "10-building-healthy-on-call-culture.md";
  slug: "10-building-healthy-on-call-culture";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"11-learning-and-growing-in-front-end-development.md": {
	id: "11-learning-and-growing-in-front-end-development.md";
  slug: "11-learning-and-growing-in-front-end-development";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"12-the-life-of-a-generalist-software-engineer.md": {
	id: "12-the-life-of-a-generalist-software-engineer.md";
  slug: "12-the-life-of-a-generalist-software-engineer";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"13-devops-and-site-reliability-engineering.md": {
	id: "13-devops-and-site-reliability-engineering.md";
  slug: "13-devops-and-site-reliability-engineering";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"14-protective-leadership-and-leadership-style.md": {
	id: "14-protective-leadership-and-leadership-style.md";
  slug: "14-protective-leadership-and-leadership-style";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"15-prioritization-for-senior-and-staff-software-engineers.md": {
	id: "15-prioritization-for-senior-and-staff-software-engineers.md";
  slug: "15-prioritization-for-senior-and-staff-software-engineers";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"16-being-an-indie-hacker.md": {
	id: "16-being-an-indie-hacker.md";
  slug: "16-being-an-indie-hacker";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"17-banish-your-inner-critic.md": {
	id: "17-banish-your-inner-critic.md";
  slug: "17-banish-your-inner-critic";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"18-managing-organizational-changes.md": {
	id: "18-managing-organizational-changes.md";
  slug: "18-managing-organizational-changes";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"19-software-architect-role-and-archicture.md": {
	id: "19-software-architect-role-and-archicture.md";
  slug: "19-software-architect-role-and-archicture";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"2-how-engineering-teams-work-with-product-teams.md": {
	id: "2-how-engineering-teams-work-with-product-teams.md";
  slug: "2-how-engineering-teams-work-with-product-teams";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"20-software-architecture-design-systems.md": {
	id: "20-software-architecture-design-systems.md";
  slug: "20-software-architecture-design-systems";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"21-intent-based-leadership-with-david-marquet.md": {
	id: "21-intent-based-leadership-with-david-marquet.md";
  slug: "21-intent-based-leadership-with-david-marquet";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"22-effective-11-meetings-for-software.md": {
	id: "22-effective-11-meetings-for-software.md";
  slug: "22-effective-11-meetings-for-software";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"23-accessibility-and-inclusive-design.md": {
	id: "23-accessibility-and-inclusive-design.md";
  slug: "23-accessibility-and-inclusive-design";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"24-understanding-distributed-systems.md": {
	id: "24-understanding-distributed-systems.md";
  slug: "24-understanding-distributed-systems";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"25-live-pair-programming-open-source.md": {
	id: "25-live-pair-programming-open-source.md";
  slug: "25-live-pair-programming-open-source";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"26-machine-learning-and-data-science.md": {
	id: "26-machine-learning-and-data-science.md";
  slug: "26-machine-learning-and-data-science";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"27-problem-solving-skills-and-a-strategy.md": {
	id: "27-problem-solving-skills-and-a-strategy.md";
  slug: "27-problem-solving-skills-and-a-strategy";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"28-how-to-present-solutions-as-software.md": {
	id: "28-how-to-present-solutions-as-software.md";
  slug: "28-how-to-present-solutions-as-software";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"3-diversity-gender-discrimination.md": {
	id: "3-diversity-gender-discrimination.md";
  slug: "3-diversity-gender-discrimination";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"4-how-to-be-a-working-student.md": {
	id: "4-how-to-be-a-working-student.md";
  slug: "4-how-to-be-a-working-student";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"5-startup-marketing.md": {
	id: "5-startup-marketing.md";
  slug: "5-startup-marketing";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"6-software-development-in-startups.md": {
	id: "6-software-development-in-startups.md";
  slug: "6-software-development-in-startups";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"7-mobile-apps-at-scale.md": {
	id: "7-mobile-apps-at-scale.md";
  slug: "7-mobile-apps-at-scale";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"8-cross-cultural-communication.md": {
	id: "8-cross-cultural-communication.md";
  slug: "8-cross-cultural-communication";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"9-engineering-career-path.md": {
	id: "9-engineering-career-path.md";
  slug: "9-engineering-career-path";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
"trailer-season-3.md": {
	id: "trailer-season-3.md";
  slug: "trailer-season-3";
  body: string;
  collection: "podcast";
  data: InferEntrySchema<"podcast">
} & { render(): Render[".md"] };
};
"posts": {
"14-lessons-i-learned-in-10-years.md": {
	id: "14-lessons-i-learned-in-10-years.md";
  slug: "14-lessons-i-learned-in-10-years";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"a-life-without-problems-the-happiness.md": {
	id: "a-life-without-problems-the-happiness.md";
  slug: "a-life-without-problems-the-happiness";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"being-morally-good-in-the-war-of-life.md": {
	id: "being-morally-good-in-the-war-of-life.md";
  slug: "being-morally-good-in-the-war-of-life";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"bias-towards-action.md": {
	id: "bias-towards-action.md";
  slug: "bias-towards-action";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"can-you-fire-your-colleague.md": {
	id: "can-you-fire-your-colleague.md";
  slug: "can-you-fire-your-colleague";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"chestertons-fence.md": {
	id: "chestertons-fence.md";
  slug: "chestertons-fence";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"communicating-decisions-in-the-organizations.md": {
	id: "communicating-decisions-in-the-organizations.md";
  slug: "communicating-decisions-in-the-organizations";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"concluding-my-struggle-with-note-taking-systems-and-apps-finally.md": {
	id: "concluding-my-struggle-with-note-taking-systems-and-apps-finally.md";
  slug: "concluding-my-struggle-with-note-taking-systems-and-apps-finally";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"concurrency-in-ios.md": {
	id: "concurrency-in-ios.md";
  slug: "concurrency-in-ios";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"csikszentmihalyi-newport-and-pressfield-on-creativity-time-and-deep-walks-in-remote-work.md": {
	id: "csikszentmihalyi-newport-and-pressfield-on-creativity-time-and-deep-walks-in-remote-work.md";
  slug: "csikszentmihalyi-newport-and-pressfield-on-creativity-time-and-deep-walks-in-remote-work";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"deciding-on-what-you-should-focus-on-next.md": {
	id: "deciding-on-what-you-should-focus-on-next.md";
  slug: "deciding-on-what-you-should-focus-on-next";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"decisions-that-remove-other-decisions.md": {
	id: "decisions-that-remove-other-decisions.md";
  slug: "decisions-that-remove-other-decisions";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"diversity-in-tech-is-a-first-world-problem.md": {
	id: "diversity-in-tech-is-a-first-world-problem.md";
  slug: "diversity-in-tech-is-a-first-world-problem";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"do-not-change-jobs.md": {
	id: "do-not-change-jobs.md";
  slug: "do-not-change-jobs";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"dont-assume-consensus-in-the-absence-of-objection.md": {
	id: "dont-assume-consensus-in-the-absence-of-objection.md";
  slug: "dont-assume-consensus-in-the-absence-of-objection";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"dont-take-responsibility-more-and-stop-blaming.md": {
	id: "dont-take-responsibility-more-and-stop-blaming.md";
  slug: "dont-take-responsibility-more-and-stop-blaming";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"effective-1-1-meetings-one-on-one-meeting-template.md": {
	id: "effective-1-1-meetings-one-on-one-meeting-template.md";
  slug: "effective-1-1-meetings-one-on-one-meeting-template";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"effective-1-on-1-meetings-own-your-one-on-one-meeting.md": {
	id: "effective-1-on-1-meetings-own-your-one-on-one-meeting.md";
  slug: "effective-1-on-1-meetings-own-your-one-on-one-meeting";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"explicit-disagreement-is-better-than-implicit-misunderstanding.md": {
	id: "explicit-disagreement-is-better-than-implicit-misunderstanding.md";
  slug: "explicit-disagreement-is-better-than-implicit-misunderstanding";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"faucets-and-bad-ideas.md": {
	id: "faucets-and-bad-ideas.md";
  slug: "faucets-and-bad-ideas";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"firebase-predictions.md": {
	id: "firebase-predictions.md";
  slug: "firebase-predictions";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"generics-in-swift.md": {
	id: "generics-in-swift.md";
  slug: "generics-in-swift";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"goals-and-existence.md": {
	id: "goals-and-existence.md";
  slug: "goals-and-existence";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"growth-with-systematic-bliss.md": {
	id: "growth-with-systematic-bliss.md";
  slug: "growth-with-systematic-bliss";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"have-the-first-win-to-build-team-spirit.md": {
	id: "have-the-first-win-to-build-team-spirit.md";
  slug: "have-the-first-win-to-build-team-spirit";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"hidden-monoliths-affect-the-software-design.md": {
	id: "hidden-monoliths-affect-the-software-design.md";
  slug: "hidden-monoliths-affect-the-software-design";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"how-and-why-rfcs-fail.md": {
	id: "how-and-why-rfcs-fail.md";
  slug: "how-and-why-rfcs-fail";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"how-to-approach-software-architecture-design.md": {
	id: "how-to-approach-software-architecture-design.md";
  slug: "how-to-approach-software-architecture-design";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"how-to-build-trust-in-a-team-as-a-new-manager.md": {
	id: "how-to-build-trust-in-a-team-as-a-new-manager.md";
  slug: "how-to-build-trust-in-a-team-as-a-new-manager";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"how-to-get-to-the-end-of-a-pile-of-unread-books.md": {
	id: "how-to-get-to-the-end-of-a-pile-of-unread-books.md";
  slug: "how-to-get-to-the-end-of-a-pile-of-unread-books";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"how-to-handle-and-overcome-objections-to-your-proposal-at-work.md": {
	id: "how-to-handle-and-overcome-objections-to-your-proposal-at-work.md";
  slug: "how-to-handle-and-overcome-objections-to-your-proposal-at-work";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"how-to-organize-your-engineering-teams-documents.md": {
	id: "how-to-organize-your-engineering-teams-documents.md";
  slug: "how-to-organize-your-engineering-teams-documents";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"how-to-reset-first-commit-in-git.md": {
	id: "how-to-reset-first-commit-in-git.md";
  slug: "how-to-reset-first-commit-in-git";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"how-to-solve-and-prevent-conflicts.md": {
	id: "how-to-solve-and-prevent-conflicts.md";
  slug: "how-to-solve-and-prevent-conflicts";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"how-to-stop-endless-discussions.md": {
	id: "how-to-stop-endless-discussions.md";
  slug: "how-to-stop-endless-discussions";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"importance-of-the-feedback.md": {
	id: "importance-of-the-feedback.md";
  slug: "importance-of-the-feedback";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"ios-application-lifecycle.md": {
	id: "ios-application-lifecycle.md";
  slug: "ios-application-lifecycle";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"ios-developer-productivity-kit.md": {
	id: "ios-developer-productivity-kit.md";
  slug: "ios-developer-productivity-kit";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"is-software-engineering-an-art.md": {
	id: "is-software-engineering-an-art.md";
  slug: "is-software-engineering-an-art";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"joining-sumup.md": {
	id: "joining-sumup.md";
  slug: "joining-sumup";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"learning-cone-and-blame-spiral-the-case-of-blame-absorbers.md": {
	id: "learning-cone-and-blame-spiral-the-case-of-blame-absorbers.md";
  slug: "learning-cone-and-blame-spiral-the-case-of-blame-absorbers";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"learnings-on-dealing-with-ambiguity.md": {
	id: "learnings-on-dealing-with-ambiguity.md";
  slug: "learnings-on-dealing-with-ambiguity";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"love-the-constraints.md": {
	id: "love-the-constraints.md";
  slug: "love-the-constraints";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"machine-learning-introduction.md": {
	id: "machine-learning-introduction.md";
  slug: "machine-learning-introduction";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"managing-multiple-aws-environments-with-terraform.md": {
	id: "managing-multiple-aws-environments-with-terraform.md";
  slug: "managing-multiple-aws-environments-with-terraform";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"managing-partially-distributed-teams.md": {
	id: "managing-partially-distributed-teams.md";
  slug: "managing-partially-distributed-teams";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"maximizing-personal-growth-by-understanding.md": {
	id: "maximizing-personal-growth-by-understanding.md";
  slug: "maximizing-personal-growth-by-understanding";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"migrating-from-vapor-1-to-vapor-2.md": {
	id: "migrating-from-vapor-1-to-vapor-2.md";
  slug: "migrating-from-vapor-1-to-vapor-2";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"moving-to-substack.md": {
	id: "moving-to-substack.md";
  slug: "moving-to-substack";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"my-experience-living-without-social-media.md": {
	id: "my-experience-living-without-social-media.md";
  slug: "my-experience-living-without-social-media";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"navigating-the-writing-challenge-every-day.md": {
	id: "navigating-the-writing-challenge-every-day.md";
  slug: "navigating-the-writing-challenge-every-day";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"new-horizons-with-server-side-swift.md": {
	id: "new-horizons-with-server-side-swift.md";
  slug: "new-horizons-with-server-side-swift";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"no-you-dont-need-to-learn-another-programming-language-every-three-months.md": {
	id: "no-you-dont-need-to-learn-another-programming-language-every-three-months.md";
  slug: "no-you-dont-need-to-learn-another-programming-language-every-three-months";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"on-drugs-and-great-people.md": {
	id: "on-drugs-and-great-people.md";
  slug: "on-drugs-and-great-people";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"on-the-purpose-of-life.md": {
	id: "on-the-purpose-of-life.md";
  slug: "on-the-purpose-of-life";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"passing-down-the-experience.md": {
	id: "passing-down-the-experience.md";
  slug: "passing-down-the-experience";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"prioritization-skills-for-senior-and-staff-software-engineers.md": {
	id: "prioritization-skills-for-senior-and-staff-software-engineers.md";
  slug: "prioritization-skills-for-senior-and-staff-software-engineers";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"productivity-scam-and-perception-of-time.md": {
	id: "productivity-scam-and-perception-of-time.md";
  slug: "productivity-scam-and-perception-of-time";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"put-remote-work-in-your-inclusion-efforts-not-only-in-diversity-in-the-workplace.md": {
	id: "put-remote-work-in-your-inclusion-efforts-not-only-in-diversity-in-the-workplace.md";
  slug: "put-remote-work-in-your-inclusion-efforts-not-only-in-diversity-in-the-workplace";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"questioning-vs-asking.md": {
	id: "questioning-vs-asking.md";
  slug: "questioning-vs-asking";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"relationship-vs-task-conflicts.md": {
	id: "relationship-vs-task-conflicts.md";
  slug: "relationship-vs-task-conflicts";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"separation-of-concerns-at-work.md": {
	id: "separation-of-concerns-at-work.md";
  slug: "separation-of-concerns-at-work";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"shift-left-on-security.md": {
	id: "shift-left-on-security.md";
  slug: "shift-left-on-security";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"simple-linear-regression.md": {
	id: "simple-linear-regression.md";
  slug: "simple-linear-regression";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"sometimes-saying-nothing-tells-everything.md": {
	id: "sometimes-saying-nothing-tells-everything.md";
  slug: "sometimes-saying-nothing-tells-everything";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"speaking-writing-and-high-quality-ideas.md": {
	id: "speaking-writing-and-high-quality-ideas.md";
  slug: "speaking-writing-and-high-quality-ideas";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"studying-and-learning-leadership.md": {
	id: "studying-and-learning-leadership.md";
  slug: "studying-and-learning-leadership";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"supplying-books-to-my-father.md": {
	id: "supplying-books-to-my-father.md";
  slug: "supplying-books-to-my-father";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"systematic-approach-to-give-feedback-to-blame-absorbers.md": {
	id: "systematic-approach-to-give-feedback-to-blame-absorbers.md";
  slug: "systematic-approach-to-give-feedback-to-blame-absorbers";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"testing-in-ios.md": {
	id: "testing-in-ios.md";
  slug: "testing-in-ios";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"the-blue-green-deployment-strategy.md": {
	id: "the-blue-green-deployment-strategy.md";
  slug: "the-blue-green-deployment-strategy";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"the-decision-making-pendulum.md": {
	id: "the-decision-making-pendulum.md";
  slug: "the-decision-making-pendulum";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"the-good-the-bad-and-the-ugly-of-career-ladders-and-frameworks.md": {
	id: "the-good-the-bad-and-the-ugly-of-career-ladders-and-frameworks.md";
  slug: "the-good-the-bad-and-the-ugly-of-career-ladders-and-frameworks";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"the-must-have-skill-for-every-leader-listening-with-empathy.md": {
	id: "the-must-have-skill-for-every-leader-listening-with-empathy.md";
  slug: "the-must-have-skill-for-every-leader-listening-with-empathy";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"the-power-of-ritualization-rituals-vs-routines.md": {
	id: "the-power-of-ritualization-rituals-vs-routines.md";
  slug: "the-power-of-ritualization-rituals-vs-routines";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"the-real-difficulty-of-engineering-leadership.md": {
	id: "the-real-difficulty-of-engineering-leadership.md";
  slug: "the-real-difficulty-of-engineering-leadership";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"these-annoying-tenure-engineers.md": {
	id: "these-annoying-tenure-engineers.md";
  slug: "these-annoying-tenure-engineers";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"three-types-of-feedback.md": {
	id: "three-types-of-feedback.md";
  slug: "three-types-of-feedback";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"timely-estimations-are-underrated.md": {
	id: "timely-estimations-are-underrated.md";
  slug: "timely-estimations-are-underrated";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"top-3-tips-for-planners.md": {
	id: "top-3-tips-for-planners.md";
  slug: "top-3-tips-for-planners";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"unit-tests-in-server-side-swift.md": {
	id: "unit-tests-in-server-side-swift.md";
  slug: "unit-tests-in-server-side-swift";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"using-firebase-cloud-messaging-for-remote-notifications-in-ios.md": {
	id: "using-firebase-cloud-messaging-for-remote-notifications-in-ios.md";
  slug: "using-firebase-cloud-messaging-for-remote-notifications-in-ios";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"using-swiftlint-and-danger-for-swift-best-practices.md": {
	id: "using-swiftlint-and-danger-for-swift-best-practices.md";
  slug: "using-swiftlint-and-danger-for-swift-best-practices";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"vapor-2-what-to-do-after-hello-world-example.md": {
	id: "vapor-2-what-to-do-after-hello-world-example.md";
  slug: "vapor-2-what-to-do-after-hello-world-example";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"view-lifecycle-in-ios.md": {
	id: "view-lifecycle-in-ios.md";
  slug: "view-lifecycle-in-ios";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"what-hades-the-game-had-taught-me.md": {
	id: "what-hades-the-game-had-taught-me.md";
  slug: "what-hades-the-game-had-taught-me";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"what-i-learned-about-getting-better-at-giving-talks-and-presentations.md": {
	id: "what-i-learned-about-getting-better-at-giving-talks-and-presentations.md";
  slug: "what-i-learned-about-getting-better-at-giving-talks-and-presentations";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"why-are-hybrid-meetings-terrible-remote-vs-on-site-meetings.md": {
	id: "why-are-hybrid-meetings-terrible-remote-vs-on-site-meetings.md";
  slug: "why-are-hybrid-meetings-terrible-remote-vs-on-site-meetings";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"why-cant-this-be-done-sooner.md": {
	id: "why-cant-this-be-done-sooner.md";
  slug: "why-cant-this-be-done-sooner";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"why-did-i-stop-live-streaming.md": {
	id: "why-did-i-stop-live-streaming.md";
  slug: "why-did-i-stop-live-streaming";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"why-dont-they-leave-the-software-to-engineers.md": {
	id: "why-dont-they-leave-the-software-to-engineers.md";
  slug: "why-dont-they-leave-the-software-to-engineers";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"why-is-it-so-hard-to-be-kind.md": {
	id: "why-is-it-so-hard-to-be-kind.md";
  slug: "why-is-it-so-hard-to-be-kind";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"why-is-writing-important.md": {
	id: "why-is-writing-important.md";
  slug: "why-is-writing-important";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"why-should-leaders-have-good-storytelling-skills-in-reorganizations-or-restructurings.md": {
	id: "why-should-leaders-have-good-storytelling-skills-in-reorganizations-or-restructurings.md";
  slug: "why-should-leaders-have-good-storytelling-skills-in-reorganizations-or-restructurings";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"yet-i-cried-one-more-time.md": {
	id: "yet-i-cried-one-more-time.md";
  slug: "yet-i-cried-one-more-time";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../content/config");
}
