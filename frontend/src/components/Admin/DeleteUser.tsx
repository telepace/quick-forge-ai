import { Button, DialogTitle, Text } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FiTrash2 } from "react-icons/fi"

import { UsersService } from "@/client"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog"
import useCustomToast from "@/hooks/useCustomToast"

/**
 * A React component that renders a dialog for deleting a user.
 *
 * @param {Object} props - The component props.
 * @param {string} props.id - The ID of the user to be deleted.
 */
const DeleteUser = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  /**
   * Deletes a user by their unique identifier.
   *
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<void>} A Promise that resolves when the user has been successfully deleted.
   * @throws {Error} If an error occurs during the deletion process, an Error is thrown with details.
   */
  const deleteUser = async (id: string) => {
    await UsersService.deleteUser({ userId: id })
  }

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      showSuccessToast("The user was deleted successfully")
      setIsOpen(false)
    },
    onError: () => {
      showErrorToast("An error occurred while deleting the user")
    },
    onSettled: () => {
      queryClient.invalidateQueries()
    },
  })

  /**
   * Handles the submission of an action by invoking a mutation with a specific ID.
   *
   * @async
   * @function onSubmit
   * @throws {Error} If there is an issue during the mutation process.
   */
  const onSubmit = async () => {
    mutation.mutate(id)
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      role="alertdialog"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" colorPalette="red">
          <FiTrash2 fontSize="16px" />
          Delete User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>
              All items associated with this user will also be{" "}
              <strong>permanently deleted.</strong> Are you sure? You will not
              be able to undo this action.
            </Text>
          </DialogBody>

          <DialogFooter gap={2}>
            <DialogActionTrigger asChild>
              <Button
                variant="subtle"
                colorPalette="gray"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              variant="solid"
              colorPalette="red"
              type="submit"
              loading={isSubmitting}
            >
              Delete
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </form>
      </DialogContent>
    </DialogRoot>
  )
}

export default DeleteUser
