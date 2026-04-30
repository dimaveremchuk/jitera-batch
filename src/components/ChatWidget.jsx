import { motion, useReducedMotion } from 'framer-motion'
import BatchResultsTable from './BatchResultsTable'

const EASING = [0.165, 0.84, 0.44, 1]

// Top-right L-corner → ↘ diagonal; bottom-left L-corner → ↗ diagonal.
// Both paths are M…L…L (3 points) so Framer Motion interpolates between them.
const EXPAND_D1 = 'M 8.5 3.5 L 12.5 3.5 L 12.5 7.5'
const EXPAND_D2 = 'M 7.5 12.5 L 3.5 12.5 L 3.5 8.5'
const CLOSE_D1  = 'M 4.5 4.5 L 8 8 L 11.5 11.5'
const CLOSE_D2  = 'M 11.5 4.5 L 8 8 L 4.5 11.5'

function ExpandCloseIcon({ expanded, reduce }) {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
			<motion.path
				animate={{ d: expanded ? CLOSE_D1 : EXPAND_D1 }}
				initial={false}
				transition={reduce ? { duration: 0 } : { duration: 0.2, ease: EASING }}
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<motion.path
				animate={{ d: expanded ? CLOSE_D2 : EXPAND_D2 }}
				initial={false}
				transition={reduce ? { duration: 0 } : { duration: 0.2, ease: EASING }}
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

const iconBtnStyle = {
	width: 28,
	height: 28,
	borderRadius: 'var(--radius-sm)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: 'var(--color-text-muted)',
	flexShrink: 0,
}

export default function ChatWidget({ successCount, failedCount, totalDocs, rows, expanded, onExpand, onCollapse }) {
	const reduce = useReducedMotion()

	return (
		// layoutId handles the one-time morph from BatchWidget/BatchModal.
		// No `layout` prop here — expand/collapse is handled by animating the body's
		// height directly, so the root never gets a FLIP scale transform that would
		// squish the header.
		<motion.div
			layoutId="batch-status"
			style={{
				width: 680,
				background: 'var(--color-surface-raised)',
				borderRadius: 'var(--radius-xl)',
				boxShadow: 'var(--shadow-sm)',
				border: '1px solid var(--color-border)',
				overflow: 'hidden',
			}}
		>
			{/* Header — fixed, never animates */}
			<div style={{
				height: 56,
				padding: '0 16px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				flexShrink: 0,
			}}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', fontWeight: 400 }}>
						Translate documents
					</span>
					<span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
						{successCount} out of {totalDocs} translated
					</span>
				</div>

				<button
					className="btn-ghost"
					style={iconBtnStyle}
					onClick={expanded ? onCollapse : onExpand}
					aria-label={expanded ? 'Close' : 'Expand'}
				>
					<ExpandCloseIcon expanded={expanded} reduce={reduce} />
				</button>
			</div>

			{/* Body — height animates 0→auto so the root grows naturally with no FLIP */}
			<motion.div
				animate={{ height: expanded ? 'auto' : 0 }}
				initial={{ height: 0 }}
				transition={reduce ? { duration: 0 } : { duration: 0.3, ease: EASING }}
				style={{ overflow: 'hidden' }}
			>
				<div style={{
					maxHeight: 480,
					overflowY: 'auto',
					scrollbarWidth: 'thin',
					scrollbarColor: 'var(--color-text-disabled) transparent',
					padding: '0 16px 16px',
					display: 'flex',
					flexDirection: 'column',
				}}>
					<BatchResultsTable
						rows={rows}
						totalDocs={totalDocs}
						successCount={successCount}
						failedCount={failedCount}
					/>
				</div>
			</motion.div>
		</motion.div>
	)
}
