import { storyblokEditable, StoryblokComponent } from "@storyblok/react";

const Grid = ({ blok }) => (
  <ul {...storyblokEditable(blok)} key={blok._uid} className="container mx-auto grid md:grid-cols-3 gap-12 my-12 place-items-center">
    {blok.columns.map((blok) => (
      <li key={blok._uid}>
        <StoryblokComponent blok={blok} />
      </li>
    ))}
  </ul>
);

export default Grid;