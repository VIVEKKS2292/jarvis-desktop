import React, { useEffect } from "react"
import { Stage, Layer, Line, Image, Rect } from "react-konva"
import useImage from "use-image"

// 🔹 IMPORT SVG FILES
import shortcutsIcon from "../assets/shortcuts.svg"
import chatIcon from "../assets/chat.svg"
import weatherIcon from "../assets/weather.svg"
import notesIcon from "../assets/notes.svg"
import systemIcon from "../assets/system.svg"
import moodIcon from "../assets/mood.svg"



// 🔹 STAGE
const size = 420
const centerX = size / 2
const centerY = size / 2
const radius = 180

// 🔹 MODULES
const modules = [
    { id: "shortcuts", icon: shortcutsIcon },
    { id: "chat", icon: chatIcon },
    { id: "weather", icon: weatherIcon },
    { id: "notes", icon: notesIcon },
    { id: "system", icon: systemIcon },
    { id: "mood", icon: moodIcon },
]


// 🔹 COMPONENT FOR EACH SLICE
const Slice = ({
    points,
    icon,
    center,
    onClick,
}: {
    points: number[]
    icon: string
    center: { x: number; y: number }
    onClick: () => void
}) => {
    const [img] = useImage(icon)
    const [isHovered, setIsHovered] = React.useState(false)
    const lineRef = React.useRef<any>(null)
    const imageRef = React.useRef<any>(null)

    const handleMouseEnter = () => {
        setIsHovered(true)
        // Glow effect on hover
        if (lineRef.current) {
            lineRef.current.to({
                shadowBlur: 16,
                shadowOpacity: 0.8,
                strokeWidth: 3,
                duration: 0.2,
            })
        }
        if (imageRef.current) {
            imageRef.current.to({
                scaleX: 1.1,
                scaleY: 1.1,
                shadowBlur: 12,
                shadowOpacity: 0.7,
                duration: 0.2,
            })
        }
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        // Revert glow effect
        if (lineRef.current) {
            lineRef.current.to({
                shadowBlur: 0,
                shadowOpacity: 0,
                strokeWidth: 2,
                duration: 0.2,
            })
        }
        if (imageRef.current) {
            imageRef.current.to({
                scaleX: 1,
                scaleY: 1,
                shadowBlur: 0,
                shadowOpacity: 0,
                duration: 0.2,
            })
        }
    }

    const handleClick = () => {
        onClick()
        // Pulse effect on click
        if (lineRef.current) {
            lineRef.current.to({
                opacity: 0.7,
                duration: 0.1,
            })
            lineRef.current.to({
                opacity: 1,
                duration: 0.1,
            })
        }
    }

    return (
        <>
            {/* Triangle slice with glassmorphism glow */}
            <Line
                ref={lineRef}
                points={points}
                closed
                fill="#0A0F1C"
                stroke="#00D4FF"
                strokeWidth={2}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                shadowColor="#00D4FF"
                shadowBlur={0}
                shadowOpacity={0}
                opacity={1}
                tension={0.1}
                hitStrokeWidth={10}
                perfectDrawEnabled={false}
            />

            {/* Icon with enhanced glow and scale effects */}
            {img && (
                <Image
                    ref={imageRef}
                    image={img}
                    x={center.x}
                    y={center.y}
                    width={60}
                    height={60}
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    shadowColor="#00D4FF"
                    shadowBlur={0}
                    shadowOpacity={0}
                    opacity={0.9}
                    offsetX={30}
                    offsetY={30}
                    scaleX={1}
                    scaleY={1}
                    perfectDrawEnabled={false}
                />
            )}
        </>
    )
}




