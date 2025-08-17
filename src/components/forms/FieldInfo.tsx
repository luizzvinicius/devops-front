import type { AnyFieldMeta } from "@tanstack/react-form";

export function FieldInfo({ fieldMeta }: { fieldMeta: AnyFieldMeta }) {
	if (fieldMeta.errors.length === 0) return "";

	return (
		<div>
			{fieldMeta.isTouched && (
				<span className="text-sm text-red-500">
					{fieldMeta.errors.reduce((acc, i) => `${acc}  ${i.message}`, "")}
				</span>
			)}
		</div>
	);
}
