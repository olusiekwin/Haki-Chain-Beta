"use client"

import { useCallback } from "react"
import { configService } from "../services/core/config-service"

/**
 * Hook for accessing application configuration
 */
export function useConfig() {
  // Feature flags
  const isBlockchainEnabled = useCallback(() => {
    return configService.isBlockchainEnabled()
  }, [])

  const isAiAssistantEnabled = useCallback(() => {
    return configService.isAiAssistantEnabled()
  }, [])

  const useMockData = configService.useMockData()

  // API configuration
  const getApiUrl = useCallback(() => {
    return configService.getApiUrl()
  }, [])

  // Blockchain configuration
  const getHederaNetwork = useCallback(() => {
    return configService.getHederaNetwork()
  }, [])

  const getTokenContractAddress = useCallback(() => {
    return configService.getTokenContractAddress()
  }, [])

  const getBountyContractAddress = useCallback(() => {
    return configService.getBountyContractAddress()
  }, [])

  const getEscrowContractAddress = useCallback(() => {
    return configService.getEscrowContractAddress()
  }, [])

  // UI configuration
  const getPageSize = useCallback(() => {
    return configService.getPageSize()
  }, [])

  const getDefaultCurrency = useCallback(() => {
    return configService.getDefaultCurrency()
  }, [])

  // Role-specific configuration
  const getAdminRoles = useCallback(() => {
    return configService.getAdminRoles()
  }, [])

  const getLawyerRoles = useCallback(() => {
    return configService.getLawyerRoles()
  }, [])

  const getNgoRoles = useCallback(() => {
    return configService.getNgoRoles()
  }, [])

  const getDonorRoles = useCallback(() => {
    return configService.getDonorRoles()
  }, [])

  return {
    // Feature flags
    isBlockchainEnabled,
    isAiAssistantEnabled,
    useMockData,

    // API configuration
    getApiUrl,

    // Blockchain configuration
    getHederaNetwork,
    getTokenContractAddress,
    getBountyContractAddress,
    getEscrowContractAddress,

    // UI configuration
    getPageSize,
    getDefaultCurrency,

    // Role-specific configuration
    getAdminRoles,
    getLawyerRoles,
    getNgoRoles,
    getDonorRoles,
  }
}

