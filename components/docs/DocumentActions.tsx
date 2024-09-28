import React from "react";
import { Button } from "@nextui-org/react";

interface DocumentActionsProps {
	loading: boolean;
	saveDocument: () => void;
	deleteDocument: () => void;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
	loading,
	saveDocument,
	deleteDocument,
}) => {
	return (
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
	);
};

export default DocumentActions;
