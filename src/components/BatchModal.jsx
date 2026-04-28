import { motion, useReducedMotion } from 'framer-motion'

const DOC_NAMES = [
	['API Reference', 'api-reference'],
	['Authentication', 'authentication'],
	['Deployment Guide', 'deployment-guide'],
	['Technical Architecture', 'technical-architecture'],
	['Configuration', 'configuration'],
	['Quick Start', 'quick-start'],
	['Integration Patterns', 'integration-patterns'],
	['Error Codes', 'error-codes'],
	['Business Requirements', 'business-requirements'],
	['Database Schema', 'database-schema'],
	['Security Guide', 'security-guide'],
	['Release Notes', 'release-notes'],
	['User Guide', 'user-guide'],
	['Admin Guide', 'admin-guide'],
	['Changelog', 'changelog'],
	['FAQ', 'faq'],
	['Troubleshooting', 'troubleshooting'],
	['Architecture Overview', 'architecture-overview'],
	['Data Models', 'data-models'],
	['API Changelog', 'api-changelog'],
]

const ROWS = Array.from({ length: 200 }, (_, i) => {
	const [name, slug] = DOC_NAMES[i % DOC_NAMES.length]
	return { name, path: `/spec/${slug}.md`, targetPath: `/spec/${slug}_ja.md` }
})

const PROMPT = `Translate document {{document_name}} in {{document_path}} to Japanese and create translated document in {{target_document_path}} by appending "_ja" to original document name.`

const EASING = 'cubic-bezier(0.165, 0.84, 0.44, 1)'

const backdrop = {
	position: 'fixed',
	inset: 0,
	backdropFilter: 'blur(10px)',
	WebkitBackdropFilter: 'blur(10px)',
	background: 'oklch(1 0 0 / 40%)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 100,
}

const panel = {
	width: '680px',
	maxHeight: '688px',
	borderRadius: 'var(--radius-xl)',
	boxShadow: 'var(--shadow-sm)',
	background: 'var(--color-surface-raised)',
	display: 'flex',
	flexDirection: 'column',
	overflow: 'hidden',
	position: 'relative',
	border: '1px solid var(--color-border)',
}

const header = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	padding: '16px 16px 20px 20px',
	flexShrink: 0,
}

const fieldSection = {
	padding: '0 20px 16px',
	flexShrink: 0,
}

const label = {
	display: 'block',
	fontSize: 'var(--text-sm)',
	color: 'var(--color-text-secondary)',
	marginBottom: '6px',
}

const textInput = {
	width: '100%',
	height: '36px',
	border: '1px solid var(--color-border)',
	borderRadius: 'var(--radius-sm)',
	padding: '0 12px',
	fontSize: 'var(--text-sm)',
	color: 'var(--color-text-primary)',
}

const promptTextarea = {
	width: '100%',
	minHeight: '80px',
	border: '1px solid var(--color-border)',
	borderRadius: 'var(--radius-sm)',
	padding: '10px 12px',
	fontSize: 'var(--text-sm)',
	color: 'var(--color-text-primary)',
	resize: 'none',
	lineHeight: '1.5',
}

const docsSection = {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	overflow: 'hidden',
	padding: '0 20px 0',
}

const docsHeader = {
	display: 'flex',
	alignItems: 'baseline',
	justifyContent: 'space-between',
	flexShrink: 0,
	marginBottom: '4px',
}

const filterInput = {
	width: '280px',
	fontSize: 'var(--text-sm)',
	color: 'var(--color-text-primary)',
	padding: '4px 0',
	flexShrink: 0,
	display: 'block',
}

const tableWrapper = {
	flex: 1,
	overflowY: 'auto',
	scrollbarWidth: 'thin',
	scrollbarColor: 'var(--color-text-disabled) transparent',
	marginTop: '8px',
	borderRadius: 'var(--radius-sm)',
	border: '1px solid var(--color-border)',
}

const footer = {
	padding: '20px',
	display: 'flex',
	justifyContent: 'flex-end',
	flexShrink: 0,
}

