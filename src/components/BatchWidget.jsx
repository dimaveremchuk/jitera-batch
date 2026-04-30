import { AnimatePresence, motion } from 'framer-motion'
import { Tooltip } from '@base-ui/react/tooltip'
import { ClockIcon, PausedIcon, ExecutingIcon, MorphIcon } from './BatchModal'

const widgetStyle = {
	width: '680px',
	height: '56px',
	background: 'var(--color-surface-raised)',
	boxShadow: 'var(--shadow-sm)',
	borderRadius: 'var(--radius-xl)',
	padding: '20px 16px 20px 20px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	border: '1px solid var(--color-border)',
	overflow: 'hidden',
}

const leftStyle = {
	display: 'flex',
	alignItems: 'center',
	gap: '8px',
	flex: 1,
	minWidth: 0,
}

const textStyle = {
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
}

const rightStyle = {
	display: 'flex',
	alignItems: 'center',
	gap: '6px',
	flexShrink: 0,
}

const toggleBtnStyle = {
	width: '24px',
	height: '24px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
	borderRadius: 'var(--radius-sm)',
}

const expandBtnStyle = {
	width: '24px',
	height: '24px',
	display: 'flex',
	alignItems: 'center',
	borderRadius: 'var(--radius-sm)',
	justifyContent: 'center',
	flexShrink: 0,
	color: 'var(--color-text-muted)',
}

export default function BatchWidget({
	executionPhase,
	completedCount,
	totalDocs,
	currentDocName,
	onToggleExecution,
	onExpand,
}) {
	const leftKey = executionPhase === 'running' ? `running-${currentDocName}` : executionPhase

	const toggleTooltip =
		executionPhase === 'running' ? 'Pause batch execution' :
		executionPhase === 'paused'  ? 'Resume batch execution' :
		                               'Start batch execution'

	const toggleAriaLabel =
		executionPhase === 'running' ? 'Pause' :
		executionPhase === 'paused'  ? 'Resume' :
		                               'Start'

	return (
		<Tooltip.Provider>
			<div style={widgetStyle}>
				{/* Left: status icon + label */}
				<div style={leftStyle}>
					<span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: 'var(--color-text-secondary)' }}>
						{executionPhase === 'running' ? <ExecutingIcon /> : executionPhase === 'paused' ? <PausedIcon /> : <ClockIcon />}
					</span>
					<AnimatePresence mode="wait" initial={false}>
						<motion.span
							key={leftKey}
							initial={{ opacity: 0, filter: 'blur(4px)' }}
							animate={{ opacity: 1, filter: 'blur(0px)' }}
							exit={{ opacity: 0, filter: 'blur(4px)' }}
							transition={{ duration: 0.15 }}
							style={{
								...textStyle,
								fontSize: 'var(--text-base)',
								color: executionPhase === 'running' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
							}}
						>
							{executionPhase === 'running'
								? `Translating ${currentDocName}...`
								: executionPhase === 'paused'
								? 'Paused — Translate documents'
								: 'Translate documents'}
						</motion.span>
					</AnimatePresence>
				</div>

				{/* Right: progress + toggle + expand */}
				<div style={rightStyle}>
					<span style={{
						fontSize: 'var(--text-sm)',
						color: 'var(--color-text-muted)',
						fontVariantNumeric: 'tabular-nums',
						flexShrink: 0,
					}}>
						{completedCount}/{totalDocs}
					</span>

					<Tooltip.Root>
						<Tooltip.Trigger render={
							<button
								style={toggleBtnStyle}
								className="btn-ghost"
								onClick={onToggleExecution}
								aria-label={toggleAriaLabel}
							/>
						}>
							<MorphIcon mode={executionPhase === 'running' ? 'pause' : 'play'} />
						</Tooltip.Trigger>
						<Tooltip.Portal>
							<Tooltip.Positioner sideOffset={4}>
								<Tooltip.Popup className="tooltip-popup">{toggleTooltip}</Tooltip.Popup>
							</Tooltip.Positioner>
						</Tooltip.Portal>
					</Tooltip.Root>

					<Tooltip.Root>
						<Tooltip.Trigger render={
							<button
								style={expandBtnStyle}
								className="btn-ghost"
								onClick={onExpand}
								aria-label="Expand"
							/>
						}>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M3 7.75C3.41421 7.75 3.75 8.08579 3.75 8.5V12.25H7.5C7.91421 12.25 8.25 12.5858 8.25 13C8.25 13.4142 7.91421 13.75 7.5 13.75H3C2.58579 13.75 2.25 13.4142 2.25 13V8.5C2.25 8.08579 2.58579 7.75 3 7.75ZM13 2.25C13.4142 2.25 13.75 2.58579 13.75 3V7.5C13.75 7.91421 13.4142 8.25 13 8.25C12.5858 8.25 12.25 7.91421 12.25 7.5V3.75H8.5C8.08579 3.75 7.75 3.41421 7.75 3C7.75 2.58579 8.08579 2.25 8.5 2.25H13Z" fill="currentColor"/>
							</svg>
						</Tooltip.Trigger>
						<Tooltip.Portal>
							<Tooltip.Positioner sideOffset={4}>
								<Tooltip.Popup className="tooltip-popup">Expand</Tooltip.Popup>
							</Tooltip.Positioner>
						</Tooltip.Portal>
					</Tooltip.Root>
				</div>
			</div>
		</Tooltip.Provider>
	)
}
