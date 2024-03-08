import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  getStoryblokApi,
  useStoryblokState,
  StoryblokComponent,
} from "@storyblok/react";

export default function Page() {
  let story = useLoaderData();
  story = useStoryblokState(story);

  return (
    <>
      <StoryblokComponent blok={story.content} />
    </>
  )
};

export const loader = async ({ params, preview = false }) => {
  let slug = params["*"] ?? "home";
  let blogSlug = params["*"] === "blog/" ? "blog/home" : null;

  let sbParams = {
    version: "draft"
  };

  if (preview) {
    sbParams.version = "draft"
    sbParams.cv = Date.now()
  };

  let { data } = await getStoryblokApi().get(`cdn/stories/${blogSlug ? blogSlug : slug}`, sbParams);
  return json(data?.story, preview);
};