// 🔹 MAIN
const HexMenu = ({ onSelect }: { onSelect: (id: string) => void }) => {
    const [centerHovered, setCenterHovered] = React.useState(false)
    const [isDragging, setIsDragging] = React.useState(false)
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 })
    const centerRef = React.useRef<any>(null)
    const stageRef = React.useRef<any>(null)

    // 🔔 Track user activity to reset idle timer
    const handleUserActivity = React.useCallback(() => {
        // Activity is tracked in main process via before-input-event
        // This callback is here for explicit activity tracking if needed
    }, [])

    const points = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i - Math.PI
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
        }
    })

    const handleCenterMouseEnter = () => {
        setCenterHovered(true)
        // Change cursor to move
        if (stageRef.current) {
            stageRef.current.container().style.cursor = "move"
        }
        if (centerRef.current) {
            centerRef.current.to({
                shadowBlur: 20,
                shadowOpacity: 1,
                scaleX: 1.08,
                scaleY: 1.08,
                duration: 0.3,
            })
        }
    }

    const handleCenterMouseLeave = () => {
        setCenterHovered(false)
        // Restore cursor
        if (stageRef.current && !isDragging) {
            stageRef.current.container().style.cursor = "default"
        }
        if (centerRef.current) {
            centerRef.current.to({
                shadowBlur: 8,
                shadowOpacity: 0.6,
                scaleX: 1,
                scaleY: 1,
                duration: 0.3,
            })
        }
    }

    const handleCenterMouseDown = (e: any) => {
        e.evt.preventDefault()
        setIsDragging(true)
        setDragStart({ x: e.evt.clientX, y: e.evt.clientY })
    }

    const handleStageMouseMove = (e: any) => {
        if (!isDragging) return

        const deltaX = e.evt.clientX - dragStart.x
        const deltaY = e.evt.clientY - dragStart.y

        window.api.windowDrag(deltaX, deltaY)
        setDragStart({ x: e.evt.clientX, y: e.evt.clientY })
    }

    const handleStageMouseUp = () => {
        setIsDragging(false)
        // Restore cursor if not hovering over center
        if (stageRef.current && !centerHovered) {
            stageRef.current.container().style.cursor = "default"
        }
    }

    const handleCenterClick = () => {
        if (!isDragging) {
            onSelect("ai-core")
            // Pulse animation on click
            if (centerRef.current) {
                centerRef.current.to({
                    scaleX: 0.95,
                    scaleY: 0.95,
                    duration: 0.1,
                })
                centerRef.current.to({
                    scaleX: 1.08,
                    scaleY: 1.08,
                    duration: 0.1,
                })
            }
        }
    }

    return (
        <Stage
            ref={stageRef}
            width={size}
            height={size}
            onMouseMove={handleStageMouseMove}
            onMouseUp={handleStageMouseUp}
            onMouseLeave={handleStageMouseUp}
        >
            <Layer>
                {/* 🔥 BACKGROUND */}
                {/* <Rect width={size} height={size} fill="#0A0F1C" /> */}

                {/* Glow layer behind hex (subtle backdrop) */}
                <Line
                    points={Array.from({ length: 6 }, (_, i) => {
                        const angle = (Math.PI / 3) * i - Math.PI
                        return [
                            centerX + radius * Math.cos(angle),
                            centerY + radius * Math.sin(angle),
                        ]
                    }).flat()}
                    closed
                    fill="transparent"
                    stroke="rgba(0, 212, 255, 0.1)"
                    strokeWidth={1}
                    shadowColor="#00D4FF"
                    shadowBlur={6}
                    shadowOpacity={0.3}
                    perfectDrawEnabled={false}
                />

                {points.map((p, i) => {
                    const next = points[(i + 1) % 6]

                    // Calculate centroid of the triangle (center of mass)
                    // Triangle vertices: centerX,centerY (center) + p + next
                    const centroidX = (centerX + p.x + next.x) / 3
                    const centroidY = (centerY + p.y + next.y) / 3

                    return (
                        <Slice
                            key={i}
                            points={[centerX, centerY, p.x, p.y, next.x, next.y]}
                            icon={modules[i].icon}
                            center={{ x: centroidX, y: centroidY }}
                            onClick={() => onSelect(modules[i].id)}
                        />
                    )
                })}

                {/* AI Core Center Circle with glassmorphism */}
                <Line
                    ref={centerRef}
                    points={Array.from({ length: 72 }, (_, i) => {
                        const angle = (Math.PI * 2 * i) / 72
                        const r = 50
                        return [
                            centerX + r * Math.cos(angle),
                            centerY + r * Math.sin(angle),
                        ]
                    }).flat()}
                    closed
                    fill="rgba(10, 15, 28, 0.7)"
                    stroke="#00D4FF"
                    strokeWidth={2}
                    shadowColor="#00D4FF"
                    shadowBlur={8}
                    shadowOpacity={0.6}
                    onClick={handleCenterClick}
                    onMouseEnter={handleCenterMouseEnter}
                    onMouseLeave={handleCenterMouseLeave}
                    onMouseDown={handleCenterMouseDown}
                    opacity={1}
                    scaleX={1}
                    scaleY={1}
                    perfectDrawEnabled={false}
                    hitStrokeWidth={15}
                />

                {/* AI Core inner circle (pulsing indicator) */}
                <Line
                    points={Array.from({ length: 72 }, (_, i) => {
                        const angle = (Math.PI * 2 * i) / 72
                        const r = 25
                        return [
                            centerX + r * Math.cos(angle),
                            centerY + r * Math.sin(angle),
                        ]
                    }).flat()}
                    closed
                    fill="transparent"
                    stroke="#00D4FF"
                    strokeWidth={1.5}
                    opacity={0.5}
                    perfectDrawEnabled={false}
                />
            </Layer>
        </Stage>
    )
}

export default HexMenu