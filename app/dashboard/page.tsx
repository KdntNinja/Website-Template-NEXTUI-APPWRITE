"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";

import { databases, ID } from "@/config/appwrite";

const NewDocumentPage = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const createNewDocument = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await databases.createDocument(
				process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
				process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
				ID.unique(),
				{ name: "Untitled Document", content: "" }, // Ensure these attributes match your schema
			);

			router.push(`/dashboard/docs/${response.$id}`);
		} catch (error: any) {
			setError("Failed to create document. Please try again.");
			console.error("Failed to create document:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Create New Document</h1>
			{error && <div className="text-red-500 mb-4">{error}</div>}
			<Button
				color="primary"
				isLoading={loading}
				variant="flat"
				onClick={createNewDocument}
			>
				Create Document
			</Button>
		</div>
	);
};

export default NewDocumentPage;
