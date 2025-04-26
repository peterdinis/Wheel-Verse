import type { FC, ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type BaseLayoutProps = {
	children?: ReactNode;
};

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-grow pt-16">{children}</main>
			<Footer />
		</div>
	);
};

export default BaseLayout;
