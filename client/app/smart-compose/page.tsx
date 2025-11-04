"use client";
import { useRef, useState } from "react";
import { debounce } from "lodash";

export default function SmartCompose() {
	const textarea = useRef<HTMLTextAreaElement>(null);
	const [cursorPosition, setCursorPosition] = useState(0);
	const [currentSuggestion, setCurrentSuggestion] = useState("");

	const debouncedOnChange = debounce(
		async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const text = e.target.value;
			const cursorPos = e.target.selectionStart;
			setCursorPosition(cursorPos);

			try {
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
				if (cursorPos === text.length) {
					setCurrentSuggestion(suggestion);
				} else {
					setCurrentSuggestion("");
				}
			} catch (error) {
				console.error("Error fetching completion:", error);
				setCurrentSuggestion("");
			}
		},
		500
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
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
			<div className='max-w-4xl w-full bg-white rounded-lg shadow-lg p-8'>
				<h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>
					AI Text Autocomplete Demo
				</h1>
				<p className='text-gray-600 mb-6 text-center'>
					Start typing and see AI-powered suggestions appear. Press Tab to
					accept the suggestion.
				</p>
				<div className='relative'>
					<textarea
						name='text'
						id='text'
						onChange={(e) => {
							setCurrentSuggestion("");
							debouncedOnChange(e);
						}}
						ref={textarea}
						onKeyDown={tabAutoComplete}
						className='w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-lg leading-relaxed'
						placeholder='Start typing here...'
					></textarea>
					{currentSuggestion && (
						<div className='absolute top-4 left-4 right-4 bottom-4 pointer-events-none text-gray-400 font-mono text-lg leading-relaxed overflow-hidden'>
							<span className='invisible'>{textarea.current?.value}</span>
							<span className='text-gray-400'>{currentSuggestion}</span>
						</div>
					)}
				</div>
				<div className='mt-4 flex justify-between items-center text-sm text-gray-500'>
					<div>Cursor position: {cursorPosition}</div>
					<div className='text-right'>
						{currentSuggestion ? (
							<span className='text-blue-600 font-medium'>
								Suggestion available: Press Tab to accept
							</span>
						) : (
							<span>Generating suggestion...</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
