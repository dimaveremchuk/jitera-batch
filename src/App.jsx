import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import ChatInput from './components/ChatInput'
import BatchModal, { FailedIcon } from './components/BatchModal'
import BatchWidget from './components/BatchWidget'
import ChatWidget from './components/ChatWidget'

function AnimatedDots() {
	const [count, setCount] = useState(1)
	useEffect(() => {
		const id = setInterval(() => setCount(c => c === 3 ? 1 : c + 1), 400)
		return () => clearInterval(id)
	}, [])
	return '.'.repeat(count)
}

export default function App() {
	const [chatPhase, setChatPhase] = useState('empty')
	const [userMessage, setUserMessage] = useState('')
	const [agentMessage, setAgentMessage] = useState('')

	// Lifted batch state
	const [batchModeActive, setBatchModeActive] = useState(false)
	const [executionPhase, setExecutionPhase] = useState('idle')
	const [completedCount, setCompletedCount] = useState(0)
	const [totalDocs, setTotalDocs] = useState(200)
	const [currentDocName, setCurrentDocName] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [chatWidget, setChatWidget] = useState(null)
	const [chatWidgetExpanded, setChatWidgetExpanded] = useState(false)

	const batchActionsRef = useRef(null)
	const pendingChatWidgetRef = useRef(null)

	function handleSubmit(value) {
		setUserMessage(value)
		setChatPhase('thinking')
		setAgentMessage('Thinking...')
		setTimeout(() => {
			setAgentMessage('Found 200 documents in /spec. Preparing batch translation...')
		}, 4000)
		setTimeout(() => {
			setChatPhase('modal')
			setIsModalOpen(true)
			setBatchModeActive(true)
		}, 8000)
	}

	function handleBatchDone(data) {
		if (!isModalOpen) {
			setChatWidget(data)
		} else {
			pendingChatWidgetRef.current = data
		}
	}

	function handleModalClose() {
		if (executionPhase === 'done') {
			setChatWidget(pendingChatWidgetRef.current)
		}
		setIsModalOpen(false)
	}

	const showWidget = chatPhase === 'modal' && !isModalOpen && !chatWidget

	return (
		<LayoutGroup>
		<div className="min-h-screen bg-bg p-2 flex">
			<div className="flex-1 bg-surface rounded-sm border border-border flex flex-col overflow-hidden">

				{/* Top spacer: pushes title+input group to vertical center when empty */}
				{chatPhase === 'empty' && <div style={{ flex: 1 }} />}

				{/* Title */}
				<AnimatePresence>
					{chatPhase === 'empty' && (
						<motion.div
							key="title"
							exit={{ opacity: 0, transition: { duration: 0.15 } }}
							style={{ display: 'flex', justifyContent: 'center' }}
						>
							<h1 className="text-xxl text-text-primary tracking-tight">
								What do you want to work on today?
							</h1>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Gap between title and input */}
				{chatPhase === 'empty' && <div style={{ height: 48 }} />}

				{/* Chat messages */}
				<AnimatePresence>
					{chatPhase !== 'empty' && (
						<motion.div
							key="messages"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 24px 0' }}
						>
							<div style={{ width: '744px', display: 'flex', flexDirection: 'column', gap: 12 }}>
								<motion.div
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2 }}
									style={{
										alignSelf: 'flex-end',
										background: 'var(--color-bg)',
										borderRadius: 'var(--radius-xl)',
										padding: '16px 20px',
										maxWidth: 580,
										fontSize: 'var(--text-md)',
									}}
								>
									{userMessage}
								</motion.div>

								<AnimatePresence mode="wait">
									<motion.div
										key={agentMessage}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}
										style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-md)' }}
									>
										{agentMessage === 'Thinking...'
											? <>Thinking<AnimatedDots /></>
											: agentMessage}
									</motion.div>
								</AnimatePresence>

								<AnimatePresence>
									{chatWidget && (
										<motion.div
											key="completion-msg"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.2 }}
											style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-md)' }}
										>
											Done. Translated {chatWidget.successCount} out of {chatWidget.totalDocs} documents to Japanese. {chatWidget.failedCount} couldn't be processed — hover the <span style={{ display: 'inline-flex', verticalAlign: 'middle', color: 'var(--color-error)', margin: '0 1px' }}><FailedIcon /></span> icon on any failed row for details.
										</motion.div>
									)}
								</AnimatePresence>

								{chatWidget && (
									<ChatWidget
										successCount={chatWidget.successCount}
										failedCount={chatWidget.failedCount}
										totalDocs={chatWidget.totalDocs}
										rows={chatWidget.rows}
										expanded={chatWidgetExpanded}
										onExpand={() => setChatWidgetExpanded(true)}
										onCollapse={() => setChatWidgetExpanded(false)}
									/>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Widget above input */}
				<AnimatePresence>
					{showWidget && (
						<motion.div
							key="batch-widget"
							initial={{ opacity: 0, y: 6, scale: 0.98 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 6, scale: 0.98 }}
							transition={{ duration: 0.2, ease: [0.165, 0.84, 0.44, 1] }}
							style={{ display: 'flex', justifyContent: 'center', paddingBottom: 8 }}
						>
							<BatchWidget
								executionPhase={executionPhase}
								completedCount={completedCount}
								totalDocs={totalDocs}
								currentDocName={currentDocName}
								onToggleExecution={() => batchActionsRef.current?.toggle()}
								onExpand={() => { if (!chatWidget) setIsModalOpen(true) }}
							/>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Input: single instance, layout prop animates position */}
				<motion.div
					layout
					transition={{
						duration: 0.35,
						ease: [0.4, 0, 0.2, 1],
						layout: { duration: chatPhase === 'modal' ? 0 : 0.35, ease: [0.4, 0, 0.2, 1] },
					}}
					style={{
						display: 'flex',
						justifyContent: 'center',
						...(chatPhase !== 'empty' && {
							paddingTop: showWidget ? 0 : 48,
							paddingBottom: 24,
							background: 'linear-gradient(to bottom, transparent, var(--color-bg))',
						}),
					}}
				>
					<ChatInput onSubmit={handleSubmit} batchModeActive={batchModeActive} onBatchModeChange={setBatchModeActive} />
				</motion.div>

				{/* Bottom spacer: mirrors top spacer to complete vertical centering */}
				{chatPhase === 'empty' && <div style={{ flex: 1 }} />}
			</div>

			<AnimatePresence>
				{chatPhase === 'modal' && !chatWidget && (
					<BatchModal
						onClose={handleModalClose}
						executionPhase={executionPhase}
						setExecutionPhase={setExecutionPhase}
						completedCount={completedCount}
						setCompletedCount={setCompletedCount}
						totalDocs={totalDocs}
						setTotalDocs={setTotalDocs}
						onDocumentChange={setCurrentDocName}
						batchActionsRef={batchActionsRef}
						isModalOpen={isModalOpen}
						onBatchDone={handleBatchDone}
					/>
				)}
			</AnimatePresence>
		</div>
		</LayoutGroup>
	)
}
