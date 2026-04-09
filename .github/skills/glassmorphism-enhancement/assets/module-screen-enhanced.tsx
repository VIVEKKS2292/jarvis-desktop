import React from 'react'
import { GlassPanel } from './glass-panel-template'
import { PrimaryButton, SecondaryButton } from './button-template'
import { TextInput, FormGroup } from './input-template'

/**
 * Enhanced Module Screen Example
 * 
 * Complete implementation showing how to combine glassmorphism patterns
 * for a full module/panel UI with neon accents and smooth animations
 */

export const EnhancedModuleScreen: React.FC<{
    title: string
    onClose: () => void
}> = ({ title, onClose }) => {
    const [inputValue, setInputValue] = React.useState('')

    return (
        <div className="
      fixed inset-0
      bg-[#0A0F1C]
      flex flex-col
      z-40
      animate-slideIn
    ">
            {/* Header with Back Button */}
            <div className="
        flex items-center justify-between
        px-8 py-6
        border-b border-white border-opacity-10
        bg-[rgba(10,15,28,0.5)]
        backdrop-blur-[12px]
      ">
                <button
                    onClick={onClose}
                    className="
            flex items-center gap-2
            px-4 py-2
            text-white hover:text-cyan-400
            hover:bg-[rgba(0,212,255,0.1)]
            rounded-lg
            transition-all duration-200
          "
                >
                    ← Back
                </button>
                <h1 className="
          text-2xl font-bold text-white
          text-center flex-1
        ">
                    {title}
                </h1>
                <div className="w-24" /> {/* Spacer for alignment */}
            </div>

            {/* Main Content */}
            <div className="
        flex-1
        overflow-y-auto
        px-8 py-8
        space-y-6
      ">
                {/* Welcome Section */}
                <GlassPanel className="p-6">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-cyan-400">
                            Welcome to {title}
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            This is an enhanced module screen showcasing glassmorphism styling
                            with frosted glass panels, backdrop blur effects, and neon cyan accents
                            across all interactive elements.
                        </p>
                    </div>
                </GlassPanel>

                {/* Input Section */}
                <GlassPanel header="Quick Input" className="p-6">
                    <FormGroup label="Enter something">
                        <TextInput
                            placeholder="Type here..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            icon="🔍"
                        />
                    </FormGroup>
                </GlassPanel>

                {/* Feature Grid */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-4">Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Glassmorphism', 'Cyan Accent', 'Smooth Animation', 'Futuristic'].map((feature) => (
                            <GlassPanel
                                key={feature}
                                onClick={() => console.log(`Clicked: ${feature}`)}
                                className="p-4 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="
                    w-3 h-3
                    bg-cyan-400
                    rounded-full
                    shadow-[0_0_8px_rgba(0,212,255,0.8)]
                  " />
                                    <span className="text-white font-medium">{feature}</span>
                                </div>
                            </GlassPanel>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <GlassPanel className="p-6">
                    <h3 className="text-cyan-400 font-semibold mb-4">Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Active', value: '24/7' },
                            { label: 'Status', value: 'Online' },
                            { label: 'Uptime', value: '99.9%' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-2xl font-bold text-cyan-400">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-gray-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </GlassPanel>

                {/* Info Cards */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-4">Key Information</h3>
                    <div className="space-y-3">
                        {[
                            { icon: '⚡', title: 'Performance', desc: 'Optimized for speed' },
                            { icon: '🔒', title: 'Security', desc: 'End-to-end encryption' },
                            { icon: '🎨', title: 'Design', desc: 'Futuristic glassmorphism' },
                        ].map((item) => (
                            <GlassPanel key={item.title} className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="text-2xl mt-1">{item.icon}</div>
                                    <div>
                                        <h4 className="text-white font-semibold">{item.title}</h4>
                                        <p className="text-gray-400 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            </GlassPanel>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer with Actions */}
            <div className="
        flex items-center justify-between
        px-8 py-6
        border-t border-white border-opacity-10
        bg-[rgba(10,15,28,0.5)]
        backdrop-blur-[12px]
        gap-4
      ">
                <p className="text-gray-400 text-sm">
                    {inputValue ? `You entered: ${inputValue}` : 'Ready for input...'}
                </p>
                <div className="flex gap-3">
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                    <PrimaryButton
                        onClick={() => {
                            console.log('Action triggered with:', inputValue)
                            setInputValue('')
                        }}
                        disabled={!inputValue}
                    >
                        Submit
                    </PrimaryButton>
                </div>
            </div>
        </div>
    )
}

/**
 * CSS Animations (add to your global CSS or CSS module)
 * 
 * @keyframes slideIn {
 *   from {
 *     opacity: 0;
 *     transform: translate(0, 20px);
 *   }
 *   to {
 *     opacity: 1;
 *     transform: translate(0, 0);
 *   }
 * }
 * 
 * @keyframes fadeIn {
 *   from { opacity: 0; }
 *   to { opacity: 1; }
 * }
 * 
 * .animate-slideIn {
 *   animation: slideIn 0.3s ease-out;
 * }
 * 
 * .animate-fadeIn {
 *   animation: fadeIn 0.3s ease-out;
 * }
 */

/**
 * Usage Example:
 * 
 * const [isOpen, setIsOpen] = useState(false)
 * 
 * return (
 *   <>
 *     <button onClick={() => setIsOpen(true)}>Open Module</button>
 *     {isOpen && (
 *       <EnhancedModuleScreen
 *         title="Weather"
 *         onClose={() => setIsOpen(false)}
 *       />
 *     )}
 *   </>
 * )
 */

/**
 * Design Features Demonstrated:
 * 
 * ✓ Primary background color: #0A0F1C
 * ✓ Glass panels with rgba(10,15,28,0.5-0.7) and backdrop blur
 * ✓ Soft white borders with opacity 0.1-0.2
 * ✓ Cyan accent color (#00D4FF) for interactive elements
 * ✓ Smooth transitions (0.2s-0.4s ease)
 * ✓ Hover effects with scale and glow
 * ✓ Futuristic AI assistant aesthetic
 * ✓ Dark mode compliant
 * ✓ Modular component structure
 * ✓ Consistent spacing and typography
 */
