"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import dynamic from "next/dynamic";

import { databases } from "@/config/appwrite";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import "react-quill/dist/quill.snow.css";

const modules = {
	toolbar: [
		[{ font: [] }, { size: [] }],
		["bold", "italic", "underline", "strike"],
		[
			{ list: "ordered" },
			{ list: "bullet" },
			{ indent: "-1" },
			{ indent: "+1" },
		],
		[{ color: [] }, { background: [] }],
		[{ align: [] }],
		["link", "image", "video"],
		["clean"],
	],
};

const formats = [
	"font",
	"size",
	"header",
	"bold",
	"italic",
	"underline",
	"strike",
	"list",
	"bullet",
	"indent",
	"color",
	"background",
	"align",
	"link",
	"image",
	"video",
];

const DocumentEditorPage = () => {
	const [loading, setLoading] = useState(false);
	const [document, setDocument] = useState<any>(null);
	const [content, setContent] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const { docId } = useParams();
	const router = useRouter();
	const printRef = useRef<HTMLDivElement>(null);

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

	const deleteDocument = async () => {
		if (!document) {
			alert("Document not found.");

			return;
		}

		setLoading(true);
		try {
			await databases.deleteDocument(
				process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
				process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
				document.$id,
			);
			router.push("/dashboard");
		} catch (error) {
			alert("Failed to delete document");
		} finally {
			setLoading(false);
		}
	};

	const handleKeyDown = async (event: KeyboardEvent) => {
		if (event.ctrlKey && event.key === "s") {
			event.preventDefault();
			await saveDocument();
		} else if (event.ctrlKey && event.key === "p") {
			event.preventDefault();
			if (printRef.current) {
				const printContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>${title}</title>
     <style>
      @page {
       size: auto;
       margin: 0;
      }
      body {
       font-family: Arial, sans-serif;
       margin: 20px;
      }
      h1 {
       text-align: center;
       margin-bottom: 20px;
      }
      .content {
       border: 1px solid #ccc;
       padding: 20px;
      }
     </style>
    </head>
    <body>
     <div class="content">${printRef.current.innerHTML}</div>
    </body>
    </html>
   `;

				const printWindow = window.open("", "", "width=800,height=600");

				if (printWindow) {
					printWindow.document.write(printContent);
					printWindow.document.close();
					printWindow.onafterprint = () => printWindow.close();
					printWindow.print();
				}
			}
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [document, content, title]);

	return (
		<div className="flex flex-col h-screen p-4">
			<Card className="flex flex-col h-full">
				<CardHeader className="flex justify-between items-center p-4 border-b">
					<Input
						fullWidth
						className="text-2xl font-bold border-none outline-none flex-1"
						placeholder="Document Title"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<div className="flex space-x-2">
						<Button
							color="primary"
							isLoading={loading}
							variant="flat"
							onClick={saveDocument}
						>
							Save
						</Button>
						<Button
							color="danger"
							isLoading={loading}
							variant="flat"
							onClick={deleteDocument}
						>
							Delete
						</Button>
					</div>
				</CardHeader>
				<CardBody
					className="flex-1 overflow-hidden p-4"
					style={{ height: "calc(100vh - 100px)" }}
				>
					<ReactQuill
						formats={formats}
						modules={modules}
						style={{ height: "100%", display: "flex", flexDirection: "column" }}
						value={content}
						onChange={setContent}
					/>
					<div ref={printRef} className="hidden">
						<div dangerouslySetInnerHTML={{ __html: content }} />
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default DocumentEditorPage;
