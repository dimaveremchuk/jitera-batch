import { useState } from 'react'
import { Tooltip } from '@base-ui/react/tooltip'

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

const iconBtn = {
	width: '28px',
	height: '28px',
	borderRadius: 'var(--radius-sm)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
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

export default function ChatInput({ onSubmit }) {
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
					<Tooltip.Root>
						<Tooltip.Trigger render={<button style={iconBtn} className="btn-ghost" />}>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M8 2.75C8.41421 2.75 8.75 3.08579 8.75 3.5V7.25H12.5C12.9142 7.25 13.25 7.58579 13.25 8C13.2499 8.41416 12.9142 8.75 12.5 8.75H8.75V12.5C8.75 12.9142 8.41421 13.25 8 13.25C7.58581 13.25 7.25 12.9142 7.25 12.5V8.75H3.5C3.08588 8.74994 2.75006 8.41412 2.75 8C2.75 7.58583 3.08584 7.25006 3.5 7.25H7.25V3.5C7.25 3.0858 7.58581 2.75003 8 2.75Z" fill="black"/>
							</svg>
						</Tooltip.Trigger>
						<Tooltip.Portal>
							<Tooltip.Positioner sideOffset={4}>
								<Tooltip.Popup className="tooltip-popup">Add files or tools</Tooltip.Popup>
							</Tooltip.Positioner>
						</Tooltip.Portal>
					</Tooltip.Root>
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
