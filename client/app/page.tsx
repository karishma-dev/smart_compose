import Link from "next/link";

export default function Home() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
			<div className='max-w-2xl w-full bg-white rounded-lg shadow-lg p-8'>
				<h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>
					AI Tools Playground
				</h1>
				<p className='text-gray-600 mb-6 text-center'>
					Explore different Generative AI tools. Each page is a different demo!
				</p>
				<ul className='space-y-4'>
					<li>
						<Link href='/smart-compose'>
							<span className='block px-4 py-3 bg-blue-100 rounded hover:bg-blue-200 text-blue-700 font-semibold cursor-pointer text-center'>
								Smart Compose (Text Autocomplete)
							</span>
						</Link>
					</li>
					<li>
						<Link href='/text-summarizer'>
							<span className='block px-4 py-3 bg-indigo-100 rounded hover:bg-indigo-200 text-indigo-700 font-semibold cursor-pointer text-center'>
								Text Summarizer
							</span>
						</Link>
					</li>
					{/* Add more tools here as you build them */}
				</ul>
			</div>
		</div>
	);
}
