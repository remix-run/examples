import Title from "../../components/Title";
import { client } from "../../models/contentful.server";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export async function loader() {
	const blogs = await client.getAllBlogs();
	const page = await client.getPage("Writings")
    return json({blogs, page})
}

export const meta = ({data}) => {
	const {seoMetadata} = data.page;
	return {
		title: seoMetadata.title,
		description: seoMetadata.description,
		"og:image": `${seoMetadata.ogImage.url}`
	}
}

function PostList(data){
	return(
		data.map(post => (
			<div key={post.slug} className="mt-8 pb-2 border-b-2 border-light last:border-0">
				<Link to={post.slug}>
					<h2 className="text-xl font-medium sm:text-3xl cursor-pointer hover:text-gray-800 dark:text-gray-300 dark:hover:text-secondary">{post.title}</h2>
				</Link>
				<p className="py-2 sm:py-4 text-sm sm:text-lg font-body dark:text-gray-400">{post.description}</p>
				<div className="flex justify-between mb-1">
					<p className="text-sm sm:text-lg dark:text-gray-300">
						<span role="image" aria-label="calendar emoji">
							🗓 {' '}
						</span>
						{new Date(post.sys.firstPublishedAt).toDateString()}
					</p>
						<p className="">
							{
								post.tag.map(item=>
									(
										<span key={item} className="mr-1 sm:mr-2 text-xs sm:text-sm rounded-full py-1 px-2 sm:px-3 text-primary dark:text-secondary">
											#{item}
										</span>
									)
								)
							}
						</p>
				</div>
				<a href={`writings/${post.slug}`}>
					<p className="pt-1 sm:pt-2 text-xs sm:text-base text-primary cursor-pointer hover:text-hover w-fit dark:text-secondary">Read More <span role="image" aria-label="arrow">→</span>
					</p>
				</a>
			</div>
		))
)}

export default function Writings() {
    const {blogs} = useLoaderData();
    return (
        <div className="px-8 sm:px-0 sm:max-w-2xl mx-auto">
            <Title title="Writings" emoji="📝" />
            {PostList(blogs)}
        </div>
    )
}