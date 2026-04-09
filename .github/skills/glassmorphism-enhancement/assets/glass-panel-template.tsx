import React from 'react'

/**
 * Glass Panel Template
 * 
 * Base component for cards, containers, and content panels
 * with glassmorphism styling (#0A0F1C base, backdrop blur, neon accents)
 */

interface GlassPanelProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
    header?: string
    headerAction?: React.ReactNode
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
    children,
    className = '',
    onClick,
    header,
    headerAction,
}) => {
    return (
        <div
            onClick={onClick}
            className={`
        bg-[rgba(10,15,28,0.7)]
        backdrop-blur-[16px]
        border border-white border-opacity-10
        rounded-[16px]
        shadow-lg
        hover:border-white hover:border-opacity-20
        hover:bg-opacity-80
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${className}
      `}
        >
            {header && (
                <div className="
          flex items-center justify-between
          pb-4
          border-b border-white border-opacity-10
          mb-4
        ">
                    <h3 className="text-white font-semibold text-lg">{header}</h3>
                    {headerAction}
                </div>
            )}
            {children}
        </div>
    )
}

/**
 * Floating Glass Panel
 * Used for modals, overlays, and floating dialogs
 */

interface FloatingPanelProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    className?: string
}

export const FloatingGlassPanel: React.FC<FloatingPanelProps> = ({
    isOpen,
    onClose,
    children,
    title,
    className = '',
}) => {
    if (!isOpen) return null

    return (
        <div className="
      fixed inset-0
      bg-black bg-opacity-40
      backdrop-blur-[4px]
      flex items-center justify-center
      z-50
      animate-fadeIn
    ">
            <div className={`
        bg-[rgba(10,15,28,0.95)]
        backdrop-blur-[20px]
        border border-white border-opacity-10
        rounded-[20px]
        shadow-2xl
        p-8
        max-w-lg
        w-full
        mx-4
        animate-slideIn
        ${className}
      `}>
                {title && (
                    <div className="
            flex items-center justify-between
            mb-6
            pb-4
            border-b border-white border-opacity-10
          ">
                        <h2 className="text-white text-xl font-semibold">{title}</h2>
                        <button
                            onClick={onClose}
                            className="
                p-2
                text-white hover:text-cyan-400
                hover:bg-[rgba(0,212,255,0.1)]
                rounded-lg
                transition-all duration-200
              "
                        >
                            ✕
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    )
}

/**
 * Example Usage
 */

export const PanelExample = () => {
    return (
        <div className="bg-[#0A0F1C] min-h-screen p-6">
            {/* Basic Panel */}
            <GlassPanel className="p-6 mb-4">
                <p className="text-gray-300">Simple glass panel content</p>
            </GlassPanel>

            {/* Panel with Header */}
            <GlassPanel
                header="Module Title"
                headerAction={<span className="text-cyan-400 text-sm">Info</span>}
                className="p-6"
            >
                <p className="text-gray-300">Content with header</p>
            </GlassPanel>

            {/* Clickable Panel */}
            <GlassPanel
                onClick={() => console.log('clicked')}
                className="p-6 cursor-pointer"
            >
                <p className="text-gray-300">Click me</p>
            </GlassPanel>
        </div>
    )
}
