import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import ChatInput from './components/ChatInput'
import BatchModal from './components/BatchModal'

export default function App() {
	const [modalOpen, setModalOpen] = useState(false)

	return (
		<div className="min-h-screen bg-bg p-2 flex">
			<div className="flex-1 bg-surface rounded-sm border border-border flex flex-col items-center justify-center gap-[48px]">
				<h1 className="text-xxl text-text-primary tracking-tight">
					What do you want to work on today?
				</h1>
				<ChatInput onSubmit={() => setModalOpen(true)} />
			</div>
			<AnimatePresence>
				{modalOpen && <BatchModal onClose={() => setModalOpen(false)} />}
			</AnimatePresence>
		</div>
	)
}
