import { useState, useEffect, useRef, useMemo, memo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

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

// --- Icon components ---

function ClockIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M8.43262 13.4834C8.84556 13.4513 9.20615 13.7599 9.23828 14.1729C9.27036 14.5858 8.9618 14.9464 8.54883 14.9785C8.36759 14.9926 8.18457 15 8 15C7.81543 15 7.63241 14.9926 7.45117 14.9785C7.0382 14.9464 6.72964 14.5858 6.76172 14.1729C6.79385 13.7599 7.15444 13.4513 7.56738 13.4834C7.70999 13.4945 7.85427 13.5 8 13.5C8.14573 13.5 8.29001 13.4945 8.43262 13.4834ZM2.75977 11.4893C3.07452 11.2202 3.54818 11.2567 3.81738 11.5713C4.00475 11.7905 4.20954 11.9953 4.42871 12.1826C4.74329 12.4518 4.77982 12.9255 4.51074 13.2402C4.24155 13.5548 3.76789 13.5913 3.45312 13.3223C3.17492 13.0844 2.91561 12.8251 2.67773 12.5469C2.40865 12.2321 2.44515 11.7585 2.75977 11.4893ZM12.1826 11.5713C12.4518 11.2567 12.9255 11.2202 13.2402 11.4893C13.5548 11.7585 13.5913 12.2321 13.3223 12.5469C13.0844 12.8251 12.8251 13.0844 12.5469 13.3223C12.2321 13.5914 11.7585 13.5548 11.4893 13.2402C11.2202 12.9255 11.2567 12.4518 11.5713 12.1826C11.7905 11.9953 11.9953 11.7905 12.1826 11.5713ZM8 3.75C8.41421 3.75 8.75 4.08579 8.75 4.5V7.68945L10.5303 9.46973C10.8232 9.76262 10.8232 10.2374 10.5303 10.5303C10.2374 10.8232 9.76262 10.8232 9.46973 10.5303L7.46973 8.53027C7.32907 8.38962 7.25 8.19891 7.25 8V4.5C7.25 4.08579 7.58579 3.75 8 3.75ZM1.82715 6.76172C2.24007 6.79385 2.54868 7.15444 2.5166 7.56738C2.50553 7.70999 2.5 7.85427 2.5 8C2.5 8.14573 2.50553 8.29001 2.5166 8.43262C2.54868 8.84556 2.24007 9.20615 1.82715 9.23828C1.41418 9.27036 1.05357 8.9618 1.02148 8.54883C1.00741 8.36759 1 8.18457 1 8C1 7.81543 1.00741 7.63241 1.02148 7.45117C1.05357 7.0382 1.41418 6.72964 1.82715 6.76172ZM14.1729 6.76172C14.5858 6.72964 14.9464 7.0382 14.9785 7.45117C14.9926 7.63241 15 7.81543 15 8C15 8.18457 14.9926 8.36759 14.9785 8.54883C14.9464 8.9618 14.5858 9.27036 14.1729 9.23828C13.7599 9.20615 13.4513 8.84556 13.4834 8.43262C13.4945 8.29001 13.5 8.14573 13.5 8C13.5 7.85427 13.4945 7.70999 13.4834 7.56738C13.4513 7.15444 13.7599 6.79385 14.1729 6.76172ZM3.45312 2.67773C3.76789 2.40865 4.24155 2.44515 4.51074 2.75977C4.77982 3.07452 4.74329 3.54818 4.42871 3.81738C4.20954 4.00475 4.00475 4.20954 3.81738 4.42871C3.54818 4.74329 3.07452 4.77982 2.75977 4.51074C2.44515 4.24155 2.40865 3.76789 2.67773 3.45312C2.91561 3.17492 3.17492 2.91561 3.45312 2.67773ZM11.4893 2.75977C11.7585 2.44515 12.2321 2.40865 12.5469 2.67773C12.8251 2.91561 13.0844 3.17492 13.3223 3.45312C13.5914 3.76789 13.5548 4.24155 13.2402 4.51074C12.9255 4.77982 12.4518 4.74329 12.1826 4.42871C11.9953 4.20954 11.7905 4.00475 11.5713 3.81738C11.2567 3.54818 11.2202 3.07452 11.4893 2.75977ZM8 1C8.18457 1 8.36759 1.00741 8.54883 1.02148C8.9618 1.05357 9.27036 1.41418 9.23828 1.82715C9.20615 2.24007 8.84556 2.54868 8.43262 2.5166C8.29001 2.50553 8.14573 2.5 8 2.5C7.85427 2.5 7.70999 2.50553 7.56738 2.5166C7.15444 2.54868 6.79385 2.24007 6.76172 1.82715C6.72964 1.41418 7.0382 1.05357 7.45117 1.02148C7.63241 1.00741 7.81543 1 8 1Z" fill="currentColor"/>
		</svg>
	)
}

function ExecutingIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M8 1C11.8658 1.00009 14.9998 4.13421 15 8C15 11.8659 11.8659 14.9999 8 15C4.13401 15 1 11.866 1 8C1.00018 4.13416 4.13412 1 8 1ZM8 2.5C4.96254 2.5 2.50018 4.96258 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0375 13.4999 13.5 11.0375 13.5 8C13.4998 4.96264 11.0374 2.50009 8 2.5Z" fill="currentColor" fillOpacity="0.15"/>
			<circle
				className="executing-arc"
				cx="8" cy="8" r="6.25"
				stroke="currentColor" strokeWidth="1.5"
				strokeDasharray="9 30" strokeLinecap="round"
				fill="none"
			/>
		</svg>
	)
}

function CheckIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M11.9697 4.96967C12.2626 4.67678 12.7373 4.67678 13.0302 4.96967C13.3231 5.26257 13.3231 5.73734 13.0302 6.03022L7.53022 11.5302C7.23734 11.8231 6.76257 11.8231 6.46967 11.5302L3.46967 8.53022C3.17678 8.23732 3.17678 7.76256 3.46967 7.46967C3.76256 7.17678 4.23732 7.17678 4.53022 7.46967L6.99994 9.9394L11.9697 4.96967Z" fill="currentColor" fillOpacity="0.4"/>
		</svg>
	)
}

function FailedIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M8 1C11.8658 1.00009 14.9998 4.13421 15 8C15 11.8659 11.8659 14.9999 8 15C4.13401 15 1 11.866 1 8C1.00018 4.13416 4.13412 1 8 1ZM8 2.5C4.96254 2.5 2.50018 4.96258 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0375 13.4999 13.5 11.0375 13.5 8C13.4998 4.96264 11.0374 2.50009 8 2.5ZM8 9.5C8.55228 9.5 9 9.94772 9 10.5C9 11.0523 8.55228 11.5 8 11.5C7.44772 11.5 7 11.0523 7 10.5C7 9.94772 7.44772 9.5 8 9.5ZM8 4.25C8.41421 4.25 8.75 4.58579 8.75 5V7.5C8.75 7.91421 8.41421 8.25 8 8.25C7.58579 8.25 7.25 7.91421 7.25 7.5V5C7.25 4.58579 7.58579 4.25 8 4.25Z" fill="currentColor"/>
		</svg>
	)
}

function PausedIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M8 1C11.8658 1.00009 14.9998 4.13421 15 8C15 11.8659 11.8659 14.9999 8 15C4.13401 15 1 11.866 1 8C1.00018 4.13416 4.13412 1 8 1ZM8 2.5C4.96254 2.5 2.50018 4.96258 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0375 13.4999 13.5 11.0375 13.5 8C13.4998 4.96264 11.0374 2.50009 8 2.5Z" fill="currentColor"/>
			<path d="M6.5 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M9.5 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
		</svg>
	)
}

// Pause: 2 visible bars + 1 invisible center point (morphs into 3 play lines)
// Play: left edge + top-right diagonal + bottom-right diagonal
const MORPH_COORDS = {
	pause: [
		{ x1: 5.5, y1: 4, x2: 5.5, y2: 12, strokeWidth: 1.5 },  // left bar
		{ x1: 10.5, y1: 4, x2: 10.5, y2: 12, strokeWidth: 1.5 }, // right bar
		{ x1: 8, y1: 8, x2: 8, y2: 8, strokeWidth: 0 },          // invisible (zero width)
	],
	play: [
		{ x1: 5.5, y1: 4, x2: 5.5, y2: 12, strokeWidth: 1.5 },   // left edge
		{ x1: 5.5, y1: 4, x2: 11, y2: 8, strokeWidth: 1.5 },     // top-right diagonal
		{ x1: 5.5, y1: 12, x2: 11, y2: 8, strokeWidth: 1.5 },    // bottom-right diagonal
	],
}

