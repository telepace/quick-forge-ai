'use client'

import { Toggle } from '@/components/ui/toggle'
import clsx from 'clsx'
import { useTheme } from 'nextra-theme-docs'
import { useCallback } from 'react'

/**
 * 快速切换暗黑模式组件，用于覆盖 nextra 原生切换下拉框。
 *
 * @param {Object} props - 组件的属性对象。
 * @param {string} [props.className] - 可选的 CSS 类名，用于自定义样式。
 */
export default function ThemeToggle({
  className,
}: {
  className?: string
}) {
  const { setTheme, theme } = useTheme()

  const changeTheme = useCallback(() => {
    if (theme === 'dark') {
      setTheme('light')
    }
    else {
      setTheme('dark')
    }
  }, [setTheme, theme])

  return (
    <Toggle
      size="sm"
      className={clsx([
        'cursor-pointer',
        className,
      ])}
      onClick={changeTheme}
    >
      <span className="icon-[ri--sun-fill] dark:icon-[ri--moon-clear-fill]"></span>
    </Toggle>
  )
}
