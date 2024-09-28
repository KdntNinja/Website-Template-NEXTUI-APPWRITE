import React from "react";
import { Input } from "@nextui-org/react";

interface DocumentTitleInputProps {
	title: string;
	setTitle: (title: string) => void;
}

const DocumentTitleInput: React.FC<DocumentTitleInputProps> = ({
	title,
	setTitle,
}) => {
	return (
		<div className="flex justify-between items-center p-4 border-b">
			<Input
				fullWidth
				className="text-2xl font-bold border-none outline-none flex-1"
				placeholder="Document Title"
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
		</div>
	);
};

export default DocumentTitleInput;
