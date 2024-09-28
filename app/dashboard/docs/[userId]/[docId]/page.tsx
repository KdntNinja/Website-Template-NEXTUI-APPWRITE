"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@nextui-org/button";
import dynamic from "next/dynamic";

import { databases } from "@/config/appwrite";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import "react-quill/dist/quill.snow.css";

const DocumentEditorPage = () => {
	const [loading, setLoading] = useState(false);
	const [document, setDocument] = useState<any>(null);
	const [content, setContent] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const { docId } = useParams();

	useEffect(() => {
		const fetchDocument = async (docId: string) => {
			try {
				const response = await databases.getDocument(
					process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
					process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
					docId,
				);

				setDocument(response);
				setContent(response.content);
				setTitle(response.title);
			} catch (error) {
				alert(error);
			}
		};

		if (docId) {
			fetchDocument(Array.isArray(docId) ? docId[0] : docId).catch((error) => {
				alert(error);
			});
		}
	}, [docId]);

	useEffect(() => {
		const intervalId = setInterval(async () => {
			await saveDocument();
		}, 60000);

		return () => clearInterval(intervalId);
	}, [content, title]);

	const saveDocument = async () => {
		if (!document) {
			alert("Document not found.");

			return;
		}

		setLoading(true);
		try {
			await databases.updateDocument(
				process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
				process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
				document.$id,
				{ content, title },
			);
		} catch (error) {
			alert("Failed to save document");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col h-screen">
			<div className="flex justify-between items-center p-4 border-b">
				<input
					className="text-2xl font-bold border-none outline-none flex-1"
					placeholder="Document Title"
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<Button
					color="primary"
					isLoading={loading}
					variant="flat"
					onClick={saveDocument}
				>
					Save
				</Button>
			</div>
			<div className="flex-1 overflow-hidden">
				<ReactQuill
					style={{ height: "100%", display: "flex", flexDirection: "column" }}
					value={content}
					onChange={setContent}
				/>
			</div>
		</div>
	);
};

export default DocumentEditorPage;
