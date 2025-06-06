import { SIDEBARPROPS } from '@/constant/menu'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {
    page: string
    slug: string
}

const Items = ({page, slug}: Props) => {
  return SIDEBARPROPS.map((item) => (
    <Link
        key={item.id}
        href={`/dashboard/${slug}/${item.label === 'home' ? '/' : item.label}`}
        className={cn(
            'captalize flex gap-x-2 rounded-xl p-3',
            page === item.label && 'bg-[#171717]',
            page === slug && item.label === 'home' 
            ? 'bg-[#171717]'
            : 'text-[#9B9CA0]'
        )}
    >
        {item.icon}
        <span>{item.label}</span>
    </Link>
  ))
}

export default Items