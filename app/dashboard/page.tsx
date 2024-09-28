"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Query } from "appwrite";

import { databases, account, ID } from "@/config/appwrite";

const DashboardPage = () => {
	const [loading, setLoading] = useState(false);
	const [userId, setUserId] = useState<string | null>(null);
	const [documents, setDocuments] = useState<any[]>([]);
	const router = useRouter();

	useEffect(() => {
		const fetchUserId = async () => {
			try {
				const user = await account.get();

				setUserId(user.$id);
				await fetchDocuments(user.$id);
			} catch (error) {
				alert(error);
			}
		};

		const fetchDocuments = async (userId: string) => {
			try {
				const response = await databases.listDocuments(
					process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
					process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
					[Query.equal("userId", userId)],
				);

				setDocuments(response.documents);
			} catch (error) {
				alert(error);
			}
		};

		const initialize = async () => {
			await fetchUserId();
		};

		initialize().catch((error) => {
			alert(error);
		});
	}, []);

	const createNewDocument = async () => {
		if (!userId) {
			alert("User ID not found.");

			return;
		}

		setLoading(true);
		try {
			const response = await databases.createDocument(
				process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
				process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
				ID.unique(),
				{ title: "Untitled Document", content: "", userId: userId },
			);

			router.push(`/dashboard/docs/${userId}/${response.$id}`);
		} catch (error) {
			alert(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto p-4 flex flex-col items-center">
			<h1 className="text-3xl font-bold mb-6">Dashboard</h1>
			<Button
				className="mb-6"
				color="primary"
				isLoading={loading}
				variant="flat"
				onClick={createNewDocument}
			>
				Create Document
			</Button>
			<div className="w-full">
				<h2 className="text-2xl font-semibold mb-4 text-center">
					Your Documents
				</h2>
				{documents.length > 0 ? (
					<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{documents.map((doc) => (
							<li
								key={doc.$id}
								className="border p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
							>
								<a
									className="text-blue-500 font-medium"
									href={`/dashboard/docs/${userId}/${doc.$id}`}
								>
									{doc.title || "Untitled Document"}
								</a>
							</li>
						))}
					</ul>
				) : (
					<p className="text-center">No documents found.</p>
				)}
			</div>
		</div>
	);
};

export default DashboardPage;
