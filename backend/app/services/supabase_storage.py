"""
Supabase 存储服务

此模块提供了与 Supabase Storage 交互的功能，仅在配置了 Supabase 时可用。
"""
from typing import Optional, BinaryIO, List, Dict, Any
from pathlib import Path
import logging

from app.core.config import settings
from app.core.supabase_service import supabase_client, SUPABASE_AVAILABLE

logger = logging.getLogger(__name__)


class SupabaseStorageService:
    """Supabase 存储服务，用于管理文件上传和下载"""
    
    @staticmethod
    def is_available() -> bool:
        """检查 Supabase 存储服务是否可用"""
        return SUPABASE_AVAILABLE and settings.DATABASE_TYPE == "supabase" and supabase_client is not None
    
    @staticmethod
    def upload_file(
        bucket_name: str,
        file_path: str,
        file: BinaryIO,
        content_type: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Optional[Dict[str, Any]]:
        """
        上传文件到 Supabase Storage
        
        Args:
            bucket_name: Supabase 存储桶名称
            file_path: 文件在存储桶中的路径/名称
            file: 要上传的文件对象
            content_type: 文件内容类型
            metadata: 可选的文件元数据
            
        Returns:
            上传结果或 None（如果 Supabase 不可用）
        """
        if not SupabaseStorageService.is_available() or not supabase_client:
            logger.warning("Supabase Storage 不可用，无法上传文件")
            return None
            
        try:
            options = {}
            if content_type:
                options["content_type"] = content_type
            if metadata:
                options["metadata"] = metadata
                
            result = supabase_client.storage.from_(bucket_name).upload(
                path=file_path,
                file=file,
                **options
            )
            return result
        except Exception as e:
            logger.error(f"上传文件到 Supabase 失败: {str(e)}")
            return None
    
    @staticmethod
    def get_public_url(bucket_name: str, file_path: str) -> Optional[str]:
        """
        获取文件的公共访问 URL
        
        Args:
            bucket_name: 存储桶名称
            file_path: 文件路径
            
        Returns:
            公共 URL 或 None（如果 Supabase 不可用）
        """
        if not SupabaseStorageService.is_available() or not supabase_client:
            logger.warning("Supabase Storage 不可用，无法获取公共 URL")
            return None
            
        try:
            return supabase_client.storage.from_(bucket_name).get_public_url(file_path)
        except Exception as e:
            logger.error(f"获取 Supabase 公共 URL 失败: {str(e)}")
            return None
    
    @staticmethod
    def download_file(bucket_name: str, file_path: str, destination: Path) -> bool:
        """
        从 Supabase Storage 下载文件
        
        Args:
            bucket_name: 存储桶名称
            file_path: 文件路径
            destination: 目标本地路径
            
        Returns:
            下载是否成功
        """
        if not SupabaseStorageService.is_available() or not supabase_client:
            logger.warning("Supabase Storage 不可用，无法下载文件")
            return False
            
        try:
            # 下载文件内容
            response = supabase_client.storage.from_(bucket_name).download(file_path)
            
            # 写入到目标路径
            with open(destination, 'wb') as f:
                f.write(response)
                
            return True
        except Exception as e:
            logger.error(f"从 Supabase 下载文件失败: {str(e)}")
            return False
    
    @staticmethod
    def list_files(bucket_name: str, path: Optional[str] = None) -> Optional[List[Dict[str, Any]]]:
        """
        列出存储桶中的文件
        
        Args:
            bucket_name: 存储桶名称
            path: 可选的路径前缀
            
        Returns:
            文件列表或 None（如果 Supabase 不可用）
        """
        if not SupabaseStorageService.is_available() or not supabase_client:
            logger.warning("Supabase Storage 不可用，无法列出文件")
            return None
            
        try:
            options = {}
            if path:
                options["path"] = path
                
            return supabase_client.storage.from_(bucket_name).list(**options)
        except Exception as e:
            logger.error(f"列出 Supabase 文件失败: {str(e)}")
            return None
            
    @staticmethod
    def delete_file(bucket_name: str, file_paths: List[str]) -> Optional[Dict[str, Any]]:
        """
        删除 Supabase Storage 中的文件
        
        Args:
            bucket_name: 存储桶名称
            file_paths: 要删除的文件路径列表
            
        Returns:
            删除结果或 None（如果 Supabase 不可用）
        """
        if not SupabaseStorageService.is_available() or not supabase_client:
            logger.warning("Supabase Storage 不可用，无法删除文件")
            return None
            
        try:
            return supabase_client.storage.from_(bucket_name).remove(file_paths)
        except Exception as e:
            logger.error(f"删除 Supabase 文件失败: {str(e)}")
            return None 