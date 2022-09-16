import { getPlaiceholder } from "plaiceholder";

const SPACE = process.env.CONTENTFUL_SPACE_ID
const TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN

async function apiCall(query, variables) {
    const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${SPACE}/environments/master`;
    const options = {
        method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${TOKEN}`,
		},
		body: JSON.stringify({ query, variables }),
    }
    return await fetch(fetchUrl, options)
}

async function getProjects() {
    
    const query = `
    {
        projectsCollection (order:releaseDate_DESC){
            items {
                title
                desc {
                    json
                }
                releaseDate
                link
                previewImage {
                    description
                    url
                }
            }
        }
    }`;
    const response = await apiCall(query);
    const json = await response.json()
    const formattedData = await json.data.projectsCollection.items.map(
		async (project) => {
			const { title, desc, releaseDate, link, previewImage } = project;
			const { css, img } = await getPlaiceholder(previewImage.url);
			return {
				title,
				desc,
				releaseDate,
				link,
				image: img,
				imageAlt: previewImage.description,
				css,
			};
		}
	);
	return Promise.all(formattedData)
}

async function getTalks() {
    const query = `{
        talksCollection {
            items {
                sys {
                    id
                }
                title
                description {
                    json
                }
                link
                type
                previewImage {
                    description
                    url
                }
            }
        }
    }`;
    const response = await apiCall(query);
    const json = await response.json();
    return await json.data.talksCollection.items

}

async function getAllBlogs() {
    const query = `
    {
        blogCollection(order:sys_firstPublishedAt_DESC) {
        items {
          title
          slug
          description
          tag
          sys {
            firstPublishedAt
          }
        }
      }
    }
    `;
    const response = await apiCall(query);
    const json = await response.json();
    return await json.data.blogCollection.items
}

async function getSingleBlog(slug) {
    const query = `
    query($slug: String){
        blogCollection(where: {slug:$slug}) {
            items {
                title
                description
                tag
                canonicalUrl
                blogBody {
                  json
                }
                sys {
                  publishedAt
                }
                openGraphImage {
                  url
                }
              }
            }
    }
    `;
    const variables = {
        slug: slug
    };
    const response = await apiCall(query,variables);
    const json = await response.json();
    return await json.data.blogCollection.items[0]
}

async function getPage(title) {
    const query=`
    query($title:String) {
        pageCollection(where:{title:$title}){
          items{
            title
            description{
              json
            }
            rolesCollection{
              items{
                roleTitle
              }
            }
            linksCollection{
              items {
                name
                url
              }
            }
            seoMetadata{
              title
              ogImage {
                url
              }
              description
            }
          }
        }
      }
    `
    const variables = {
        title: title
    };
    const response = await apiCall(query,variables);
    const json = await response.json();
    return await json.data.pageCollection.items[0]
}

export const client = {getProjects, getTalks, getAllBlogs, getSingleBlog, getPage}