import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Tooltip } from '@base-ui/react/tooltip'
import { Menu } from '@base-ui/react/menu'

const card = {
	width: '744px',
	minHeight: '116px',
	maxHeight: '554px',
	background: 'var(--color-surface-raised)',
	borderRadius: 'var(--radius-xl)',
	boxShadow: 'var(--shadow-sm)',
	display: 'flex',
	flexDirection: 'column',
	overflow: 'hidden',
	border: '1px solid var(--color-border)',
}

const textarea = {
	minHeight: '64px',
	padding: '16px 16px 8px',
	resize: 'none',
	fontSize: 'var(--text-base)',
	color: 'var(--color-text-primary)',
	background: 'transparent',
	lineHeight: '1.5',
	fieldSizing: 'content',
	overflowY: 'auto',
	scrollbarWidth: 'thin',
	scrollbarColor: 'var(--color-text-disabled) transparent',
}

const bottomBar = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	padding: '8px 12px 12px 12px',
}

const leftGroup = {
	display: 'flex',
	alignItems: 'center',
	gap: '4px',
}

const iconBtn = {
	width: '28px',
	height: '28px',
	borderRadius: 'var(--radius-sm)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
}

const batchBtn = {
	display: 'flex',
	height: '28px',
	alignItems: 'center',
	gap: '6px',
	fontSize: 'var(--text-sm)',
	color: 'var(--color-text-primary)',
	padding: '6px 8px',
	borderRadius: 'var(--radius-sm)',
	background: 'var(--color-hover)',
	flexShrink: 0,
	position: 'relative',
}

const modelBtn = {
	display: 'flex',
	height: '28px',
	alignItems: 'center',
	gap: '4px',
	fontSize: 'var(--text-sm)',
	color: 'var(--color-text-primary)',
	padding: '6px 8px',
	borderRadius: 'var(--radius-sm)',
}

const sendBtn = {
	...iconBtn,
}

const rightGroup = {
	display: 'flex',
	alignItems: 'center',
	gap: '12px',
}

