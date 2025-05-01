"use client";

import { signOut, useSession } from "next-auth/react";
import type { FC } from "react";
import { Button } from "../ui/button";

const Profile: FC = () => {
	const { data: session } = useSession();

	if (!session) {
		return (
			<div className="text-center">
				<p>You are not logged in.</p>
				<Button onClick={() => (window.location.href = "/login")}>
					Go to Login
				</Button>
			</div>
		);
	}

	return (
		<div className="container flex min-h-screen flex-col items-center justify-center space-y-8">
			<h1 className="font-bold text-2xl">Your Profile</h1>
			<div className="space-y-4">
				<div>
					<h3 className="font-medium">Name: {session.user?.name}</h3>
					<p>Email: {session.user?.email}</p>
				</div>

				{/* Example for logged-in user */}
				<div className="flex items-center justify-center space-x-4">
					<Button onClick={() => signOut()}>Log Out</Button>
				</div>
			</div>
		</div>
	);
};

export default Profile;