function MorphIcon({ mode }) {
	const coords = MORPH_COORDS[mode]
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
			{[0, 1, 2].map((idx) => (
				<motion.line
					key={idx}
					animate={{ x1: coords[idx].x1, y1: coords[idx].y1, x2: coords[idx].x2, y2: coords[idx].y2, strokeWidth: coords[idx].strokeWidth }}
					transition={{ duration: 0.2, ease: [0.165, 0.84, 0.44, 1] }}
					stroke="currentColor"
					strokeLinecap="round"
				/>
			))}
		</svg>
	)
}

function StatusIcon({ status, reduce }) {
	const icon =
		status === 'executing' ? <ExecutingIcon /> :
		status === 'paused'    ? <PausedIcon />    :
		status === 'done'      ? <CheckIcon />     :
		status === 'failed'    ? <FailedIcon />    :
		                         <ClockIcon />

	const color = status === 'failed' ? 'var(--color-error)' : 'var(--color-text-muted)'

	if (reduce) {
		return (
			<span style={{ display: 'flex', alignItems: 'center', color, flexShrink: 0 }}>
				{icon}
			</span>
		)
	}

	return (
		<AnimatePresence mode="wait" initial={false}>
			<motion.span
				key={status}
				initial={{ opacity: 0, filter: 'blur(4px)' }}
				animate={{ opacity: 1, filter: 'blur(0px)' }}
				exit={{ opacity: 0, filter: 'blur(4px)' }}
				transition={{ duration: 0.15 }}
				style={{ display: 'flex', alignItems: 'center', color, flexShrink: 0 }}
			>
				{icon}
			</motion.span>
		</AnimatePresence>
	)
}

const tdStyle = { padding: '0 12px', borderBottom: '1px solid var(--color-border)' }

const TableRow = memo(function TableRow({ row, i, status, executionPhase, reduce }) {
	const bg =
		status === 'executing' ? 'var(--color-accent-subtle)' :
		status === 'failed'    ? 'var(--color-error-subtle)'  :
		i % 2 === 0            ? 'white'                      :
		                         'var(--color-bg)'

	const rowStyle = { background: bg, height: '28px' }

	const firstCell = (
		<td style={tdStyle}>
			<span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
				{executionPhase !== 'idle' && (
					<StatusIcon status={status} reduce={reduce} />
				)}
				{row.name}
			</span>
		</td>
	)

	const targetPathStyle = status === 'done'
		? { ...tdStyle, color: 'var(--color-link)', textDecoration: 'underline', cursor: 'pointer' }
		: tdStyle

	const otherCells = (
		<>
			<td style={tdStyle}>{row.path}</td>
			<td style={targetPathStyle}>{row.targetPath}</td>
		</>
	)

	if (i < 10) {
		return (
			<motion.tr
				style={rowStyle}
				initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
				animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
				transition={{ duration: 0.25, ease: 'easeOut' }}
			>
				{firstCell}
				{otherCells}
			</motion.tr>
		)
	}
	return (
		<tr style={rowStyle}>
			{firstCell}
			{otherCells}
		</tr>
	)
})

// --- Styles ---

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
	height: '688px',
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
	padding: '0 12px',
	fontSize: 'var(--text-sm)',
	color: 'var(--color-text-primary)',
	transition: 'opacity 150ms ease',
}

