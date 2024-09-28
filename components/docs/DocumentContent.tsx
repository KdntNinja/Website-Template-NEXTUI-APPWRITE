import React from "react";
import dynamic from "next/dynamic";

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

interface DocumentContentProps {
	content: string;
	setContent: (content: string) => void;
	printRef: React.RefObject<HTMLDivElement>;
	title: string;
}

const DocumentContent: React.FC<DocumentContentProps> = ({
	content,
	setContent,
	printRef,
	title,
}) => {
	return (
		<div className="flex-1 overflow-hidden p-4">
			<ReactQuill
				formats={formats}
				modules={modules}
				style={{ height: "100%", display: "flex", flexDirection: "column" }}
				value={content}
				onChange={setContent}
			/>
			<div ref={printRef} className="hidden">
				<h1>{title}</h1>
				<div dangerouslySetInnerHTML={{ __html: content }} />
			</div>
		</div>
	);
};

export default DocumentContent;
