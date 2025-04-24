import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { FaUserAstronaut } from "react-icons/fa"
import { FiLogOut, FiUser } from "react-icons/fi"

import useAuth from "@/hooks/useAuth"
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu"

/**
 * Renders the user menu component with options to access settings and log out.
 *
 * @returns {JSX.Element} - The rendered user menu component.
 */
const UserMenu = () => {
  const { user, logout } = useAuth()

  /**
   * Handles the user logout process.
   *
   * @async
   * @function handleLogout
   * @description This function is responsible for initiating the user logout process. It calls the `logout()` function to perform the actual logout action.
   * @throws {Error} - If an error occurs during the logout process, it will be thrown.
   */
  const handleLogout = async () => {
    logout()
  }

  return (
    <>
      {/* Desktop */}
      <Flex>
        <MenuRoot>
          <MenuTrigger asChild p={2}>
            <Button data-testid="user-menu" variant="solid" maxW="sm" truncate>
              <FaUserAstronaut fontSize="18" />
              <Text>{user?.full_name || "User"}</Text>
            </Button>
          </MenuTrigger>

          <MenuContent>
            <Link to="settings">
              <MenuItem
                closeOnSelect
                value="user-settings"
                gap={2}
                py={2}
                style={{ cursor: "pointer" }}
              >
                <FiUser fontSize="18px" />
                <Box flex="1">My Profile</Box>
              </MenuItem>
            </Link>

            <MenuItem
              value="logout"
              gap={2}
              py={2}
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              <FiLogOut />
              Log Out
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </Flex>
    </>
  )
}

export default UserMenu
