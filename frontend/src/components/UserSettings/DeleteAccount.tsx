import { Container, Heading, Text } from "@chakra-ui/react"

import DeleteConfirmation from "./DeleteConfirmation"

/**
 * Renders a component for deleting an account.
 *
 * This component includes a heading, a text description explaining the action,
 * and a confirmation dialog for deleting the account. It is designed to be used
 * in a user interface where users can choose to delete their account permanently.
 *
 * @returns {React.ReactNode} - The rendered React component.
 */
const DeleteAccount = () => {
  return (
    <Container maxW="full">
      <Heading size="sm" py={4}>
        Delete Account
      </Heading>
      <Text>
        Permanently delete your data and everything associated with your
        account.
      </Text>
      <DeleteConfirmation />
    </Container>
  )
}
export default DeleteAccount
