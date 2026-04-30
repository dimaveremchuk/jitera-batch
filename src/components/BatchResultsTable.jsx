import { useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Tooltip } from '@base-ui/react/tooltip'
import { CheckIcon, FailedIcon } from './BatchModal'

const tdStyle = { padding: '0 12px', borderBottom: '1px solid var(--color-border)' }

const btnStyle = {
	color: 'var(--color-text-primary)',
	borderRadius: 'var(--radius-sm)',
	fontSize: 'var(--text-sm)',
	fontWeight: 500,
	padding: '0 8px',
	height: '28px',
	cursor: 'default',
	border: '1px solid var(--color-border)',
	display: 'flex',
	alignItems: 'center',
	gap: '5px',
}

export default function BatchResultsTable({ rows, totalDocs, successCount, failedCount }) {
	const [copied, setCopied] = useState(false)
	const copyTimeoutRef = useRef(null)
	const reduce = useReducedMotion()

	function handleCopy() {
		setCopied(true)
		clearTimeout(copyTimeoutRef.current)
		copyTimeoutRef.current = setTimeout(() => setCopied(false), 1000)
	}

	return (
		<div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
			<div style={{
				flex: 1,
				overflowY: 'auto',
				scrollbarWidth: 'thin',
				scrollbarColor: 'var(--color-text-disabled) transparent',
				borderRadius: 'var(--radius-sm)',
				border: '1px solid var(--color-border)',
			}}>
				<table style={{ width: '100%', fontSize: 'var(--text-xs)', borderCollapse: 'collapse' }}>
					<thead>
						<tr>
							{['document_name', 'document_path', 'target_document_path'].map((col) => (
								<th
									key={col}
									style={{
										textAlign: 'left',
										fontWeight: 600,
										color: 'var(--color-text-secondary)',
										padding: '8px 12px',
										borderBottom: '1px solid var(--color-border)',
										position: 'sticky',
										top: 0,
										background: 'var(--color-surface-raised)',
										zIndex: 1,
									}}
								>
									{col}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map((row, i) => {
							const failed = row.status === 'failed'
							const bg = failed
								? 'var(--color-error-subtle)'
								: i % 2 === 0 ? 'white' : 'var(--color-bg)'
							const statusIcon = failed ? (
								<Tooltip.Provider>
									<Tooltip.Root delay={300} closeDelay={0}>
										<Tooltip.Trigger render={<span style={{ display: 'flex', color: 'var(--color-error)' }} />}>
											<FailedIcon />
										</Tooltip.Trigger>
										<Tooltip.Portal>
											<Tooltip.Positioner sideOffset={6} style={{ zIndex: 101 }}>
												<Tooltip.Popup className="tooltip-popup--error">{row.error}</Tooltip.Popup>
											</Tooltip.Positioner>
										</Tooltip.Portal>
									</Tooltip.Root>
								</Tooltip.Provider>
							) : (
								<span style={{ display: 'flex', color: 'var(--color-text-secondary)' }}>
									<CheckIcon />
								</span>
							)

							return (
								<tr key={i} style={{ background: bg, height: '28px' }}>
									<td style={tdStyle}>
										<span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
											{statusIcon}
											{row.name}
										</span>
									</td>
									<td style={tdStyle}>{row.path}</td>
									<td style={failed ? tdStyle : { ...tdStyle, color: 'var(--color-link)', textDecoration: 'underline', cursor: 'pointer' }}>
										{row.targetPath}
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>

			<div style={{ paddingTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
				<motion.button
					layout
					className="btn-secondary"
					style={{ ...btnStyle, overflow: 'hidden' }}
					transition={{ duration: 0.15, layout: { duration: 0.2, ease: [0.165, 0.84, 0.44, 1] } }}
					onClick={handleCopy}
				>
					<AnimatePresence mode="wait">
						{copied ? (
							<motion.span
								key="check"
								initial={reduce ? false : { opacity: 0, filter: 'blur(4px)' }}
								animate={{ opacity: 1, filter: 'blur(0px)' }}
								exit={{ opacity: 0, filter: 'blur(4px)' }}
								transition={{ duration: 0.15 }}
								style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
							>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M4 8 L7 11 L12.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</motion.span>
						) : (
							<motion.span
								key="copy"
								initial={reduce ? false : { opacity: 0, filter: 'blur(4px)' }}
								animate={{ opacity: 1, filter: 'blur(0px)' }}
								exit={{ opacity: 0, filter: 'blur(4px)' }}
								transition={{ duration: 0.15 }}
								style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
							>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M9 5.25C9.9665 5.25 10.75 6.0335 10.75 7V13C10.75 13.9665 9.9665 14.75 9 14.75H3C2.0335 14.75 1.25 13.9665 1.25 13V7C1.25 6.0335 2.0335 5.25 3 5.25H9ZM3 6.75C2.86193 6.75 2.75 6.86193 2.75 7V13C2.75 13.1381 2.86193 13.25 3 13.25H9C9.13807 13.25 9.25 13.1381 9.25 13V7C9.25 6.86193 9.13807 6.75 9 6.75H3ZM13 1.25C13.9665 1.25 14.75 2.0335 14.75 3V9C14.75 9.9665 13.9665 10.75 13 10.75H12.5C12.0858 10.75 11.75 10.4142 11.75 10C11.75 9.58579 12.0858 9.25 12.5 9.25H13C13.1381 9.25 13.25 9.13807 13.25 9V3C13.25 2.86193 13.1381 2.75 13 2.75H7C6.86193 2.75 6.75 2.86193 6.75 3V3.5C6.75 3.91421 6.41421 4.25 6 4.25C5.58579 4.25 5.25 3.91421 5.25 3.5V3C5.25 2.0335 6.0335 1.25 7 1.25H13Z" fill="currentColor"/>
								</svg>
							</motion.span>
						)}
					</AnimatePresence>
					<span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
						<span style={{ opacity: 0, pointerEvents: 'none', whiteSpace: 'nowrap', userSelect: 'none' }}>
							{copied ? 'Copied' : 'Copy as CSV'}
						</span>
						<motion.span
							style={{ position: 'absolute', left: 0, whiteSpace: 'nowrap' }}
							animate={{ opacity: copied ? 0 : 1, filter: copied ? 'blur(4px)' : 'blur(0px)' }}
							transition={{ duration: 0.15 }}
						>
							Copy as CSV
						</motion.span>
						<motion.span
							style={{ position: 'absolute', left: 0, whiteSpace: 'nowrap' }}
							animate={{ opacity: copied ? 1 : 0, filter: copied ? 'blur(0px)' : 'blur(4px)' }}
							transition={{ duration: 0.15 }}
						>
							Copied
						</motion.span>
					</span>
				</motion.button>
			</div>
		</div>
	)
}
