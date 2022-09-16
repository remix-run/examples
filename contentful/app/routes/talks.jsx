import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Title from "../components/Title";
import { client } from "../models/contentful.server";
import { motion } from 'framer-motion';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

export async function loader() {
	const talks = await client.getTalks();
	const page = await client.getPage("Talks")
	return json({talks,page});
}

export const meta= ({data}) =>{
	const {title, description, ogImage} = data.page.seoMetadata
	return {
		title,
		description,
		"og:image": `${ogImage.url}`
	}
}

export default function Talks() {
    const {talks} = useLoaderData();
    return (
        <div className="px-4 sm:px-48">
				<Title title="Talks" emoji="🎙" />
				<div className="grid gap-6 sm:grid-cols-3">
					{talks.map((item) => {
						const { link, sys, description, title, type, previewImage } = item;
						return (
							<a
								href={link}
								key={sys.id}
							>
								<motion.div
									className="mt-8 max-w-sm rounded overflow-hidden shadow-lg bg-white cursor-pointer dark:bg-gray-700"
									whileHover={{
										scale: 1.05,
										transition: {
											duration: 0.4,
											ease: 'easeInOut',
										},
									}}
								>
									<div
										style={{
											position: 'relative',
											display: 'block',
											overflow: 'hidden',
										}}
									>
										<div
											style={{
												position: 'absolute',
												top: 0,
												right: 0,
												bottom: 0,
												left: 0,
												width: '100%',
												height: '100%',
												transform: 'scale(1.5)',
												filter: 'blur(40px)',
											}}
										/>

										<img src={previewImage.url} alt={previewImage.description} />
									</div>
									<div className="px-6 py-4">
										<h2 className="font-semibold text-lg mb-2 dark:text-secondary">
											{title}
										</h2>
										<p>{documentToReactComponents(
										description.json
									)}</p>
									</div>
								</motion.div>
							</a>
						);
					})}
				</div>
			</div>
    )
}