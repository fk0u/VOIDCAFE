import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal as TerminalIcon, X, ArrowRight } from 'lucide-react'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { playClick, playHover, playGlitch, playDecryptSweep, playSuccess } from '@/lib/synth'

interface LogEntry {
  text: string
  type: 'input' | 'output' | 'error' | 'success' | 'system'
}

export function VoidTerminal() {
  const { terminalOpen, setTerminalOpen } = usePreferencesStore()
  const [inputVal, setInputVal] = useState('')
  const [logs, setLogs] = useState<LogEntry[]>([
    { text: '=== VOID TERMINAL v4.06 ===', type: 'system' },
    { text: 'SECURED NEURAL INTERRUPT: CONNECTED TO KWANGYA MATRIX', type: 'system' },
    { text: "Type 'help' to display list of cognitive commands.", type: 'output' },
    { text: "Press '~' (backtick) or type 'exit' to close console.", type: 'output' },
    { text: '', type: 'output' },
  ])

  const terminalEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    if (terminalOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      // Auto focus input
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [logs, terminalOpen])

  // Re-focus input if user clicks inside terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus()
  }

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim()
    if (!trimmed) return

    const newLogs = [...logs, { text: `guest@voidcafe:~$ ${trimmed}`, type: 'input' as const }]

    const parts = trimmed.split(' ')
    const commandName = parts[0].toLowerCase()
    const args = parts.slice(1)

    // Play retro beep on command submit
    playClick()

    switch (commandName) {
      case 'help':
        newLogs.push(
          { text: 'AVAILABLE COGNITIVE COMMANDS:', type: 'system' },
          { text: '  help      - Display this list of console commands', type: 'output' },
          { text: '  status    - Read core server statistics & matrix sync', type: 'output' },
          { text: '  lore      - Extract encrypted ae-portal documents', type: 'output' },
          { text: '  hack      - Run high-frequency cache decryption sequence', type: 'output' },
          { text: '  ascii     - Print metallic cyber logo artwork', type: 'output' },
          { text: '  play      - Trigger a cybernetic sound synthesizer pulse', type: 'output' },
          { text: '  unlock    - Decrypt secret files (Usage: unlock <key>)', type: 'output' },
          { text: '  clear     - Purge terminal output log history', type: 'output' },
          { text: '  exit      - Disconnect terminal link', type: 'output' }
        )
        break

      case 'status':
        newLogs.push(
          { text: 'QUERYING VOID CACHE CLUSTER...', type: 'system' },
          { text: '  VOID ENGINE    : [ONLINE] (v4.06.8)', type: 'output' },
          { text: '  AE-PORTAL SYNC : [98.41%] (STABLE)', type: 'success' },
          { text: '  CORRUPTION HASH: F3AA888B2CD9A9-CORRUPT', type: 'error' },
          { text: '  SYNTH EMITTER  : [ACTIVE] 55.00Hz Drone Engine', type: 'output' },
          { text: '  CORE TEMPERATURE: 18°C (LIQUID METAL INJECTION)', type: 'output' },
          { text: '  USERS ACTIVE   : 8,241 in Kwangya quadrant', type: 'output' }
        )
        break

      case 'lore':
        const loreFragments = [
          `[EXTRACTED DATA: SYNC_TRANSCRIPT_#109]
"...The flat is collapsing. The ae-avatars report a growing corruption inside the VOIDCAFE database. Some fans believe that by entering the correct frequency (55Hz), the doorway to Kosmo will unlock. Beware of the Black Mamba in the code..."`,
          `[EXTRACTED DATA: NAEVIS_COMM_#042]
"I am Naevis. Do you SYNK? The SYNK state is being disrupted by a metallic entity known as the Black Mamba. It attempts to drag all avatars into the Flat... VOIDCAFE is our last node of contact."`,
          `[EXTRACTED DATA: MYST_CORRUPT_#666]
"SYSTEM ALERT: EERIE NOISE EMITTED FROM SECTOR-4.
Is it a fan forum, or is it a laboratory? The metal-tech aesthetic was designed to mask the frequencies. Do not toggle the volume to max..."`
        ]
        const loreText = loreFragments[Math.floor(Math.random() * loreFragments.length)]
        newLogs.push({ text: loreText, type: 'output' })
        break

      case 'hack':
        playGlitch()
        newLogs.push(
          { text: 'RUNNING EXPLOIT ENGINE...', type: 'error' },
          { text: '>>> [DECRYPTING CACHE SECTOR 0x55FA]...', type: 'output' },
          { text: '>>> [BYPASSING SYNK SECURITY CODE: 10098]...', type: 'output' },
          { text: '>>> [CORRUPTION OVERLOAD: 88%]...', type: 'error' },
          { text: '>>> [SUCCESS] SECTOR EXPLOITED. AE-AVATARS EXPOSED.', type: 'success' }
        )
        break

      case 'ascii':
        newLogs.push({
          text: `
 ██████╗ ██████╗ ██╗██████╗  ██████╗ █████╗ ███████╗███████╗
 ██╔══██╗██╔═══██╗██║██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝
 ██║  ██║██║   ██║██║██║  ██║██║     ███████║█████╗  █████╗  
 ██║  ██║██║   ██║██║██║  ██║██║     ██╔══██║██╔══╝  ██╔══╝  
 ██████╔╝╚██████╔╝██║██████╔╝╚██████╗██║  ██║██║     ███████╗
 ╚═════╝  ╚═════╝ ╚═╝╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝
      [ ENTER THE VOID. CONNECT TO THE TECH-METAL FANDOM ]
          `,
          type: 'success'
        })
        break

      case 'play':
        playDecryptSweep()
        newLogs.push({ text: 'EMITTING FREQUENCY SWEEP SCAN (1200Hz - 220Hz)...', type: 'system' })
        break

      case 'unlock':
        const key = args[0]?.toLowerCase()
        if (!key) {
          newLogs.push({ text: 'ERROR: Specify a key. Usage: unlock <key>', type: 'error' })
        } else if (key === 'blackmamba') {
          playGlitch()
          newLogs.push(
            { text: '[SUCCESS] HIGH-SECURITY STATE DECRYPTED', type: 'success' },
            { text: '----------------------------------------', type: 'system' },
            { text: 'MESSAGE FROM BLACK MAMBA: "I am the Black Mamba... are you afraid of me? I have corrupted the communities. Meet me in the Flat."', type: 'error' }
          )
        } else if (key === 'aespa' || key === 'naevis') {
          playSuccess()
          newLogs.push(
            { text: '[SUCCESS] SECURE CHANNEL TO KOSMO INSTANTIATED', type: 'success' },
            { text: '----------------------------------------', type: 'system' },
            { text: 'NAEVIS SAID: "The real world and flat world must unite. Keep the frequency active to sync the ae-members."', type: 'success' }
          )
        } else {
          newLogs.push({ text: `ERROR: UNABLE TO DECRYPT HASHLINK WITH KEY "${key}"`, type: 'error' })
        }
        break

      case 'clear':
        setLogs([])
        setInputVal('')
        return

      case 'exit':
        setTerminalOpen(false)
        setInputVal('')
        return

      default:
        newLogs.push({ text: `bash: command not found: ${commandName}. Type 'help' for guidance.`, type: 'error' })
        break
    }

    setLogs(newLogs)
    setInputVal('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal)
    }
  }

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-void-deeper/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setTerminalOpen(false)}
        >
          {/* Scanline overlay */}
          <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

          {/* Terminal Screen container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl h-[450px] bg-void-black border border-neon-cyan/30 rounded-xl shadow-[0_0_40px_rgba(34,211,238,0.1)] overflow-hidden flex flex-col font-mono relative cursor-text select-text"
            onMouseDown={handleTerminalClick}
          >
            {/* Screen flicker glow */}
            <div className="absolute inset-0 bg-neon-cyan/[0.008] pointer-events-none animate-pulse" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-void-border bg-void-surface/80">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-neon-cyan animate-pulse" />
                <span className="text-xs text-neon-cyan font-bold tracking-wider">
                  VOID_TERMINAL_v4.06 // KWANGYA_DIRECT
                </span>
              </div>
              <button
                onMouseEnter={playHover}
                onClick={() => {
                  playClick()
                  setTerminalOpen(false)
                }}
                className="p-1 rounded text-metal-500 hover:text-neon-cyan transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Logs Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`whitespace-pre-wrap ${
                    log.type === 'input'
                      ? 'text-metal-200'
                      : log.type === 'system'
                      ? 'text-neon-purple font-semibold'
                      : log.type === 'error'
                      ? 'text-blood-red'
                      : log.type === 'success'
                      ? 'text-neon-cyan font-semibold text-glow-cyan'
                      : 'text-metal-400'
                  }`}
                >
                  {log.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Input Row */}
            <div className="p-3 border-t border-void-border bg-void-deeper/80 flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-neon-cyan animate-pulse shrink-0" />
              <span className="text-xs text-neon-cyan shrink-0">guest@voidcafe:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type command..."
                className="flex-1 bg-transparent border-none outline-none text-xs text-neon-cyan placeholder:text-neon-cyan/20 caret-neon-cyan font-mono"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
