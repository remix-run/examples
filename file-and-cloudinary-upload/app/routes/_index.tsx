import { Link } from "@remix-run/react";

export default function () {
  return (
    <ul>
      <li>
        <Link to="cloudinary-upload">Cloudinary Upload</Link>
      </li>
      <li>
        <Link to="/local-upload">Local Upload</Link>
      </li>
    </ul>
  );
}
