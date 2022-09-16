import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {client} from '../../models/contentful.server';
import Title from "../../components/Title";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';

export const loader = async ({params}) => {
    const {slug} = params;
    return json(await client.getSingleBlog(slug))
}

export const meta= ({data}) =>{
	const {title, description, openGraphImage} = data
	return {
		title,
		description,
		"og:image": `${openGraphImage.url}`
	}
}

export const richTextRenderOptions = {
	renderNode: {
		[INLINES.HYPERLINK]: (node, children) => {
			const { data } = node;
			const { uri } = data;
			return (
					<a
						className="text-primary underline dark:text-secondary"
						target="_blank"
                        href={uri}
					>
						{children[0]}
					</a>
			);
		},
		[BLOCKS.PARAGRAPH]: (node, children) => {
			return (
				<p className="text-gray-700 text-base dark:text-gray-400 leading-relaxed mb-4 text-justify">{children}</p>
			);
		},
		[BLOCKS.HEADING_1]: (node, children) => {
			return (
				<h2 className="text-4xl">{children}</h2>
			)
		},
		[BLOCKS.HEADING_2]: (node, children) => {
			return (
				<h2 className="text-3xl">{children}</h2>
			)
		}
	},
};

export default function PostSlug() {
    const {title, description, tag, blogBody, sys, canonicalUrl} = useLoaderData();
    let canonicalName = '';
    if (canonicalUrl) {
		canonicalName = canonicalUrl.replace('https://', '').split('/')[0];
	}
    
    return (
        <div className="sm:max-w-3xl mx-auto">
				<div className="px-4 sm:px-0">
					<Title title={title} />
				</div>
				<article className="mt-4">
					<div className="post px-4 sm:px-0">
						{canonicalUrl ? (
							<p className="text-lg mb-6 italic">
								This blog was originally shared on{' '}
								<a href={canonicalUrl}>
									{canonicalName}
								</a>
								.
							</p>
						) : null}
						{documentToReactComponents(blogBody.json,richTextRenderOptions)}
					</div>
				</article>
				<p className="text-hover italic">
					Last Updated: {new Date(sys.publishedAt).toDateString()}
				</p>
			</div>
    )
}