import React from 'react'
import { ComponentConfig, defaultSiteConfig, defaultAPIConfig } from '../types/config'
import { mergeConfigurations } from '../lib/generic-utils'

interface DrwSkincareProviderProps {
  children: React.ReactNode
  config: Partial<ComponentConfig>
}

export const DrwSkincareContext = React.createContext<ComponentConfig>({
  site: defaultSiteConfig,
  api: defaultAPIConfig,
  locale: 'id-ID',
  currency: 'IDR'
})

export const DrwSkincareProvider: React.FC<DrwSkincareProviderProps> = ({
  children,
  config
}) => {
  const defaultConfig: ComponentConfig = {
    site: defaultSiteConfig,
    api: defaultAPIConfig,
    locale: 'id-ID',
    currency: 'IDR'
  }

  const mergedConfig = mergeConfigurations(config, defaultConfig)

  return (
    <DrwSkincareContext.Provider value={mergedConfig}>
      {children}
    </DrwSkincareContext.Provider>
  )
}

export const useDrwSkincareConfig = () => {
  const context = React.useContext(DrwSkincareContext)
  if (!context) {
    throw new Error('useDrwSkincareConfig must be used within DrwSkincareProvider')
  }
  return context
}