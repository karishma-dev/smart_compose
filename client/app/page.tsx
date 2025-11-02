"use client";
import { useRef, useState } from "react";
import { debounce } from "lodash";

export default function Home() {
	const textarea = useRef<HTMLTextAreaElement>(null);
	const [cursorPosition, setCursorPosition] = useState(0);
	const [currentSuggestion, setCurrentSuggestion] = useState("");

	const debouncedOnChange = debounce(
		async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const text = e.target.value;
			const cursorPos = e.target.selectionStart;
			setCursorPosition(cursorPos);

			const response = await fetch("http://127.0.0.1:8000/complete", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text: text,
				}),
			});

			const data = await response.json();
			const suggestion = data.completion;
			setCurrentSuggestion(suggestion);
		},
		300
	);

	const tabAutoComplete = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Tab") {
			e.preventDefault();
			if (textarea.current) {
				const start = textarea.current.selectionStart;
				const end = textarea.current.selectionEnd;
				const text = textarea.current.value;
				const newText =
					text.slice(0, start) + currentSuggestion + text.slice(end);
				textarea.current.value = newText;
				const newCursorPos = start + currentSuggestion.length;
				textarea.current.selectionStart = newCursorPos;
				textarea.current.selectionEnd = newCursorPos;
				setCurrentSuggestion("");
			}
		}
	};

	return (
		<div className='flex min-h-screen items-center justify-center flex-col'>
			<textarea
				name='text'
				id='text'
				onChange={(e) => debouncedOnChange(e)}
				ref={textarea}
				onKeyDown={tabAutoComplete}
			></textarea>

			<div>Cursor position: {cursorPosition}</div>
			<br />
			<div>Suggestion: {currentSuggestion}</div>
		</div>
	);
}
