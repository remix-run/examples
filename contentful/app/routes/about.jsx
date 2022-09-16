import Title from "../components/Title";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { client } from "../models/contentful.server";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { INLINES } from '@contentful/rich-text-types';

export async function loader() {
    return json(await client.getPage("About"))
}

export const meta = ({data}) => {
	const {seoMetadata} = data;
	return {
		title: seoMetadata.title,
		description: seoMetadata.description
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
		}
	},
};

export default function About() {
  const {description } = useLoaderData();
    return (
        <div className="px-8 sm:px-0 sm:max-w-2xl mx-auto">
        <Title title="About" emoji="🙋‍♂️" />
      <div className="mt-4 text-lg dark:text-gray-300">
      {documentToReactComponents(description.json,richTextRenderOptions)}
      </div>
      </div>
    )
}