const executeBtn = {
	background: 'var(--color-black)',
	color: 'white',
	borderRadius: 'var(--radius-sm)',
	fontSize: 'var(--text-sm)',
	fontWeight: 500,
	padding: '0 8px',
	height: '28px',
	cursor: 'default',
}

export default function BatchModal({ onClose }) {
	const reduce = useReducedMotion()

	const backdropAnim = reduce
		? {}
		: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }

	const panelAnim = reduce
		? {}
		: {
				initial: { opacity: 0, scale: 0.96, y: 12 },
				animate: { opacity: 1, scale: 1, y: 0 },
				exit: { opacity: 0, scale: 0.96, y: 12 },
		  }

	const transition = { duration: 0.22, ease: EASING }
	const exitTransition = { duration: 0.18, ease: EASING }

	return (
		<motion.div
			style={backdrop}
			onClick={onClose}
			{...backdropAnim}
			transition={transition}
		>
			<motion.div
				style={panel}
				onClick={(e) => e.stopPropagation()}
				{...panelAnim}
				transition={transition}
				exit={{ ...panelAnim.exit, transition: exitTransition }}
			>
				{/* Header */}
				<div style={header}>
					<span style={{ fontSize: 'var(--text-lg)', fontWeight: 500 }}>
						Translate documents
					</span>
					<button
						className="btn-ghost"
						style={{
							width: 28,
							height: 28,
							borderRadius: 'var(--radius-sm)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'var(--color-text-muted)',
							flexShrink: 0,
						}}
						onClick={onClose}
						aria-label="Close"
					>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M10.6513 4.28803C10.9442 3.99514 11.419 3.99514 11.7119 4.28803C12.0048 4.58092 12.0048 5.05568 11.7119 5.34858L9.06049 7.99994L11.7119 10.6513C12.0048 10.9442 12.0048 11.419 11.7119 11.7119C11.419 12.0048 10.9442 12.0048 10.6513 11.7119L7.99994 9.06049L5.34858 11.7119C5.05568 12.0048 4.58092 12.0048 4.28803 11.7119C3.99514 11.419 3.99514 10.9442 4.28803 10.6513L6.9394 7.99994L4.28803 5.34858C3.99514 5.05568 3.99514 4.58092 4.28803 4.28803C4.58092 3.99514 5.05568 3.99514 5.34858 4.28803L7.99994 6.9394L10.6513 4.28803Z" fill="currentColor"/>
						</svg>
					</button>
				</div>

				{/* Task name */}
				<div style={fieldSection}>
					<label style={label}>Task name</label>
					<input
						style={textInput}
						defaultValue="Translate documents"
					/>
				</div>

				{/* Prompt */}
				<div style={fieldSection}>
					<label style={label}>Prompt</label>
					<textarea style={promptTextarea} defaultValue={PROMPT} />
				</div>

				{/* Documents */}
				<div style={docsSection}>
					<div style={docsHeader}>
						<span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
							Documents
						</span>
						<span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
							200
						</span>
					</div>
					<input
						style={filterInput}
						placeholder="Change selection..."
					/>
					<div style={tableWrapper}>
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
											}}
										>
											{col}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{ROWS.map((row, i) => (
									<tr
										key={i}
										style={{
											background: i % 2 === 0 ? 'white' : 'var(--color-bg)',
											height: '28px',
										}}
									>
										<td style={{ padding: '0 12px', borderBottom: '1px solid var(--color-border)' }}>
											{row.name}
										</td>
										<td style={{ padding: '0 12px', borderBottom: '1px solid var(--color-border)' }}>
											{row.path}
										</td>
										<td style={{ padding: '0 12px', borderBottom: '1px solid var(--color-border)' }}>
											{row.targetPath}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Footer */}
				<div style={footer}>
					<button
						style={executeBtn}
						onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-black-hover)')}
						onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-black)')}
					>
						Execute batch
					</button>
				</div>
			</motion.div>
		</motion.div>
	)
}
