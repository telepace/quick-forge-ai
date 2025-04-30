"""
Supabase Storage Service

This module provides functionality for interacting with Supabase Storage, only available when Supabase is configured.
"""
from typing import Optional, BinaryIO, List, Dict, Any
from pathlib import Path
import logging

from app.core.config import settings
from app.core.supabase_service import supabase_client, SUPABASE_AVAILABLE

logger = logging.getLogger(__name__)


class SupabaseStorageService:
    """Supabase Storage Service for managing file uploads and downloads"""
    
    @staticmethod
    def is_available() -> bool:
        """Check if the Supabase Storage Service is available"""
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
        Upload a file to Supabase Storage
        
        Args:
            bucket_name: Supabase storage bucket name
            file_path: File path within the storage bucket
            file: File object to be uploaded
            content_type: File content type
            metadata: Optional file metadata
            
        Returns:
            Upload result or None (if Supabase is not available)
        """
        if not SupabaseStorageService.is_available() or not supabase_client:
            logger.warning("Supabase Storage is not available, cannot upload file")
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
            logger.error(f"Failed to upload file to Supabase: {str(e)}")
            return None
    
    @staticmethod
    def get_public_url(bucket_name: str, file_path: str) -> Optional[str]:
        """
        Get the public access URL for a file
        
        Args:
            bucket_name: Storage bucket name
            file_path: File path
            
        Returns:
            Public URL or None (if Supabase is not available)
        """
        if not SupabaseStorageService.is_available() or not supabase_client:
            logger.warning("Supabase Storage is not available, cannot get public URL")
            return None
            
        try:
            return supabase_client.storage.from_(bucket_name).get_public_url(file_path)
        except Exception as e:
            logger.error(f"Failed to get Supabase public URL: {str(e)}")
            return None
    
    @staticmethod
    def download_file(bucket_name: str, file_path: str, destination: Path) -> bool:
        """
        Download a file from Supabase Storage
        
        Args:
            bucket_name: Storage bucket name
            file_path: File path
            destination: Destination local path
            
        Returns:
            Whether the download was successful
        """
        if not SupabaseStorageService.is_available() or not supabase_client:
            logger.warning("Supabase Storage is not available, cannot download file")
            return False
            
        try:
            # Download file content
            response = supabase_client.storage.from_(bucket_name).download(file_path)
            
            # Write to destination path
            with open(destination, 'wb') as f:
                f.write(response)
                
            return True
        except Exception as e:
            logger.error(f"Failed to download file from Supabase: {str(e)}")
            return False
    
    @staticmethod
    def list_files(bucket_name: str, path: Optional[str] = None) -> Optional[List[Dict[str, Any]]]:
        """
        List files in a storage bucket
        
        Args:
            bucket_name: Storage bucket name
            path: Optional path prefix
            
        Returns:
            File list or None (if Supabase is not available)
        """
        if not SupabaseStorageService.is_available() or not supabase_client:
            logger.warning("Supabase Storage is not available, cannot list files")
            return None
            
        try:
            options = {}
            if path:
                options["path"] = path
                
            return supabase_client.storage.from_(bucket_name).list(**options)
        except Exception as e:
            logger.error(f"Failed to list Supabase files: {str(e)}")
            return None
            
    @staticmethod
    def delete_file(bucket_name: str, file_paths: List[str]) -> Optional[Dict[str, Any]]:
        """
        Delete files from Supabase Storage
        
        Args:
            bucket_name: Storage bucket name
            file_paths: List of file paths to delete
            
        Returns:
            Deletion result or None (if Supabase is not available)
        """
        if not SupabaseStorageService.is_available() or not supabase_client:
            logger.warning("Supabase Storage is not available, cannot delete file")
            return None
            
        try:
            return supabase_client.storage.from_(bucket_name).remove(file_paths)
        except Exception as e:
            logger.error(f"Failed to delete Supabase file: {str(e)}")
            return None 