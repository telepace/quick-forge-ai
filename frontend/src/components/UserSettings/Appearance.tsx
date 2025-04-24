import { Container, Heading, Stack } from "@chakra-ui/react"
import { useTheme } from "next-themes"

import { Radio, RadioGroup } from "@/components/ui/radio"

/**
 * A React component that provides a user interface for managing theme settings, allowing users to switch between system default, light mode, and dark mode.
 *
 * @returns {React.ReactNode} - The JSX element representing the appearance management interface.
 */
const Appearance = () => {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <Container maxW="full">
        <Heading size="sm" py={4}>
          Appearance
        </Heading>

        <RadioGroup
          onValueChange={(value: string) => setTheme(value)}
          value={theme || 'system'}
          colorPalette="teal"
        >
          <Stack>
            <Radio value="system">System</Radio>
            <Radio value="light">Light Mode</Radio>
            <Radio value="dark">Dark Mode</Radio>
          </Stack>
        </RadioGroup>
      </Container>
    </>
  )
}
export default Appearance
