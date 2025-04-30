"""
Supabase Authentication Service

This module provides functionality for interacting with Supabase Auth, only available when Supabase is configured.
"""
from typing import Optional, Dict, Any, List
import logging

from app.core.config import settings
from app.core.supabase_service import supabase_client, SUPABASE_AVAILABLE

logger = logging.getLogger(__name__)


class SupabaseAuthService:
    """Supabase Authentication Service, for handling user authentication related functions"""
    
    @staticmethod
    def is_available() -> bool:
        """Check if the Supabase Authentication Service is available"""
        return SUPABASE_AVAILABLE and settings.DATABASE_TYPE == "supabase" and supabase_client is not None
    
    @staticmethod
    def sign_up(email: str, password: str, additional_data: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        """
        Sign up a new user in Supabase
        
        Args:
            email: User email
            password: User password
            additional_data: Optional additional user data
            
        Returns:
            Sign up result or None (if Supabase is not available)
        """
        if not SupabaseAuthService.is_available() or not supabase_client:
            logger.warning("Supabase Auth is not available, cannot sign up user")
            return None
            
        try:
            data = {"email": email, "password": password}
            if additional_data:
                data.update(additional_data)
                
            return supabase_client.auth.sign_up(data)
        except Exception as e:
            logger.error(f"Supabase user sign up failed: {str(e)}")
            return None
    
    @staticmethod
    def sign_in(email: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Supabase user login
        
        Args:
            email: User email
            password: User password
            
        Returns:
            Login result or None (if Supabase is not available)
        """
        if not SupabaseAuthService.is_available() or not supabase_client:
            logger.warning("Supabase Auth is not available, cannot login user")
            return None
            
        try:
            return supabase_client.auth.sign_in_with_password({"email": email, "password": password})
        except Exception as e:
            logger.error(f"Supabase user login failed: {str(e)}")
            return None
    
    @staticmethod
    def get_user(token: str) -> Optional[Dict[str, Any]]:
        """
        Get Supabase user information
        
        Args:
            token: User session token
            
        Returns:
            User data or None (if Supabase is not available or validation fails)
        """
        if not SupabaseAuthService.is_available() or not supabase_client:
            logger.warning("Supabase Auth is not available, cannot get user")
            return None
            
        try:
            # Set access token
            supabase_client.auth.set_session(token)
            # Get user
            return supabase_client.auth.get_user()
        except Exception as e:
            logger.error(f"Getting Supabase user failed: {str(e)}")
            return None
    
    @staticmethod
    def sign_out(token: Optional[str] = None) -> bool:
        """
        Sign out Supabase user login
        
        Args:
            token: Optional user session token, if provided, sets the session first
            
        Returns:
            Operation success
        """
        if not SupabaseAuthService.is_available() or not supabase_client:
            logger.warning("Supabase Auth is not available, cannot sign out")
            return False
            
        try:
            if token:
                supabase_client.auth.set_session(token)
                
            supabase_client.auth.sign_out()
            return True
        except Exception as e:
            logger.error(f"Supabase user sign out failed: {str(e)}")
            return False
    
    @staticmethod
    def reset_password(email: str) -> bool:
        """
        Send password reset email
        
        Args:
            email: User email
            
        Returns:
            Operation success
        """
        if not SupabaseAuthService.is_available() or not supabase_client:
            logger.warning("Supabase Auth is not available, cannot reset password")
            return False
            
        try:
            supabase_client.auth.reset_password_for_email(email)
            return True
        except Exception as e:
            logger.error(f"Supabase password reset failed: {str(e)}")
            return False
    
    @staticmethod
    def update_user(user_data: Dict[str, Any], token: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Update Supabase user data
        
        Args:
            user_data: New user data
            token: Optional user session token, if provided, sets the session first
            
        Returns:
            Update result or None (if Supabase is not available)
        """
        if not SupabaseAuthService.is_available() or not supabase_client:
            logger.warning("Supabase Auth is not available, cannot update user")
            return None
            
        try:
            if token:
                supabase_client.auth.set_session(token)
                
            return supabase_client.auth.update_user(user_data)
        except Exception as e:
            logger.error(f"Updating Supabase user failed: {str(e)}")
            return None 