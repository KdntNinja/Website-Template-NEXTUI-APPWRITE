"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";

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
				fetchDocuments(user.$id);
			} catch (error) {
				console.error("Failed to fetch user ID:", error);
			}
		};

		const fetchDocuments = async (userId: string) => {
			try {
				const response = await databases.listDocuments(
					process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
					process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
					[`userId=${userId}`], // Corrected query format
				);

				setDocuments(response.documents);
			} catch (error) {
				console.error("Failed to fetch documents:", error);
			}
		};

		fetchUserId();
	}, []);

	const createNewDocument = async () => {
		if (!userId) {
			console.error("User ID is not available");

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
			console.error("Failed to create document:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Dashboard</h1>
			<Button
				color="primary"
				isLoading={loading}
				variant="flat"
				onClick={createNewDocument}
			>
				Create Document
			</Button>
			<div className="mt-4">
				<h2 className="text-xl font-semibold mb-2">Your Documents</h2>
				{documents.length > 0 ? (
					<ul>
						{documents.map((doc) => (
							<li key={doc.$id} className="mb-2">
								<a
									className="text-blue-500"
									href={`/dashboard/docs/${userId}/${doc.$id}`}
								>
									{doc.title}
								</a>
							</li>
						))}
					</ul>
				) : (
					<p>No documents found.</p>
				)}
			</div>
		</div>
	);
};

export default DashboardPage;
