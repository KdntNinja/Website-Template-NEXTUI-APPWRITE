import React from "react";

interface PrintContentProps {
	title: string;
	content: string;
	printRef: React.RefObject<HTMLDivElement>;
}

const PrintContent: React.FC<PrintContentProps> = ({
	title,
	content,
	printRef,
}) => {
	return (
		<div ref={printRef} className="hidden">
			<h1>{title}</h1>
			<div dangerouslySetInnerHTML={{ __html: content }} />
		</div>
	);
};

export default PrintContent;
