import { getAllAutomations, getAutomationInfo } from "@/action/automation"
import { useQuery } from "@tanstack/react-query"

export const useQueryAutomations = () => {
    return useQuery(
        {
            queryKey:['user-automations'],
            queryFn: getAllAutomations
        }
    )
}

export const useQueryAutomation = (id: string) => {
    return useQuery(
        {
            queryKey:['automation-info'],
            queryFn: () => getAutomationInfo(id)
        }
    )
}