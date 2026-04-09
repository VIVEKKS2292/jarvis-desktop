import React from 'react'

/**
 * Button Templates
 * 
 * Interactive buttons with glassmorphism styling, glow effects, and hover animations
 */

interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    className?: string
    icon?: React.ReactNode
    loading?: boolean
}

/**
 * Primary Button
 * Used for main actions, confirmations, submissions
 * Features: cyan glow, scale on hover, neon border
 */
export const PrimaryButton: React.FC<ButtonProps> = ({
    children,
    onClick,
    disabled = false,
    className = '',
    icon,
    loading = false,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`
        bg-[rgba(0,212,255,0.1)]
        border border-cyan-400
        text-cyan-400
        rounded-lg
        px-6 py-2
        shadow-[0_0_8px_rgba(0,212,255,0.4)]
        hover:shadow-[0_0_16px_rgba(0,212,255,0.7)]
        hover:scale-105
        hover:border-opacity-100
        focus:outline-none
        focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50
        transition-all duration-300
        font-semibold
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {loading ? 'Loading...' : children}
        </button>
    )
}

/**
 * Secondary Button
 * Used for cancel, back, less important actions
 * Features: glass panel, subtle border, no glow
 */
export const SecondaryButton: React.FC<ButtonProps> = ({
    children,
    onClick,
    disabled = false,
    className = '',
    icon,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        bg-[rgba(10,15,28,0.5)]
        border border-white border-opacity-20
        text-white
        rounded-lg
        px-6 py-2
        hover:bg-opacity-70
        hover:border-white hover:border-opacity-40
        hover:scale-103
        focus:outline-none
        focus:ring-2 focus:ring-white focus:ring-opacity-30
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    )
}

/**
 * Icon Button (Minimal)
 * Used for close, back, or small icon-only actions
 * Features: minimal style, glow on hover
 */
export const IconButton: React.FC<ButtonProps> = ({
    children,
    onClick,
    disabled = false,
    className = '',
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        p-2
        text-white
        hover:text-cyan-400
        hover:bg-[rgba(0,212,255,0.1)]
        hover:shadow-[0_0_8px_rgba(0,212,255,0.3)]
        rounded-lg
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
        >
            {children}
        </button>
    )
}

/**
 * Danger Button
 * Used for destructive actions (delete, remove)
 * Features: red/orange glow instead of cyan
 */
export const DangerButton: React.FC<ButtonProps> = ({
    children,
    onClick,
    disabled = false,
    className = '',
    icon,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        bg-[rgba(255,100,100,0.1)]
        border border-red-500
        text-red-500
        rounded-lg
        px-6 py-2
        shadow-[0_0_8px_rgba(255,100,100,0.3)]
        hover:shadow-[0_0_16px_rgba(255,100,100,0.6)]
        hover:scale-105
        focus:outline-none
        focus:ring-2 focus:ring-red-400 focus:ring-opacity-30
        transition-all duration-300
        font-semibold
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    )
}

/**
 * Button Group
 * Container for multiple buttons with proper spacing
 */
interface ButtonGroupProps {
    children: React.ReactNode
    layout?: 'horizontal' | 'vertical'
    gap?: string
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
    children,
    layout = 'horizontal',
    gap = 'gap-3',
}) => {
    const flexDir = layout === 'horizontal' ? 'flex-row' : 'flex-col'
    return (
        <div className={`flex ${flexDir} ${gap}`}>{children}</div>
    )
}

/**
 * Example Usage
 */

export const ButtonExamples = () => {
    return (
        <div className="bg-[#0A0F1C] min-h-screen p-8 space-y-8">
            {/* Primary Buttons */}
            <div>
                <h3 className="text-cyan-400 text-lg mb-4">Primary Buttons</h3>
                <div className="flex gap-3">
                    <PrimaryButton>Confirm</PrimaryButton>
                    <PrimaryButton disabled>Disabled</PrimaryButton>
                    <PrimaryButton loading>Processing</PrimaryButton>
                    <PrimaryButton icon="✓">With Icon</PrimaryButton>
                </div>
            </div>

            {/* Secondary Buttons */}
            <div>
                <h3 className="text-cyan-400 text-lg mb-4">Secondary Buttons</h3>
                <div className="flex gap-3">
                    <SecondaryButton>Cancel</SecondaryButton>
                    <SecondaryButton disabled>Disabled</SecondaryButton>
                    <SecondaryButton icon="←">Back</SecondaryButton>
                </div>
            </div>

            {/* Icon Buttons */}
            <div>
                <h3 className="text-cyan-400 text-lg mb-4">Icon Buttons</h3>
                <div className="flex gap-3">
                    <IconButton>✕</IconButton>
                    <IconButton>→</IconButton>
                    <IconButton>⚙️</IconButton>
                </div>
            </div>

            {/* Danger Buttons */}
            <div>
                <h3 className="text-cyan-400 text-lg mb-4">Danger Buttons</h3>
                <div className="flex gap-3">
                    <DangerButton>Delete</DangerButton>
                    <DangerButton icon="⚠">Dangerous Action</DangerButton>
                </div>
            </div>

            {/* Button Groups */}
            <div>
                <h3 className="text-cyan-400 text-lg mb-4">Button Groups</h3>
                <ButtonGroup>
                    <PrimaryButton>Save</PrimaryButton>
                    <SecondaryButton>Cancel</SecondaryButton>
                </ButtonGroup>
            </div>
        </div>
    )
}
