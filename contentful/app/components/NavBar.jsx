import { NavLink } from "@remix-run/react";
import { useState } from "react";

export default function NavBar() {

    const [isOpen, setIsOpen] = useState(false);
	const handleClick = (e) => {
		e.preventDefault();
		setIsOpen((previous) => !previous);
	};

    return (
        <header className="sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-2">
			<div className="flex items-center justify-between px-4 py-2 sm:p-0">
				<div>
					<NavLink to="/">
						<span role="img" aria-label="dog" className="text-5xl">🐶</span>
					</NavLink>
				</div>
				<div className="flex justify-between items-center">
					<button
						type="button"
						className="text-primary focus:text-gray-800 hover:text-primary sm:hidden dark:text-white dark:focus:text-primary"
						onClick={handleClick}
					>
						<svg
							className="fill-current h-6 w-6"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							{isOpen ? (
								<path d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
							) : (
								<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
							)}
							<title>Menu</title>
						</svg>
					</button>
				</div>
			</div>
			<div className="px-4 pb-2 items-center flex">
				<div
					className={`${
						isOpen ? 'block' : 'hidden'
					} sm:flex sm:justify-between sm:p-0 sm:text-lg dark:text-white`}
				>
						<NavLink to="/writings" className="block py-1 underline-anim underline-animate sm:ml-4 text-primary">
							Writings
						</NavLink>
					<NavLink to="/talks" className="mt-1 block py-1 underline-anim underline-animate sm:mt-0 sm:ml-4  text-primary">
							Talks
						</NavLink>
						<NavLink to="/projects" className="mt-1 block py-1 underline-anim underline-animate sm:mt-0 sm:ml-4  text-primary">
							Projects
					</NavLink>
						<NavLink to="/about" className="mt-1 block py-1 underline-anim underline-animate sm:mt-0 sm:ml-4  text-primary">
							About
					</NavLink>
				</div>
			</div>
		</header>
    )
}