const promptTextarea = {
	width: '100%',
	minHeight: '80px',
	padding: '10px 12px',
	fontSize: 'var(--text-sm)',
	color: 'var(--color-text-primary)',
	resize: 'none',
	lineHeight: '1.5',
	transition: 'opacity 150ms ease',
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
	height: '36px',
	padding: '0 12px',
	fontSize: 'var(--text-sm)',
	color: 'var(--color-text-primary)',
	flexShrink: 0,
	display: 'block',
	transition: 'opacity 150ms ease',
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

const executeBtnStyle = {
	background: 'var(--color-black)',
	color: 'white',
	borderRadius: 'var(--radius-sm)',
	fontSize: 'var(--text-sm)',
	fontWeight: 500,
	padding: '0 8px',
	height: '28px',
	cursor: 'default',
}

const pauseResumeBtnStyle = {
	background: 'white',
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

export default function BatchModal({ onClose }) {
	const reduce = useReducedMotion()

	const [taskName, setTaskName] = useState('Translate documents')
	const [populationPhase, setPopulationPhase] = useState('populating')
	const [visibleRows, setVisibleRows] = useState(0)
	const [dots, setDots] = useState(1)

	// Execution state
	const [executionPhase, setExecutionPhase] = useState('idle')
	const [rowStatuses, setRowStatuses] = useState(() =>
		Array.from({ length: 200 }, () => ({ status: 'pending' }))
	)
	const [completedCount, setCompletedCount] = useState(0)
	const [currentlyExecuting, setCurrentlyExecuting] = useState(null)

	// Refs
	const timeoutRef = useRef(null)
	const isPausedRef = useRef(false)
	const processNextRowRef = useRef(null)
	const failedIndices = useMemo(() => {
		const s = new Set()
		while (s.size < 20) s.add(Math.floor(Math.random() * 200))
		return s
	}, [])

	// Defined every render so closures are always fresh; stored in ref for recursive calls
	processNextRowRef.current = function processNextRow(index) {
		if (isPausedRef.current || index >= 200) {
			if (index >= 200) {
				setExecutionPhase('done')
				setCurrentlyExecuting(null)
			}
			return
		}
		setRowStatuses(prev => {
			const next = [...prev]
			next[index] = { status: 'executing' }
			return next
		})
		setCurrentlyExecuting(index)
		const duration = 500 + Math.random() * 3500
		timeoutRef.current = setTimeout(() => {
			setRowStatuses(prev => {
				const next = [...prev]
				next[index] = { status: failedIndices.has(index) ? 'failed' : 'done' }
				if (index === 49) {
					for (let r = 50; r < 200; r++) {
						next[r] = { status: failedIndices.has(r) ? 'failed' : 'done' }
					}
				}
				return next
			})
			if (index === 49) {
				setCompletedCount(200)
				setExecutionPhase('done')
				setCurrentlyExecuting(null)
			} else {
				setCompletedCount(c => c + 1)
				processNextRowRef.current(index + 1)
			}
		}, duration)
	}

	useEffect(() => {
		return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
	}, [])

	useEffect(() => {
		if (reduce) {
			setVisibleRows(200)
			setPopulationPhase('done')
			return
		}

		const cleanups = []

		for (let i = 0; i < 10; i++) {
			const t = setTimeout(() => setVisibleRows(i + 1), i * 120)
			cleanups.push(() => clearTimeout(t))
		}

		const phase2 = setTimeout(() => {
			let current = 10
			const iv = setInterval(() => {
				current += 1
				setVisibleRows(current)
				if (current >= 200) {
					clearInterval(iv)
					setPopulationPhase('done')
				}
			}, 10)
			cleanups.push(() => clearInterval(iv))
		}, 1200)
		cleanups.push(() => clearTimeout(phase2))

		const dotsIv = setInterval(() => setDots((d) => (d % 3) + 1), 400)
		cleanups.push(() => clearInterval(dotsIv))

		return () => cleanups.forEach((fn) => fn())
	}, [reduce])

	function handleStart() {
		isPausedRef.current = false
		setExecutionPhase('running')
		processNextRowRef.current(0)
	}

	function handlePause() {
		isPausedRef.current = true
		clearTimeout(timeoutRef.current)
		setExecutionPhase('paused')
		if (currentlyExecuting !== null) {
			setRowStatuses(prev => {
				const next = [...prev]
				next[currentlyExecuting] = { status: 'paused' }
				return next
			})
		}
	}

	function handleResume() {
		const idx = currentlyExecuting ?? 0
		isPausedRef.current = false
		setExecutionPhase('running')
		setRowStatuses(prev => {
			const next = [...prev]
			next[idx] = { status: 'pending' }
			return next
		})
		processNextRowRef.current(idx)
	}

	const isLocked = executionPhase === 'running' || executionPhase === 'done'

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

	const counterKey =
		populationPhase === 'populating'                                    ? 'populating' :
		(executionPhase === 'running' || executionPhase === 'paused')       ? 'progress'   :
		                                                                       'done-count'

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
						{taskName}
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
						className="field"
						style={{ ...textInput, opacity: isLocked ? 0.5 : 1 }}
						value={taskName}
						onChange={(e) => setTaskName(e.target.value)}
						disabled={isLocked}
					/>
				</div>

				{/* Prompt */}
				<div style={fieldSection}>
					<label style={label}>Prompt</label>
					<textarea
						className="field"
						style={{ ...promptTextarea, opacity: isLocked ? 0.5 : 1 }}
						defaultValue={PROMPT}
						disabled={isLocked}
					/>
				</div>

				{/* Documents */}
				<div style={docsSection}>
					<div style={docsHeader}>
						<span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
							Documents
						</span>
						<AnimatePresence mode="wait">
							{counterKey === 'populating' ? (
								<motion.span
									key="populating"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0, transition: { duration: 0.3 } }}
									transition={{ duration: 0.2 }}
									style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}
								>
									Populating{[1, 2, 3].map((n) => (
									<span key={n} style={{ opacity: dots >= n ? 1 : 0 }}>.</span>
								))}
								</motion.span>
							) : counterKey === 'progress' ? (
								<motion.span
									key="progress"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
									style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}
								>
									{completedCount}/200
								</motion.span>
							) : (
								<motion.span
									key="done-count"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3, delay: 0.15 }}
									style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}
								>
									200
								</motion.span>
							)}
						</AnimatePresence>
					</div>
					<input
						className="field"
						style={{ ...filterInput, opacity: isLocked ? 0.5 : 1 }}
						placeholder="Change selection..."
						disabled={isLocked}
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
												zIndex: 1,
											}}
										>
											{col}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{ROWS.slice(0, visibleRows).map((row, i) => (
									<TableRow
										key={i}
										row={row}
										i={i}
										status={rowStatuses[i]?.status ?? 'pending'}
										executionPhase={executionPhase}
										reduce={reduce}
									/>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Footer */}
				<div style={footer}>
					<AnimatePresence mode="wait">
						{executionPhase === 'idle' && (
							<motion.button
								key="idle"
								style={executeBtnStyle}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.15 }}
								onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-black-hover)')}
								onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-black)')}
								onClick={handleStart}
								disabled={populationPhase !== 'done'}
							>
								Execute batch
							</motion.button>
						)}
						{(executionPhase === 'running' || executionPhase === 'paused') && (
							<motion.button
								key="pause-resume"
								style={{ ...pauseResumeBtnStyle, overflow: 'hidden' }}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.15 }}
								onClick={executionPhase === 'running' ? handlePause : handleResume}
							>
								<MorphIcon mode={executionPhase === 'running' ? 'pause' : 'play'} />
								{/* Hidden spacer drives button width; visible labels crossfade absolutely */}
								<span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
									<span style={{ opacity: 0, pointerEvents: 'none', whiteSpace: 'nowrap', userSelect: 'none' }}>
										{executionPhase === 'running' ? 'Pause' : 'Resume'}
									</span>
									<motion.span
										style={{ position: 'absolute', left: 0, whiteSpace: 'nowrap' }}
										animate={{ opacity: executionPhase === 'running' ? 1 : 0, filter: executionPhase === 'running' ? 'blur(0px)' : 'blur(4px)' }}
										transition={{ duration: 0.15 }}
									>
										Pause
									</motion.span>
									<motion.span
										style={{ position: 'absolute', left: 0, whiteSpace: 'nowrap' }}
										animate={{ opacity: executionPhase === 'paused' ? 1 : 0, filter: executionPhase === 'paused' ? 'blur(0px)' : 'blur(4px)' }}
										transition={{ duration: 0.15 }}
									>
										Resume
									</motion.span>
								</span>
							</motion.button>
						)}
						{executionPhase === 'done' && (
							<motion.button
								key="done"
								style={executeBtnStyle}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.15 }}
							>
								Done
							</motion.button>
						)}
					</AnimatePresence>
				</div>
			</motion.div>
		</motion.div>
	)
}
