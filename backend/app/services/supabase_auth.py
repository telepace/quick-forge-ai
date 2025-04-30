"""
Supabase 认证服务

此模块提供了与 Supabase Auth 交互的功能，仅在配置了 Supabase 时可用。
"""
from typing import Optional, Dict, Any, List
import logging

from app.core.config import settings
from app.core.supabase_service import supabase_client, SUPABASE_AVAILABLE

logger = logging.getLogger(__name__)


class SupabaseAuthService:
    """Supabase 认证服务，用于处理用户认证相关功能"""
    
    @staticmethod
    def is_available() -> bool:
        """检查 Supabase 认证服务是否可用"""
        return SUPABASE_AVAILABLE and settings.DATABASE_TYPE == "supabase" and supabase_client is not None
    
    @staticmethod
    def sign_up(email: str, password: str, additional_data: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        """
        在 Supabase 中注册新用户
        
        Args:
            email: 用户电子邮件
            password: 用户密码
            additional_data: 可选的额外用户数据
            
        Returns:
            注册结果或 None（如果 Supabase 不可用）
        """
        if not SupabaseAuthService.is_available() or not supabase_client:
            logger.warning("Supabase Auth 不可用，无法注册用户")
            return None
            
        try:
            data = {"email": email, "password": password}
            if additional_data:
                data.update(additional_data)
                
            return supabase_client.auth.sign_up(data)
        except Exception as e:
            logger.error(f"Supabase 用户注册失败: {str(e)}")
            return None
    
    @staticmethod
    def sign_in(email: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Supabase 用户登录
        
        Args:
            email: 用户电子邮件
            password: 用户密码
            
        Returns:
            登录结果或 None（如果 Supabase 不可用）
        """
        if not SupabaseAuthService.is_available() or not supabase_client:
            logger.warning("Supabase Auth 不可用，无法登录用户")
            return None
            
        try:
            return supabase_client.auth.sign_in_with_password({"email": email, "password": password})
        except Exception as e:
            logger.error(f"Supabase 用户登录失败: {str(e)}")
            return None
    
    @staticmethod
    def get_user(token: str) -> Optional[Dict[str, Any]]:
        """
        获取 Supabase 用户信息
        
        Args:
            token: 用户会话令牌
            
        Returns:
            用户数据或 None（如果 Supabase 不可用或验证失败）
        """
        if not SupabaseAuthService.is_available() or not supabase_client:
            logger.warning("Supabase Auth 不可用，无法获取用户")
            return None
            
        try:
            # 设置访问令牌
            supabase_client.auth.set_session(token)
            # 获取用户
            return supabase_client.auth.get_user()
        except Exception as e:
            logger.error(f"获取 Supabase 用户失败: {str(e)}")
            return None
    
    @staticmethod
    def sign_out(token: Optional[str] = None) -> bool:
        """
        退出 Supabase 用户登录
        
        Args:
            token: 可选的用户会话令牌，如果提供则先设置会话
            
        Returns:
            操作是否成功
        """
        if not SupabaseAuthService.is_available() or not supabase_client:
            logger.warning("Supabase Auth 不可用，无法退出登录")
            return False
            
        try:
            if token:
                supabase_client.auth.set_session(token)
                
            supabase_client.auth.sign_out()
            return True
        except Exception as e:
            logger.error(f"Supabase 用户退出登录失败: {str(e)}")
            return False
    
    @staticmethod
    def reset_password(email: str) -> bool:
        """
        发送密码重置邮件
        
        Args:
            email: 用户电子邮件
            
        Returns:
            操作是否成功
        """
        if not SupabaseAuthService.is_available() or not supabase_client:
            logger.warning("Supabase Auth 不可用，无法重置密码")
            return False
            
        try:
            supabase_client.auth.reset_password_for_email(email)
            return True
        except Exception as e:
            logger.error(f"Supabase 密码重置失败: {str(e)}")
            return False
    
    @staticmethod
    def update_user(user_data: Dict[str, Any], token: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        更新 Supabase 用户数据
        
        Args:
            user_data: 新的用户数据
            token: 可选的用户会话令牌，如果提供则先设置会话
            
        Returns:
            更新结果或 None（如果 Supabase 不可用）
        """
        if not SupabaseAuthService.is_available() or not supabase_client:
            logger.warning("Supabase Auth 不可用，无法更新用户")
            return None
            
        try:
            if token:
                supabase_client.auth.set_session(token)
                
            return supabase_client.auth.update_user(user_data)
        except Exception as e:
            logger.error(f"更新 Supabase 用户失败: {str(e)}")
            return None 