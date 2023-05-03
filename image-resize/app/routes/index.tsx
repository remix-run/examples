import { Image } from "~/components/image";

const containerStyles = {
  padding: "2rem",
  marginLeft: "auto",
  marginRight: "auto",
};
const imageGridStyles = {
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  overflowX: "scroll",
};

export default function Index() {
  return (
    <div style={containerStyles}>
      <h1>Cover</h1>
      <div style={imageGridStyles as React.CSSProperties}>
        <Image src="dog-1.jpg" alt="dog" width={600} height={600} fit="cover" />
        <Image src="dog-1.jpg" alt="dog" width={300} height={300} fit="cover" />
        <Image src="dog-1.jpg" alt="dog" width={150} height={150} fit="cover" />
        <Image src="dog-1.jpg" alt="dog" width={50} height={50} fit="cover" />
      </div>

      <h1>Contain</h1>
      <div style={imageGridStyles as React.CSSProperties}>
        <Image src="other-dogs/dog-2.jpg" alt="dog" width={600} fit="contain" />
        <Image src="other-dogs/dog-2.jpg" alt="dog" width={300} fit="contain" />
        <Image src="other-dogs/dog-2.jpg" alt="dog" width={150} fit="contain" />
        <Image src="other-dogs/dog-2.jpg" alt="dog" width={50} fit="contain" />
      </div>
    </div>
  );
}
