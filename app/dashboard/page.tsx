"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { Modal, ModalBody, ModalHeader } from "@nextui-org/modal";

import { databases, account } from "@/config/appwrite";

const DashboardPage = () => {
	const [documents, setDocuments] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [isVerified, setIsVerified] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchDocuments = async () => {
			try {
				const response = await databases.listDocuments(
					process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
					process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
				);

				setDocuments(response.documents);
			} catch (error) {
			} finally {
				setLoading(false);
			}
		};

		const checkVerification = async () => {
			try {
				const user = await account.get();

				setIsVerified(user.emailVerification);
			} catch (error) {
				console.error("Failed to fetch user data:", error);
			}
		};

		fetchDocuments();
		checkVerification();
	}, []);

	const handleCreateNewDoc = () => {
		if (isVerified) {
			router.push("/dashboard/doc/new");
		} else {
			setShowModal(true);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Dashboard</h1>
			<Button color="primary" variant="flat" onClick={handleCreateNewDoc}>
				Create New Document
			</Button>
			{loading ? (
				<div className="flex justify-center items-center mt-4">
					<Spinner size="lg" />
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
					{documents.map((doc) => (
						<Card key={doc.$id} className="shadow-lg">
							<CardHeader className="font-bold text-lg bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-t-lg">
								{doc.title}
							</CardHeader>
							<CardBody className="p-4">
								<p className="text-gray-700">{doc.description}</p>
								<Button
									className="mt-2"
									color="primary"
									variant="flat"
									onClick={() => router.push(`/dashboard/doc/${doc.$id}`)}
								>
									Open
								</Button>
							</CardBody>
						</Card>
					))}
				</div>
			)}
			<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
				<ModalHeader>Please Verify Your Email</ModalHeader>
				<ModalBody>
					<p>
						Please check your email to verify your account before creating a new
						document.
					</p>
				</ModalBody>
			</Modal>
		</div>
	);
};

export default DashboardPage;