export default function ChatInput({ onSubmit, batchModeActive = false, onBatchModeChange }) {
	const [value, setValue] = useState('')

	function handleSend() {
		if (value.trim()) {
			onSubmit?.(value)
			setValue('')
		}
	}

	return (
		<Tooltip.Provider>
			<div style={card}>
				<textarea
					placeholder="Ask anything..."
					style={textarea}
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<div style={bottomBar}>
					<div style={leftGroup}>
						<Menu.Root>
							<Menu.Trigger render={<button style={iconBtn} className="btn-ghost" aria-label="Add files or tools" />}>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M8 2.75C8.41421 2.75 8.75 3.08579 8.75 3.5V7.25H12.5C12.9142 7.25 13.25 7.58579 13.25 8C13.2499 8.41416 12.9142 8.75 12.5 8.75H8.75V12.5C8.75 12.9142 8.41421 13.25 8 13.25C7.58581 13.25 7.25 12.9142 7.25 12.5V8.75H3.5C3.08588 8.74994 2.75006 8.41412 2.75 8C2.75 7.58583 3.08584 7.25006 3.5 7.25H7.25V3.5C7.25 3.0858 7.58581 2.75003 8 2.75Z" fill="black"/>
								</svg>
							</Menu.Trigger>
							<Menu.Portal>
								<Menu.Positioner side="bottom" align="start" sideOffset={8}>
									<Menu.Popup className="menu-popup">
										<Tooltip.Root>
											<Tooltip.Trigger render={<Menu.Item className="menu-item" onClick={() => {}} />}>
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M11 1.75C11.9663 1.75007 12.7498 2.53376 12.75 3.5V6.5C12.7498 6.91396 12.414 7.24993 12 7.25C11.586 7.24993 11.2502 6.91396 11.25 6.5V3.5C11.2498 3.36218 11.1379 3.25007 11 3.25H4.5C4.36208 3.25 4.25025 3.36214 4.25 3.5V12.5C4.25 12.6381 4.36193 12.75 4.5 12.75H7C7.414 12.7501 7.74975 13.086 7.75 13.5C7.75 13.9142 7.41415 14.2499 7 14.25H4.5C3.5335 14.25 2.75 13.4665 2.75 12.5V3.5C2.75025 2.53371 3.53365 1.75 4.5 1.75H11ZM12 8.75C12.4142 8.75002 12.75 9.08582 12.75 9.5V10.75H14C14.4142 10.75 14.75 11.0858 14.75 11.5C14.75 11.9142 14.4142 12.25 14 12.25H12.75V13.5C12.75 13.9142 12.4142 14.25 12 14.25C11.5858 14.25 11.25 13.9142 11.25 13.5V12.25H10C9.58582 12.25 9.25002 11.9142 9.25 11.5C9.25002 11.0858 9.58582 10.75 10 10.75H11.25V9.5C11.25 9.08582 11.5858 8.75002 12 8.75ZM7.5 7.25C7.9142 7.25 8.24998 7.58581 8.25 8C8.25 8.41421 7.91421 8.75 7.5 8.75H6C5.58581 8.74998 5.25 8.4142 5.25 8C5.25002 7.58582 5.58582 7.25002 6 7.25H7.5ZM9.5 4.75C9.9142 4.75 10.25 5.08581 10.25 5.5C10.25 5.91421 9.91421 6.25 9.5 6.25H6C5.58581 6.24998 5.25 5.9142 5.25 5.5C5.25002 5.08582 5.58582 4.75002 6 4.75H9.5Z" fill="currentColor"/>
												</svg>
												Attach document
											</Tooltip.Trigger>
											<Tooltip.Portal>
												<Tooltip.Positioner side="right" sideOffset={8}>
													<Tooltip.Popup className="tooltip-popup" style={{ maxWidth: 220, whiteSpace: 'normal' }}>Add a file from your workspace to include in the conversation</Tooltip.Popup>
												</Tooltip.Positioner>
											</Tooltip.Portal>
										</Tooltip.Root>
										<Tooltip.Root>
											<Tooltip.Trigger render={<Menu.Item className="menu-item" onClick={() => onBatchModeChange(true)} />}>
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M1.27686 4.75098C1.68702 4.69333 2.06684 4.9795 2.12451 5.38965L3.09814 12.3213C3.11735 12.4579 3.24375 12.5532 3.38037 12.5342L10.313 11.5605C10.7229 11.5031 11.1019 11.7883 11.1597 12.1982C11.2173 12.6084 10.9312 12.9883 10.521 13.0459L3.58936 14.0195C2.63228 14.154 1.7473 13.4874 1.61279 12.5303L0.63916 5.59863C0.581518 5.18849 0.86673 4.80867 1.27686 4.75098ZM13.5005 2C14.3287 2.00023 15.0005 2.67172 15.0005 3.5V9.5L14.9927 9.65332C14.921 10.3592 14.3596 10.9203 13.6538 10.9922L13.5005 11H5.50049L5.34717 10.9922C4.64119 10.9205 4.08 10.3593 4.0083 9.65332L4.00049 9.5V3.5C4.00049 2.67157 4.67206 2 5.50049 2H13.5005ZM5.50049 9.5H13.5005V3.5H5.50049V9.5ZM9.50049 7.25C9.91451 7.25023 10.2505 7.58593 10.2505 8C10.2505 8.41407 9.91451 8.74977 9.50049 8.75H7.50049C7.08627 8.75 6.75049 8.41421 6.75049 8C6.75049 7.58579 7.08627 7.25 7.50049 7.25H9.50049ZM11.5005 4.75C11.9145 4.75023 12.2505 5.08593 12.2505 5.5C12.2505 5.91407 11.9145 6.24977 11.5005 6.25H7.50049C7.08627 6.25 6.75049 5.91421 6.75049 5.5C6.75049 5.08579 7.08627 4.75 7.50049 4.75H11.5005Z" fill="currentColor"/>
												</svg>
												Batch mode
											</Tooltip.Trigger>
											<Tooltip.Portal>
												<Tooltip.Positioner side="right" sideOffset={8}>
													<Tooltip.Popup className="tooltip-popup" style={{ maxWidth: 220, whiteSpace: 'normal' }}>Run the same prompt across multiple documents at once</Tooltip.Popup>
												</Tooltip.Positioner>
											</Tooltip.Portal>
										</Tooltip.Root>
									</Menu.Popup>
								</Menu.Positioner>
							</Menu.Portal>
						</Menu.Root>

						<AnimatePresence>
							{batchModeActive && (
								<motion.button
									key="batch-btn"
									className="batch-btn"
									style={batchBtn}
									onClick={() => onBatchModeChange(false)}
									aria-label="Exit batch mode"
									initial={{ opacity: 0, scale: 0.85 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.85 }}
									transition={{ duration: 0.15, ease: [0.165, 0.84, 0.44, 1] }}
								>
									<div style={{ position: 'relative', width: 16, height: 16, flexShrink: 0, color: 'var(--color-text-secondary)' }}>
										<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="batch-btn-icon-default">
											<path d="M1.27686 4.75098C1.68702 4.69333 2.06684 4.9795 2.12451 5.38965L3.09814 12.3213C3.11735 12.4579 3.24375 12.5532 3.38037 12.5342L10.313 11.5605C10.7229 11.5031 11.1019 11.7883 11.1597 12.1982C11.2173 12.6084 10.9312 12.9883 10.521 13.0459L3.58936 14.0195C2.63228 14.154 1.7473 13.4874 1.61279 12.5303L0.63916 5.59863C0.581518 5.18849 0.86673 4.80867 1.27686 4.75098ZM13.5005 2C14.3287 2.00023 15.0005 2.67172 15.0005 3.5V9.5L14.9927 9.65332C14.921 10.3592 14.3596 10.9203 13.6538 10.9922L13.5005 11H5.50049L5.34717 10.9922C4.64119 10.9205 4.08 10.3593 4.0083 9.65332L4.00049 9.5V3.5C4.00049 2.67157 4.67206 2 5.50049 2H13.5005ZM5.50049 9.5H13.5005V3.5H5.50049V9.5ZM9.50049 7.25C9.91451 7.25023 10.2505 7.58593 10.2505 8C10.2505 8.41407 9.91451 8.74977 9.50049 8.75H7.50049C7.08627 8.75 6.75049 8.41421 6.75049 8C6.75049 7.58579 7.08627 7.25 7.50049 7.25H9.50049ZM11.5005 4.75C11.9145 4.75023 12.2505 5.08593 12.2505 5.5C12.2505 5.91407 11.9145 6.24977 11.5005 6.25H7.50049C7.08627 6.25 6.75049 5.91421 6.75049 5.5C6.75049 5.08579 7.08627 4.75 7.50049 4.75H11.5005Z" fill="currentColor"/>
										</svg>
										<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="batch-btn-icon-close" style={{ position: 'absolute', top: 0, left: 0 }}>
											<path d="M10.6513 4.28803C10.9442 3.99514 11.419 3.99514 11.7119 4.28803C12.0048 4.58092 12.0048 5.05568 11.7119 5.34858L9.06049 7.99994L11.7119 10.6513C12.0048 10.9442 12.0048 11.419 11.7119 11.7119C11.419 12.0048 10.9442 12.0048 10.6513 11.7119L7.99994 9.06049L5.34858 11.7119C5.05568 12.0048 4.58092 12.0048 4.28803 11.7119C3.99514 11.419 3.99514 10.9442 4.28803 10.6513L6.9394 7.99994L4.28803 5.34858C3.99514 5.05568 3.99514 4.58092 4.28803 4.28803C4.58092 3.99514 5.05568 3.99514 5.34858 4.28803L7.99994 6.9394L10.6513 4.28803Z" fill="currentColor"/>
										</svg>
									</div>
									Batch mode
								</motion.button>
							)}
						</AnimatePresence>
					</div>

					<div style={rightGroup}>
						<button style={modelBtn} className="btn-ghost">
							Model
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M11.9702 5.96973C12.2631 5.67686 12.7379 5.67684 13.0308 5.96973C13.3234 6.26263 13.3235 6.73747 13.0308 7.03027L8.53076 11.5303C8.23796 11.8231 7.76313 11.8229 7.47021 11.5303L2.97021 7.03027C2.67732 6.73738 2.67732 6.26262 2.97021 5.96973C3.26311 5.67686 3.73788 5.67684 4.03076 5.96973L8.00049 9.93945L11.9702 5.96973Z" fill="black"/>
							</svg>
						</button>
						<Tooltip.Root>
							<Tooltip.Trigger render={<button style={sendBtn} className="btn-send" onClick={handleSend} />}>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M8.02533 2.25098C8.03218 2.25121 8.039 2.25153 8.04584 2.25195C8.0845 2.25429 8.12227 2.2596 8.15912 2.26758C8.1924 2.2748 8.22455 2.28607 8.25678 2.29785C8.26926 2.30242 8.2827 2.30437 8.29487 2.30957C8.31395 2.31772 8.33106 2.33004 8.34955 2.33984C8.37335 2.35248 8.39767 2.36387 8.41987 2.37891C8.45869 2.40523 8.49583 2.43534 8.53022 2.46973L12.5302 6.46973C12.8231 6.76261 12.8231 7.23739 12.5302 7.53027C12.2373 7.82316 11.7626 7.82314 11.4697 7.53027L8.74994 4.81055V13C8.74994 13.4142 8.41413 13.75 7.99994 13.75C7.58573 13.75 7.24994 13.4142 7.24994 13V4.81055L4.53022 7.53027C4.23733 7.82316 3.76257 7.82314 3.46967 7.53027C3.17678 7.23738 3.17678 6.76262 3.46967 6.46973L7.46967 2.46973L7.52631 2.41797C7.53651 2.40965 7.54802 2.40321 7.55854 2.39551C7.57408 2.38414 7.58998 2.37345 7.60639 2.36328C7.63029 2.34849 7.65456 2.3351 7.67963 2.32324C7.69781 2.31463 7.71635 2.30697 7.73529 2.2998C7.76287 2.28942 7.79088 2.28144 7.81928 2.27441C7.83934 2.26944 7.85916 2.26309 7.87983 2.25977C7.89088 2.25799 7.90192 2.25616 7.91303 2.25488C7.94152 2.2516 7.97057 2.25 7.99994 2.25C8.00845 2.25 8.0169 2.2507 8.02533 2.25098Z" fill="white"/>
								</svg>
							</Tooltip.Trigger>
							<Tooltip.Portal>
								<Tooltip.Positioner sideOffset={4}>
									<Tooltip.Popup className="tooltip-popup">Submit</Tooltip.Popup>
								</Tooltip.Positioner>
							</Tooltip.Portal>
						</Tooltip.Root>
					</div>
				</div>
			</div>
		</Tooltip.Provider>
	)
}
