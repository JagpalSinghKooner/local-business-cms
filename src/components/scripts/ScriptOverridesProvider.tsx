'use client'

import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from 'react'

export type ScriptOverride = {
  scriptKey: string
  enabled: boolean
}

type ScriptOverrideContextValue = {
  overrides: ScriptOverride[]
  setOverrides: (next: ScriptOverride[]) => void
}

const ScriptOverridesContext = createContext<ScriptOverrideContextValue | undefined>(undefined)

export function ScriptOverridesProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<ScriptOverride[]>([])

  const value = useMemo(() => ({ overrides, setOverrides }), [overrides])

  return <ScriptOverridesContext.Provider value={value}>{children}</ScriptOverridesContext.Provider>
}

export function useScriptOverrides(): ScriptOverride[] {
  const context = useContext(ScriptOverridesContext)
  if (!context) {
    throw new Error('useScriptOverrides must be used within ScriptOverridesProvider')
  }
  return context.overrides
}

export function useSetScriptOverrides(): (next: ScriptOverride[]) => void {
  const context = useContext(ScriptOverridesContext)
  if (!context) {
    throw new Error('useSetScriptOverrides must be used within ScriptOverridesProvider')
  }
  return context.setOverrides
}

export function ApplyScriptOverrides({ overrides }: { overrides?: ScriptOverride[] }) {
  const setOverrides = useSetScriptOverrides()

  useEffect(() => {
    setOverrides(overrides ?? [])
    return () => setOverrides([])
  }, [overrides, setOverrides])

  return null
}
