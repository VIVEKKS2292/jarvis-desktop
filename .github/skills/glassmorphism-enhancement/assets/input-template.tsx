import React from 'react'

/**
 * Input & Form Templates
 * 
 * Form elements with glassmorphism styling, focus effects, and transparency
 */

interface TextInputProps {
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
    className?: string
    icon?: React.ReactNode
    type?: string
    errorMessage?: string
}

/**
 * Text Input
 * Used for text fields, search, form inputs
 * Features: transparent glass, cyan focus ring, clear error state
 */
export const TextInput: React.FC<TextInputProps> = ({
    placeholder = 'Enter text...',
    value,
    onChange,
    disabled = false,
    className = '',
    icon,
    type = 'text',
    errorMessage,
}) => {
    return (
        <div className="w-full">
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
            w-full
            ${icon ? 'pl-10' : 'px-4'} py-2
            bg-[rgba(10,15,28,0.5)]
            backdrop-blur-[8px]
            border border-white border-opacity-10
            rounded-lg
            text-white
            placeholder-gray-500
            focus:border-cyan-400 focus:border-opacity-100
            focus:outline-none
            focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-30
            focus:bg-[rgba(10,15,28,0.7)]
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${errorMessage ? 'border-red-500 border-opacity-50' : ''}
            ${className}
          `}
                />
            </div>
            {errorMessage && (
                <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
            )}
        </div>
    )
}

/**
 * Textarea
 * Used for longer text input, notes, messages
 * Features: resizable, glass effect, focus glow
 */
interface TextareaProps {
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    disabled?: boolean
    className?: string
    rows?: number
    errorMessage?: string
}

export const Textarea: React.FC<TextareaProps> = ({
    placeholder = 'Enter your message...',
    value,
    onChange,
    disabled = false,
    className = '',
    rows = 4,
    errorMessage,
}) => {
    return (
        <div className="w-full">
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                rows={rows}
                className={`
          w-full
          px-4 py-2
          bg-[rgba(10,15,28,0.5)]
          backdrop-blur-[8px]
          border border-white border-opacity-10
          rounded-lg
          text-white
          placeholder-gray-500
          focus:border-cyan-400 focus:border-opacity-100
          focus:outline-none
          focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-30
          focus:bg-[rgba(10,15,28,0.7)]
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-none
          ${errorMessage ? 'border-red-500 border-opacity-50' : ''}
          ${className}
        `}
            />
            {errorMessage && (
                <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
            )}
        </div>
    )
}

/**
 * Select Dropdown
 * Used for selections from predefined options
 * Features: glass styling, cyan focus, icon indicator
 */
interface SelectProps {
    options: { label: string; value: string }[]
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    errorMessage?: string
}

export const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option...',
    disabled = false,
    className = '',
    errorMessage,
}) => {
    return (
        <div className="w-full">
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
            w-full
            px-4 py-2 pr-10
            bg-[rgba(10,15,28,0.5)]
            backdrop-blur-[8px]
            border border-white border-opacity-10
            rounded-lg
            text-white
            appearance-none
            cursor-pointer
            focus:border-cyan-400 focus:border-opacity-100
            focus:outline-none
            focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-30
            focus:bg-[rgba(10,15,28,0.7)]
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${errorMessage ? 'border-red-500 border-opacity-50' : ''}
            ${className}
          `}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                    ▼
                </div>
            </div>
            {errorMessage && (
                <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
            )}
        </div>
    )
}

/**
 * Checkbox
 * Used for boolean selections
 * Features: glass container, cyan accent on checked
 */
interface CheckboxProps {
    label: string
    checked?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
    className?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
    label,
    checked = false,
    onChange,
    disabled = false,
    className = '',
}) => {
    return (
        <label className={`
      flex items-center gap-3
      cursor-pointer
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="hidden"
            />
            <div className={`
        w-5 h-5
        border border-white border-opacity-20
        rounded
        flex items-center justify-center
        transition-all duration-200
        ${checked ? 'bg-cyan-400 border-cyan-400' : 'bg-[rgba(10,15,28,0.5)]'}
        hover:bg-[rgba(0,212,255,0.2)]
      `}>
                {checked && <span className="text-[#0A0F1C] font-bold">✓</span>}
            </div>
            <span className="text-white">{label}</span>
        </label>
    )
}

/**
 * Radio Button Group
 * Used for exclusive selections
 * Features: glass container, cyan accent
 */
interface RadioOption {
    label: string
    value: string
}

interface RadioGroupProps {
    options: RadioOption[]
    value?: string
    onChange?: (value: string) => void
    disabled?: boolean
    className?: string
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
    options,
    value,
    onChange,
    disabled = false,
    className = '',
}) => {
    return (
        <div className={`space-y-3 ${className}`}>
            {options.map((option) => (
                <label
                    key={option.value}
                    className={`
            flex items-center gap-3
            cursor-pointer
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    <input
                        type="radio"
                        name="radio-group"
                        value={option.value}
                        checked={value === option.value}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={disabled}
                        className="hidden"
                    />
                    <div className={`
            w-5 h-5
            border-2 border-white border-opacity-20
            rounded-full
            flex items-center justify-center
            transition-all duration-200
            ${value === option.value ? 'border-cyan-400 bg-cyan-400 bg-opacity-10' : 'bg-[rgba(10,15,28,0.5)]'}
            hover:bg-[rgba(0,212,255,0.2)]
          `}>
                        {value === option.value && (
                            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                        )}
                    </div>
                    <span className="text-white">{option.label}</span>
                </label>
            ))}
        </div>
    )
}

/**
 * Form Container
 * Wrapper for grouping form elements
 */
interface FormProps {
    children: React.ReactNode
    onSubmit?: (e: React.FormEvent) => void
    className?: string
}

export const Form: React.FC<FormProps> = ({
    children,
    onSubmit,
    className = '',
}) => {
    return (
        <form
            onSubmit={onSubmit}
            className={`
        space-y-4
        ${className}
      `}
        >
            {children}
        </form>
    )
}

/**
 * Form Group
 * Container for label + input pair
 */
interface FormGroupProps {
    label: string
    required?: boolean
    children: React.ReactNode
    className?: string
}

export const FormGroup: React.FC<FormGroupProps> = ({
    label,
    required = false,
    children,
    className = '',
}) => {
    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-white text-sm font-medium">
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {children}
        </div>
    )
}

/**
 * Example Usage
 */

export const FormExample = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: '',
        category: '',
        subscribe: false,
        preference: '',
    })

    return (
        <div className="bg-[#0A0F1C] min-h-screen p-8">
            <Form>
                <FormGroup label="Name" required>
                    <TextInput
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Email" required>
                    <TextInput
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Category">
                    <Select
                        options={[
                            { label: 'Feature Request', value: 'feature' },
                            { label: 'Bug Report', value: 'bug' },
                            { label: 'General Feedback', value: 'feedback' },
                        ]}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Message" required>
                    <Textarea
                        placeholder="Share your thoughts..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                </FormGroup>

                <Checkbox
                    label="Subscribe to updates"
                    checked={formData.subscribe}
                    onChange={(e) => setFormData({ ...formData, subscribe: e.target.checked })}
                />

                <FormGroup label="Preference">
                    <RadioGroup
                        options={[
                            { label: 'Email', value: 'email' },
                            { label: 'SMS', value: 'sms' },
                            { label: 'Push', value: 'push' },
                        ]}
                        value={formData.preference}
                        onChange={(value) => setFormData({ ...formData, preference: value })}
                    />
                </FormGroup>
            </Form>
        </div>
    )
}
