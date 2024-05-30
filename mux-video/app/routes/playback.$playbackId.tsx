import MuxPlayer from "@mux/mux-player-react";
import { MetaFunction } from "@remix-run/node";
import { useParams, Link } from "@remix-run/react";

const title = "View this video created with Mux + Remix";
const description =
  "This video was uploaded and processed by Mux in an example Remix application.";
export const meta: MetaFunction = ({ params }) => {
  const { playbackId } = params;
  return [
    { name: "description", content: description },
    { property: "og:type", content: "video" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:image",
      content: `https://image.mux.com/${playbackId}/thumbnail.png?width=1200&height=630&fit_mode=pad`,
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:title", content: title },
    { property: "twitter:description", content: description },
    {
      property: "twitter:image",
      content: `https://image.mux.com/${playbackId}/thumbnail.png?width=1200&height=600&fit_mode=pad`,
    },
    { property: "twitter:image:width", content: "1200" },
    { property: "twitter:image:height", content: "600" },
    // These tags should be sufficient for social sharing.
    // However, if you're really committed video SEO, I'd suggest adding ld+json, as well.
    // https://developers.google.com/search/docs/appearance/structured-data/video
  ];
};

export default function Page() {
  const { playbackId } = useParams();
  return (
    <>
      <p>
        This video is ready for playback and sharing
      </p>
      <MuxPlayer
        style={{ width: '100%', height: 'auto', aspectRatio: '16/9', marginBottom: '2rem' }}
        playbackId={playbackId}
        metadata={{ player_name: "remix/examples/mux-video" }}
        accentColor="rgb(37 99 235)"
      />
      <p>
        Go <Link to="/">back home</Link> to upload another video.
      </p>
    </>
  );
}
